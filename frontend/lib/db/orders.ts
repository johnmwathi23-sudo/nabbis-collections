import { createServerClient } from '@/lib/supabase';
import type { Order, OrderItem } from '@/lib/types';

export async function createOrder(data: {
  customer_id?: string | null;
  session_id?: string | null;
  subtotal: number;
  shipping_total: number;
  total: number;
  payment_method: string;
  shipping_address: Record<string, string>;
  billing_address: Record<string, string>;
  delivery_zone_id?: string | null;
  delivery_eta?: string | null;
  items: { product_id: string; product_name: string; product_image?: string; product_sku?: string; unit_price: number; quantity: number; subtotal: number }[];
}): Promise<Order> {
  const supabase = createServerClient();

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: data.customer_id || null,
      session_id: data.session_id || null,
      subtotal: data.subtotal,
      shipping_total: data.shipping_total,
      tax_total: 0,
      discount_total: 0,
      total: data.total,
      payment_method: data.payment_method,
      payment_status: 'pending',
      shipping_address: data.shipping_address,
      billing_address: data.billing_address,
      delivery_zone_id: data.delivery_zone_id || null,
      delivery_eta: data.delivery_eta || null,
      status: 'pending',
    })
    .select()
    .single();

  if (orderError) throw new Error(`Failed to create order: ${orderError.message}`);

  const orderItems = data.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    product_image: item.product_image || null,
    product_sku: item.product_sku || null,
    unit_price: item.unit_price,
    quantity: item.quantity,
    subtotal: item.subtotal,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw new Error(`Failed to create order items: ${itemsError.message}`);

  return order as Order;
}

export async function getOrders(customerId: string): Promise<Order[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch orders: ${error.message}`);
  return (data as Order[]) || [];
}

export async function getOrder(id: string): Promise<Order | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Order;
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) throw new Error(`Failed to fetch order items: ${error.message}`);
  return (data as OrderItem[]) || [];
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) throw new Error(`Failed to update order: ${error.message}`);
}

export async function updatePaymentStatus(id: string, paymentStatus: Order['payment_status'], mpesaReceipt?: string): Promise<void> {
  const supabase = createServerClient();
  const update: Record<string, string> = { payment_status: paymentStatus };
  if (mpesaReceipt) update.mpesa_receipt = mpesaReceipt;
  const { error } = await supabase
    .from('orders')
    .update(update)
    .eq('id', id);

  if (error) throw new Error(`Failed to update payment: ${error.message}`);
}
