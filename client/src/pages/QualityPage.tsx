import PageShell from "@/components/storefront/PageShell";
import TrustBar from "@/components/storefront/TrustBar";
import { BadgeCheck, Gauge, Layers, FileText } from "lucide-react";

export default function QualityPage() {
  return (
    <>
      <PageShell
        eyebrow="Estándares de calidad • 2026"
        title="Calidad que se nota en el bordado"
        subtitle="No es solo un archivo: es densidad, puntada, limpieza y consistencia. Así cuidamos la experiencia para que puedas producir sin miedo."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-7">
            <div className="flex items-start gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Revisión antes de publicar</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Validamos puntadas, cierres, saltos y terminaciones. El objetivo:
                  minimizar sorpresas en producción.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-7">
            <div className="flex items-start gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Optimización de densidad</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ajustes de densidad y orden de puntadas para un bordado limpio,
                  evitando acumulación o deformaciones.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-7">
            <div className="flex items-start gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Variantes reales</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Cuando aplica, ofrecemos variantes por bastidor o formato.
                  Menos “adaptar a la fuerza”, más “usar y producir”.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-7">
            <div className="flex items-start gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Entrega clara y profesional</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Archivos ordenados y, cuando corresponde, PDF de referencia.
                  Menos confusión, más velocidad.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border bg-card p-7">
          <h2 className="text-xl font-semibold">Control de calidad</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Checklist interno que buscamos cumplir en cada publicación:
          </p>
          <ul className="mt-4 grid list-disc gap-2 pl-5 text-sm text-muted-foreground md:grid-cols-2">
            <li>Puntadas sin saltos innecesarios</li>
            <li>Densidad equilibrada por tipo de relleno</li>
            <li>Terminaciones limpias</li>
            <li>Compatibilidad por formato</li>
            <li>Archivos nombrados y organizados</li>
            <li>Información del producto completa</li>
          </ul>
        </div>
      </PageShell>

      <div className="pb-14">
        <TrustBar />
      </div>
    </>
  );
}
