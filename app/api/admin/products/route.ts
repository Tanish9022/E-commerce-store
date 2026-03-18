import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";

const DEMO_PRODUCTS = [
  {
    name: "Cyber Hoodie v1.0",
    description: "Premium cotton blend hoodie with cinematic high-density prints. Designed for the digital generation.",
    price: 4999,
    category: "Hoodies",
    stock: 50,
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    name: "Phantom Zip Hoodie",
    description: "Ultra-heavyweight zip hoodie with distressed detailing and modular pocket systems.",
    price: 5499,
    category: "Hoodies",
    stock: 30,
    images: ["https://images.unsplash.com/photo-1578932724444-49a0f1f14830?auto=format&fit=crop&q=80&w=800"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    name: "Utility Vest 01",
    description: "Tactical streetwear vest featuring water-resistant fabric and 6-pocket utility array.",
    price: 3999,
    category: "Collections",
    stock: 25,
    images: ["https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?auto=format&fit=crop&q=80&w=800"],
    sizes: ["S", "M", "L"]
  }
];

async function isAdmin() {
  const token = (await cookies()).get("genz_token")?.value;
  if (!token) return false;
  const payload = await verifyJWT(token);
  return !!payload; // Return true if valid token exists
}

export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Seed demo data if database is empty
    if (!products || products.length === 0) {
      const { data: inserted, error: insertError } = await supabase
        .from('products')
        .insert(DEMO_PRODUCTS)
        .select();
      
      if (insertError) throw insertError;
      return NextResponse.json(inserted);
    }
    
    return NextResponse.json(products);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      return NextResponse.json({ error: "Unauthorized access detected." }, { status: 401 });
    }
    
    const body = await req.json();
    console.log("[Admin API] Received product body:", body);
    
    // Validate required fields and types
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json({ error: "Product name is required and must be a string." }, { status: 400 });
    }
    if (body.price === undefined || isNaN(Number(body.price))) {
      return NextResponse.json({ error: "Valid product price is required." }, { status: 400 });
    }
    if (!body.category) {
      return NextResponse.json({ error: "Product category is required." }, { status: 400 });
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        name: body.name,
        description: body.description || "",
        price: Number(body.price),
        category: body.category,
        stock: parseInt(body.stock) || 0,
        images: Array.isArray(body.images) ? body.images : [],
        sizes: Array.isArray(body.sizes) ? body.sizes : ["S", "M", "L", "XL"],
        colors: Array.isArray(body.colors) ? body.colors : []
      }])
      .select()
      .single();

    if (error) {
      console.error("[Supabase Error] Product Creation:", error);
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        details: error.details,
        hint: error.hint
      }, { status: 500 });
    }

    console.log("[Admin API] Product created successfully:", product.id);
    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    console.error("Critical Exception [Product Creation]:", err);
    return NextResponse.json({ error: "An internal server error occurred while creating the product." }, { status: 500 });
  }
}
