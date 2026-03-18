import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    await transporter.sendMail({
      from: `"GenZ Collection" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email error:", error);
  }
};

export const getAdminNotificationEmail = (order: any) => {
  const productsList = order.products
    .map((p: any) => `<li>${p.name} (x${p.quantity}) - ₹${p.price}</li>`)
    .join("");

  return `
    <div style="font-family: sans-serif; background-color: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #39FF14;">
      <h1 style="color: #39FF14; text-transform: uppercase; letter-spacing: 2px;">NEW ORDER RECEIVED</h1>
      <p style="font-size: 16px; color: #ccc;">Action Required: Send UPI QR code to customer for payment.</p>
      
      <div style="background-color: #111; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <p><strong>Order ID:</strong> ${order.id.toString().toUpperCase()}</p>
        <p><strong>Customer:</strong> ${order.email}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
      </div>

      <h3 style="color: #39FF14;">Products Ordered:</h3>
      <ul style="color: #ccc;">
        ${productsList}
      </ul>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
        <a href="${process.env.NEXT_PUBLIC_URL}/admin/orders" style="background-color: #39FF14; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 10px; display: inline-block;">VIEW IN DASHBOARD</a>
      </div>
    </div>
  `;
};

export const getOrderEmailTemplate = (order: any, status: string) => {
  const statusMessages: any = {
    pending_payment: "Awaiting UPI payment. Please check your email for the QR code.",
    paid: "Payment received. Your order is being prepared for fulfillment.",
    processing: "Our team is currently bringing your vision to life.",
    shipped: "Your package has left the studio and is in transit.",
    delivered: "Great news! Your order has been delivered.",
  };

  return `
    <div style="font-family: sans-serif; background-color: #000; color: #fff; padding: 40px; border-radius: 20px;">
      <h1 style="color: #39FF14; text-transform: uppercase; letter-spacing: 2px;">GenZ Collection</h1>
      <p style="font-size: 18px; color: #ccc;">${statusMessages[status] || "Your order status has been updated."}</p>
      <div style="border-top: 1px solid #333; margin: 20px 0; padding-top: 20px;">
        <p><strong>Order ID:</strong> ${order.id.toString().toUpperCase()}</p>
        <p><strong>Total:</strong> ₹${order.totalAmount}</p>
      </div>
      <a href="${process.env.NEXT_PUBLIC_URL}/orders/${order.id}" style="background-color: #39FF14; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 10px; display: inline-block;">TRACK ORDER</a>
    </div>
  `;
};

export const sendWhatsAppNotification = (order: any) => {
  // Placeholder for WhatsApp API integration
  console.log("-----------------------------------------");
  console.log("SEND WHATSAPP MESSAGE TO ADMIN");
  console.log(`New Order: ${order.id}`);
  console.log(`Amount: ₹${order.totalAmount}`);
  console.log(`Customer: ${order.email}`);
  console.log("-----------------------------------------");
};
