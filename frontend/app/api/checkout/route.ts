import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createServerClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        session_id: body.session_id || null,
        status: "pending",
        subtotal: body.subtotal,
        shipping_total: body.shipping_total,
        tax_total: 0,
        discount_total: 0,
        total: body.total,
        payment_method: body.payment_method,
        payment_status: "pending",
        shipping_address: body.shipping_address,
        billing_address: body.billing_address,
        delivery_eta: body.delivery_eta || null,
        notes: body.notes || null,
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 });
    }

    const orderItems = (body.items || []).map(
      (item: { product_id: string; product_name: string; product_image?: string; product_sku?: string; unit_price: number; quantity: number; subtotal: number }) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image || null,
        product_sku: item.product_sku || null,
        unit_price: item.unit_price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })
    );

    if (orderItems.length > 0) {
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        return NextResponse.json({ error: itemsError.message }, { status: 400 });
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
