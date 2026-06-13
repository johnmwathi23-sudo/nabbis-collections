import { createServerClient } from '@/lib/supabase';

export async function getLoyaltyPoints(customerId: string): Promise<number> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('loyalty_points')
    .eq('id', customerId)
    .single();

  if (error) throw new Error(`Failed to fetch loyalty points: ${error.message}`);
  return data?.loyalty_points || 0;
}

export async function earnPoints(customerId: string, points: number, reference: string, description: string): Promise<void> {
  const supabase = createServerClient();

  const { error: txError } = await supabase
    .from('loyalty_transactions')
    .insert({
      customer_id: customerId,
      points,
      type: 'earned',
      reference,
      description,
    });

  if (txError) throw new Error(`Failed to record loyalty transaction: ${txError.message}`);

  const { error: updateError } = await supabase.rpc('increment_loyalty_points', {
    p_customer_id: customerId,
    p_points: points,
  });

  if (updateError) throw new Error(`Failed to update loyalty points: ${updateError.message}`);
}

export async function redeemPoints(customerId: string, points: number, reference: string): Promise<string> {
  const supabase = createServerClient();

  const currentPoints = await getLoyaltyPoints(customerId);
  if (currentPoints < points) {
    throw new Error('Insufficient loyalty points');
  }

  const couponCode = `LOYALTY-${customerId.slice(0, 8)}-${Date.now().toString(36).toUpperCase()}`;

  const { error: txError } = await supabase
    .from('loyalty_transactions')
    .insert({
      customer_id: customerId,
      points: -points,
      type: 'redeemed',
      reference,
      description: `Redeemed ${points} points for discount`,
    });

  if (txError) throw new Error(`Failed to redeem points: ${txError.message}`);

  const { error: updateError } = await supabase.rpc('increment_loyalty_points', {
    p_customer_id: customerId,
    p_points: -points,
  });

  if (updateError) throw new Error(`Failed to update loyalty points: ${updateError.message}`);

  return couponCode;
}
