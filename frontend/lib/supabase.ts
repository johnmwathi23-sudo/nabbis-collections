import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function isConfigured(): boolean {
  return !!supabaseUrl && !!supabaseAnonKey && !!supabaseServiceKey;
}

export function createServerClient() {
  if (!isConfigured()) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

export function createAnonClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase anon key not configured');
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}
