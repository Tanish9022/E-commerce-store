import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const { data: user } = await supabase.from('users').select('*').eq('email', email).single();
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signJWT(
      { userId: user.id, email: user.email },
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      { message: "Login successful", user: { name: user.name, email: user.email } },
      { status: 200 }
    );

    response.cookies.set("genz_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    console.error("Login Error:", err);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
