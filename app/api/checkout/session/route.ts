import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(req: Request) {
  try {
    const { items, email } = await req.json();

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${item.name} (${item.size})`,
          metadata: {
            id: item.id,
            size: item.size,
            customization: JSON.stringify(item.customizationData || {}),
          },
        },
        unit_amount: item.price * 100, // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
      customer_email: email,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "DE", "FR"], // Add as needed
      },
      metadata: {
        items: JSON.stringify(items.map((i: any) => ({ id: i.id, size: i.size }))),
      }
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("Stripe Session Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
