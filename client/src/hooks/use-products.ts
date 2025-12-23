import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type ProductWithFormats } from "@shared/schema";
import { z } from "zod";

// Helper to handle optional query params
type ProductFilters = {
  search?: string;
  category?: string;
  sort?: 'featured' | 'new' | 'bestseller' | 'price_asc' | 'price_desc';
};

export function useProducts(filters?: ProductFilters) {
  // Construct query key based on filters so it refetches when they change
  const queryKey = [api.products.list.path, filters];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Build URL with query params
      const url = new URL(api.products.list.path, window.location.origin);
      if (filters?.search) url.searchParams.set("search", filters.search);
      if (filters?.category) url.searchParams.set("category", filters.category);
      if (filters?.sort) url.searchParams.set("sort", filters.sort);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      
      // Validation with Zod schema from shared routes (typed as any in manifest but returns ProductWithFormats[])
      const data = await res.json();
      return api.products.list.responses[200].parse(data) as ProductWithFormats[];
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");
      
      const data = await res.json();
      return api.products.get.responses[200].parse(data) as ProductWithFormats;
    },
    enabled: !!id && !isNaN(id),
  });
}
