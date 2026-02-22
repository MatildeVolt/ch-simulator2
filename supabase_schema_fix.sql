-- ============================================
-- CH-SIMULATOR: DATABASE FIX (Run this first)
-- ============================================
-- Run this script in Supabase SQL Editor to fix the user creation trigger.
-- This drops and recreates the trigger with correct permissions.

-- Step 1: Drop old trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TABLE IF EXISTS public.news CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Step 2: Create the role enum
CREATE TYPE user_role AS ENUM ('Operator', 'Subject');

-- Step 3: Create the subjects table
CREATE TABLE public.subjects (
  id UUID references auth.users on delete cascade not null primary key,
  email TEXT not null,
  role user_role default 'Subject'::user_role not null,
  created_at TIMESTAMP WITH TIME ZONE default now() not null
);

-- Step 4: Enable RLS
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own record
CREATE POLICY "Users can view own subject data" ON public.subjects
  FOR SELECT USING (auth.uid() = id);

-- Allow the service role (triggers) to insert
CREATE POLICY "Service role can insert subjects" ON public.subjects
  FOR INSERT WITH CHECK (true);

-- Step 5: Create the news table
CREATE TABLE public.news (
  id UUID default gen_random_uuid() primary key,
  title TEXT not null,
  content TEXT not null,
  author_id UUID references public.subjects(id) on delete set null,
  created_at TIMESTAMP WITH TIME ZONE default now() not null
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read news" ON public.news
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Operators can insert news" ON public.news
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.subjects 
      WHERE subjects.id = auth.uid() 
      AND subjects.role = 'Operator'
    )
  );

-- Step 6: Create the trigger function (with security definer and correct search_path)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subjects (id, email, role)
  VALUES (
    new.id,
    new.email,
    CASE 
      WHEN new.email = 'matildevoltolini@icloud.com' THEN 'Operator'::user_role
      ELSE 'Subject'::user_role 
    END
  );
  RETURN new;
END;
$$;

-- Step 7: Bind the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 8: Grant execute permission to authenticated role
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
