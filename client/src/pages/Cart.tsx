import { Navbar } from "@/components/Navbar";
import { useCart, useRemoveFromCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useUser } from "@/hooks/use-auth";

export default function Cart() {
  const { data: user } = useUser();
  const { data: cartItems, isLoading } = useCart();
  const removeItem = useRemoveFromCart();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-bold font-display mb-4">Please log in</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your cart.</p>
          <Link href="/login">
            <Button size="lg" className="bg-primary text-white">Log In / Sign Up</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const subtotal = cartItems?.reduce((acc, item) => acc + (item.product.price * (item.quantity || 1)), 0) || 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>

        {cartItems && cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 p-6 bg-white border border-border/50 rounded-xl shadow-sm">
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg text-foreground">{item.product.name}</h3>
                        <p className="font-bold text-lg text-primary">${(item.product.price / 100).toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.product.tier} License</p>
                    </div>
                    
                    <div className="flex justify-between items-end mt-4">
                      <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        onClick={() => removeItem.mutate(item.id)}
                        disabled={removeItem.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-xl border border-border/50 shadow-sm sticky top-24">
                <h3 className="font-semibold text-xl mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${(subtotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax Estimate</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(subtotal / 100).toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-base rounded-lg">
                  Checkout <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Secure checkout processed by Stripe.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-border/50 rounded-xl">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any designs yet.</p>
            <Link href="/shop">
              <Button size="lg" className="bg-primary text-white">Continue Shopping</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

// Icon helper
import { ShoppingBag } from "lucide-react";
