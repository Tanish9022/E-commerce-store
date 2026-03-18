"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Heading } from "@/components/ui/Heading";
import { ShoppingCart, Clock, CheckCircle, Truck, Smartphone, Loader2, Bell, X } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<any | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastOrderCount = useRef<number>(0);

  const fetchOrders = useCallback(async (isInitial = false) => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      
      // Check for new orders
      if (!isInitial && data.length > lastOrderCount.current) {
        const latestOrder = data[0];
        setNewOrderAlert(latestOrder);
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.log("Audio play failed", e));
        }
        setTimeout(() => setNewOrderAlert(null), 10000); // Hide after 10s
      }
      
      setOrders(data);
      lastOrderCount.current = data.length;
    } catch (err) {
      console.error(err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(true);
    
    // Setup polling every 30 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

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

  const isRecentOrder = (createdAt: string) => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return new Date(createdAt) > fiveMinutesAgo;
  };

  return (
    <div className="space-y-12 pb-40 relative">
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      {/* New Order Toast */}
      {newOrderAlert && (
        <div className="fixed top-10 right-10 z-50 bg-accent text-black p-6 rounded-2xl shadow-2xl flex items-start gap-4 animate-in slide-in-from-right-10 duration-500">
          <div className="bg-black p-3 rounded-xl">
             <Bell className="w-6 h-6 text-accent animate-bounce" />
          </div>
          <div className="flex-1 space-y-1">
             <p className="font-black uppercase tracking-widest text-xs">New Order Received</p>
             <p className="text-[10px] font-bold opacity-70">{newOrderAlert.email}</p>
             <p className="text-sm font-black">{formatCurrency(newOrderAlert.totalAmount)}</p>
          </div>
          <button onClick={() => setNewOrderAlert(null)} className="hover:opacity-50">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
              <tr key={order.id} className={cn(
                "hover:bg-white/[0.02] transition-colors group relative",
                isRecentOrder(order.createdAt) && order.paymentStatus === "pending" && "bg-accent/[0.03]"
              )}>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-black uppercase tracking-widest text-[10px] text-white">
                          {order.id.slice(-8).toUpperCase()}
                        </p>
                        {isRecentOrder(order.createdAt) && (
                          <span className="bg-accent text-black text-[7px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse">
                            New Order
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500">{order.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                   <div className="text-[10px] font-bold text-zinc-400">
                      {order.products.length} Items
                   </div>
                </td>
                <td className="p-6">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest",
                    order.paymentStatus === "paid" ? "bg-accent/5 border-accent/20 text-accent" : "bg-yellow-500/5 border-yellow-500/20 text-yellow-500"
                  )}>
                    {getStatusIcon(order.paymentStatus)}
                    {order.paymentStatus === "pending" ? "Pending Payment" : order.paymentStatus}
                  </div>
                </td>
                <td className="p-6">
                   <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      {order.orderStatus.replace("_", " ")}
                   </div>
                </td>
                <td className="p-6 font-black text-white">{formatCurrency(order.totalAmount)}</td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    {order.paymentStatus === "pending" && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id, "paid", "paid")}
                        disabled={updatingId === order.id}
                        className="bg-accent text-black px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                      >
                        {updatingId === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Mark as Paid"}
                      </button>
                    )}
                    {order.orderStatus === "paid" && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id, "paid", "processing")}
                        disabled={updatingId === order.id}
                        className="bg-white text-black px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
                      >
                        Start Processing
                      </button>
                    )}
                    {order.orderStatus === "processing" && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id, "paid", "shipped")}
                        disabled={updatingId === order.id}
                        className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-white/20 transition-all disabled:opacity-50"
                      >
                        Mark Shipped
                      </button>
                    )}
                    {order.orderStatus === "shipped" && (
                      <button 
                        onClick={() => handleUpdateStatus(order.id, "paid", "delivered")}
                        disabled={updatingId === order.id}
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
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">No active orders detected</p>
          </div>
        )}
      </div>
    </div>
  );
}
