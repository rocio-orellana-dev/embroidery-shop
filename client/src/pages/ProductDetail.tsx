import { useMemo, useState, useEffect } from "react";
import { useProduct } from "@/hooks/use-products";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAddToCart } from "@/hooks/use-cart";
import { Loader2, Check, Layers, Shield } from "lucide-react";
import WatermarkedImage from "@/components/ui/WatermarkedImage";

type ViewKey = "realistic" | "preview" | "stitches";

export default function ProductDetail() {
  const [, params] = useRoute("/shop/:id");
  const id = parseInt(params?.id || "0");

  const { data: product, isLoading } = useProduct(id);
  const addToCart = useAddToCart();

  const [activeView, setActiveView] = useState<ViewKey>("realistic");
  const [selectedFormat, setSelectedFormat] = useState<string>("JEF");

  // Cuando cargue el producto, setea el formato por defecto
  useEffect(() => {
    if (product?.formats?.length) {
      setSelectedFormat(product.formats[0]);
    }
  }, [product?.formats]);

  const views = useMemo(() => {
    const file = (product?.imageUrl || "").split("/").pop() || "";
    const base = file.replace(/\.[^/.]+$/, "");

    return [
      {
        key: "realistic" as const,
        label: "Vista Realista",
        help: "Así se vería bordado en una tela (mock/realista).",
        src: `/designs/realistic/${base}.png`,
      },
      {
        key: "preview" as const,
        label: "Previsualización",
        help: "Vista limpia del diseño, ideal para ver composición y colores.",
        src: `/designs/previews/${base}.png`,
      },
      {
        key: "stitches" as const,
        label: "Mapa de Puntadas",
        help: "Vista técnica: muestra el recorrido y tipo de puntada. No es la vista final en tela.",
        src: `/designs/stitches/${base}.png`,
      },
    ];
  }, [product?.imageUrl]);

  const active = views.find((v) => v.key === activeView) ?? views[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-muted-foreground">Producto no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* IZQUIERDA: VISTAS */}
          <div className="space-y-5">
            {/* Banner selector de vista */}
            <div className="rounded-xl border border-border/60 bg-background/70 p-2 flex gap-2">
              {views.map((v) => {
                const selected = v.key === activeView;
                return (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => setActiveView(v.key)}
                    className={[
                      "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition",
                      selected
                        ? "bg-primary text-white shadow"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted",
                    ].join(" ")}
                  >
                    {v.label}
                  </button>
                );
              })}
            </div>

            {/* Info de vista actual (para no confundir puntadas) */}
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">
                  Vista actual: {active.label}
                </span>
                <Badge variant="secondary" className="text-[11px]">
                  {activeView === "stitches" ? "TÉCNICO" : "VISTA CLIENTE"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{active.help}</p>

              {activeView === "stitches" && (
                <p className="text-xs mt-2 text-amber-600">
                  ⚠️ Esta es una vista técnica (puntadas). La apariencia final en tela puede variar según hilo, tela y máquina.
                </p>
              )}
            </div>

            {/* Imagen principal */}
            <div className="relative aspect-square bg-muted/30 rounded-xl flex items-center justify-center">
              <WatermarkedImage
                src={active.src}
                alt={active.label}
                variant="light"
                className="w-full h-auto rounded-xl"
                label="Vista previa – Matriz protegida © Bordados.Premium"
              />

              {product.isNew && (
                <Badge className="absolute top-6 left-6 bg-blue-500">
                  NUEVO
                </Badge>
              )}
            </div>

            {/* Miniaturas (opcional, pero ordenadas) */}
            <div className="grid grid-cols-3 gap-4">
              {views.map((v) => {
                const selected = v.key === activeView;
                return (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => setActiveView(v.key)}
                    className={[
                      "aspect-square rounded-lg bg-muted border overflow-hidden transition-colors",
                      selected
                        ? "border-primary"
                        : "border-border/50 hover:border-primary",
                    ].join(" ")}
                    title={v.label}
                  >
                    <img
                      src={v.src}
                      alt={v.label}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* DERECHA: INFO + FORMATO + COMPRA */}
          <div className="flex flex-col h-full">
            <div className="mb-2">
              <span className="text-primary font-medium tracking-wide text-sm uppercase">
                {product.category}
              </span>
            </div>

            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            <div className="text-3xl font-light text-foreground mb-8">
              {new Intl.NumberFormat("es-CL", {
                style: "currency",
                currency: "CLP",
                maximumFractionDigits: 0,
              }).format(product.price)}
            </div>

            <p className="text-muted-foreground leading-relaxed text-lg mb-8">
              {product.description}
            </p>

            <div className="space-y-6 mb-10">
              {/* Selector de formato (NO descargas aquí) */}
              <div className="flex flex-col gap-2">
                <span className="font-medium text-sm text-foreground uppercase tracking-wider">
                  Elige el formato a comprar
                </span>

                <div className="flex flex-wrap gap-2 pt-1">
                  {(product.formats ?? []).map((fmt) => {
                    const selected = fmt === selectedFormat;
                    return (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setSelectedFormat(fmt)}
                        className={[
                          "px-3 py-2 rounded-lg border text-sm font-mono uppercase transition",
                          selected
                            ? "bg-primary text-white border-primary"
                            : "bg-background border-border hover:bg-muted/40",
                        ].join(" ")}
                      >
                        .{fmt}
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-muted-foreground">
                  Estás comprando: <b>.{selectedFormat}</b> (la descarga se habilita después del pago).
                </p>
              </div>

              {/* Características */}
              <div className="flex flex-col gap-2">
                <span className="font-medium text-sm text-foreground uppercase tracking-wider">
                  Características
                </span>
                <ul className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> Hoja de cambio de color
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> Hoja de producción
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> Redimensionable (hasta 20%)
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-auto space-y-4">
              <Button
                size="lg"
                className="w-full h-14 text-lg font-medium rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                onClick={() =>
                  addToCart.mutate({
                    productId: product.id,
                    quantity: 1,
                    format: selectedFormat,
                  })
                }
                disabled={addToCart.isPending}
              >
                {addToCart.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Añadiendo...
                  </>
                ) : (
                  `Añadir al Carrito (.${selectedFormat})`
                )}
              </Button>

              <div className="flex justify-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" /> Pago Seguro
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="w-4 h-4" /> Calidad Verificada
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
