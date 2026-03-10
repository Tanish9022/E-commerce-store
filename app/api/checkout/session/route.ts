import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { items, email, shippingAddress, userId } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    
    // Create the order with "Pending" status for Manual UPI workflow
    const order = await Order.create({
      userId: userId || null,
      email: email,
      products: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        customization: item.customizationData || null
      })),
      totalAmount: totalAmount,
      shippingAddress: shippingAddress || {
        name: "Customer",
        address: "Pending Details",
        city: "",
        postalCode: "",
        country: "IN"
      },
      paymentStatus: "pending",
      orderStatus: "pending_payment",
      createdAt: new Date(),
    });

    // Note: In a real app, you'd trigger your email utility here
    // sendOrderEmail(email, order);

    return NextResponse.json({ 
      success: true,
      orderId: order._id,
      message: "Order placed successfully. Awaiting manual UPI payment."
    });
  } catch (err: any) {
    console.error("Manual Order Creation Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
