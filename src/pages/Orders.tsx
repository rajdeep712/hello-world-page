import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface OrderItem {
  id: string;
  item_name: string;
  item_type: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  total_amount: number;
  subtotal: number;
  shipping_cost: number;
  payment_status: string;
  order_status: string;
  shipping_address: string;
  order_items: OrderItem[];
}

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        created_at,
        total_amount,
        subtotal,
        shipping_cost,
        payment_status,
        order_status,
        shipping_address,
        order_items (
          id,
          item_name,
          item_type,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'confirmed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <Helmet>
        <title>My Orders | Basho by Shivangi</title>
        <meta name="description" content="View your order history" />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h1 className="font-display text-4xl md:text-5xl text-foreground">My Orders</h1>

            {loading ? (
              <p className="text-muted-foreground">Loading orders...</p>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-medium mb-2">No orders yet</h2>
                  <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                  <Link to="/products">
                    <Button>Browse Products</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader 
                      className="cursor-pointer"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            Order #{order.order_number}
                            {expandedOrder === order.id ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(order.order_status)}>
                            {order.order_status || 'Processing'}
                          </Badge>
                          <span className="font-medium">₹{order.total_amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {expandedOrder === order.id && (
                      <CardContent className="border-t">
                        <div className="pt-4 space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Items</h4>
                            <div className="space-y-2">
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    {item.item_name} × {item.quantity}
                                  </span>
                                  <span>₹{item.total_price.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1 text-sm border-t pt-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span>₹{order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Shipping</span>
                              <span>{order.shipping_cost > 0 ? `₹${order.shipping_cost.toLocaleString()}` : 'Free'}</span>
                            </div>
                            <div className="flex justify-between font-medium pt-2 border-t">
                              <span>Total</span>
                              <span>₹{order.total_amount.toLocaleString()}</span>
                            </div>
                          </div>

                          {order.shipping_address && (
                            <div>
                              <h4 className="font-medium mb-1">Shipping Address</h4>
                              <p className="text-sm text-muted-foreground">{order.shipping_address}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Payment:</span>
                            <Badge variant="outline" className={getStatusColor(order.payment_status)}>
                              {order.payment_status || 'Pending'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
