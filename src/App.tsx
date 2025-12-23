import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider, useCart } from "@/hooks/useCart";
import { AuthProvider } from "@/hooks/useAuth";
import { WishlistProvider } from "@/hooks/useWishlist";
import AnimatedRoutes from "@/components/AnimatedRoutes";
import ScrollRestoration from "@/components/ScrollRestoration";
import CartDrawer from "@/components/CartDrawer";

const queryClient = new QueryClient();

// CartDrawer wrapper - must be inside CartProvider
const CartDrawerWrapper = () => {
  const { isDrawerOpen, closeDrawer } = useCart();
  return <CartDrawer open={isDrawerOpen} onClose={closeDrawer} />;
};

// Inner app content that uses Cart context
const AppContent = () => {
  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollRestoration />
        <AnimatedRoutes />
        <CartDrawerWrapper />
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AppContent />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
