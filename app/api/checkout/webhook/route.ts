import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-02-25.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret!);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    await connectToDatabase();

    // Create Order in DB
    try {
      // Note: We need to retrieve line items to get full details if needed
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      
      const products = lineItems.data.map((item: any) => ({
        name: item.description,
        price: item.amount_total / 100,
        quantity: item.quantity,
        // metadata can be passed back from product_data if needed
      }));

      await Order.create({
        email: session.customer_details?.email,
        totalAmount: session.amount_total! / 100,
        stripeSessionId: session.id,
        paymentStatus: "paid",
        orderStatus: "processing",
        shippingAddress: {
          name: session.shipping_details?.name,
          address: session.shipping_details?.address?.line1,
          city: session.shipping_details?.address?.city,
          postalCode: session.shipping_details?.address?.postal_code,
          country: session.shipping_details?.address?.country,
        },
        products: products, // Simplified for webhook
      });

      console.log(`Order created for session ${session.id}`);
    } catch (err) {
      console.error("Order Creation Error:", err);
    }
  }

  return NextResponse.json({ received: true });
}
