-- ============================================================
-- Create Admin User for Nabbis Collections Dashboard
-- ============================================================
-- Run this SQL in Supabase SQL Editor to create an admin user.

-- Make sure the user_role enum exists (run only if needed)
DO $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('customer', 'vendor', 'admin');
  end if;
end $$;

-- Insert the admin user
INSERT INTO public.users (name, email, phone, role)
VALUES ('Admin User', 'admin@nabbis.com', '+254700000000', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- Verify the user was created
SELECT * FROM public.users WHERE email = 'admin@nabbis.com';