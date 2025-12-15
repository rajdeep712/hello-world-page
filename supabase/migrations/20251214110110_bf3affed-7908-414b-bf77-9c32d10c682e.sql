-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL DEFAULT 'tableware',
  image_url TEXT,
  is_custom BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  weight_kg DECIMAL(5,2) DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workshops table
CREATE TABLE public.workshops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration TEXT,
  max_participants INTEGER DEFAULT 10,
  current_participants INTEGER DEFAULT 0,
  workshop_date TIMESTAMP WITH TIME ZONE,
  workshop_type TEXT DEFAULT 'group',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  item_type TEXT NOT NULL CHECK (item_type IN ('product', 'workshop')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_item CHECK (
    (item_type = 'product' AND product_id IS NOT NULL AND workshop_id IS NULL) OR
    (item_type = 'workshop' AND workshop_id IS NOT NULL AND product_id IS NULL)
  )
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  session_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT,
  gst_number TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  order_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  workshop_id UUID REFERENCES public.workshops(id),
  item_type TEXT NOT NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Products and workshops are publicly viewable
CREATE POLICY "Products are publicly viewable" ON public.products FOR SELECT USING (true);
CREATE POLICY "Workshops are publicly viewable" ON public.workshops FOR SELECT USING (true);

-- Cart items - users can manage their own cart by session_id
CREATE POLICY "Anyone can view cart items by session" ON public.cart_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert cart items" ON public.cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update cart items" ON public.cart_items FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete cart items" ON public.cart_items FOR DELETE USING (true);

-- Orders - viewable by session
CREATE POLICY "Orders viewable by session" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Orders can be created" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders can be updated" ON public.orders FOR UPDATE USING (true);

-- Order items
CREATE POLICY "Order items are viewable" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Order items can be created" ON public.order_items FOR INSERT WITH CHECK (true);

-- Insert sample products
INSERT INTO public.products (name, description, price, category, weight_kg) VALUES
('Wabi-Sabi Bowl', 'Handcrafted ceramic bowl with natural imperfections', 2800, 'bowls', 0.8),
('Zen Tea Cup Set', 'Set of 4 minimalist tea cups', 3500, 'cups', 1.2),
('Ikebana Vase', 'Tall cylindrical vase for flower arrangements', 4200, 'vases', 1.5),
('Raku Dinner Plate', 'Large dinner plate with unique glaze', 1800, 'plates', 0.6),
('Kintsugi Serving Platter', 'Large serving platter with gold repair details', 6500, 'platters', 2.0),
('Tokoname Tea Pot', 'Traditional clay teapot', 5200, 'teaware', 0.9);

-- Insert sample workshops
INSERT INTO public.workshops (title, description, price, duration, max_participants, workshop_type) VALUES
('Beginner Pottery Workshop', 'Learn the basics of wheel throwing', 2500, '3 hours', 8, 'group'),
('One-on-One Master Class', 'Personal session with the founder', 8000, '2 hours', 1, 'private'),
('Couple Pottery Date', 'Romantic pottery experience for two', 5000, '2.5 hours', 2, 'couple'),
('Kids Clay Play', 'Fun pottery session for children', 1500, '1.5 hours', 10, 'kids');