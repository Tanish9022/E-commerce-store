"use client";

import React, { useState, useEffect } from "react";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Edit3, Package, Image as ImageIcon, X } from "lucide-react";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { formatCurrency } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Hoodies");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>(["S", "M", "L", "XL"]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleSize = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter(s => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          price: Number(price), 
          category, 
          stock: Number(stock), 
          description,
          images,
          sizes
        }),
      });

      if (res.ok) {
        setIsAdding(false);
        fetchProducts();
        // Reset form
        setName(""); setPrice(""); setStock(""); setDescription(""); setImages([]); setSizes(["S", "M", "L", "XL"]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px]">Inventory</span>
          <Heading size="lg">PRODUCT <span className="text-accent italic">MANAGE.</span></Heading>
        </div>
        <Button variant="accent" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {isAdding ? "Close Form" : "Add Product"}
        </Button>
      </div>

      {isAdding && (
        <div className="glass-card rounded-[2rem] p-10 border-accent/20 animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-4">Media Assets</label>
              <ImageUploader 
                folder="products"
                label="Upload Product Shot"
                onUploadSuccess={(url) => setImages([...images, url])}
              />
              <div className="grid grid-cols-4 gap-2 px-2">
                {images.map((url, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-zinc-800 border border-white/5 overflow-hidden">
                    <img src={url} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Product Name</label>
                  <input 
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cyber Hoodie v2.0"
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 outline-none focus:border-accent/50" required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Price (INR)</label>
                    <input 
                      type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 4999"
                      className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 outline-none focus:border-accent/50" required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Stock</label>
                    <input 
                      type="number" value={stock} onChange={(e) => setStock(e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 outline-none focus:border-accent/50" required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Available Sizes</label>
                  <div className="flex gap-2">
                    {["S", "M", "L", "XL"].map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={cn(
                          "w-12 h-12 rounded-xl border font-black text-xs transition-all",
                          sizes.includes(size) 
                            ? "bg-accent border-accent text-black" 
                            : "bg-zinc-900 border-white/5 text-zinc-500 hover:border-white/20"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Category</label>
                  <select 
                    value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 outline-none focus:border-accent/50"
                  >
                    <option>Hoodies</option>
                    <option>T-Shirts</option>
                    <option>Sweatshirts</option>
                    <option>Collections</option>
                  </select>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Description</label>
                  <textarea 
                    rows={5} value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the aesthetic and technical details..."
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 outline-none focus:border-accent/50 resize-none"
                  />
                </div>
                <div className="pt-4">
                  <Button type="submit" variant="accent" className="w-full py-8" disabled={images.length === 0 || loading}>
                    {images.length === 0 ? "Upload Images to Continue" : "Complete Deployment"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Product Table */}
      <div className="glass-card rounded-[2rem] overflow-hidden border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950 border-b border-white/5">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Product</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Category</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Stock</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Price</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-zinc-900 rounded-lg flex-shrink-0 border border-white/5 overflow-hidden">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-full h-full p-4 text-zinc-800" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black uppercase tracking-tight text-sm">{product.name}</span>
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">
                        {product.sizes?.join(" / ")}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-xs text-zinc-400 font-bold uppercase tracking-widest">{product.category}</td>
                <td className="p-6">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black tracking-widest">
                    {product.stock} Units
                  </span>
                </td>
                <td className="p-6 font-black text-accent">{formatCurrency(product.price)}</td>
                <td className="p-6 text-right space-x-2">
                  <button className="p-3 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-3 rounded-xl hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && !loading && (
          <div className="p-20 text-center space-y-4">
            <Package className="w-12 h-12 text-zinc-800 mx-auto" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">No active products in database</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for cn if not available via import
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
