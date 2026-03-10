"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, X, Command, ArrowRight, Package, Layout, Tag } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import { PRODUCTS } from "@/data/products";
import { DESIGN_TEMPLATES } from "@/data/designTemplates";
import { cn } from "@/lib/utils";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";

export const SearchOverlay = () => {
  const { isOpen, closeSearch } = useSearchStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 1. Prepare Data for Fuse.js
  const searchData = useMemo(() => {
    const products = PRODUCTS.map(p => ({ ...p, type: "Product", link: `/products/${p.id}` }));
    const templates = DESIGN_TEMPLATES.map(t => ({ ...t, type: "Template", link: `/customize?templateId=${t.id}` }));
    const categories = Array.from(new Set(PRODUCTS.map(p => p.category))).map(c => ({ 
      id: c, name: c, type: "Category", link: `/shop?category=${c}` 
    }));
    return [...products, ...templates, ...categories];
  }, []);

  // 2. Initialize Fuse.js
  const fuse = useMemo(() => new Fuse(searchData, {
    keys: ["name", "category", "type", "tag"],
    threshold: 0.3,
    distance: 100,
  }), [searchData]);

  // 3. Search Results
  const results = useMemo(() => {
    if (!query) return [];
    return fuse.search(query).slice(0, 8).map(r => r.item);
  }, [fuse, query]);

  // 4. Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        useSearchStore.getState().toggleSearch();
      }
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSearch]);

  // 5. Focus Input
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery(""); // Reset query on open
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResultClick = (link: string) => {
    router.push(link);
    closeSearch();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="h-24 px-10 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <Search className="w-5 h-5 text-accent" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Global Search Engine</span>
        </div>
        <button 
          onClick={closeSearch}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white border border-white/5"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto pt-20 px-6">
        {/* Search Input */}
        <div className="relative group">
          <input
            ref={inputRef}
            type="text"
            placeholder="SEARCH PRODUCTS, PRESETS, SECTORS..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-b-2 border-white/10 py-8 text-4xl md:text-6xl font-black uppercase tracking-tighter outline-none focus:border-accent transition-colors placeholder:text-zinc-800"
          />
          <div className="absolute right-0 bottom-8 flex items-center gap-3 text-zinc-600">
            <Command className="w-4 h-4" />
            <span className="text-[10px] font-black tracking-widest">K</span>
          </div>
        </div>

        {/* Results / Empty State */}
        <div className="mt-12 space-y-12">
          {!query ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Recommended Targets</h3>
              <div className="flex flex-wrap gap-4">
                {["Hoodies", "Cyber Core", "Typography", "New Arrivals"].map((tag) => (
                  <button 
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-6 py-3 rounded-full bg-zinc-900 border border-white/5 hover:border-accent/30 transition-all text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {results.length > 0 ? (
                results.map((result: any, i) => (
                  <div 
                    key={i}
                    onClick={() => handleResultClick(result.link)}
                    className="flex items-center justify-between p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5 hover:border-accent/20 hover:bg-accent/5 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-20 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center overflow-hidden">
                        {result.type === "Product" ? <Package className="w-6 h-6 text-zinc-600" /> : <Layout className="w-6 h-6 text-accent/40" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-xl font-black uppercase tracking-tight group-hover:text-accent transition-colors">{result.name}</h4>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                            result.type === "Product" ? "border-white/10 text-zinc-500" : "border-accent/20 text-accent"
                          )}>
                            {result.type}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Sector: {result.category || "Base System"}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-zinc-800 group-hover:text-accent group-hover:translate-x-2 transition-all" />
                  </div>
                ))
              ) : (
                <div className="py-20 text-center space-y-4 opacity-20">
                  <Search className="w-12 h-12 mx-auto" />
                  <p className="text-sm font-black uppercase tracking-[0.3em]">No signals detected</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
