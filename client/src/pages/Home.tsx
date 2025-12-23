import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Star, ShieldCheck, Truck } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { motion } from "framer-motion";

export default function Home() {
  const { data: products, isLoading } = useProducts({ sort: 'featured' });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-background to-background" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Elevate your <br/>
                <span className="text-gold-gradient">Embroidery</span> Art.
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Premium digital embroidery patterns for professionals. 
                Optimized for JEF, DST, PES and more. Immediate download.
              </p>
              <div className="flex gap-4">
                <Link href="/shop">
                  <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
                    Explore Collection
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="rounded-full px-8 border-primary/20 hover:bg-primary/5">
                    Our Quality
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-full blur-3xl opacity-20" />
              {/* Unsplash image of embroidery machine or art */}
              <img 
                src="https://pixabay.com/get/gc991fe93a02b63e3284a5a679b8fbbbd3cacd6b8c4d253646529b59759a8094a67f9a502911da6a1e378b4edf8a6c793893e60f7a4f06c534c8d21e2a4545ddd_1280.jpg"
                alt="Embroidery Detail" 
                className="relative rounded-2xl shadow-2xl border border-white/10 w-full object-cover aspect-[4/3]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="border-y border-border/50 bg-secondary/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">Manually digitized, tested patterns.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Commercial License</h3>
                <p className="text-sm text-muted-foreground">Included with every PRO purchase.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Instant Download</h3>
                <p className="text-sm text-muted-foreground">Access your files immediately.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Featured Designs</h2>
              <p className="text-muted-foreground">Hand-picked selections for this season.</p>
            </div>
            <Link href="/shop">
              <Button variant="ghost" className="group text-primary hover:text-primary/80">
                View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading 
              ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
              : products?.slice(0, 4).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
            }
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <h3 className="font-display text-2xl font-bold mb-4">
                Bordados<span className="text-primary italic">.Premium</span>
              </h3>
              <p className="text-gray-400 max-w-sm">
                Elevating the art of machine embroidery with professional-grade digital patterns for creators worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/shop?category=Floral" className="hover:text-primary transition-colors">Floral</Link></li>
                <li><Link href="/shop?category=Logos" className="hover:text-primary transition-colors">Logos</Link></li>
                <li><Link href="/shop?category=Monograms" className="hover:text-primary transition-colors">Monograms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/license" className="hover:text-primary transition-colors">License Info</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            © 2024 Bordados Premium. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
