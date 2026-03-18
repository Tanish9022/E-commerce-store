"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Edit3, Package, Image as ImageIcon, X, Search, Filter, Eye } from "lucide-react";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { formatCurrency, cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ADMIN_EMAIL } from "@/lib/constants";

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Hoodies");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");

  const fetchProducts = async () => {
    console.log("[Admin] Fetching products...");
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      console.log("[Admin] Products fetched:", data.length);
      setProducts(data);
    } catch (err) {
      console.error("[Admin] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setPrice(editingProduct.price.toString());
      setCategory(editingProduct.category);
      setStock(editingProduct.stock.toString());
      setDescription(editingProduct.description || "");
      setImages(editingProduct.images || []);
      setSizes(editingProduct.sizes || []);
      setColors(editingProduct.colors || []);
      setIsAdding(true);
    }
  }, [editingProduct]);

  const toggleSize = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter(s => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const addColor = () => {
    if (colorInput && !colors.includes(colorInput)) {
      setColors([...colors, colorInput]);
      setColorInput("");
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter(c => c !== color));
  };

  const resetForm = () => {
    setName(""); 
    setPrice(""); 
    setStock(""); 
    setDescription(""); 
    setImages([]); 
    setSizes(["S", "M", "L", "XL"]);
    setColors([]);
    setEditingProduct(null);
    setIsAdding(false);
  };

  const [notification, setNotification] = useState<{message: string, type: "success" | "error"} | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const productData = { 
      name, 
      price: Number(price), 
      category, 
      stock: Number(stock), 
      description,
      images,
      sizes,
      colors
    };

    console.log("[Admin] Submitting product data:", productData);

    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const result = await res.json();

      if (res.ok) {
        console.log("[Admin] Operation successful:", result);
        showNotification(editingProduct ? "Product updated successfully!" : "Product created successfully!");
        resetForm();
        fetchProducts();
      } else {
        console.error("[Admin] Operation failed:", result);
        showNotification(result.error || "Operation failed", "error");
      }
    } catch (err) {
      console.error("[Admin] Exception during submit:", err);
      showNotification("An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "All" || p.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [products, searchQuery, activeFilter]);

  const categories = ["All", "Hoodies", "T-Shirts", "Sweatshirts", "Collections"];

  return (
    <div className="space-y-12 pb-20 relative">
      {/* Notification Toast */}
      {notification && (
        <div className={cn(
          "fixed top-10 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-top-10 duration-500",
          notification.type === "success" ? "bg-accent border-accent text-black" : "bg-red-500 border-red-500 text-white"
        )}>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest">{notification.message}</span>
            <button onClick={() => setNotification(null)}><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px]">Inventory Hub</span>
          <Heading size="lg">PRODUCT <span className="text-accent italic">MANAGEMENT.</span></Heading>
        </div>
        <Button variant="accent" onClick={() => isAdding ? resetForm() : setIsAdding(true)}>
          {isAdding ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {isAdding ? "Cancel Operation" : "Add New Product"}
        </Button>
      </div>

      {isAdding && (
        <div className="glass-card rounded-[2rem] p-10 border-accent/20 animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-4">Visual Assets</label>
              <ImageUploader 
                folder="products"
                label="Upload Product Image"
                onUploadSuccess={(url) => setImages([...images, url])}
              />
              <div className="grid grid-cols-3 gap-2 px-2">
                {images.map((url, i) => (
                  <div key={i} className="group relative aspect-square rounded-xl bg-zinc-800 border border-white/5 overflow-hidden">
                    <img src={url} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 p-1 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
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
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 outline-none focus:border-accent/50 text-sm" required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Price (INR)</label>
                    <input 
                      type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 4999"
                      className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 outline-none focus:border-accent/50 text-sm" required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Inventory Stock</label>
                    <input 
                      type="number" value={stock} onChange={(e) => setStock(e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 outline-none focus:border-accent/50 text-sm" required 
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Colors</label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {colors.map(color => (
                      <span key={color} className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-accent">
                        {color}
                        <button type="button" onClick={() => removeColor(color)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" value={colorInput} onChange={(e) => setColorInput(e.target.value)}
                      placeholder="Add color (e.g. Onyx)"
                      className="flex-1 bg-zinc-900 border border-white/5 rounded-xl p-4 outline-none focus:border-accent/50 text-sm"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
                    />
                    <Button type="button" variant="outline" onClick={addColor} className="rounded-xl">Add</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Market Category</label>
                  <select 
                    value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 outline-none focus:border-accent/50 text-sm appearance-none"
                  >
                    {categories.filter(c => c !== "All").map(cat => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Design Specification</label>
                  <textarea 
                    rows={6} value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Technical specifications, fabric details, and aesthetic description..."
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 outline-none focus:border-accent/50 resize-none text-sm"
                  />
                </div>
                <div className="pt-4">
                  <Button type="submit" variant="accent" className="w-full py-8 text-xs font-black tracking-widest uppercase" disabled={loading}>
                    {loading ? "Processing..." : editingProduct ? "Push Updates to Production" : "Deploy New Product"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
         <div className="flex gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto pb-2">
            {categories.map(cat => (
               <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={cn(
                    "px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                    activeFilter === cat 
                      ? "bg-accent border-accent text-black" 
                      : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/20"
                  )}
               >
                  {cat}
               </button>
            ))}
         </div>
         <div className="relative group w-full lg:w-[400px]">
            <input 
              type="text" 
              placeholder="Search product archive..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-3 pl-12 pr-6 outline-none focus:border-accent/50 transition-all text-xs"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-accent transition-colors" />
         </div>
      </div>

      {/* Product List */}
      <div className="glass-card rounded-[2rem] overflow-hidden border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950 border-b border-white/5">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Product Specification</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Market</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Inventory</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Valuation</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-20 bg-zinc-900 rounded-xl flex-shrink-0 border border-white/5 overflow-hidden p-1">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <ImageIcon className="w-full h-full p-4 text-zinc-800" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-black uppercase tracking-tight text-sm text-white">{product.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">
                          Sizes: {product.sizes?.join(", ")}
                        </span>
                        {product.colors?.length > 0 && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-zinc-800" />
                            <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">
                              Colors: {product.colors?.join(", ")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                   <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 bg-white/5 px-3 py-1 rounded-full">
                      {product.category}
                   </span>
                </td>
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <span className={cn(
                      "text-xs font-black",
                      product.stock < 10 ? "text-red-500" : "text-white"
                    )}>
                      {product.stock} Units
                    </span>
                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                       <div 
                        className={cn(
                          "h-full rounded-full transition-all",
                          product.stock < 10 ? "bg-red-500" : "bg-accent"
                        )} 
                        style={{ width: `${Math.min(product.stock, 100)}%` }} 
                       />
                    </div>
                  </div>
                </td>
                <td className="p-6 font-black text-accent text-sm">{formatCurrency(product.price)}</td>
                <td className="p-6 text-right">
                   <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => window.open(`/products/${product.id}`, '_blank')}
                      className="p-3 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-accent transition-all group-hover:border-white/10 border border-transparent"
                      title="View in Shop"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="p-3 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all group-hover:border-white/10 border border-transparent"
                      title="Edit Product"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-3 rounded-xl hover:bg-red-500/10 text-zinc-500 hover:text-red-500 transition-all group-hover:border-white/10 border border-transparent"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && !loading && (
          <div className="p-32 text-center space-y-6">
            <div className="w-20 h-20 bg-zinc-900/50 border border-white/5 rounded-3xl flex items-center justify-center mx-auto">
               <Package className="w-8 h-8 text-zinc-700" />
            </div>
            <div className="space-y-2">
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Zero matches found in active archive</p>
               <p className="text-[9px] text-zinc-600 uppercase tracking-widest">Adjust filters or search parameters</p>
            </div>
          </div>
        )}
        {loading && (
           <div className="p-32 flex justify-center">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
           </div>
        )}
      </div>
    </div>
  );
}
