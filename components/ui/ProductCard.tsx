"use client";

import React from "react";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  category: string;
  images?: string[];
  sizes?: string[];
  tag?: string;
  className?: string;
}

const ProductCard = ({ id, name, price, category, images, sizes, tag, className }: ProductCardProps) => {
  return (
    <div className={cn("group cursor-pointer", className)}>
      <Link href={`/products/${id}`}>
        <div className="relative aspect-[3/4] bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-accent/30 shadow-2xl">
          {/* Product Image */}
          {images?.[0] ? (
            <img 
              src={images[0]} 
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 group-hover:scale-110 transition-transform duration-700" />
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Status Tag */}
          {tag && (
            <div className="absolute top-6 left-6 z-10">
              <span className="bg-accent text-black text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                {tag}
              </span>
            </div>
          )}

          {/* Available Sizes Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {sizes?.map(size => (
                <span key={size} className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-[8px] font-black text-white/60">
                  {size}
                </span>
              ))}
            </div>
            <button className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent transition-colors flex items-center justify-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              Initialize Procurement
            </button>
          </div>
        </div>
      </Link>

      <div className="mt-8 flex justify-between items-start px-2">
        <div className="space-y-1">
          <Heading size="xs" className="text-white tracking-tight leading-none truncate max-w-[200px]">
            {name}
          </Heading>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {category}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-light text-accent italic">{formatCurrency(price)}</p>
        </div>
      </div>
    </div>
  );
};

const Heading = ({ size, children, className }: any) => {
  const sizes = {
    xs: "text-sm md:text-base font-black uppercase tracking-widest",
  };
  return <h3 className={cn((sizes as any)[size], className)}>{children}</h3>;
};

export { ProductCard };
