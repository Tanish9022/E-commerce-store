"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function OrderSuccessContent() {
  const { clearCart } = useCartStore();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    clearCart(); // Clear cart on successful order
  }, [clearCart]);

  if (!mounted) return null;

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="pt-40 pb-40">
        <Container size="sm">
          <div className="flex flex-col items-center text-center space-y-12">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full" />
              <CheckCircle className="w-24 h-24 text-accent relative z-10 animate-in zoom-in duration-700" />
            </div>

            <div className="space-y-6 relative z-10">
              <span className="text-accent font-black uppercase tracking-[0.5em] text-[10px]">Payment Received</span>
              <Heading size="lg">ORDER <span className="text-accent italic">CONFIRMED.</span></Heading>
              <p className="text-zinc-500 font-light text-lg leading-relaxed max-w-md mx-auto">
                Thank you for joining the revolution. Your order has been placed successfully and is currently being processed.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-10 w-full space-y-8 border-accent/10">
              <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-white/5 pb-8">
                <div className="text-left space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Order Number</p>
                  <p className="text-sm font-black text-white truncate max-w-[200px]">{sessionId?.slice(-12).toUpperCase() || "GENZ-XXXX-XXXX"}</p>
                </div>
                <div className="text-left md:text-right space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Expected Delivery</p>
                  <p className="text-sm font-black text-accent">2-4 Business Days</p>
                </div>
              </div>

              <div className="flex items-start gap-6 text-left">
                <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/5">
                  <Package className="w-6 h-6 text-accent" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black uppercase tracking-widest text-xs">Processing & Printing</h4>
                  <p className="text-xs text-zinc-500 font-light">Your custom vision is now being translated into reality by our studio team.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full pt-8">
              <Button 
                variant="accent" 
                size="xl" 
                className="flex-1"
                onClick={() => window.location.href = "/"}
              >
                Back to HQ
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="flex-1"
                onClick={() => window.location.href = "/shop"}
              >
                <ShoppingBag className="mr-3 w-5 h-5" />
                Continue Shopping
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
