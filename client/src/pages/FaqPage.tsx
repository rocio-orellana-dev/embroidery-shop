import PageShell from "@/components/storefront/PageShell";
import TrustBar from "@/components/storefront/TrustBar";

const faqs = [
  {
    q: "¿Cómo descargo después de comprar?",
    a: "Tras completar tu compra, tendrás acceso inmediato a la descarga. Si usas cuenta, también quedará disponible en tu perfil.",
  },
  {
    q: "¿Qué formatos ofrecen?",
    a: "Depende del diseño. En cada producto verás los formatos disponibles (por ejemplo JEF, DST, PES) y sus variantes.",
  },
  {
    q: "¿Puedo usar los diseños para vender productos físicos?",
    a: "Sí. Puedes bordar en productos físicos y venderlos. Lo que no está permitido es revender, compartir o redistribuir el archivo digital.",
  },
  {
    q: "¿Qué pasa si el archivo no me sirve para mi máquina?",
    a: "Revisa el formato antes de comprar. Si tienes dudas, consulta primero. Si hubo un error evidente en la información publicada, te ayudaremos a resolverlo.",
  },
  {
    q: "¿La compra es segura?",
    a: "Trabajamos con buenas prácticas para proteger tus datos. Recomendamos además usar contraseñas fuertes y no compartir tu acceso.",
  },
  {
    q: "¿Puedo pedir un diseño personalizado?",
    a: "Sí. Puedes solicitar un diseño a pedido indicando referencias, medidas y formato. Te responderemos con una cotización y plazo estimado.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageShell
        eyebrow="Soporte • 2026"
        title="Preguntas frecuentes"
        subtitle="Resolvemos las dudas típicas antes de comprar: formatos, licencias, descargas y soporte. Queremos que te sientas seguro/a."
      >
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border bg-card p-6">
              <p className="font-semibold">{f.q}</p>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border bg-card p-7">
          <p className="text-sm text-muted-foreground">
            ¿No encontraste tu respuesta? Escríbenos con el{" "}
            <span className="font-semibold text-foreground">modelo de tu máquina</span>,{" "}
            el <span className="font-semibold text-foreground">formato</span> que usas y el{" "}
            <span className="font-semibold text-foreground">tamaño de bastidor</span>.
            Así te ayudamos más rápido.
          </p>
        </div>
      </PageShell>

      <div className="pb-14">
        <TrustBar />
      </div>
    </>
  );
}
