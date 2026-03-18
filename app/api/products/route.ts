import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Seed demo data if database is empty
    if (!products || products.length === 0) {
      console.log("Seeding demo products to Supabase...");
      const { data: inserted, error: insertError } = await supabase
        .from('products')
        .insert(DEMO_PRODUCTS)
        .select();
      
      if (insertError) {
        console.error("Error seeding products:", insertError);
        return NextResponse.json(products || []); // Return empty or whatever we have
      }
      return NextResponse.json(inserted);
    }

    return NextResponse.json(products || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
