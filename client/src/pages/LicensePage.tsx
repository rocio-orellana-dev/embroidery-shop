import PageShell from "@/components/storefront/PageShell";
import TrustBar from "@/components/storefront/TrustBar";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

export default function LicensePage() {
  return (
    <>
      <PageShell
        eyebrow="Legal • 2026"
        title="Licencia de uso"
        subtitle="Claridad total: qué puedes hacer con tus compras y qué no. Esto protege tu trabajo y también el nuestro."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-7">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5" />
              <div>
                <h3 className="font-semibold">Permitido</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>• Bordar los diseños en productos físicos.</li>
                  <li>• Vender productos físicos bordados (prendas, parches, etc.).</li>
                  <li>• Usarlos en tu producción personal o comercial.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-7">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5" />
              <div>
                <h3 className="font-semibold">No permitido</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>• Revender o redistribuir el archivo digital.</li>
                  <li>• Compartir el archivo en grupos, foros o plataformas.</li>
                  <li>• Publicar el archivo para descarga (gratis o pagada).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border bg-card p-7">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5" />
            <div>
              <h3 className="font-semibold">Protección y seguridad</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Esta licencia existe para mantener una tienda sustentable y proteger
                el trabajo creativo. Si necesitas un permiso especial (por ejemplo
                para producción a gran escala), contáctanos para una licencia extendida.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Nota: La compra de un producto digital no transfiere propiedad intelectual.
          Se otorga una licencia de uso según lo descrito arriba.
        </p>
      </PageShell>

      <div className="pb-14">
        <TrustBar />
      </div>
    </>
  );
}
