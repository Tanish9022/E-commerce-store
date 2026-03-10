"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, User, Search, Menu, X, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useSearchStore } from "@/store/useSearchStore";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart, getItemCount } = useCartStore();
  const { openSearch } = useSearchStore();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-700 py-8 px-4 md:px-10",
        isScrolled
          ? "py-5"
          : "bg-transparent"
      )}
    >
      <Container className={cn(
        "flex justify-between items-center transition-all duration-700 px-8 py-4 rounded-full",
        isScrolled ? "glass-card-hover bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]" : "bg-transparent"
      )}>
        {/* Brand Logo */}
        <Link href="/" className="text-xl font-black uppercase tracking-[0.1em] font-syne hover:text-accent transition-all duration-500 hover:scale-105 active:scale-95">
          GEN-Z COLLECTION
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex gap-12 font-black uppercase text-[10px] tracking-[0.3em] font-syne">
          {['Shop', 'Customize', 'Collections', 'About'].map((item) => (
            <Link 
              key={item} 
              href={`/${item.toLowerCase()}`} 
              className="relative py-2 text-zinc-400 hover:text-white transition-colors group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-500 group-hover:w-full shadow-[0_0_10px_var(--accent-glow)]" />
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex gap-8 items-center text-white">
          <button 
            onClick={openSearch}
            className="p-2 -m-2 text-zinc-400 hover:text-white transition-all duration-500 hover:scale-110 active:scale-90"
          >
            <Search className="w-5 h-5 cursor-pointer" />
          </button>
          
          <div className="w-5 h-5 flex items-center justify-center">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
            ) : (
              <Link href={user ? (user.role === 'admin' ? "/admin" : "/dashboard") : "/login"}>
                <User className={cn(
                  "w-5 h-5 cursor-pointer transition-all duration-500 hover:scale-110 active:scale-90",
                  user ? "text-accent drop-shadow-[0_0_8px_var(--accent-glow)]" : "text-zinc-400 hover:text-white"
                )} />
              </Link>
            )}
          </div>

          <button 
            onClick={openCart}
            className="relative p-2 -m-2 group outline-none"
          >
            <ShoppingBag className="w-5 h-5 text-zinc-400 group-hover:text-white transition-all duration-500 group-hover:scale-110 active:scale-90" />
            <span className="absolute top-1 right-1 bg-accent text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(57,255,20,0.4)]">
              {getItemCount()}
            </span>
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex flex-col items-center justify-center gap-10 transition-all duration-700 md:hidden",
        isMobileMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-10 pointer-events-none"
      )}>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-10 right-10 p-4 rounded-full bg-white/5 border border-white/10"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center gap-8 font-syne font-black uppercase text-3xl tracking-tighter">
          {['Shop', 'Customize', 'Collections', 'About'].map((item) => (
            <Link 
              key={item} 
              href={`/${item.toLowerCase()}`} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-accent transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="mt-10 pt-10 border-t border-white/5 w-64 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 mb-6">Social Feed</p>
          <div className="flex justify-center gap-8 text-zinc-400">
             <span className="text-xs font-black hover:text-white cursor-pointer">IG</span>
             <span className="text-xs font-black hover:text-white cursor-pointer">TW</span>
             <span className="text-xs font-black hover:text-white cursor-pointer">TK</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };
