-- Add care_instructions column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS care_instructions TEXT;