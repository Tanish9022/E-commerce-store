"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, ArrowRight, ShieldCheck, CheckCircle, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (items.length === 0 && mounted && !orderId) {
      router.push("/shop");
    }
  }, [items, mounted, router, orderId]);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items,
          email: user?.email || "guest@example.com",
          userId: user?.id,
          shippingAddress: {
            name: user?.name || "Guest Customer",
            address: "Manual UPI Payment Selected",
            city: "",
            postalCode: "",
            country: "IN"
          }
        }),
      });

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setOrderId(data.orderId);
      clearCart();
      setLoading(false);
    } catch (err) {
      console.error("Order error:", err);
      setLoading(false);
      alert("Failed to place order. Please try again.");
    }
  };

  if (!mounted) return null;

  // Order Success View
  if (orderId) {
    return (
      <main className="bg-black min-h-screen text-white flex items-center justify-center p-6">
        <Container size="sm">
          <div className="flex flex-col items-center text-center space-y-12 animate-in fade-in zoom-in duration-700">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full" />
              <CheckCircle className="w-24 h-24 text-accent relative z-10" />
            </div>

            <div className="space-y-6">
              <span className="text-accent font-black uppercase tracking-[0.5em] text-[10px]">Order Received</span>
              <Heading size="lg">ORDER <span className="text-accent italic">SUCCESSFUL.</span></Heading>
              <div className="glass-card rounded-3xl p-8 border-accent/20 space-y-6">
                <p className="text-zinc-500 font-light text-lg leading-relaxed">
                  Your order has been received. Our team will send you a <span className="text-accent font-bold italic text-xl uppercase tracking-tighter mx-1 inline-flex items-center gap-2"><Smartphone className="w-5 h-5" /> UPI QR code</span> shortly for payment.
                </p>
                <div className="pt-6 border-t border-white/5">
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Order ID Reference</p>
                   <p className="text-sm font-black text-white">{orderId.toUpperCase()}</p>
                </div>
              </div>
            </div>

            <Button 
              variant="accent" 
              size="xl" 
              className="w-full"
              onClick={() => router.push("/")}
            >
              Back to HQ
              <ArrowRight className="ml-3 w-5 h-5" />
            </Button>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white pb-40">
      <Navbar />

      <div className="pt-40">
        <Container size="md">
          <div className="flex flex-col gap-16">
            <div className="space-y-4">
              <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px]">Manual Payment</span>
              <Heading size="lg">Finalize Your <span className="text-accent italic">Order.</span></Heading>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-7 space-y-8">
                <div className="glass-card rounded-3xl p-8 space-y-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Items in your bag</h3>
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-6 items-center">
                        <div className="w-20 h-24 bg-zinc-900 rounded-2xl flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="text-sm font-black uppercase tracking-widest mb-1">{item.name}</h4>
                          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                            Size: {item.size} / Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-black">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-black uppercase tracking-widest px-4">
                  <Smartphone className="w-4 h-4 text-accent" />
                  Pay via UPI QR (Sent manually by admin)
                </div>
              </div>

              <div className="lg:col-span-5 space-y-8">
                <div className="glass-card rounded-3xl p-8 space-y-8 border-accent/20">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Payment Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Subtotal</span>
                      <span className="font-bold">{formatCurrency(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Tax</span>
                      <span>{formatCurrency(0)}</span>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                      <span className="text-xs font-black uppercase tracking-widest">Total</span>
                      <span className="text-3xl font-black text-accent">{formatCurrency(getTotalPrice())}</span>
                    </div>
                  </div>

                  <Button 
                    variant="accent" 
                    size="xl" 
                    className="w-full"
                    onClick={handlePlaceOrder}
                    disabled={loading || items.length === 0}
                  >
                    {loading ? "Placing Order..." : (
                      <>
                        <ShoppingBag className="w-5 h-5 mr-3" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <p className="text-[9px] text-center text-zinc-600 uppercase tracking-widest leading-relaxed px-4">
                    Our team will contact you via email with a UPI QR code to complete the payment once the order is placed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}
