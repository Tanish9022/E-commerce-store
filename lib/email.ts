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
      from: `"Kiro Studio" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email error:", error);
  }
};

export const getOrderEmailTemplate = (order: any, status: string) => {
  const statusMessages: any = {
    paid: "Your order has been confirmed and is entering the laboratory.",
    processing: "Our team is currently bringing your custom vision to life.",
    shipped: "Your deployment has left the studio and is in transit.",
    delivered: "Mission complete. Your order has been delivered.",
  };

  return `
    <div style="font-family: sans-serif; background-color: #000; color: #fff; padding: 40px; border-radius: 20px;">
      <h1 style="color: #39FF14; text-transform: uppercase; letter-spacing: 2px;">KIRO STUDIO</h1>
      <p style="font-size: 18px; color: #ccc;">${statusMessages[status] || "Your order status has been updated."}</p>
      <div style="border-top: 1px solid #333; margin: 20px 0; padding-top: 20px;">
        <p><strong>Order ID:</strong> ${order.stripeSessionId.slice(-10).toUpperCase()}</p>
        <p><strong>Total:</strong> $${order.totalAmount}.00</p>
      </div>
      <a href="${process.env.NEXT_PUBLIC_URL}/orders/${order._id}" style="background-color: #39FF14; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 10px; display: inline-block;">TRACK DEPLOYMENT</a>
    </div>
  `;
};
