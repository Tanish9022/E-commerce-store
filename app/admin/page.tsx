"use client";

import React, { useState, useEffect } from "react";
import { Heading } from "@/components/ui/Heading";
import { DollarSign, ShoppingBag, Package, TrendingUp, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    activeDeployments: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/orders")
        ]);
        const products = await prodRes.json();
        const orders = await orderRes.json();

        const revenue = orders.reduce((acc: number, curr: any) => acc + curr.totalAmount, 0);
        
        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          activeDeployments: orders.filter((o: any) => o.paymentStatus === "paid").length
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: "Gross Revenue", value: `$${stats.totalRevenue}.00`, icon: DollarSign, color: "text-accent" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-white" },
    { label: "Product Stack", value: stats.totalProducts, icon: Package, color: "text-white" },
    { label: "Active Drops", value: stats.activeDeployments, icon: Activity, color: "text-accent" },
  ];

  return (
    <div className="space-y-12">
      <div>
        <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px]">Intelligence</span>
        <Heading size="lg">SYSTEM <span className="text-accent italic">OVERVIEW.</span></Heading>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card rounded-[2rem] p-8 border-white/5 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <stat.icon className={stat.color} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
              <p className="text-3xl font-black mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-card rounded-[2.5rem] p-10 border-white/5 h-[400px] flex flex-col items-center justify-center text-center space-y-4">
           <TrendingUp className="w-12 h-12 text-zinc-800" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Revenue Analytics Coming Soon</p>
        </div>
        <div className="glass-card rounded-[2.5rem] p-10 border-white/5 h-[400px] flex flex-col items-center justify-center text-center space-y-4">
           <Activity className="w-12 h-12 text-zinc-800" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">System Logs Coming Soon</p>
        </div>
      </div>
    </div>
  );
}
