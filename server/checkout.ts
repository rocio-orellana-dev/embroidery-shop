// server/checkout.ts
import type { Express } from "express";
import { db } from "./db";
import * as schema from "@shared/schema";
import { eq, inArray } from "drizzle-orm";

function makeOrderNumber() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `BP-${y}${m}${day}-${rand}`;
}

/**
 * Checkout MOCK (DEV) basado en tus tablas actuales:
 * - users
 * - cart_items
 * - products
 *
 * No guarda "orders" porque no existe esa tabla en tu schema.
 * Lo que hace:
 * 1) Lee el carrito del usuario
 * 2) Calcula subtotal/total (centavos)
 * 3) Genera orderNumber
 * 4) Vacía el carrito (opcional, lo dejamos ON)
 * 5) Retorna redirectUrl a una página de éxito
 */
export function registerCheckoutRoutes(app: Express) {
  app.post("/api/checkout/mock", async (req: any, res) => {
    try {
      // ✅ Ideal: usar sesión/auth (passport) => req.user.id
      // ✅ DEV fallback: permitir userId por body si no hay req.user
      const sessionUserId = req.user?.id;
      const bodyUserId = req.body?.userId;

      const userId = sessionUserId ?? bodyUserId;

      if (!userId) {
        return res.status(401).json({
          message: "Debes iniciar sesión para finalizar la compra.",
        });
      }

      // ✅ 1) Traer items del carrito del usuario
      const cart = await db
        .select()
        .from(schema.cartItems)
        .where(eq(schema.cartItems.userId, Number(userId)));

      if (!cart.length) {
        return res.status(400).json({ message: "Tu carrito está vacío." });
      }

      // ✅ 2) Traer productos asociados (para precio y validación)
      const productIds = cart.map((c) => c.productId);
      const products = await db
        .select()
        .from(schema.products)
        .where(inArray(schema.products.id, productIds));

      const productById = new Map(products.map((p) => [p.id, p]));

      // ✅ 3) Validar y calcular subtotal
      let subtotal = 0;

      const items = cart.map((c) => {
        const p = productById.get(c.productId);

        if (!p) {
          throw new Error(
            `Producto no encontrado (id=${c.productId}). Elimina ese ítem del carrito.`,
          );
        }

        if (p.isActive === false) {
          throw new Error(
            `El producto "${p.name}" ya no está disponible. Elíminalo del carrito.`,
          );
        }

        const qty = Number(c.quantity || 1);
        const unitAmount = Number(p.price); // CENTAVOS
        const lineTotal = unitAmount * qty;

        subtotal += lineTotal;

        return {
          cartItemId: c.id,
          productId: p.id,
          name: p.name,
          tier: p.tier,
          imageUrl: p.imageUrl,
          unitAmount, // centavos
          quantity: qty,
          lineTotal, // centavos
        };
      });

      const tax = 0; // por ahora
      const total = subtotal + tax;

      // ✅ 4) Generar "orderNumber" (mock)
      const orderNumber = makeOrderNumber();

      // ✅ 5) Vaciar carrito después de “pago exitoso”
      // Si quieres NO vaciarlo, comenta este bloque.
      await db.delete(schema.cartItems).where(eq(schema.cartItems.userId, Number(userId)));

      // ✅ 6) Respuesta al frontend
      return res.json({
        ok: true,
        orderNumber,
        currency: "USD",
        subtotal,
        tax,
        total,
        items,
        // Tu frontend redirige a esto
        redirectUrl: `/checkout/success?order=${encodeURIComponent(orderNumber)}`,
      });
    } catch (err: any) {
      console.error("Checkout mock error:", err);
      return res.status(500).json({
        message: err?.message ?? "Error finalizando la compra.",
      });
    }
  });
}
