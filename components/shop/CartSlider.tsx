"use client";

import React, { useEffect, useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore, CartItem as CartItemType } from "@/store/useCartStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

const CartItem = ({ item }: { item: CartItemType }) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-6 py-6 border-b border-white/5 group">
      <div className="relative w-24 h-32 rounded-2xl bg-zinc-900 overflow-hidden flex-shrink-0">
        <div className="w-full h-full bg-zinc-800" />
        {item.customizationData && (
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-sm font-black uppercase tracking-widest leading-none truncate pr-4">
              {item.name}
            </h4>
            <button 
              onClick={() => removeItem(item.id, item.size)}
              className="text-zinc-600 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
            Size: {item.size} {item.customizationData ? " / Custom" : ""}
          </p>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4 bg-zinc-900 rounded-full px-3 py-1 border border-white/5">
            <button 
              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-black min-w-[1ch] text-center">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <p className="text-sm font-black text-accent">${item.price * item.quantity}.00</p>
        </div>
      </div>
    </div>
  );
};

const CartSlider = () => {
  const { isOpen, closeCart, items, getTotalPrice, getItemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />

      {/* Slider Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[450px] bg-black border-l border-white/10 z-[101] shadow-2xl transition-transform duration-700 cubic-bezier(0.65, 0, 0.35, 1)",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-8 border-b border-white/5">
            <div className="flex items-center gap-4">
              <Heading size="xs" className="text-white">Your Cart</Heading>
              <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black tracking-widest border border-accent/20">
                {getItemCount()} Items
              </span>
            </div>
            <button 
              onClick={closeCart}
              className="p-2 rounded-full bg-zinc-900 text-white hover:text-accent transition-colors border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-8 no-scrollbar">
            {items.length > 0 ? (
              <div className="py-4">
                {items.map((item) => (
                  <CartItem key={`${item.id}-${item.size}`} item={item} />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-40">
                 <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8" />
                 </div>
                 <p className="text-xs uppercase font-black tracking-[0.2em]">Your bag is currently empty.</p>
                 <Button variant="outline" size="sm" onClick={closeCart}>Continue Shopping</Button>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-8 border-t border-white/5 bg-zinc-950/50 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                  <span>Subtotal</span>
                  <span className="text-white">${getTotalPrice()}.00</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                  <span>Shipping</span>
                  <span className="text-accent italic">Calculated at checkout</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-lg font-black uppercase tracking-tighter">Total Price</span>
                  <span className="text-2xl font-black text-accent">${getTotalPrice()}.00</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button variant="accent" size="xl" className="w-full" withArrow>
                   Checkout Now
                </Button>
                <Button variant="ghost" size="sm" className="w-full text-zinc-500" onClick={closeCart}>
                   Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { CartSlider };
