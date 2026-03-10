"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, User, Search } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference py-6 px-10 flex justify-between items-center text-white">
      <div className="text-2xl font-black uppercase tracking-widest">
        Kiro
      </div>
      <div className="hidden md:flex gap-10 font-bold uppercase text-sm tracking-widest">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <Link href="/shop" className="hover:text-accent transition-colors">Shop</Link>
        <Link href="/customize" className="hover:text-accent transition-colors">Customize</Link>
        <Link href="/about" className="hover:text-accent transition-colors">About</Link>
      </div>
      <div className="flex gap-6 items-center">
        <Search className="w-5 h-5 cursor-pointer hover:text-accent transition-colors" />
        <User className="w-5 h-5 cursor-pointer hover:text-accent transition-colors" />
        <div className="relative cursor-pointer group">
          <ShoppingBag className="w-5 h-5 hover:text-accent transition-colors" />
          <span className="absolute -top-2 -right-2 bg-accent text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            0
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
