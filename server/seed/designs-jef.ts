// server/seed/designs-jef.ts
import "dotenv/config";
import { db } from "../db";
import { products, productFormats } from "@shared/schema";
import { eq } from "drizzle-orm";

type SeedProduct = {
  name: string;
  description: string;
  category: string;
  tier: "STANDARD" | "PRO" | "PREMIUM";
  price: number; // ✅ CLP (entero). Ej: 2500 => $2.500
  imageUrl: string; // ✅ SIEMPRE apunta al preview
  isFeatured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  isActive?: boolean;
  formats: string[]; // ej: ["JEF","PES","DST"]
};

// ✅ Normaliza formatos: mayúsculas + sin duplicados
function normalizeFormats(formats: string[]) {
  return Array.from(
    new Set(
      (formats || [])
        .map((f) => String(f).trim().toUpperCase())
        .filter(Boolean)
    )
  );
}

// ✅ Asegura que la descripción no diga “solo JEF” y agregue formatos
function withIncludedFormats(desc: string, formats: string[]) {
  const f = normalizeFormats(formats);
  const clean = (desc || "").trim();

  // Evita duplicar si vuelves a correr el seed
  if (clean.toLowerCase().includes("incluye formatos:")) return clean;

  const suffix = ` Incluye formatos: ${f.map((x) => `.${x}`).join(", ")}.`;

  if (!clean) return suffix.trim();
  return clean.endsWith(".") ? clean + suffix : clean + "." + suffix;
}

const DEFAULT_FORMATS = ["JEF", "PES", "DST"] as const;

const seed: SeedProduct[] = [
  {
    name: "Cáliz (chico)",
    description: "Diseño para bordado digital. Ideal para aplicaciones religiosas",
    category: "Religioso",
    tier: "PREMIUM",
    price: 2990,
    imageUrl: "/designs/previews/caliz-chico.png",
    isFeatured: true,
    isActive: true,
    formats: [...DEFAULT_FORMATS],
  },
  {
    name: "Agrícola EIRL",
    description: "Logo para bordado corporativo",
    category: "Logos",
    tier: "PREMIUM",
    price: 2500,
    imageUrl: "/designs/previews/agricola-eirl.png",
    isActive: true,
    formats: [...DEFAULT_FORMATS],
  },
  {
    name: "Aires Coltauquinos",
    description: "Logo para bordado corporativo",
    category: "Logos",
    tier: "PREMIUM",
    price: 1000,
    imageUrl: "/designs/previews/aires-coltauquinos.png",
    isActive: true,
    formats: [...DEFAULT_FORMATS],
  },
  {
    name: "Alianza",
    description: "Logo para bordado",
    category: "Logos",
    tier: "PREMIUM",
    price: 3990,
    imageUrl: "/designs/previews/alianza.png",
    isActive: true,
    formats: [...DEFAULT_FORMATS],
  },
  {
    name: "Árbol de Corazones",
    description:
      "Diseño decorativo para bordado. Perfecto para regalos y proyectos románticos",
    category: "Amor",
    tier: "PRO",
    price: 2990,
    imageUrl: "/designs/previews/arbol-de-corazones.png",
    isFeatured: true,
    isActive: true,
    formats: [...DEFAULT_FORMATS],
  },
  {
    name: "Ask Your Boy",
    description: "Texto/frase para bordado",
    category: "Frases",
    tier: "STANDARD",
    price: 2490,
    imageUrl: "/designs/previews/ask-your-boy.png",
    isActive: true,
    formats: [...DEFAULT_FORMATS],
  },
  {
    name: "Bandera 6x4",
    description: "Diseño patriótico para bordado",
    category: "Patriótico",
    tier: "PRO",
    price: 2990,
    imageUrl: "/designs/previews/bandera-6x4.png",
    isActive: true,
    formats: [...DEFAULT_FORMATS],
  },
  {
    name: "Búho 5",
    description: "Diseño de animal para bordado",
    category: "Animales",
    tier: "PRO",
    price: 2990,
    imageUrl: "/designs/previews/buho-5.png",
    isActive: true,
    formats: [...DEFAULT_FORMATS],
  },
  {
    name: "Búho H",
    description: "Diseño de animal para bordado",
    category: "Animales",
    tier: "PRO",
    price: 2990,
    imageUrl: "/designs/previews/buho-h.png",
    isActive: true,
    formats: [...DEFAULT_FORMATS],
  },
  {
    name: "Caballo + Herradura",
    description: "Diseño de animal para bordado",
    category: "Animales",
    tier: "PRO",
    price: 2990,
    imageUrl: "/designs/previews/caballo-herradura.png",
    isActive: true,
    formats: [...DEFAULT_FORMATS],
  },
];

async function run() {
  try {
    await db.transaction(async (tx) => {
      for (const pRaw of seed) {
        const formats = normalizeFormats(pRaw.formats);
        const p: SeedProduct = {
          ...pRaw,
          formats,
          description: withIncludedFormats(pRaw.description, formats),
        };

        const existing = await tx.query.products.findFirst({
          where: (tbl, ops) => ops.eq(tbl.name, p.name),
        });

        let productId = existing?.id;

        if (!existing) {
          const inserted = await tx
            .insert(products)
            .values({
              name: p.name,
              description: p.description,
              price: p.price,
              tier: p.tier,
              category: p.category,
              imageUrl: p.imageUrl,
              isNew: p.isNew ?? false,
              isBestseller: p.isBestseller ?? false,
              isFeatured: p.isFeatured ?? false,
              isActive: p.isActive ?? true,
            })
            .returning({ id: products.id });

          productId = inserted[0]?.id;
        } else {
          // ✅ UPDATE si existe: así cambian precios/textos/imagen al re-ejecutar el seed
          await tx
            .update(products)
            .set({
              description: p.description,
              price: p.price,
              tier: p.tier,
              category: p.category,
              imageUrl: p.imageUrl,
              isNew: p.isNew ?? false,
              isBestseller: p.isBestseller ?? false,
              isFeatured: p.isFeatured ?? false,
              isActive: p.isActive ?? true,
            })
            .where(eq(products.id, existing.id));
        }

        if (productId) {
          // ✅ Sincroniza formatos EXACTOS: borra y vuelve a insertar
          await tx
            .delete(productFormats)
            .where(eq(productFormats.productId, productId));

          if (formats.length > 0) {
            await tx.insert(productFormats).values(
              formats.map((f) => ({
                productId,
                format: f,
              }))
            );
          }
        }
      }
    });

    console.log(
      "✅ Seed listo: products + product_formats sincronizados (precios CLP + JEF/PES/DST)."
    );
    process.exit(0);
  } catch (e) {
    console.error("❌ Error ejecutando seed:", e);
    process.exit(1);
  }
}

run();
