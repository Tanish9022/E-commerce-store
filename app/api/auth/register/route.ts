import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: existingUser } = await supabase.from('users').select('*').eq('email', email).single();
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword }])
      .select()
      .single();

    if (error) throw error;

    const token = await signJWT(
      { userId: user.id, email: user.email },
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      { message: "Registration successful", user: { name: user.name, email: user.email } },
      { status: 201 }
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
    console.error("Register Error:", err);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
