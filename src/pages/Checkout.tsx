import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useAddresses, Address, AddressFormData } from '@/hooks/useAddresses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, MapPin, Package, CreditCard, FileText, Check, ChevronRight, Shield } from 'lucide-react';
import AddressForm from '@/components/AddressForm';
import PaymentProcessingOverlay from '@/components/PaymentProcessingOverlay';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotal, getShippingCost, clearCart, sessionId } = useCart();
  const { addresses, loading: addressesLoading, addAddress, getDefaultAddress } = useAddresses();
  
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'verifying' | 'success' | null>(null);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  
  const [profile, setProfile] = useState<{ full_name: string; phone: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gstNumber: '',
  });

  const subtotal = getTotal();
  const shipping = getShippingCost();
  const total = subtotal + shipping;
  const hasProducts = items.some(item => item.item_type === 'product');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = getDefaultAddress();
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      }
    }
  }, [addresses, selectedAddressId, getDefaultAddress]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfile(data);
      setFormData(prev => ({
        ...prev,
        name: data.full_name || '',
        email: user.email || '',
        phone: data.phone || '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddAddress = async (data: AddressFormData) => {
    setSavingAddress(true);
    const { data: newAddress, error } = await addAddress(data);
    if (error) {
      toast.error('Failed to add address');
    } else {
      toast.success('Address added');
      setShowAddAddress(false);
      if (newAddress) {
        setSelectedAddressId(newAddress.id);
      }
    }
    setSavingAddress(false);
  };

  const getSelectedAddress = (): Address | null => {
    return addresses.find(a => a.id === selectedAddressId) || null;
  };

  const formatAddressString = (address: Address): string => {
    const parts = [
      address.street,
      address.landmark,
      address.city,
      address.state,
      address.pincode,
    ].filter(Boolean);
    return parts.join(', ');
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Please fill in required fields');
      return;
    }

    const selectedAddress = getSelectedAddress();
    if (hasProducts && !selectedAddress) {
      toast.error('Please select or add a shipping address');
      return;
    }

    setLoading(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error('Failed to load payment gateway');
      }

      const orderNumber = `BSH${Date.now().toString(36).toUpperCase()}`;
      const shippingAddressString = selectedAddress ? formatAddressString(selectedAddress) : null;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          session_id: sessionId,
          user_id: user?.id,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: selectedAddress?.phone || formData.phone,
          shipping_address: shippingAddressString,
          gst_number: formData.gstNumber || null,
          subtotal,
          shipping_cost: shipping,
          total_amount: total,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id || null,
        workshop_id: item.workshop_id || null,
        item_type: item.item_type,
        item_name: item.product?.name || item.workshop?.title || '',
        quantity: item.quantity,
        unit_price: item.product?.price || item.workshop?.price || 0,
        total_price: (item.product?.price || item.workshop?.price || 0) * item.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      const { data: razorpayData, error: razorpayError } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: total,
          currency: 'INR',
          receipt: orderNumber,
          notes: { orderId: order.id },
        },
      });

      if (razorpayError) throw razorpayError;

      const options = {
        key: razorpayData.keyId,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: 'Basho Byy Shivangi',
        description: `Order #${orderNumber}`,
        order_id: razorpayData.orderId,
        handler: async (response: any) => {
          try {
            setPaymentStatus('verifying');
            
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order.id,
              },
            });

            if (verifyError || !verifyData.verified) {
              throw new Error('Payment verification failed');
            }

            setPaymentStatus('success');
            setCompletedOrderId(order.id);

            supabase.functions.invoke('send-order-confirmation', {
              body: { order_id: order.id },
            }).catch(err => console.error('Email sending error:', err));

            clearCart().catch(err => console.error('Clear cart error:', err));

            setTimeout(() => {
              window.location.assign(`/order-confirmation/${order.id}`);
            }, 1500);
          } catch (err) {
            setPaymentStatus(null);
            console.error('Payment verification error:', err);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: selectedAddress?.phone || formData.phone,
        },
        theme: {
          color: '#8B7355',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setPaymentStatus(null);
            toast.info('Payment cancelled');
          },
        },
      };

      setPaymentStatus('processing');
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Checkout failed. Please try again.');
      setPaymentStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (completedOrderId) {
      navigate(`/order-confirmation/${completedOrderId}`, { replace: true });
    }
  }, [completedOrderId, navigate]);

  useEffect(() => {
    if (items.length === 0 && !completedOrderId) {
      navigate('/cart', { replace: true });
    }
  }, [items.length, completedOrderId, navigate]);

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/checkout', { replace: true });
    }
  }, [user, navigate]);

  if (items.length === 0 || !user || completedOrderId) {
    return null;
  }

  const selectedAddress = getSelectedAddress();

  return (
    <div className="min-h-screen bg-sand">
      <Helmet>
        <title>Checkout | Basho by Shivangi</title>
        <meta name="description" content="Complete your purchase securely." />
      </Helmet>

      <AnimatePresence>
        {paymentStatus && <PaymentProcessingOverlay status={paymentStatus} />}
      </AnimatePresence>

      <Navigation />

      <main className="min-h-screen bg-background pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-3">
              Checkout
            </h1>
            <div className="w-16 h-px bg-primary/40 mx-auto" />
          </motion.div>

          {/* Progress Steps */}
          <motion.div 
            className="flex items-center justify-center gap-2 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 text-primary">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">Cart</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2 text-primary">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</div>
              <span className="text-sm font-medium hidden sm:inline">Details</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">3</div>
              <span className="text-sm hidden sm:inline">Payment</span>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form Section */}
            <motion.form 
              onSubmit={handleSubmit}
              className="lg:col-span-3 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Contact Information */}
              <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 bg-muted/30 border-b border-border/40">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg">Contact Information</h2>
                    <p className="text-xs text-muted-foreground">How can we reach you?</p>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">Full Name *</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        required 
                        className="h-11"
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email *</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                        disabled
                        className="h-11 bg-muted/50"
                      />
                    </div>
                  </div>
                  
                  {!hasProducts && (
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm">Phone</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-11"
                        placeholder="Your phone number"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              {hasProducts && (
                <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-serif text-lg">Shipping Address</h2>
                        <p className="text-xs text-muted-foreground">Where should we deliver?</p>
                      </div>
                    </div>
                    <Dialog open={showAddAddress} onOpenChange={setShowAddAddress}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <Plus className="w-4 h-4" />
                          Add New
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="font-serif">Add New Address</DialogTitle>
                        </DialogHeader>
                        <AddressForm
                          initialData={{ name: formData.name, phone: formData.phone }}
                          onSubmit={handleAddAddress}
                          onCancel={() => setShowAddAddress(false)}
                          loading={savingAddress}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="p-6">
                    {addressesLoading ? (
                      <div className="flex items-center gap-3 text-muted-foreground py-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading addresses...</span>
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                          <MapPin className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground mb-4">No saved addresses yet</p>
                        <Button variant="outline" onClick={() => setShowAddAddress(true)} className="gap-2">
                          <Plus className="w-4 h-4" />
                          Add Your First Address
                        </Button>
                      </div>
                    ) : (
                      <RadioGroup
                        value={selectedAddressId || ''}
                        onValueChange={setSelectedAddressId}
                        className="space-y-3"
                      >
                        {addresses.map((address) => (
                          <label
                            key={address.id}
                            htmlFor={`checkout-addr-${address.id}`}
                            className={`relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                              selectedAddressId === address.id 
                                ? 'bg-primary/5 border-2 border-primary ring-4 ring-primary/10' 
                                : 'bg-muted/30 border-2 border-transparent hover:bg-muted/50'
                            }`}
                          >
                            <RadioGroupItem value={address.id} id={`checkout-addr-${address.id}`} className="mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-foreground">{address.label}</span>
                                {address.is_default && (
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-foreground/80">{address.name} • {address.phone}</p>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {formatAddressString(address)}
                              </p>
                            </div>
                            {selectedAddressId === address.id && (
                              <div className="absolute top-3 right-3">
                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                  <Check className="w-4 h-4 text-primary-foreground" />
                                </div>
                              </div>
                            )}
                          </label>
                        ))}
                      </RadioGroup>
                    )}
                  </div>
                </div>
              )}

              {/* GST Details */}
              <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 bg-muted/30 border-b border-border/40">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg">GST Details</h2>
                    <p className="text-xs text-muted-foreground">Optional - For business invoices</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber" className="text-sm">GST Number</Label>
                    <Input 
                      id="gstNumber" 
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., 22AAAAA0000A1Z5"
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Order Summary */}
              <div className="lg:hidden bg-card rounded-xl border border-border/60 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-2xl font-serif text-primary">₹{total.toLocaleString()}</span>
                </div>
                <Button 
                  type="submit" 
                  variant="earth" 
                  className="w-full h-12 text-base gap-2" 
                  disabled={loading || (hasProducts && !selectedAddressId)}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Pay ₹{total.toLocaleString()}
                    </>
                  )}
                </Button>
              </div>
            </motion.form>

            {/* Order Summary - Desktop */}
            <motion.div 
              className="lg:col-span-2 hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-card border border-border rounded-xl overflow-hidden sticky top-24 shadow-sm">
                <div className="px-6 py-4 bg-muted/30 border-b border-border/40">
                  <h2 className="font-serif text-xl">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  {/* Cart Items Preview */}
                  <div className="space-y-4 mb-6">
                    {items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                          {(item.product?.image_url || item.workshop?.image_url) ? (
                            <img 
                              src={item.product?.image_url || item.workshop?.image_url} 
                              alt={item.product?.name || item.workshop?.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-1">
                            {item.product?.name || item.workshop?.title}
                          </p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm text-primary mt-1">
                            ₹{((item.product?.price || item.workshop?.price || 0) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <p className="text-sm text-muted-foreground text-center">
                        +{items.length - 3} more item{items.length - 3 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  <div className="h-px bg-border mb-6" />
                  
                  {/* Price Breakdown */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600' : ''}>
                        {shipping > 0 ? `₹${shipping.toLocaleString()}` : 'Free'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="h-px bg-border my-4" />
                  
                  <div className="flex justify-between items-baseline mb-6">
                    <span className="font-medium">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-serif text-primary">₹{total.toLocaleString()}</span>
                      <p className="text-xs text-muted-foreground">Inclusive of GST</p>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    form="checkout-form"
                    variant="earth" 
                    className="w-full h-12 text-base gap-2" 
                    onClick={handleSubmit}
                    disabled={loading || (hasProducts && !selectedAddressId)}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Pay ₹{total.toLocaleString()}
                      </>
                    )}
                  </Button>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>Secure payment via Razorpay</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-3 opacity-60">
                      <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-5 grayscale" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
