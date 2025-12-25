import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, Palette, Sparkles, Calendar, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

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

interface CustomOrder {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  usage_description: string;
  preferred_size: string;
  notes: string | null;
  status: string;
  estimated_price: number | null;
  estimated_delivery_date: string | null;
  shipping_address: string | null;
  admin_notes: string | null;
  created_at: string;
  reference_images: string[] | null;
}

interface ExperienceBooking {
  id: string;
  experience_type: string;
  booking_date: string;
  time_slot: string;
  guests: number;
  notes: string | null;
  total_amount: number;
  payment_status: string;
  booking_status: string;
  created_at: string;
}

const experienceNames: Record<string, string> = {
  couple: 'Couple Pottery Dates',
  birthday: 'Birthday Sessions',
  farm: 'Farm & Garden Mini Parties',
  studio: 'Studio-Based Experiences'
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [experienceBookings, setExperienceBookings] = useState<ExperienceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [expandedCustomOrder, setExpandedCustomOrder] = useState<string | null>(null);
  const [expandedExperience, setExpandedExperience] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAllOrders();
    }
  }, [user]);

  const fetchAllOrders = async () => {
    if (!user) return;

    const [ordersResult, customOrdersResult, experiencesResult] = await Promise.all([
      supabase
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
        .order('created_at', { ascending: false }),
      supabase
        .from('custom_order_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('experience_bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false })
    ]);

    if (ordersResult.error) {
      console.error('Error fetching orders:', ordersResult.error);
    } else {
      setOrders(ordersResult.data || []);
    }

    if (customOrdersResult.error) {
      console.error('Error fetching custom orders:', customOrdersResult.error);
    } else {
      setCustomOrders(customOrdersResult.data || []);
    }

    if (experiencesResult.error) {
      console.error('Error fetching experiences:', experiencesResult.error);
    } else {
      setExperienceBookings(experiencesResult.data || []);
    }

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'confirmed':
      case 'delivered':
      case 'payment_done':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'payment_pending':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
      case 'failed':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'shipped':
      case 'in_progress':
      case 'in_delivery':
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

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const hasNoOrders = orders.length === 0 && customOrders.length === 0 && experienceBookings.length === 0;

  return (
    <div className="min-h-screen bg-sand">
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
            ) : hasNoOrders ? (
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
              <Tabs defaultValue="regular" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="regular" className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Orders ({orders.length})
                  </TabsTrigger>
                  <TabsTrigger value="experiences" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Experiences ({experienceBookings.length})
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Custom ({customOrders.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="regular">
                  {orders.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No regular orders yet</p>
                        <Link to="/products" className="mt-4 inline-block">
                          <Button variant="outline">Browse Products</Button>
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
                </TabsContent>

                <TabsContent value="experiences">
                  {experienceBookings.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No experience bookings yet</p>
                        <Link to="/experiences" className="mt-4 inline-block">
                          <Button variant="outline">Book an Experience</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {experienceBookings.map((booking) => (
                        <Card key={booking.id}>
                          <CardHeader 
                            className="cursor-pointer"
                            onClick={() => setExpandedExperience(expandedExperience === booking.id ? null : booking.id)}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Sparkles className="w-5 h-5 text-primary" />
                                  {experienceNames[booking.experience_type] || booking.experience_type}
                                  {expandedExperience === booking.id ? (
                                    <ChevronUp className="w-5 h-5" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5" />
                                  )}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">{format(new Date(booking.booking_date), 'PPP')}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge className={getStatusColor(booking.booking_status)}>
                                  {formatStatus(booking.booking_status)}
                                </Badge>
                                <span className="font-medium">₹{booking.total_amount.toLocaleString()}</span>
                              </div>
                            </div>
                          </CardHeader>
                          
                          {expandedExperience === booking.id && (
                            <CardContent className="border-t">
                              <div className="pt-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{format(new Date(booking.booking_date), 'PPP')}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{booking.time_slot}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                                  </div>
                                </div>

                                {booking.notes && (
                                  <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Notes</h4>
                                    <p className="text-sm">{booking.notes}</p>
                                  </div>
                                )}

                                <div className="flex items-center gap-2 text-sm border-t pt-3">
                                  <span className="text-muted-foreground">Payment:</span>
                                  <Badge variant="outline" className={getStatusColor(booking.payment_status)}>
                                    {formatStatus(booking.payment_status)}
                                  </Badge>
                                </div>

                                <div className="text-xs text-muted-foreground">
                                  Booked on {format(new Date(booking.created_at), 'PPp')}
                                </div>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="custom">
                  {customOrders.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Palette className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No custom orders yet</p>
                        <Link to="/custom-orders" className="mt-4 inline-block">
                          <Button variant="outline">Request Custom Pottery</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {customOrders.map((order) => (
                        <Card key={order.id}>
                          <CardHeader 
                            className="cursor-pointer"
                            onClick={() => setExpandedCustomOrder(expandedCustomOrder === order.id ? null : order.id)}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Palette className="w-5 h-5 text-primary" />
                                  Custom Order Request
                                  {expandedCustomOrder === order.id ? (
                                    <ChevronUp className="w-5 h-5" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5" />
                                  )}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge className={getStatusColor(order.status)}>
                                  {formatStatus(order.status)}
                                </Badge>
                                {order.estimated_price && (
                                  <span className="font-medium">₹{order.estimated_price.toLocaleString()}</span>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          
                          {expandedCustomOrder === order.id && (
                            <CardContent className="border-t">
                              <div className="pt-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
                                    <p className="text-sm">{order.usage_description}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Preferred Size</h4>
                                    <p className="text-sm capitalize">{order.preferred_size}</p>
                                  </div>
                                </div>

                                {order.notes && (
                                  <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Your Notes</h4>
                                    <p className="text-sm">{order.notes}</p>
                                  </div>
                                )}

                                {order.admin_notes && (
                                  <div className="bg-muted/50 p-3 rounded-lg">
                                    <h4 className="font-medium text-sm text-muted-foreground">Response from Artisan</h4>
                                    <p className="text-sm">{order.admin_notes}</p>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t pt-3">
                                  {order.estimated_price && (
                                    <div>
                                      <span className="text-muted-foreground">Estimated Price:</span>
                                      <span className="ml-2 font-medium">₹{order.estimated_price.toLocaleString()}</span>
                                    </div>
                                  )}
                                  {order.estimated_delivery_date && (
                                    <div>
                                      <span className="text-muted-foreground">Est. Delivery:</span>
                                      <span className="ml-2 font-medium">{formatDate(order.estimated_delivery_date)}</span>
                                    </div>
                                  )}
                                </div>

                                {order.shipping_address && (
                                  <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Shipping Address</h4>
                                    <p className="text-sm">{order.shipping_address}</p>
                                  </div>
                                )}

                                {order.reference_images && order.reference_images.length > 0 && (
                                  <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Reference Images</h4>
                                    <div className="flex gap-2 flex-wrap">
                                      {order.reference_images.map((img, idx) => (
                                        <a 
                                          key={idx} 
                                          href={img} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="w-16 h-16 rounded-md overflow-hidden border hover:opacity-80 transition-opacity"
                                        >
                                          <img src={img} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover" />
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-muted-foreground">Contact:</span>
                                  <span>{order.email}</span>
                                  {order.phone && <span>• {order.phone}</span>}
                                </div>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
