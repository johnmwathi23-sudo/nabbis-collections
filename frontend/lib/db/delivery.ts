import { createServerClient } from '@/lib/supabase';
import type { DeliveryZone } from '@/lib/types';
import { cache } from 'react';

export const getDeliveryZones = cache(async (): Promise<DeliveryZone[]> => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('delivery_zones')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });

  if (error) throw new Error(`Failed to fetch delivery zones: ${error.message}`);
  return (data as DeliveryZone[]) || [];
});

export function findDeliveryZone(
  county: string,
  zones: DeliveryZone[]
): DeliveryZone | null {
  return zones.find((z) =>
    z.counties.some((c) => c.toLowerCase() === county.toLowerCase())
  ) || null;
}
