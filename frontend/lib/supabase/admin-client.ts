import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let adminClient: ReturnType<typeof createClient> | null = null;

export function getAdminClient() {
  if (adminClient) return adminClient;
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Admin Supabase client not configured');
  }
  adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
  return adminClient;
}
