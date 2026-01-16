import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CheckoutSuccess from "./pages/CheckoutSuccess";

import AppLayout from "@/layouts/AppLayout";

import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Login from "@/pages/Login";
import Cart from "@/pages/Cart";
import NotFound from "@/pages/not-found";
import AboutPage from "./pages/AboutPage";
import QualityPage from "./pages/QualityPage";
import FaqPage from "./pages/FaqPage";
import LicensePage from "./pages/LicensePage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/shop/:id" component={ProductDetail} />
      <Route path="/login" component={Login} />
      <Route path="/cart" component={Cart} />

      <Route path="/about" component={AboutPage} />
      <Route path="/quality" component={QualityPage} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/license" component={LicensePage} />
      <Route path="/checkout/success" component={CheckoutSuccess} />


      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppLayout>
          <Router />
        </AppLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
