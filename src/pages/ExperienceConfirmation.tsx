import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, Users, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface ExperienceBooking {
  id: string;
  experience_type: string;
  booking_date: string;
  time_slot: string;
  guests: number;
  total_amount: number;
  payment_status: string;
  booking_status: string;
  notes: string | null;
  created_at: string;
}

const experienceNames: Record<string, string> = {
  couple: 'Couple Pottery Date',
  birthday: 'Birthday Session',
  farm: 'Farm & Garden Mini Party',
  studio: 'Studio-Based Experience'
};

export default function ExperienceConfirmation() {
  const { bookingId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [booking, setBooking] = useState<ExperienceBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError('No booking ID provided');
        setLoading(false);
        return;
      }

      if (authLoading) return;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('experience_bookings')
        .select('*')
        .eq('id', bookingId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching booking:', fetchError);
        setError('Unable to load booking details');
      } else if (data) {
        setBooking(data);
      } else {
        setError('Booking not found');
      }
      setLoading(false);
    };

    fetchBooking();
  }, [bookingId, user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Booking Confirmed | Basho by Shivangi</title>
        <meta name="description" content="Your experience booking has been confirmed!" />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-6" />
          </motion.div>

          <motion.h1
            className="font-display text-4xl md:text-5xl text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            You're All Set!
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Your experience has been booked. We can't wait to create something special with you.
          </motion.p>

          {booking && (
            <motion.div
              className="bg-card border border-border rounded-lg p-6 text-left mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="font-display text-xl mb-4">Booking Details</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{experienceNames[booking.experience_type] || booking.experience_type}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium">
                      {format(new Date(booking.booking_date), 'EEEE, MMMM d, yyyy')} at {booking.time_slot}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-medium">{booking.guests} {booking.guests === 1 ? 'person' : 'people'}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Paid</span>
                    <span className="font-display text-xl text-primary">₹{Number(booking.total_amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.p
            className="text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            A confirmation email has been sent to your email address with all the details.
          </motion.p>

          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/orders">
              <Button variant="earth">View My Bookings</Button>
            </Link>
            <Link to="/experiences">
              <Button variant="outline">Book Another</Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
