import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package, Sparkles } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, loading, updateQuantity, removeFromCart, getTotal, getShippingCost, itemCount } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const handleCheckout = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    navigate('/checkout');
  };

  const handleAuthSuccess = () => {
    navigate('/checkout');
  };
  
  const subtotal = getTotal();
  const shipping = getShippingCost();
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground font-serif text-lg">Loading your cart...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Cart | Basho by Shivangi</title>
        <meta name="description" content="Review your cart and proceed to checkout." />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-3">
              Your Cart
            </h1>
            <div className="w-16 h-px bg-primary/40 mx-auto" />
          </motion.div>

          {items.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="font-serif text-2xl text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Discover our handcrafted pottery pieces and artisanal workshops
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/products">
                  <Button variant="earth" size="lg" className="gap-2">
                    <Package className="w-4 h-4" />
                    Browse Products
                  </Button>
                </Link>
                <Link to="/workshops">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    View Workshops
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-3 space-y-4">
                <motion.p 
                  className="text-sm text-muted-foreground mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
                </motion.p>

                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="group relative bg-card rounded-xl overflow-hidden border border-border/60 hover:border-primary/30 transition-all duration-500"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    layout
                  >
                    <div className="flex gap-4 p-4 md:p-5">
                      {/* Image */}
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                        {(item.product?.image_url || item.workshop?.image_url) ? (
                          <img 
                            src={item.product?.image_url || item.workshop?.image_url} 
                            alt={item.product?.name || item.workshop?.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-grow min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-serif text-lg md:text-xl text-foreground leading-tight line-clamp-2">
                              {item.product?.name || item.workshop?.title}
                            </h3>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 -mt-1 -mr-2"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 capitalize">
                            {item.item_type === 'workshop' && item.workshop?.duration && (
                              <span className="inline-flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                {item.workshop.duration} • 
                              </span>
                            )}
                            {item.item_type}
                          </p>
                        </div>

                        <div className="flex items-end justify-between mt-3">
                          <p className="text-lg font-medium text-primary">
                            ₹{(item.product?.price || item.workshop?.price || 0).toLocaleString()}
                          </p>

                          {item.item_type === 'product' ? (
                            <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full hover:bg-background"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full hover:bg-background"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                              Qty: 1
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-card border border-border rounded-xl p-6 md:p-8 sticky top-24 shadow-sm">
                  <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                      <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                        {shipping > 0 ? `₹${shipping.toLocaleString()}` : 'Free'}
                      </span>
                    </div>
                    
                    <div className="h-px bg-border my-4" />
                    
                    <div className="flex justify-between items-baseline">
                      <span className="text-foreground font-medium">Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-serif text-primary">₹{total.toLocaleString()}</span>
                        <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="earth" 
                    className="w-full mt-8 h-12 text-base gap-2" 
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="m7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        Secure Payment
                      </span>
                      <span className="w-px h-3 bg-border" />
                      <span>GST Included</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        onSuccess={handleAuthSuccess}
        title="Sign in to checkout"
        description="Create an account or sign in to complete your purchase"
      />
    </>
  );
}
