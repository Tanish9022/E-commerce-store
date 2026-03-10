"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  category: string;
  tag?: string;
  imageUrl?: string;
  className?: string;
}

const ProductCard = ({
  id,
  name,
  price,
  category,
  tag,
  imageUrl,
  className,
}: ProductCardProps) => {
  return (
    <div className={cn("group cursor-pointer hover-scale", className)}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/5 mb-8 group-hover:border-accent/30 transition-all duration-700">
        {tag && (
          <div className="absolute top-8 left-8 z-20">
            <span className="px-5 py-2.5 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              {tag}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-700 z-10 flex flex-col items-center justify-center gap-4 px-10 translate-y-8 group-hover:translate-y-0">
          <Link
            href={`/products/${id}`}
            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-center hover:bg-accent transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(57,255,20,0.4)]"
          >
            Access Data
          </Link>
          <button className="w-full border border-white/10 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/5 transition-all duration-500 flex items-center justify-center gap-3">
            <ShoppingBag className="w-4 h-4 text-zinc-400 group-hover/btn:text-white" />
            Rapid Load
          </button>
        </div>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 transition-transform duration-700 group-hover:scale-110" />
        )}
      </div>

      <div className="flex justify-between items-start px-2">
        <div>
          <h4 className="text-2xl font-black uppercase tracking-tight mb-1 group-hover:text-accent transition-colors">
            {name}
          </h4>
          <p className="text-zinc-500 uppercase text-[10px] font-bold tracking-[0.2em]">
            {category}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-light text-accent">${price}.00</p>
        </div>
      </div>
    </div>
  );
};

export { ProductCard };
