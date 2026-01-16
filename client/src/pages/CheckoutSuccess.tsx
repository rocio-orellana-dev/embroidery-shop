import { useLocation } from "wouter";

export default function CheckoutSuccess() {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const order = params.get("order");
  const token = params.get("token");

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">¡Compra confirmada!</h1>
        <p className="text-muted-foreground mt-2">
          Tu pedido fue registrado correctamente. Ya puedes acceder a tus descargas.
        </p>

        <div className="mt-6 space-y-2 text-sm">
          <div><span className="font-semibold">Orden:</span> {order ?? "—"}</div>
          <div><span className="font-semibold">Token:</span> {token ?? "—"}</div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            className="px-5 py-2 rounded-full bg-black text-white"
            onClick={() => setLocation("/shop")}
          >
            Seguir comprando
          </button>

          <button
            className="px-5 py-2 rounded-full border"
            onClick={() => alert("Aquí va tu página real de descargas (My Downloads).")}
          >
            Ir a mis descargas
          </button>
        </div>
      </div>
    </div>
  );
}
