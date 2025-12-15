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
import { Loader2, Plus, MapPin } from 'lucide-react';
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

  // Fetch profile and set defaults
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Set default address when addresses load
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
        name: 'Basho by Shivangi',
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

            // Send order confirmation email - only order_id needed, auth handled by function
            supabase.functions.invoke('send-order-confirmation', {
              body: { order_id: order.id },
            }).catch(err => console.error('Email sending error:', err));

            // Clear cart after payment success (do not block redirect)
            clearCart().catch(err => console.error('Clear cart error:', err));

            // Wait for animation then hard-navigate (more reliable than SPA navigate after Razorpay modal)
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

  // Redirect if order completed
  useEffect(() => {
    if (completedOrderId) {
      navigate(`/order-confirmation/${completedOrderId}`, { replace: true });
    }
  }, [completedOrderId, navigate]);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0 && !completedOrderId) {
      navigate('/cart', { replace: true });
    }
  }, [items.length, completedOrderId, navigate]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/checkout', { replace: true });
    }
  }, [user, navigate]);

  if (items.length === 0 || !user || completedOrderId) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Basho by Shivangi</title>
        <meta name="description" content="Complete your purchase securely." />
      </Helmet>

      <AnimatePresence>
        {paymentStatus && <PaymentProcessingOverlay status={paymentStatus} />}
      </AnimatePresence>

      <Navigation />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h1 
            className="font-display text-4xl md:text-5xl text-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Checkout
          </motion.h1>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.form 
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Contact Information */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h2 className="font-display text-xl">Contact Information</h2>
                
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                      disabled
                    />
                  </div>
                  
                  {!hasProducts && (
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              {hasProducts && (
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Shipping Address
                    </h2>
                    <Dialog open={showAddAddress} onOpenChange={setShowAddAddress}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Add New
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add New Address</DialogTitle>
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
                  
                  {addressesLoading ? (
                    <p className="text-muted-foreground">Loading addresses...</p>
                  ) : addresses.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No saved addresses. Please add a shipping address.
                    </p>
                  ) : (
                    <RadioGroup
                      value={selectedAddressId || ''}
                      onValueChange={setSelectedAddressId}
                      className="space-y-3"
                    >
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedAddressId === address.id 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedAddressId(address.id)}
                        >
                          <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                          <label htmlFor={address.id} className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{address.label}</span>
                              {address.is_default && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>
                              )}
                            </div>
                            <p className="text-sm font-medium">{address.name} • {address.phone}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatAddressString(address)}
                            </p>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              )}

              {/* GST Details */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h2 className="font-display text-xl">GST Details (Optional)</h2>
                
                <div>
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input 
                    id="gstNumber" 
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    placeholder="For business invoices"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                variant="earth" 
                className="w-full" 
                size="lg"
                disabled={loading || (hasProducts && !selectedAddressId)}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${total.toLocaleString()}`
                )}
              </Button>
            </motion.form>

            {/* Order Summary */}
            <motion.div 
              className="bg-card border border-border rounded-lg p-6 h-fit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="font-display text-xl mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product?.name || item.workshop?.title} × {item.quantity}
                    </span>
                    <span>₹{((item.product?.price || item.workshop?.price || 0) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
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

              <p className="text-xs text-muted-foreground text-center mt-6">
                Secure payment powered by Razorpay
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
