"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { Search, Filter, SlidersHorizontal, Sparkles } from "lucide-react";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
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
    fetchProducts();
  }, []);

  const categories = ["All", "Hoodies", "T-Shirts", "Sweatshirts", "Collections"];

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <main className="bg-black min-h-screen text-white pb-40">
      <Navbar />

      <div className="pt-40">
        <Container>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
            <div className="max-w-2xl space-y-6">
              <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px]">Cyber Studio</span>
              <Heading size="xl">
                THE <span className="text-accent italic">DROP.</span>
              </Heading>
              <p className="text-zinc-500 text-lg font-light leading-relaxed">
                Engineered for the digital generation. High-performance utility meets archival aesthetics. Explore our latest drops.
              </p>
            </div>

            <div className="flex gap-4">
               <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Search Archive" 
                    className="bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-accent/50 transition-all w-[300px]"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-accent transition-colors" />
               </div>
               <Button variant="outline" size="lg" className="rounded-2xl border-white/5">
                  <SlidersHorizontal className="w-4 h-4 mr-3" />
                  Filter
               </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-4 mb-20 overflow-x-auto no-scrollbar pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                  activeCategory === cat 
                    ? "bg-accent border-accent text-black" 
                    : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/20"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
               {[1,2,3].map(i => (
                 <div key={i} className="space-y-8 animate-pulse">
                    <div className="aspect-[3/4] bg-zinc-900 rounded-[2rem]" />
                    <div className="h-4 bg-zinc-900 rounded w-1/2" />
                    <div className="h-4 bg-zinc-900 rounded w-1/4" />
                 </div>
               ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  images={product.images}
                  sizes={product.sizes}
                  category={product.category}
                  tag={product.stock < 10 ? "Low Stock" : ""}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
            <div className="py-40 text-center space-y-6">
               <Sparkles className="w-12 h-12 text-zinc-800 mx-auto" />
               <Heading size="md" className="text-zinc-700">No products found in this sector.</Heading>
               <Button variant="outline" onClick={() => setActiveCategory("All")}>Clear Filters</Button>
            </div>
          )}

          {/* Load More */}
          <div className="mt-40 flex justify-center">
             <Button variant="outline" size="lg" className="px-20 border-accent/20 hover:border-accent">
                Load More
             </Button>
          </div>
        </Container>
      </div>
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
