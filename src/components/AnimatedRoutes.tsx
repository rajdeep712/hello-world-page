import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Workshops from "@/pages/Workshops";
import Studio from "@/pages/Studio";
import Contact from "@/pages/Contact";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Orders from "@/pages/Orders";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "@/pages/NotFound";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
        <Route path="/products/:productId" element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/workshops" element={<PageTransition><Workshops /></PageTransition>} />
        <Route path="/studio" element={<PageTransition><Studio /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <PageTransition><Checkout /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/order-confirmation/:orderId" element={<PageTransition><OrderConfirmation /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <PageTransition><Profile /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <PageTransition><Orders /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <PageTransition><AdminDashboard /></PageTransition>
          </AdminRoute>
        } />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
