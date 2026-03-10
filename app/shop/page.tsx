"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Filter, SlidersHorizontal, LayoutGrid, List } from "lucide-react";

import { PRODUCTS } from "@/data/products";

const CATEGORIES = ["All", "Hoodies", "T-Shirts", "Sweatshirts", "Collections"];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isGridView, setIsGridView] = useState(true);

  // 2. Filtering Logic
  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <main className="bg-black min-h-screen text-white pb-40">
      <Navbar />

      <div className="pt-40">
        <Container>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
            <div className="max-w-2xl space-y-6">
              <Heading size="xs" className="text-accent tracking-[0.4em]">The Laboratory</Heading>
              <Heading size="xl">
                THE <span className="text-accent italic">DROP.</span>
              </Heading>
              <p className="text-zinc-500 text-lg font-light leading-relaxed">
                Precision-engineered streetwear for the digital vanguard. Explore our latest drop of high-performance fabrics and custom-ready canvases.
              </p>
            </div>

            {/* View Toggle (Desktop Only) */}
            <div className="hidden md:flex bg-zinc-900/50 p-1 rounded-full border border-white/5 backdrop-blur-md">
              <button 
                onClick={() => setIsGridView(true)}
                className={cn(
                  "p-3 rounded-full transition-all duration-300",
                  isGridView ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsGridView(false)}
                className={cn(
                  "p-3 rounded-full transition-all duration-300",
                  !isGridView ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filtering System */}
          <div className="flex flex-col md:flex-row justify-between items-center border-y border-white/5 py-8 mb-16 gap-8">
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 pb-1 border-b-2",
                    activeCategory === cat 
                      ? "text-accent border-accent" 
                      : "text-zinc-500 border-transparent hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-accent transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
                Sort By
              </button>
              <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-accent transition-colors">
                <Filter className="w-4 h-4" />
                Refine
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className={cn(
            "grid gap-x-12 gap-y-20 transition-all duration-700",
            isGridView 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          )}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  category={product.category}
                  tag={product.tag}
                  className={cn(
                    "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both",
                    !isGridView && "flex flex-col md:flex-row gap-12 items-center text-left"
                  )}
                />
              ))
            ) : (
              <div className="col-span-full py-40 text-center">
                 <Heading size="md" className="text-zinc-800">No products found in this sector.</Heading>
                 <Button 
                   variant="outline" 
                   className="mt-8"
                   onClick={() => setActiveCategory("All")}
                 >
                    Reset Filters
                 </Button>
              </div>
            )}
          </div>

          {/* Pagination Placeholder */}
          <div className="mt-32 flex justify-center">
             <Button variant="outline" size="lg" className="px-20 border-accent/20 hover:border-accent">
                Load More
             </Button>
          </div>
        </Container>
      </div>
    </main>
  );
}
