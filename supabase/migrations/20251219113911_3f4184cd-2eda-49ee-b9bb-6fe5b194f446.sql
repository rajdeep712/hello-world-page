-- Create experience_bookings table
CREATE TABLE public.experience_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  experience_type TEXT NOT NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  total_amount NUMERIC NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  booking_status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.experience_bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view own experience bookings"
ON public.experience_bookings
FOR SELECT
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Users can create their own bookings
CREATE POLICY "Users can create experience bookings"
ON public.experience_bookings
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Users can update their own pending bookings
CREATE POLICY "Users can update own pending bookings"
ON public.experience_bookings
FOR UPDATE
USING (auth.uid() IS NOT NULL AND user_id = auth.uid() AND payment_status = 'pending');

-- Admins can view all bookings
CREATE POLICY "Admins can view all experience bookings"
ON public.experience_bookings
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can update all bookings
CREATE POLICY "Admins can update all experience bookings"
ON public.experience_bookings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Admins can delete bookings
CREATE POLICY "Admins can delete experience bookings"
ON public.experience_bookings
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_experience_bookings_updated_at
BEFORE UPDATE ON public.experience_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-set booking status to done after date/time
CREATE OR REPLACE FUNCTION public.update_expired_experience_bookings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.experience_bookings
  SET booking_status = 'completed', updated_at = now()
  WHERE booking_status = 'confirmed'
    AND payment_status = 'paid'
    AND booking_date < CURRENT_DATE;
END;
$$;