import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_kiro";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("kiro_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    await connectToDatabase();
    
    const orders = await Order.find({ 
      $or: [
        { userId: decoded.userId },
        { email: decoded.email }
      ]
    }).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
