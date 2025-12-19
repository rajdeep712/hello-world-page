import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

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
    
    // First update expired bookings
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
    return <div className="text-center py-8 text-muted-foreground">Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="font-serif text-xl">Experience Bookings</h2>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
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
          <Button variant="outline" size="icon" onClick={fetchBookings}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No bookings found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="text-lg">
                    {experienceNames[booking.experience_type] || booking.experience_type}
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getStatusColor(booking.payment_status)}>
                      Payment: {booking.payment_status}
                    </Badge>
                    <Badge className={getBookingStatusColor(booking.booking_status)}>
                      {booking.booking_status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
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
                  <div className="font-medium">
                    ₹{booking.total_amount.toLocaleString()}
                  </div>
                </div>

                {booking.notes && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Notes:</span> {booking.notes}
                  </div>
                )}

                {booking.razorpay_payment_id && (
                  <div className="text-xs text-muted-foreground">
                    Payment ID: {booking.razorpay_payment_id}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Update status:</span>
                  <Select 
                    value={booking.booking_status} 
                    onValueChange={(value) => updateBookingStatus(booking.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-xs text-muted-foreground">
                  Booked on {format(new Date(booking.created_at), 'PPp')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminExperiences;
