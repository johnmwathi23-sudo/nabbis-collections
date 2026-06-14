import { getAdminClient } from '@/lib/supabase/admin-client';

const db = () => getAdminClient() as any;

export async function logAudit(params: {
  adminId: string;
  action: 'create' | 'update' | 'delete';
  entity: 'product' | 'category' | 'order' | 'profile' | 'site_setting' | 'hero_slide' | 'delivery_zone' | 'user_role';
  entityId: string;
  changes: any;
}) {
  try {
    const supabase = db();
    await supabase.from('admin_audit_log').insert({
      admin_id: params.adminId,
      action: params.action,
      entity: params.entity,
      entity_id: params.entityId,
      changes: params.changes,
    });
  } catch {
    console.error('Failed to log audit entry');
  }
}

export async function getAuditLog(limit = 50) {
  const supabase = db();
  const { data } = await supabase
    .from('admin_audit_log')
    .select('*, profiles:admin_id(email, first_name, last_name)')
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data as any[]) || [];
}
