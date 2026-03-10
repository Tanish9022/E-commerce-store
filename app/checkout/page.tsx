"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, ArrowRight, CreditCard, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (items.length === 0 && mounted) {
      router.push("/shop");
    }
  }, [items, mounted, router]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items,
          email: "guest@example.com", // In a real app, get this from an input or auth
        }),
      });

      const session = await res.json();
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="bg-black min-h-screen text-white pb-40">
      <Navbar />

      <div className="pt-40">
        <Container size="md">
          <div className="flex flex-col gap-16">
            {/* Header */}
            <div className="space-y-4">
              <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px]">Secure Checkout</span>
              <Heading size="lg">Review Your <span className="text-accent italic">Order.</span></Heading>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Order Summary */}
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
                        <p className="font-black">${item.price * item.quantity}.00</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-black uppercase tracking-widest px-4">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  Encryption SECURED BY STRIPE
                </div>
              </div>

              {/* Order Total & Action */}
              <div className="lg:col-span-5 space-y-8">
                <div className="glass-card rounded-3xl p-8 space-y-8 border-accent/20">
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Payment Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Subtotal</span>
                      <span className="font-bold">${getTotalPrice()}.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Shipping</span>
                      <span className="text-accent italic">Calculated at payment</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Tax</span>
                      <span>$0.00</span>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                      <span className="text-xs font-black uppercase tracking-widest">Total</span>
                      <span className="text-3xl font-black text-accent">${getTotalPrice()}.00</span>
                    </div>
                  </div>

                  <Button 
                    variant="accent" 
                    size="xl" 
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={loading || items.length === 0}
                  >
                    {loading ? "Processing..." : (
                      <>
                        <CreditCard className="w-5 h-5 mr-3" />
                        Pay with Stripe
                      </>
                    )}
                  </Button>

                  <p className="text-[9px] text-center text-zinc-600 uppercase tracking-widest leading-relaxed px-4">
                    By clicking "Pay with Stripe", you agree to Kiro's Terms of Service and Privacy Policy.
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
