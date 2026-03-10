"use client";

import React, { useState, useEffect } from "react";
import { Heading } from "@/components/ui/Heading";
import { ShoppingCart, User, Clock, CheckCircle, Truck, MoreVertical, Smartphone, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const handleUpdateStatus = async (id: string, paymentStatus: string, orderStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus, orderStatus }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="w-3 h-3 text-accent" />;
      case "processing": return <Clock className="w-3 h-3 text-orange-500" />;
      case "shipped": return <Truck className="w-3 h-3 text-blue-500" />;
      case "pending": return <Smartphone className="w-3 h-3 text-yellow-500" />;
      default: return <Clock className="w-3 h-3 text-zinc-500" />;
    }
  };

  return (
    <div className="space-y-12 pb-40">
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
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Payment</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Workflow</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Total</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="space-y-1">
                    <p className="font-black uppercase tracking-widest text-[10px] text-white">
                      {order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-[10px] text-zinc-500">{order.email}</p>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex -space-x-2">
                    {order.products.map((p: any, i: number) => (
                      <div key={i} className="w-8 h-10 bg-zinc-900 rounded border border-white/10 flex-shrink-0" />
                    ))}
                  </div>
                </td>
                <td className="p-6">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest",
                    order.paymentStatus === "paid" ? "bg-accent/5 border-accent/20 text-accent" : "bg-yellow-500/5 border-yellow-500/20 text-yellow-500"
                  )}>
                    {getStatusIcon(order.paymentStatus)}
                    {order.paymentStatus}
                  </div>
                </td>
                <td className="p-6">
                   <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      {order.orderStatus}
                   </div>
                </td>
                <td className="p-6 font-black text-white">${order.totalAmount}.00</td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    {order.paymentStatus === "pending" && (
                      <button 
                        onClick={() => handleUpdateStatus(order._id, "paid", "processing")}
                        disabled={updatingId === order._id}
                        className="bg-accent text-black px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                      >
                        {updatingId === order._id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Mark as Paid"}
                      </button>
                    )}
                    {order.orderStatus === "processing" && (
                      <button 
                        onClick={() => handleUpdateStatus(order._id, "paid", "shipped")}
                        disabled={updatingId === order._id}
                        className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-white/20 transition-all disabled:opacity-50"
                      >
                        Mark Shipped
                      </button>
                    )}
                    {order.orderStatus === "shipped" && (
                      <button 
                        onClick={() => handleUpdateStatus(order._id, "paid", "delivered")}
                        disabled={updatingId === order._id}
                        className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-white/20 transition-all disabled:opacity-50"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
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
