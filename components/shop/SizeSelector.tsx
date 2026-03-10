"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
}

const SizeSelector = ({ sizes, selectedSize, onSelect }: SizeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          Select Size
        </label>
        <button className="text-[10px] font-black uppercase tracking-[0.2em] text-accent underline">
          Size Guide
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={cn(
              "py-4 rounded-2xl font-black transition-all duration-300 border",
              selectedSize === size
                ? "bg-white text-black border-white shadow-xl shadow-white/10"
                : "bg-transparent text-white border-white/10 hover:border-white/40"
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export { SizeSelector };
