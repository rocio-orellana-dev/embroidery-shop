import { Navbar } from "@/components/Navbar";
import { useProduct } from "@/hooks/use-products";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAddToCart } from "@/hooks/use-cart";
import { Loader2, Check, Download, Layers, Shield } from "lucide-react";

export default function ProductDetail() {
  const [match, params] = useRoute("/shop/:id");
  const id = parseInt(params?.id || "0");
  
  const { data: product, isLoading } = useProduct(id);
  const addToCart = useAddToCart();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: Image */}
          <div className="space-y-6">
            <div className="aspect-square bg-muted rounded-2xl overflow-hidden border border-border/50 shadow-sm relative">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              {product.isNew && (
                <Badge className="absolute top-6 left-6 bg-blue-500">NEW ARRIVAL</Badge>
              )}
            </div>
            
            {/* Gallery (Static for now) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="aspect-square rounded-lg bg-muted border border-border/50 overflow-hidden cursor-pointer hover:border-primary transition-colors">
                <img src={product.imageUrl} alt="Thumbnail 1" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
              </div>
              <div className="aspect-square rounded-lg bg-muted border border-border/50 overflow-hidden cursor-pointer hover:border-primary transition-colors">
                 {/* Placeholder for detail view */}
                 <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-muted-foreground">Detail</div>
              </div>
              <div className="aspect-square rounded-lg bg-muted border border-border/50 overflow-hidden cursor-pointer hover:border-primary transition-colors">
                 {/* Placeholder for stitch view */}
                 <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-muted-foreground">Stitch View</div>
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col h-full">
            <div className="mb-2">
              <span className="text-primary font-medium tracking-wide text-sm uppercase">{product.category}</span>
            </div>
            
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {product.name}
            </h1>
            
            <div className="text-3xl font-light text-foreground mb-8">
              ${(product.price / 100).toFixed(2)}
            </div>

            <p className="text-muted-foreground leading-relaxed text-lg mb-8">
              {product.description}
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex flex-col gap-2">
                <span className="font-medium text-sm text-foreground uppercase tracking-wider">Included Formats</span>
                <div className="flex flex-wrap gap-2">
                  {product.formats.map(fmt => (
                    <Badge key={fmt} variant="secondary" className="px-3 py-1 font-mono uppercase">
                      .{fmt}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="font-medium text-sm text-foreground uppercase tracking-wider">Features</span>
                <ul className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                   <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Color Change Sheet</li>
                   <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Production Worksheet</li>
                   <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Resizable (up to 20%)</li>
                </ul>
              </div>
            </div>

            <div className="mt-auto space-y-4">
              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-medium rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                onClick={() => addToCart.mutate({ productId: product.id, quantity: 1 })}
                disabled={addToCart.isPending}
              >
                {addToCart.isPending ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Adding...</>
                ) : (
                  "Add to Cart"
                )}
              </Button>
              <div className="flex justify-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Download className="w-4 h-4" /> Instant Download</span>
                <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Secure Payment</span>
                <span className="flex items-center gap-1"><Layers className="w-4 h-4" /> Quality Verified</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
