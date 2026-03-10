"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";

export default function CollectionsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        setProducts(data.filter((p: any) => p.category === "Collections"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="bg-black min-h-screen text-white pb-40">
      <Navbar />

      <div className="pt-40">
        <Container>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
            <div className="max-w-2xl space-y-6">
              <Heading size="xs" className="text-accent tracking-[0.4em]">Limited Archive</Heading>
              <Heading size="xl">
                THE <span className="text-accent italic">COLLECTIONS.</span>
              </Heading>
              <p className="text-zinc-500 text-lg font-light leading-relaxed">
                Exclusive drops and archival pieces. High-performance utility meets digital-era aesthetics. Available for a limited time only.
              </p>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
               {[1,2,3].map(i => (
                 <div key={i} className="space-y-8 animate-pulse">
                    <div className="aspect-[3/4] bg-zinc-900 rounded-[2rem]" />
                    <div className="h-4 bg-zinc-900 rounded w-1/2" />
                 </div>
               ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={product.price}
                    category={product.category}
                    tag={product.tag}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                  />
                ))
              ) : (
                <div className="col-span-full py-40 text-center">
                   <Sparkles className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                   <Heading size="md" className="text-zinc-800 uppercase tracking-widest">No collections found in this sector.</Heading>
                </div>
              )}
            </div>
          )}
        </Container>
      </div>
    </main>
  );
}
