-- Create storage bucket for public assets
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read assets
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'assets');