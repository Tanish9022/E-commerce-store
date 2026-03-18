import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";

async function isAdmin() {
  const token = (await cookies()).get("genz_token")?.value;
  if (!token) return false;
  const payload = await verifyJWT(token);
  return !!payload; // Return true if valid token exists
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();

    const { data: product, error } = await supabase
      .from('products')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error || !product) {
      return NextResponse.json({ error: "Product not found or update failed" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: "Product not found or delete failed" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
