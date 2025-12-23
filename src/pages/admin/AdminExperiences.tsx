import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, RefreshCw, Sparkles, IndianRupee, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

interface ExperienceBooking {
  id: string;
  user_id: string;
  experience_type: string;
  booking_date: string;
  time_slot: string;
  guests: number;
  notes: string | null;
  total_amount: number;
  payment_status: string;
  booking_status: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  updated_at: string;
}

const experienceNames: Record<string, string> = {
  couple: 'Couple Pottery Dates',
  birthday: 'Birthday Sessions',
  farm: 'Farm & Garden Mini Parties',
  studio: 'Studio-Based Experiences'
};

const AdminExperiences = () => {
  const [bookings, setBookings] = useState<ExperienceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    
    await supabase.rpc('update_expired_experience_bookings');
    
    const { data, error } = await supabase
      .from('experience_bookings')
      .select('*')
      .order('booking_date', { ascending: true });

    if (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    const { error } = await supabase
      .from('experience_bookings')
      .update({ booking_status: newStatus })
      .eq('id', bookingId);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success('Status updated');
      fetchBookings();
    }
  };

  const getPaymentStatusConfig = (status: string) => {
    switch (status) {
      case 'paid': return { bg: 'bg-green-500/10', text: 'text-green-600' };
      case 'pending': return { bg: 'bg-amber-500/10', text: 'text-amber-600' };
      case 'failed': return { bg: 'bg-red-500/10', text: 'text-red-600' };
      default: return { bg: 'bg-muted', text: 'text-muted-foreground' };
    }
  };

  const getBookingStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed': return { bg: 'bg-blue-500/10', text: 'text-blue-600' };
      case 'completed': return { bg: 'bg-green-500/10', text: 'text-green-600' };
      case 'cancelled': return { bg: 'bg-red-500/10', text: 'text-red-600' };
      default: return { bg: 'bg-muted', text: 'text-muted-foreground' };
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return b.booking_status === 'confirmed' && new Date(b.booking_date) >= new Date();
    if (filter === 'completed') return b.booking_status === 'completed';
    if (filter === 'paid') return b.payment_status === 'paid';
    if (filter === 'pending') return b.payment_status === 'pending';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Experience Bookings"
        description="Manage pottery experience reservations"
        icon={Sparkles}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border/30">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-36 border-0 bg-transparent h-auto p-0 focus:ring-0">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Payment Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="icon" onClick={fetchBookings} className="h-10 w-10">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </AdminPageHeader>

      {filteredBookings.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-16 text-center">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-1">No bookings found</h3>
            <p className="text-muted-foreground">Experience bookings will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => {
            const paymentConfig = getPaymentStatusConfig(booking.payment_status);
            const bookingConfig = getBookingStatusConfig(booking.booking_status);
            
            return (
              <Card key={booking.id} className="border-border/50 overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">
                            {experienceNames[booking.experience_type] || booking.experience_type}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {format(new Date(booking.booking_date), 'PPP')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {booking.time_slot}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {booking.notes && (
                        <p className="text-sm text-muted-foreground pl-12">
                          <span className="font-medium">Notes:</span> {booking.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge className={`${paymentConfig.bg} ${paymentConfig.text} border-0`}>
                          Payment: {booking.payment_status}
                        </Badge>
                        <Badge className={`${bookingConfig.bg} ${bookingConfig.text} border-0`}>
                          {booking.booking_status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-1 font-semibold text-lg">
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            {booking.total_amount.toLocaleString()}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(booking.created_at), 'MMM d, h:mm a')}
                          </p>
                        </div>
                        
                        <Select 
                          value={booking.booking_status} 
                          onValueChange={(value) => updateBookingStatus(booking.id, value)}
                        >
                          <SelectTrigger className="w-32 h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminExperiences;
