"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ProductCard } from "@/components/ui/ProductCard";
import { PRODUCTS } from "@/data/products";

export default function CollectionsPage() {
  const collectionProducts = PRODUCTS.filter((p) => p.category === "Collections");

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {collectionProducts.length > 0 ? (
              collectionProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  category={product.category}
                  tag={product.tag}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                />
              ))
            ) : (
              <div className="col-span-full py-40 text-center">
                 <Heading size="md" className="text-zinc-800">No collections found in this sector.</Heading>
              </div>
            )}
          </div>
        </Container>
      </div>
    </main>
  );
}
