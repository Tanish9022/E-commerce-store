import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendEmail, getOrderEmailTemplate } from "@/lib/email";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";

async function isAdmin() {
  const token = (await cookies()).get("genz_token")?.value;
  if (!token) return false;
  const payload = await verifyJWT(token);
  return !!payload; // Return true if valid token exists
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const { orderStatus, paymentStatus } = body;

    const { data: order, error } = await supabase
      .from('orders')
      .update({
        order_status: orderStatus,
        payment_status: paymentStatus
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const mappedOrder = {
      ...order,
      totalAmount: order.total_amount,
      orderStatus: order.order_status,
      paymentStatus: order.payment_status,
      shippingAddress: order.shipping_address,
      stripeSessionId: order.stripe_session_id || order.id,
      createdAt: order.created_at
    };

    // Send Status Update Email
    await sendEmail({
      to: order.email,
      subject: `Order Update: ${order.id.toString().toUpperCase()}`,
      html: getOrderEmailTemplate(mappedOrder, orderStatus || order.payment_status),
    });

    return NextResponse.json(mappedOrder);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
