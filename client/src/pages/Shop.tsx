import { useProducts } from "@/hooks/use-products";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Link, useLocation } from "wouter";

const CATEGORIES = [
  { label: "Todas", value: "all" },
  { label: "Animales", value: "Animales" },
  { label: "Logos", value: "Logos" },
  { label: "Religioso", value: "Religioso" },
  { label: "Patriótico", value: "Patriótico" },
  { label: "Frases", value: "Frases" },
  { label: "Amor", value: "Amor" },
  // si quieres mantener las antiguas:
  { label: "Floral", value: "Floral" },
  { label: "Geométrico", value: "Geométrico" },
  { label: "Monogramas", value: "Monogramas" },
  { label: "Temporada", value: "Temporada" },
];

function getQuery(location: string) {
  const q = location.split("?")[1] ?? "";
  return new URLSearchParams(q);
}

export default function Shop() {
  const [location, setLocation] = useLocation();

  // Leer desde URL al cargar / navegar
  const params = useMemo(() => getQuery(location), [location]);
  const initialCategory = params.get("category") ?? "all";
  const initialSearch = params.get("search") ?? "";
  const initialSort = params.get("sort") ?? "featured";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [category, setCategory] = useState<string>(initialCategory);
  const [sort, setSort] = useState<string>(initialSort);

  // Si cambian los query params por navegación, sincroniza estados
  useEffect(() => {
    setCategory(initialCategory);
    setSort(initialSort);
    setSearchTerm(initialSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCategory, initialSort, initialSearch]);

  // Debounce búsqueda
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Actualiza URL cuando cambien filtros (sin recargar)
  useEffect(() => {
    const next = new URLSearchParams();
    if (category && category !== "all") next.set("category", category);
    if (sort && sort !== "featured") next.set("sort", sort);
    if (searchTerm.trim()) next.set("search", searchTerm.trim());

    const qs = next.toString();
    setLocation(qs ? `/shop?${qs}` : `/shop`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort, searchTerm]);

  const { data: products, isLoading } = useProducts({
    search: debouncedSearch || undefined,
    category: category === "all" ? undefined : category,
    sort: sort as any,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Catálogo</h1>
            <p className="text-muted-foreground mt-2">Diseños premium listos para bordado (JEF)</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar diseños..."
                className="pl-9 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-44 bg-white">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full sm:w-44 bg-white">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Destacados</SelectItem>
                <SelectItem value="new">Más recientes</SelectItem>
                <SelectItem value="price_asc">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price_desc">Precio: Mayor a Menor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-border/50 rounded-xl">
            <h3 className="text-xl font-medium text-muted-foreground">No se encontraron productos</h3>
            <p className="text-muted-foreground/60 mt-2">Intenta ajustar tus filtros o términos de búsqueda.</p>
          </div>
        )}
      </div>

      {/* Footer (ajusté categorías para que coincidan) */}
      <footer className="bg-foreground text-background py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <h3 className="font-display text-2xl font-bold mb-4">
                Bordados<span className="text-primary italic">.Premium</span>
              </h3>
              <p className="text-gray-400 max-w-sm">
                Elevando el arte del bordado a máquina con patrones digitales de nivel profesional.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Tienda</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/shop?category=Animales" className="hover:text-primary transition-colors">Animales</Link></li>
                <li><Link href="/shop?category=Logos" className="hover:text-primary transition-colors">Logos</Link></li>
                <li><Link href="/shop?category=Religioso" className="hover:text-primary transition-colors">Religioso</Link></li>
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
    </div>
  );
}
