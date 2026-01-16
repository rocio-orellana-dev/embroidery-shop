import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-border/50">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold font-display">404 Página no encontrada</h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground mb-6">
            La página que estás buscando no existe. Es posible que haya sido movida o eliminada.
          </p>
          
          <Link href="/">
            <Button className="w-full bg-primary text-white hover:bg-primary/90">
              Volver al Inicio
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}