import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const login = useLogin();
  const register = useRegister();
  
  const isPending = login.isPending || register.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login.mutate({ username, password });
    } else {
      register.mutate({ username, password });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">      
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white border border-border/50 shadow-2xl rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">
              {isLogin ? "Bienvenido de vuelta" : "Únete a Bordados"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin 
                ? "Ingresa tus credenciales para acceder a tu cuenta" 
                : "Crea una cuenta para comenzar a descargar diseños"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input 
                id="username" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                required 
                className="h-11 bg-muted/30 focus:bg-background transition-colors"
                disabled={isPending}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                required 
                className="h-11 bg-muted/30 focus:bg-background transition-colors"
                disabled={isPending}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base bg-primary hover:bg-primary/90 text-white"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Iniciar sesión" : "Crear cuenta")}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
             <p className="text-sm text-muted-foreground">
               {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
               <button 
                 onClick={() => setIsLogin(!isLogin)}
                 className="ml-2 font-medium text-primary hover:underline focus:outline-none"
               >
                 {isLogin ? "Regístrate" : "Iniciar sesión"}
               </button>
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
