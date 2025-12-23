import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Eye, Loader2, ShoppingCart, IndianRupee, User, MapPin, Package } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTableWrapper from '@/components/admin/AdminTableWrapper';
import AdminEmptyState from '@/components/admin/AdminEmptyState';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string | null;
  subtotal: number;
  shipping_cost: number | null;
  total_amount: number;
  order_status: string | null;
  payment_status: string | null;
  created_at: string;
}

interface OrderItem {
  id: string;
  item_name: string;
  item_type: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
    },
    onError: (error) => {
      toast.error('Failed to update status: ' + error.message);
    },
  });

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);
    if (!error && data) {
      setOrderItems(data);
    }
    setIsDialogOpen(true);
  };

  const getStatusConfig = (status: string | null) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-amber-500/10', text: 'text-amber-600', label: 'Pending' },
      confirmed: { bg: 'bg-blue-500/10', text: 'text-blue-600', label: 'Confirmed' },
      shipped: { bg: 'bg-purple-500/10', text: 'text-purple-600', label: 'Shipped' },
      delivered: { bg: 'bg-green-500/10', text: 'text-green-600', label: 'Delivered' },
      cancelled: { bg: 'bg-red-500/10', text: 'text-red-600', label: 'Cancelled' },
    };
    return configs[status || 'pending'] || configs.pending;
  };

  const getPaymentConfig = (status: string | null) => {
    if (status === 'paid') {
      return { bg: 'bg-green-500/10', text: 'text-green-600', label: 'Paid' };
    }
    return { bg: 'bg-amber-500/10', text: 'text-amber-600', label: 'Pending' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Orders"
        description="Track and manage customer orders"
        icon={ShoppingCart}
      />

      {orders && orders.length > 0 ? (
        <AdminTableWrapper>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="font-semibold">Order</TableHead>
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Payment</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.order_status);
                const paymentConfig = getPaymentConfig(order.payment_status);
                return (
                  <TableRow key={order.id} className="border-border/50 hover:bg-muted/30">
                    <TableCell>
                      <span className="font-mono text-sm font-medium text-foreground">
                        {order.order_number}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {order.customer_name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{order.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-semibold">
                        <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                        {order.total_amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${paymentConfig.bg} ${paymentConfig.text} border-0 font-normal`}>
                        {paymentConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.order_status || 'pending'}
                        onValueChange={(value) => updateStatusMutation.mutate({ id: order.id, status: value })}
                      >
                        <SelectTrigger className={`w-32 h-8 text-xs border-0 ${statusConfig.bg} ${statusConfig.text}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(order.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleViewOrder(order)}
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </AdminTableWrapper>
      ) : (
        <AdminTableWrapper>
          <AdminEmptyState
            icon={ShoppingCart}
            title="No orders yet"
            description="When customers place orders, they'll appear here."
          />
        </AdminTableWrapper>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Order {selectedOrder?.order_number}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Customer</span>
                  </div>
                  <p className="font-medium text-foreground">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer_email}</p>
                  {selectedOrder.customer_phone && (
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer_phone}</p>
                  )}
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Shipping Address</span>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-line">
                    {selectedOrder.shipping_address || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border/50 overflow-hidden">
                <div className="p-4 border-b border-border/50 bg-muted/20">
                  <h4 className="font-medium text-foreground">Order Items</h4>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.item_name}</TableCell>
                        <TableCell className="capitalize text-muted-foreground">{item.item_type}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right font-medium">₹{item.total_price.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>₹{(selectedOrder.shipping_cost || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border/50">
                  <span>Total</span>
                  <span className="text-primary">₹{selectedOrder.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
