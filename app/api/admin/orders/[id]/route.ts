import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import { sendEmail, getOrderEmailTemplate } from "@/lib/email";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const body = await req.json();
    const { orderStatus, paymentStatus } = body;

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { orderStatus, paymentStatus } },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Send Status Update Email
    await sendEmail({
      to: order.email,
      subject: `Deployment Update: ${order.stripeSessionId.slice(-10).toUpperCase()}`,
      html: getOrderEmailTemplate(order, orderStatus || order.paymentStatus),
    });

    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
