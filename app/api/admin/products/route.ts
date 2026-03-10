import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";

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
    await connectToDatabase();
    let products = await Product.find({}).sort({ createdAt: -1 });
    
    // Seed demo data if database is empty
    if (products.length === 0) {
      await Product.insertMany(DEMO_PRODUCTS);
      products = await Product.find({}).sort({ createdAt: -1 });
    }
    
    return NextResponse.json(products);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
