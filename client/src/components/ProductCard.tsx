import { useEffect, useMemo, useState } from "react";
import { ProductWithFormats } from "@shared/schema";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useAddToCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import WatermarkedImage from "./ui/WatermarkedImage";

interface ProductCardProps {
  product: ProductWithFormats;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();

  // ✅ CLP (sin decimales)
  const money = useMemo(
    () => (value: number) =>
      new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      }).format(value),
    []
  );

  const formats = useMemo(
    () => (product.formats || []).map((f) => String(f).toUpperCase()),
    [product.formats]
  );

  const defaultFormat = formats[0] ?? "JEF";
  const [selectedFormat, setSelectedFormat] = useState<string>(defaultFormat);

  // ✅ Si cambia el producto (refetch), asegurar formato válido
  useEffect(() => {
    if (!formats.includes(selectedFormat)) {
      setSelectedFormat(defaultFormat);
    }
  }, [formats, defaultFormat, selectedFormat]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart.mutate({
      productId: product.id,
      quantity: 1,
      format: selectedFormat, // ✅ clave para guardar formato
    });
  };

  // Determinar el color de la etiqueta según el nivel (tier)
  const getBadgeVariant = (tier: string) => {
    switch (tier.toUpperCase()) {
      case "PREMIUM":
        return "default";
      case "PRO":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Link href={`/shop/${product.id}`} className="group block cursor-pointer">
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="h-full bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all"
      >
        {/* Contenedor de Imagen */}
        <div className="aspect-square relative overflow-hidden bg-muted">
          {product.imageUrl ? (
            <WatermarkedImage
              src={product.imageUrl}
              alt={product.name}
              variant="light"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              Sin Imagen
            </div>
          )}

          {/* Etiquetas Flotantes */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none shadow-sm">
                NUEVO
              </Badge>
            )}
            {product.isBestseller && (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm">
                MÁS VENDIDO
              </Badge>
            )}
          </div>

          {/* Botón de Añadido Rápido (Visible al pasar el mouse) */}
          <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              size="icon"
              className="rounded-full shadow-lg bg-white text-black hover:bg-primary hover:text-white"
              onClick={handleAddToCart}
              disabled={addToCart.isPending || formats.length === 0}
              title={
                formats.length === 0
                  ? "Este producto no tiene formatos configurados"
                  : `Añadir .${selectedFormat} al carrito`
              }
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <Badge
              variant={getBadgeVariant(product.tier)}
              className="text-[10px] tracking-wider uppercase"
            >
              {product.tier}
            </Badge>

            {/* ✅ CLP directo (NO /100) */}
            <span className="font-display font-semibold text-lg text-primary">
              {money(product.price)}
            </span>
          </div>

          <h3 className="font-medium text-foreground text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 h-10">
            {product.description}
          </p>

          {/* Selector de formato */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Formato
              </span>
              <span className="text-[11px] text-muted-foreground">
                Seleccionado:{" "}
                <span className="font-mono uppercase">{selectedFormat}</span>
              </span>
            </div>

            {formats.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formats.map((fmt) => {
                  const active = fmt === selectedFormat;
                  return (
                    <button
                      key={fmt}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedFormat(fmt);
                      }}
                      className={[
                        "px-2.5 py-1 rounded-lg text-[11px] font-mono uppercase border transition",
                        active
                          ? "bg-primary text-white border-primary"
                          : "bg-muted/50 text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground",
                      ].join(" ")}
                      aria-pressed={active}
                      title={`Elegir ${fmt}`}
                    >
                      .{fmt}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                Sin formatos configurados.
              </div>
            )}
          </div>

          {/* Chips informativos (opcional) */}
          <div className="flex flex-wrap gap-1 mt-4">
            {formats.slice(0, 3).map((fmt) => (
              <span
                key={fmt}
                className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground uppercase"
              >
                {fmt}
              </span>
            ))}
            {formats.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                +{formats.length - 3}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-border/50 bg-card h-[420px]">
      <div className="aspect-square bg-muted animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-16 bg-muted animate-pulse rounded" />
          <div className="h-5 w-12 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
        <div className="h-8 w-full bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}
