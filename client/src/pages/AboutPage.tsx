import PageShell from "@/components/storefront/PageShell";
import TrustBar from "@/components/storefront/TrustBar";
import { Link } from "wouter";
import { Sparkles, ShieldCheck, Download, BadgeCheck } from "lucide-react";


export default function AboutPage() {
  return (
    <>
      <PageShell
        eyebrow="Bordados.Premium • 2026"
        title="Diseños premium para bordado digital, listos para producción"
        subtitle="Creamos y curamos matrices de bordado pensadas para profesionales: archivos bien organizados, compatibilidad por formato y descarga inmediata."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">Calidad verificable</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Cada diseño pasa por revisión de puntadas, densidad y terminaciones.
              El objetivo es simple: bordado limpio y confiable.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
              <Download className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">Descarga inmediata</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Compra → acceso inmediato. Sin esperas, sin “te lo envío después”.
              Ideal para producción o pedidos urgentes.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">Seguridad y confianza</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Buenas prácticas para proteger datos. La prioridad es que compres
              con tranquilidad.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold">¿Qué puedes esperar al comprar?</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border bg-card p-6">
              <p className="font-semibold">Archivos claros y ordenados</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Nombres consistentes, formatos visibles y estructura simple para
                que encuentres todo rápido.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-6">
              <p className="font-semibold">Compatibilidad por formato</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Cada producto indica formatos disponibles (JEF, DST, PES, etc.)
                y sus variantes.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-6">
              <p className="font-semibold">Licencia transparente</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Puedes vender productos físicos bordados. La reventa o
                redistribución del archivo digital no está permitida.
              </p>
              <Link className="mt-3 inline-block text-sm font-semibold underline" href="/license">
                Ver licencia
              </Link>
            </div>
            <div className="rounded-2xl border bg-card p-6">
              <p className="font-semibold">Soporte cuando lo necesites</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Si algo no calza (bastidor, formato, descarga), te guiamos con
                pasos claros.
              </p>
              <Link className="mt-3 inline-block text-sm font-semibold underline" href="/faq">
                Ir a FAQ
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-xl font-semibold">Nuestra promesa</h2>
          <div className="mt-4 rounded-2xl border bg-card p-7">
            <p className="text-sm text-muted-foreground">
              En Bordados.Premium cuidamos lo que más importa:{" "}
              <span className="font-semibold text-foreground">
                que el diseño funcione en la vida real
              </span>
              . Si buscas una tienda seria, estética y confiable, este es tu lugar.
            </p>
          </div>
        </div>
      </PageShell>

      <div className="pb-14">
        <TrustBar />
      </div>
      {/* Footer */}
            <footer className="bg-foreground text-background py-16 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12">
                  <div className="col-span-2">
                    <h3 className="font-display text-2xl font-bold mb-4">
                      Bordados<span className="text-primary italic">.Premium</span>
                    </h3>
                    <p className="text-gray-400 max-w-sm">
                      Elevando el arte del bordado a máquina con patrones digitales de nivel profesional para creadores en todo el mundo.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Tienda</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><Link href="/shop?category=Florales" className="hover:text-primary transition-colors">Floral</Link></li>
                      <li><Link href="/shop?category=Logos" className="hover:text-primary transition-colors">Logos</Link></li>
                      <li><Link href="/shop?category=Monogramas" className="hover:text-primary transition-colors">Monograms</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Soporte</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><Link href="/about" className="hover:text-primary transition-colors">Contáctanos</Link></li>
                      <li><Link href="/faq" className="hover:text-primary transition-colors">Preguntas frecuentes</Link></li>
                      <li><Link href="/license" className="hover:text-primary transition-colors">Información de licencia</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                  © 2026 Bordados Premium. Todos los derechos reservados.
                </div>
              </div>
            </footer>
    </>
  );
}
