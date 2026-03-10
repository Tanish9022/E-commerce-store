"use client";

import React, { useState, useEffect } from "react";
import { Heading } from "@/components/ui/Heading";
import { ShoppingCart, User, Clock, CheckCircle, Truck, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="w-3 h-3 text-accent" />;
      case "processing": return <Clock className="w-3 h-3 text-orange-500" />;
      case "shipped": return <Truck className="w-3 h-3 text-blue-500" />;
      default: return <Clock className="w-3 h-3 text-zinc-500" />;
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px]">Operations</span>
          <Heading size="lg">ORDER <span className="text-accent italic">TRACKING.</span></Heading>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] overflow-hidden border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950 border-b border-white/5">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Order ID / Customer</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Items</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Total</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="p-6">
                  <div className="space-y-1">
                    <p className="font-black uppercase tracking-widest text-xs">{order.stripeSessionId.slice(-10).toUpperCase()}</p>
                    <p className="text-[10px] text-zinc-500">{order.email}</p>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex -space-x-2">
                    {order.products.map((p: any, i: number) => (
                      <div key={i} className="w-8 h-10 bg-zinc-900 rounded border border-white/10 flex-shrink-0" />
                    ))}
                    {order.products.length > 3 && (
                      <div className="w-8 h-10 bg-zinc-800 rounded border border-white/10 flex items-center justify-center text-[8px] font-bold">
                        +{order.products.length - 3}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-6">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest",
                    order.paymentStatus === "paid" ? "bg-accent/5 border-accent/20 text-accent" : "bg-white/5 border-white/10 text-zinc-500"
                  )}>
                    {getStatusIcon(order.paymentStatus)}
                    {order.paymentStatus}
                  </div>
                </td>
                <td className="p-6 font-black text-white">${order.totalAmount}.00</td>
                <td className="p-6 text-right text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && !loading && (
          <div className="p-20 text-center space-y-4">
            <ShoppingCart className="w-12 h-12 text-zinc-800 mx-auto" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">No deployments detected</p>
          </div>
        )}
      </div>
    </div>
  );
}
