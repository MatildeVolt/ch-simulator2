-- Add image_url column to news table
ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update RLS policies (if needed, though standard select already covers it)
-- Comment: This column can now be populated via the Supabase Dashboard.
