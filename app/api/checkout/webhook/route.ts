import { NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") as string;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "order.paid") {
    const { payload } = event;
    const orderDetails = payload.order.entity;
    const paymentDetails = payload.payment.entity;

    await connectToDatabase();

    try {
      // Parse items from notes
      const items = JSON.parse(orderDetails.notes.items || "[]");

      await Order.create({
        email: orderDetails.notes.email || paymentDetails.email,
        totalAmount: orderDetails.amount / 100,
        stripeSessionId: orderDetails.id, // Reusing field for Razorpay Order ID
        paymentStatus: "paid",
        orderStatus: "processing",
        shippingAddress: {
          name: paymentDetails.notes?.name || "Customer",
          address: "Razorpay Checkout", // Razorpay doesn't always provide address unless configured
          city: "",
          postalCode: "",
          country: "IN",
        },
        products: items, 
      });

      console.log(`Order created for Razorpay Order ${orderDetails.id}`);
    } catch (err) {
      console.error("Order Creation Error:", err);
    }
  }

  return NextResponse.json({ received: true });
}
