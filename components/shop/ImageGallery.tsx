"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 overflow-x-auto no-scrollbar">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={cn(
              "relative w-20 h-24 rounded-2xl overflow-hidden bg-zinc-900 border-2 transition-all duration-300",
              activeImage === idx ? "border-accent" : "border-transparent opacity-50"
            )}
          >
            {/* Image Placeholder */}
            <div className="w-full h-full bg-zinc-800" />
          </button>
        ))}
      </div>

      {/* Main Preview */}
      <div className="flex-1 relative aspect-[3/4] bg-zinc-900 rounded-[3rem] overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)] z-10" />
        
        {/* Main Image Placeholder */}
        <div className="w-full h-full bg-zinc-800 transition-transform duration-700 group-hover:scale-105" />
        
        <div className="absolute top-8 left-8 z-20">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Studio Captured</span>
        </div>
      </div>
    </div>
  );
};

export { ImageGallery };
