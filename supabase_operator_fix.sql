-- ============================================
-- CH-SIMULATOR: OPERATOR FIX
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Remove any stale auth user for the Operator email
-- (This allows re-registration with the correct trigger)
DELETE FROM auth.users WHERE email = 'matildevoltolini@icloud.com';

-- Step 2: Also confirm the subjects table entry is gone (cascade should handle it, but just in case)
DELETE FROM public.subjects WHERE email = 'matildevoltolini@icloud.com';
