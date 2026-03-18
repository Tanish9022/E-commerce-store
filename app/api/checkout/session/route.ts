import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendEmail, getAdminNotificationEmail, sendWhatsAppNotification } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { items, email, shippingAddress, userId } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    
    const { data: order, error } = await supabase.from('orders').insert([{
      user_id: userId || null,
      email: email,
      products: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        customizationData: item.customizationData || null
      })),
      total_amount: totalAmount,
      shipping_address: shippingAddress || {
        name: "Customer",
        address: "Pending Details",
        city: "",
        postalCode: "",
        country: "IN"
      },
      payment_status: "pending",
      order_status: "pending_payment"
    }]).select().single();

    if (error) throw error;

    // Adapt to email template expecting totalAmount instead of total_amount
    const emailOrderData = {
      ...order,
      totalAmount: order.total_amount
    };

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.EMAIL_USER;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: "New Order Received - Action Required",
        html: getAdminNotificationEmail(emailOrderData),
      });
    }

    sendWhatsAppNotification(emailOrderData);

    return NextResponse.json({ 
      success: true,
      orderId: order.id,
      message: "Order placed successfully. Awaiting manual UPI payment."
    });
  } catch (err: any) {
    console.error("Manual Order Creation Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
