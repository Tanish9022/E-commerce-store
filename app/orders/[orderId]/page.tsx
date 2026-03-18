"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { CheckCircle, Clock, Truck, Package, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrderTrackingPage() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.orderId}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [params.orderId]);

  if (loading) return null;
  if (!order) return <div className="pt-40 text-center text-white font-black uppercase tracking-widest">Order not found in database.</div>;

  const steps = ["paid", "processing", "shipped", "delivered"];
  const currentStepIndex = steps.indexOf(order.orderStatus === "pending" ? "paid" : order.orderStatus);

  const getStepIcon = (index: number) => {
    if (index === 0) return <CheckCircle className="w-5 h-5" />;
    if (index === 1) return <Clock className="w-5 h-5" />;
    if (index === 2) return <Truck className="w-5 h-5" />;
    return <Package className="w-5 h-5" />;
  };

  return (
    <main className="bg-black min-h-screen text-white pb-40">
      <Navbar />
      <div className="pt-40">
        <Container size="md">
          <div className="space-y-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div className="space-y-4">
                <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px]">Real-time Tracking</span>
                <Heading size="lg">ORDER: <span className="text-accent italic">{order.stripeSessionId.slice(-10).toUpperCase()}</span></Heading>
              </div>
              <div className="px-6 py-3 rounded-full bg-zinc-900 border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Created: {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="glass-card rounded-[3rem] p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0" />
              
              <div className="relative flex justify-between">
                {steps.map((step, i) => (
                  <div key={step} className="flex flex-col items-center gap-4 z-10">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 border",
                      i <= currentStepIndex 
                        ? "bg-accent text-black border-accent shadow-[0_0_20px_rgba(57,255,20,0.4)]" 
                        : "bg-zinc-900 text-zinc-600 border-white/5"
                    )}>
                      {getStepIcon(i)}
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      i <= currentStepIndex ? "text-white" : "text-zinc-700"
                    )}>
                      {step}
                    </span>
                  </div>
                ))}
                
                {/* Connecting Line */}
                <div className="absolute top-6 left-0 w-full h-[2px] bg-zinc-900 -z-0">
                  <div 
                    className="h-full bg-accent transition-all duration-1000 shadow-[0_0_10px_rgba(57,255,20,0.5)]" 
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="glass-card rounded-[2.5rem] p-10 space-y-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 border-b border-white/5 pb-6">Items Summary</h3>
                <div className="space-y-6">
                  {order.products.map((p: any, i: number) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-zinc-900 rounded-xl border border-white/5" />
                        <div>
                          <p className="text-sm font-black uppercase tracking-widest">{p.name}</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Qty: {p.quantity} / Size: {p.size}</p>
                        </div>
                      </div>
                      <p className="font-black text-accent">${p.price * p.quantity}.00</p>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-white/5 flex justify-between items-center font-black">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">Total Order Value</span>
                  <span className="text-xl">${order.totalAmount}.00</span>
                </div>
              </div>

              <div className="glass-card rounded-[2.5rem] p-10 space-y-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 border-b border-white/5 pb-6">Shipping Details</h3>
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Receiver</p>
                    <p className="text-sm font-bold uppercase">{order.shippingAddress.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Address</p>
                    <p className="text-sm font-bold uppercase leading-relaxed">
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-3 text-accent/50 text-[10px] font-black uppercase tracking-widest italic">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Order
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}
