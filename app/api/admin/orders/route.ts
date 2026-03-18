import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";

async function isAdmin() {
  const token = (await cookies()).get("genz_token")?.value;
  if (!token) return false;
  const payload = await verifyJWT(token);
  return !!payload; // Return true if valid token exists
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const mappedOrders = (orders || []).map(order => ({
      ...order,
      totalAmount: order.total_amount,
      orderStatus: order.order_status,
      paymentStatus: order.payment_status,
      shippingAddress: order.shipping_address,
      stripeSessionId: order.stripe_session_id || order.id,
      createdAt: order.created_at
    }));

    return NextResponse.json(mappedOrders);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
