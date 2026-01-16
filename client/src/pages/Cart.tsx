import { useState } from "react";
import { useCart, useRemoveFromCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { useUser } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

export default function Cart() {
  const { data: user } = useUser();
  const { data: cartItems, isLoading } = useCart();
  const removeItem = useRemoveFromCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-bold font-display mb-4">
            Por favor, inicia sesión
          </h2>
          <p className="text-muted-foreground mb-6">
            Necesitas estar identificado para ver tu carrito.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-primary text-white">
              Iniciar Sesión / Registrarse
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const subtotal =
    cartItems?.reduce(
      (acc, item) => acc + item.product.price * (item.quantity || 1),
      0
    ) || 0;

  // ✅ Deja money() aquí (a nivel del componente) para usarlo en TODO el archivo
  const money = (value: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(value);

  async function handleCheckout() {
    try {
      if (!cartItems || cartItems.length === 0) return;

      setIsCheckingOut(true);

      const payload = {
        userId: user?.id ?? null,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          tier: item.product.tier,
          imageUrl: item.product.imageUrl,
          unitAmount: item.product.price,
          quantity: item.quantity || 1,
          format: (item as any).format ?? "JEF",
        })),
      };

      const res = await fetch("/api/checkout/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "No se pudo finalizar la compra.");
        return;
      }

      window.location.href = data.redirectUrl;
    } catch (e: any) {
      console.error(e);
      alert("Error inesperado finalizando compra.");
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-3xl font-display font-bold mb-8">
          Carrito de Compras
        </h1>

        {cartItems && cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Lista del Carrito */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => {
                const fmt = ((item as any).format ?? "JEF").toUpperCase();
                const lineTotal = item.product.price * (item.quantity || 1);

                return (
                  <div
                    key={item.id}
                    className="flex gap-6 p-6 bg-white border border-border/50 rounded-xl shadow-sm"
                  >
                    <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <h3 className="font-medium text-lg text-foreground truncate">
                              {item.product.name}
                            </h3>

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge
                                variant="secondary"
                                className="font-mono uppercase"
                              >
                                .{fmt}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Licencia {item.product.tier}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-lg text-primary">
                              {money(item.product.price)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Total: {money(lineTotal)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <span className="text-sm text-muted-foreground">
                          Cant: {item.quantity || 1}
                        </span>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                          onClick={() => removeItem.mutate(item.id)}
                          disabled={removeItem.isPending || isCheckingOut}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-xl border border-border/50 shadow-sm sticky top-24">
                <h3 className="font-semibold text-xl mb-6">
                  Resumen del Pedido
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Impuestos (est.)</span>
                    <span>{money(0)}</span>
                  </div>

                  <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{money(subtotal)}</span>
                  </div>
                </div>

                <Button
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-base rounded-lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || !cartItems?.length}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Finalizar Compra <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Pago seguro procesado por Stripe (modo prueba).
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-border/50 rounded-xl">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Tu carrito está vacío</h3>
            <p className="text-muted-foreground mb-8">
              Parece que aún no has añadido ningún diseño.
            </p>
            <Link href="/shop">
              <Button size="lg" className="bg-primary text-white">
                Continuar Comprando
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
