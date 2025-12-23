import { ProductWithFormats } from "@shared/schema";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useAddToCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: ProductWithFormats;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  // Determine badge color based on tier
  const getBadgeVariant = (tier: string) => {
    switch (tier.toUpperCase()) {
      case 'PREMIUM': return "default";
      case 'PRO': return "secondary";
      default: return "outline";
    }
  };

  return (
    <Link href={`/shop/${product.id}`} className="group block cursor-pointer">
      <motion.div 
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="h-full bg-card rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all"
      >
        {/* Image Container */}
        <div className="aspect-square relative overflow-hidden bg-muted">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              No Image
            </div>
          )}
          
          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none shadow-sm">NEW</Badge>
            )}
            {product.isBestseller && (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm">BESTSELLER</Badge>
            )}
          </div>

          {/* Quick Add Button (Visible on Hover) */}
          <div className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <Button 
              size="icon" 
              className="rounded-full shadow-lg bg-white text-black hover:bg-primary hover:text-white"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <Badge variant={getBadgeVariant(product.tier)} className="text-[10px] tracking-wider uppercase">
              {product.tier}
            </Badge>
            <span className="font-display font-semibold text-lg text-primary">
              ${(product.price / 100).toFixed(2)}
            </span>
          </div>
          
          <h3 className="font-medium text-foreground text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 h-10">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-1 mt-auto">
            {product.formats?.slice(0, 3).map(fmt => (
              <span key={fmt} className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground uppercase">
                {fmt}
              </span>
            ))}
            {(product.formats?.length || 0) > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                +{product.formats!.length - 3}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-border/50 bg-card h-[400px]">
      <div className="aspect-square bg-muted animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-16 bg-muted animate-pulse rounded" />
          <div className="h-5 w-12 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}
