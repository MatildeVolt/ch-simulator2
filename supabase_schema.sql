-- CH-SIMULATOR: Initial Schema Setup

-- 1. Create custom types
CREATE TYPE user_role AS ENUM ('Operator', 'Subject');

-- 2. Create the 'subjects' table to track extended user data
CREATE TABLE public.subjects (
  id UUID references auth.users on delete cascade not null primary key,
  email TEXT not null,
  role user_role default 'Subject'::user_role not null,
  created_at TIMESTAMP WITH TIME ZONE default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can view own subject data" ON public.subjects
  FOR SELECT USING (auth.uid() = id);

-- Trigger to automatically create a subject when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql security definer;

-- Bind the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Create the 'news' table
CREATE TABLE public.news (
  id UUID default gen_random_uuid() primary key,
  title TEXT not null,
  content TEXT not null,
  author_id UUID references public.subjects(id) on delete set null,
  created_at TIMESTAMP WITH TIME ZONE default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read news
CREATE POLICY "Authenticated users can read news" ON public.news
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow Operators to insert news
CREATE POLICY "Operators can insert news" ON public.news
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.subjects 
      WHERE subjects.id = auth.uid() 
      AND subjects.role = 'Operator'
    )
  );

-- Allow Operators to update news
CREATE POLICY "Operators can update news" ON public.news
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.subjects 
      WHERE subjects.id = auth.uid() 
      AND subjects.role = 'Operator'
    )
  );
