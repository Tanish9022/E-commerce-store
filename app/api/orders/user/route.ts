import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("genz_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded: any = await verifyJWT(token);
    
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .or(`user_id.eq.${decoded.userId},email.eq.${decoded.email}`)
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
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
