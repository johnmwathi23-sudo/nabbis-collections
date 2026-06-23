# Supabase Setup for Nabbis Collections

This project uses Supabase for:
- Tables: `products`, `categories`, `vendors`, `users`, `orders`
- Storage bucket: **`site-images`** (used for site image hosting)

The repo includes a starter schema: `nabbis/schema.sql`. Treat it as a starting point and verify it matches your intended auth model and column names.

## 1) Create / Identify Supabase Project
The deployment guide references this project:

- **Supabase Project:** `hwmvtgsvznkgwqcgesmy`

From the Supabase dashboard:
- Settings -> API
  - `Project URL` -> use as `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public key` -> use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2) Apply Database Schema
1. Go to **Supabase Dashboard** -> **SQL Editor**
2. New query
3. Paste contents of: `supabase/schema.sql`
4. Run

This will:
- Create enums used by `src/lib/types.ts`
- Create tables referenced by `src/lib/database.ts`
- Enable RLS and add placeholder policies

> ⚠️ Policies are intentionally permissive placeholders for drafts. You should tighten policies before production.

## 3) Configure Storage Bucket (`site-images`)
1. Supabase Dashboard -> **Storage** -> **Buckets**
2. Create bucket:
   - **Bucket name:** `site-images`
3. Decide public/private strategy:
   - If you want images publicly readable, set appropriate policies for public reads.
   - If you want private images, you must change the app to use authenticated access (current code assumes public URL usage in the helper, and the existing upload API currently writes to `public/uploads`).

## 4) RLS / Policy Notes (Important)
Current app code uses:
- `src/lib/supabase.ts`: `createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)`
- `src/lib/database.ts`: direct `.from('table').select/insert/update` calls

That means:
- If RLS is enabled, your policies must allow the operations performed by the frontend (for public read) and/or by authenticated users.
- The SQL file includes placeholder policies using `auth.role() = 'authenticated'`.

You must adjust policies to match your authentication/roles model.

## 5) Vercel Environment Variables
In **Vercel Dashboard** -> your project -> **Settings** -> **Environment Variables**, set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Do **not** commit secrets into git.

## 6) (Optional) Seed Data
If your UI requires initial vendors/products/categories, seed them after schema is created (via SQL editor inserts).

## Troubleshooting
- `Missing Supabase environment variables`:
  - Ensure Vercel env vars are set (and not left empty).
- `permission denied for relation`:
  - Adjust RLS policies for the operation (select/insert/update).
- `storage bucket not found`:
  - Ensure bucket name is exactly `site-images`.
