import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CustomOrder {
  id: string;
  name: string;
  email: string;
  estimated_price: number | null;
  status: string;
  usage_description: string;
}

export default function CustomOrderPayment() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<CustomOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_order_requests')
        .select('id, name, email, estimated_price, status, usage_description')
        .eq('id', orderId)
        .single();

      if (error) throw error;

      if (!data) {
        setError('Order not found');
        return;
      }

      if (['payment_done', 'in_progress', 'in_delivery', 'delivered'].includes(data.status)) {
        setPaymentComplete(true);
      }

      setOrder(data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!order || !order.estimated_price) return;

    setProcessing(true);
    try {
      // Create Razorpay order
      const response = await fetch(
        'https://grdolasawzsrwuqhpheu.supabase.co/functions/v1/create-custom-order-payment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customOrderId: order.id }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      // Open Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Basho by Shivangi',
        description: `Custom Pottery Order`,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch(
              'https://grdolasawzsrwuqhpheu.supabase.co/functions/v1/verify-custom-order-payment',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  customOrderId: order.id,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            setPaymentComplete(true);
            toast.success('Payment successful! Your custom pottery is now being crafted.');
          } catch (err) {
            console.error('Payment verification error:', err);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: order.name,
          email: order.email,
        },
        theme: {
          color: '#8b7355',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Payment error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to initiate payment');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-lg">
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
                <h2 className="text-xl font-medium mb-2">Order Not Found</h2>
                <p className="text-muted-foreground mb-6">{error || 'The order you are looking for does not exist.'}</p>
                <Button onClick={() => navigate('/')}>Go Home</Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (paymentComplete) {
    return (
      <>
        <Helmet>
          <title>Payment Complete | Basho by Shivangi</title>
        </Helmet>
        <Navigation />
        <main className="min-h-screen bg-background pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                  <h2 className="text-2xl font-display mb-2">Payment Complete!</h2>
                  <p className="text-muted-foreground mb-6">
                    Thank you for your payment. Your custom pottery piece is now being lovingly crafted by our artisans.
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    You can track your order status in your account.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => navigate('/orders')}>View Orders</Button>
                    <Button variant="outline" onClick={() => navigate('/')}>Go Home</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Complete Payment | Basho by Shivangi</title>
      </Helmet>
      <Navigation />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="font-display text-3xl text-center">Complete Your Payment</h1>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Custom Pottery Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer</span>
                    <span>{order.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Description</span>
                    <span className="text-right max-w-[200px] truncate">{order.usage_description}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-medium">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{order.estimated_price?.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={processing || !order.estimated_price}
                  className="w-full"
                  size="lg"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay ₹{order.estimated_price?.toLocaleString()}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secure payment powered by Razorpay
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
