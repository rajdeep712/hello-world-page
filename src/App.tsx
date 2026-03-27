import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/hooks/useCart";
import { AuthProvider } from "@/hooks/useAuth";
import { WishlistProvider } from "@/hooks/useWishlist";
import AnimatedRoutes from "@/components/AnimatedRoutes";
import AppInitializer from "@/components/AppInitializer";
import ScrollRestoration from "@/components/ScrollRestoration";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollRestoration />
                <AppInitializer>
                  <AnimatedRoutes />
                </AppInitializer>
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
