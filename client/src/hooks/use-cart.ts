import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type CartItemWithDetails, type AddToCartRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useCart() {
  return useQuery({
    queryKey: [api.cart.get.path],
    queryFn: async () => {
      const res = await fetch(api.cart.get.path, { credentials: "include" });
      if (res.status === 401) return null; // No ha iniciado sesión
      if (!res.ok) throw new Error("Error al obtener el carrito");

      const data = await res.json();
      return api.cart.get.responses[200].parse(data) as CartItemWithDetails[];
    },
    retry: false,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    // ✅ Ahora acepta format
    mutationFn: async ({ productId, quantity, format }: AddToCartRequest) => {
      const res = await fetch(api.cart.addItem.path, {
        method: api.cart.addItem.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: quantity ?? 1,
          format, // ✅ importante
        }),
        credentials: "include",
      });

      if (res.status === 401) throw new Error("Por favor, inicia sesión para añadir productos");
      if (!res.ok) throw new Error("Error al añadir al carrito");

      return api.cart.addItem.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path] });
      toast({
        title: "Añadido al carrito",
        description: "El artículo ha sido añadido a tu bolsa de compras.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.cart.removeItem.path, { id });
      const res = await fetch(url, {
        method: api.cart.removeItem.method,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al eliminar el artículo");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path] });
      toast({
        title: "Artículo eliminado",
        description: "El artículo ha sido quitado de tu carrito.",
      });
    },
  });
}
