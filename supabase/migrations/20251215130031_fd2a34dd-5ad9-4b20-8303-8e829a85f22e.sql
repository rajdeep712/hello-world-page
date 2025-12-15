-- Add user_id column to cart_items for secure user-based access
ALTER TABLE public.cart_items ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can view cart items by session" ON public.cart_items;
DROP POLICY IF EXISTS "Anyone can insert cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Anyone can update cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Anyone can delete cart items" ON public.cart_items;

-- Create new secure policies requiring authentication
CREATE POLICY "Users can view their own cart items"
ON public.cart_items
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
ON public.cart_items
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
ON public.cart_items
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
ON public.cart_items
FOR DELETE
USING (auth.uid() = user_id);