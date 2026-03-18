"use client";

import React, { useState, useEffect } from "react";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { Navbar } from "@/components/layout/Navbar";
import { Package, ShoppingCart, ArrowRight, BarChart3, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/orders")
        ]);
        
        const products = await productsRes.json();
        const orders = await ordersRes.json();

        setStats({
          products: products.length,
          orders: orders.length,
          pendingOrders: orders.filter((o: any) => o.paymentStatus === "pending").length,
          completedOrders: orders.filter((o: any) => o.paymentStatus === "paid").length
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: "Active Archive", value: stats.products, icon: Package, href: "/admin/products", color: "text-accent" },
    { label: "Total Orders", value: stats.orders, icon: ShoppingCart, href: "/admin/orders", color: "text-blue-500" },
    { label: "Awaiting Payment", value: stats.pendingOrders, icon: Clock, href: "/admin/orders", color: "text-yellow-500" },
    { label: "Successful Sales", value: stats.completedOrders, icon: CheckCircle, href: "/admin/orders", color: "text-green-500" },
  ];

  return (
    <main className="bg-black min-h-screen text-white pb-40">
      <Navbar />
      
      <div className="pt-40">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px]">Operations Center</span>
              <Heading size="lg">ADMIN <span className="text-accent italic">DASHBOARD.</span></Heading>
            </div>
            <div className="px-6 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-[10px] font-black uppercase tracking-widest">
              Store Owner Access
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {statCards.map((stat, i) => (
              <Link key={i} href={stat.href}>
                <div className="glass-card p-8 rounded-[2rem] border-white/5 space-y-4 group hover:border-accent/20 transition-all hover:-translate-y-1">
                  <div className="flex justify-between items-start">
                    <div className={`p-4 rounded-2xl bg-white/5 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-800 group-hover:text-accent transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
                    <p className="text-3xl font-black mt-1">
                      {loading ? "..." : stat.value}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Link href="/admin/products" className="group">
              <div className="glass-card rounded-[3rem] p-12 border-white/5 space-y-8 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <Package className="w-40 h-40" />
                </div>
                <div className="space-y-4 relative z-10">
                  <Heading size="md">INVENTORY <span className="text-accent">CONTROL.</span></Heading>
                  <p className="text-zinc-500 font-light leading-relaxed max-w-xs text-lg">
                    Manage your clothing collection, update stock levels, and deploy new designs to the shop.
                  </p>
                </div>
                <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-accent group-hover:gap-6 transition-all relative z-10">
                  Access Archive <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            <Link href="/admin/orders" className="group">
              <div className="glass-card rounded-[3rem] p-12 border-white/5 space-y-8 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <ShoppingCart className="w-40 h-40" />
                </div>
                <div className="space-y-4 relative z-10">
                  <Heading size="md">ORDER <span className="text-accent">FULFILLMENT.</span></Heading>
                  <p className="text-zinc-500 font-light leading-relaxed max-w-xs text-lg">
                    Track manual UPI payments, update shipping statuses, and manage customer communications.
                  </p>
                </div>
                <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-accent group-hover:gap-6 transition-all relative z-10">
                  Dispatch Center <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </Container>
      </div>
    </main>
  );
}
