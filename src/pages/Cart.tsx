import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, loading, updateQuantity, removeFromCart, getTotal, getShippingCost, itemCount } = useCart();
  
  const handleCheckout = () => {
    if (!user) {
      toast.info('Please sign in to continue with checkout');
      navigate('/auth?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };
  
  const subtotal = getTotal();
  const shipping = getShippingCost();
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading cart...</div>
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

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h1 
            className="font-display text-4xl md:text-5xl text-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Your Cart
          </motion.h1>

          {items.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg mb-6">Your cart is empty</p>
              <div className="flex gap-4 justify-center">
                <Link to="/products">
                  <Button variant="earth">Browse Products</Button>
                </Link>
                <Link to="/workshops">
                  <Button variant="outline">View Workshops</Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="bg-card border border-border rounded-lg p-4 flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                      {(item.product?.image_url || item.workshop?.image_url) ? (
                        <img 
                          src={item.product?.image_url || item.workshop?.image_url} 
                          alt={item.product?.name || item.workshop?.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <h3 className="font-display text-lg text-foreground">
                        {item.product?.name || item.workshop?.title}
                      </h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {item.item_type === 'workshop' && item.workshop?.duration && (
                          <span>{item.workshop.duration} • </span>
                        )}
                        {item.item_type}
                      </p>
                      <p className="text-primary font-medium mt-1">
                        ₹{(item.product?.price || item.workshop?.price || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      {item.item_type === 'product' ? (
                        <div className="flex items-center gap-2 border border-border rounded-lg">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Qty: 1</span>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="font-display text-xl mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping > 0 ? `₹${shipping.toLocaleString()}` : 'Free'}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-medium text-base">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button variant="earth" className="w-full mt-6" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  GST included • Secure payment via Razorpay
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
