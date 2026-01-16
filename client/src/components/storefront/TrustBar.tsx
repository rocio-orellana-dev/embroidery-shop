import { ShieldCheck, Download, BadgeCheck, Sparkles } from "lucide-react";

type Item = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

const items: Item[] = [
  {
    icon: <BadgeCheck className="h-5 w-5" />,
    title: "Calidad premium",
    desc: "Matrices probadas y optimizadas para un bordado limpio.",
  },
  {
    icon: <Download className="h-5 w-5" />,
    title: "Descarga inmediata",
    desc: "Accede a tus archivos al instante tras tu compra.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Compra segura",
    desc: "Protección de datos y buenas prácticas de seguridad.",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Diseños curados",
    desc: "Colecciones seleccionadas y actualizadas en 2026.",
  },
];

export default function TrustBar() {
  return (
    <section className="mx-auto max-w-6xl px-6">
      <div className="grid gap-4 md:grid-cols-4">
        {items.map((it) => (
          <div
            key={it.title}
            className="rounded-2xl border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-background">
                {it.icon}
              </div>
              <div>
                <p className="font-semibold">{it.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
