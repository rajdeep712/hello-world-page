import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package, Sparkles, Shield, Truck, Gift } from 'lucide-react';
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
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative">
            <div className="w-16 h-16 border-2 border-primary/20 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-primary rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground font-serif text-lg tracking-wide">Loading your cart...</p>
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

      <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pt-24 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <ShoppingBag className="w-7 h-7 text-primary" />
            </motion.div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 tracking-tight">
              Your Cart
            </h1>
            <motion.div 
              className="flex items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <span className="text-muted-foreground text-sm tracking-widest uppercase">Handcrafted with love</span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </motion.div>
          </motion.div>

          {items.length === 0 ? (
            <motion.div 
              className="text-center py-20 max-w-lg mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse" />
                <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/60" />
                </div>
              </div>
              <h2 className="font-serif text-3xl text-foreground mb-3">Your cart is empty</h2>
              <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                Discover our collection of handcrafted pottery pieces and artisanal workshops
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/products">
                  <Button variant="earth" size="lg" className="gap-2 px-8 h-12">
                    <Package className="w-4 h-4" />
                    Browse Products
                  </Button>
                </Link>
                <Link to="/workshops">
                  <Button variant="outline" size="lg" className="gap-2 px-8 h-12 border-2">
                    <Sparkles className="w-4 h-4" />
                    View Workshops
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
              {/* Cart Items */}
              <div className="lg:col-span-3 space-y-5">
                <motion.div 
                  className="flex items-center justify-between mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-muted-foreground">
                    <span className="text-foreground font-medium">{itemCount}</span> {itemCount === 1 ? 'item' : 'items'} in your cart
                  </p>
                  <Link to="/products" className="text-sm text-primary hover:underline underline-offset-4 transition-all">
                    Continue Shopping
                  </Link>
                </motion.div>

                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    layout
                  >
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    <div className="relative flex gap-5 p-5 md:p-6">
                      {/* Image */}
                      <div className="w-28 h-28 md:w-36 md:h-36 bg-muted rounded-xl flex-shrink-0 overflow-hidden ring-1 ring-border/50">
                        {(item.product?.image_url || item.workshop?.image_url) ? (
                          <img 
                            src={item.product?.image_url || item.workshop?.image_url} 
                            alt={item.product?.name || item.workshop?.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
                            <Package className="w-10 h-10" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-grow min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="inline-flex items-center gap-1.5 text-xs text-primary/80 font-medium uppercase tracking-wider mb-1.5">
                                {item.item_type === 'workshop' ? (
                                  <>
                                    <Sparkles className="w-3 h-3" />
                                    Workshop
                                  </>
                                ) : (
                                  <>
                                    <Package className="w-3 h-3" />
                                    Product
                                  </>
                                )}
                              </span>
                              <h3 className="font-serif text-xl md:text-2xl text-foreground leading-tight line-clamp-2">
                                {item.product?.name || item.workshop?.title}
                              </h3>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 -mt-1 -mr-2 rounded-full transition-colors"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {item.item_type === 'workshop' && item.workshop?.duration && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Duration: {item.workshop.duration}
                            </p>
                          )}
                        </div>

                        <div className="flex items-end justify-between mt-4">
                          <div>
                            <p className="text-2xl font-serif text-foreground">
                              ₹{((item.product?.price || item.workshop?.price || 0) * item.quantity).toLocaleString()}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                ₹{(item.product?.price || item.workshop?.price || 0).toLocaleString()} each
                              </p>
                            )}
                          </div>

                          {item.item_type === 'product' ? (
                            <div className="flex items-center gap-1 bg-muted/60 rounded-full p-1 border border-border/50">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-full hover:bg-background hover:shadow-sm transition-all"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </Button>
                              <span className="w-10 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-full hover:bg-background hover:shadow-sm transition-all"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground bg-muted/60 px-4 py-2 rounded-full border border-border/50">
                              1 seat
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
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="bg-card border border-border/50 rounded-2xl overflow-hidden sticky top-24 shadow-xl shadow-black/5">
                  {/* Summary Header */}
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 md:px-8 py-5 border-b border-border/50">
                    <h2 className="font-serif text-2xl text-foreground">Order Summary</h2>
                  </div>
                  
                  <div className="p-6 md:p-8">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                        <span className="font-medium text-foreground">₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          Shipping
                        </span>
                        <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-foreground'}>
                          {shipping > 0 ? `₹${shipping.toLocaleString()}` : 'Free'}
                        </span>
                      </div>
                      
                      {shipping === 0 && (
                        <motion.div 
                          className="flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Gift className="w-4 h-4" />
                          You've unlocked free shipping!
                        </motion.div>
                      )}
                      
                      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-6" />
                      
                      <div className="flex justify-between items-baseline">
                        <span className="text-foreground font-medium text-lg">Total</span>
                        <div className="text-right">
                          <span className="text-3xl font-serif text-foreground">₹{total.toLocaleString()}</span>
                          <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      variant="earth" 
                      className="w-full mt-8 h-14 text-base font-medium gap-2 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300" 
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5" />
                    </Button>

                    {/* Trust badges */}
                    <div className="mt-8 pt-6 border-t border-border/50">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="text-[10px] text-muted-foreground leading-tight">Secure<br/>Payment</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center">
                            <Package className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="text-[10px] text-muted-foreground leading-tight">Careful<br/>Packaging</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="text-[10px] text-muted-foreground leading-tight">Handcrafted<br/>Quality</span>
                        </div>
                      </div>
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
