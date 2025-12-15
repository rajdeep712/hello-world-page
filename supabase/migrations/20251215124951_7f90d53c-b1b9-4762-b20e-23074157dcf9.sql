-- Fix orders table RLS policies
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Orders viewable by session" ON public.orders;
DROP POLICY IF EXISTS "Orders can be created" ON public.orders;
DROP POLICY IF EXISTS "Orders can be updated" ON public.orders;

-- Allow authenticated users to view their own orders
CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT USING (auth.uid() = user_id);

-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT USING (is_admin());

-- Allow authenticated users to create orders (for checkout flow)
CREATE POLICY "Authenticated users can create orders" ON public.orders
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Only admins can update orders from the client
-- Payment status updates happen via Edge Function with service role
CREATE POLICY "Admins can update orders" ON public.orders
FOR UPDATE USING (is_admin());