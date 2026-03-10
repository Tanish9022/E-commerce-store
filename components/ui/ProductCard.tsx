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
  tag?: string;
  className?: string;
}

const ProductCard = ({ id, name, price, category, tag, className }: ProductCardProps) => {
  return (
    <div className={cn("group cursor-pointer", className)}>
      <Link href={`/products/${id}`}>
        <div className="relative aspect-[3/4] bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-accent/30">
          {/* Image Placeholder */}
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 group-hover:scale-110 transition-transform duration-700" />
          
          {/* Status Tag */}
          {tag && (
            <div className="absolute top-6 left-6 z-10">
              <span className="bg-accent text-black text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {tag}
              </span>
            </div>
          )}

          {/* Quick Add Button */}
          <div className="absolute bottom-6 right-6 z-10 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-accent transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>

      <div className="mt-8 flex justify-between items-start px-2">
        <div className="space-y-1">
          <Heading size="xs" className="text-white tracking-tight leading-none truncate max-w-[200px]">
            {name}
          </Heading>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {category}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-light text-accent">{formatCurrency(price)}</p>
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
