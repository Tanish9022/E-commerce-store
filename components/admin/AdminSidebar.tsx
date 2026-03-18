"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Box, ShoppingCart, Users, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Box, label: "Products", href: "/admin/products" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-zinc-950 border-r border-white/5 flex flex-col h-full">
      <div className="p-8">
        <Link href="/" className="text-xl font-black uppercase tracking-[0.2em] text-accent italic">
          GenZ <span className="text-white not-italic font-light">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group",
              pathname === item.href
                ? "bg-accent/10 text-accent"
                : "text-zinc-500 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-accent" : "group-hover:text-accent transition-colors")} />
            <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/";
          }}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-zinc-500 hover:text-red-500 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </div>
  );
};

export { AdminSidebar };
