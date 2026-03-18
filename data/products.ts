export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  tag: string;
  description?: string;
  images?: string[];
}

export const PRODUCTS: Product[] = [
  { id: "h-01", name: "Cyber Hoodie v1.0", price: 89, category: "Hoodies", tag: "Best Seller" },
  { id: "t-01", name: "Neon Matrix Tee", price: 45, category: "T-Shirts", tag: "New" },
  { id: "s-01", name: "Industrial Crew", price: 75, category: "Sweatshirts", tag: "Limited" },
  { id: "h-02", name: "Glow Oversize Hoodie", price: 95, category: "Hoodies", tag: "Limited" },
  { id: "t-02", name: "Binary Ghost Tee", price: 38, category: "T-Shirts", tag: "" },
  { id: "s-02", name: "Mono Tech Sweat", price: 70, category: "Sweatshirts", tag: "Sale" },
  { id: "c-01", name: "Archive Cargo", price: 120, category: "Collections", tag: "New" },
  { id: "c-02", name: "Utility Vest 01", price: 110, category: "Collections", tag: "" },
  { id: "h-03", name: "Phantom Zip Hoodie", price: 105, category: "Hoodies", tag: "New" },
];
