import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Map DB fields to frontend expectations
    const mappedOrder = {
      ...order,
      totalAmount: order.total_amount,
      orderStatus: order.order_status,
      paymentStatus: order.payment_status,
      shippingAddress: order.shipping_address,
      stripeSessionId: order.stripe_session_id || order.id,
      createdAt: order.created_at
    };

    return NextResponse.json(mappedOrder);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
