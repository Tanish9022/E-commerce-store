"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";
import { Package, Truck, CheckCircle, Clock, Layout, LogOut, User as UserIcon, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { ADMIN_EMAIL } from "@/lib/constants";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isOwner = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, orderRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/orders/user")
        ]);
        
        const userData = await userRes.json();
        const orderData = await orderRes.json();

        if (userRes.ok) {
          setUser(userData.user);
          setOrders(Array.isArray(orderData) ? orderData : []); 
        } else {
          router.push("/login");
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (loading) return null;

  return (
    <main className="bg-black min-h-screen text-white pb-40">
      <Navbar />
      <div className="pt-40">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Sidebar */}
            <div className="lg:col-span-3 space-y-8">
              <div className="glass-card rounded-3xl p-8 space-y-8 text-center">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto border border-accent/20">
                  <UserIcon className="w-10 h-10 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">{user?.name}</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">{user?.email}</p>
                </div>
                <div className="pt-6 border-t border-white/5 space-y-2">
                  <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-accent text-xs font-black uppercase tracking-widest transition-all">
                    <Layout className="w-4 h-4" />
                    Overview
                  </button>
                  {isOwner && (
                    <button 
                      onClick={() => router.push("/admin")}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-accent text-black text-xs font-black uppercase tracking-widest transition-all hover:scale-105"
                    >
                      <Layout className="w-4 h-4" />
                      Admin Dashboard
                    </button>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-zinc-500 hover:text-white text-xs font-black uppercase tracking-widest transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Secure Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-12">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px]">Operations</span>
                  <Heading size="lg">COMMAND <span className="text-accent italic">CENTER.</span></Heading>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card rounded-3xl p-8 border-white/5">
                  <Clock className="w-6 h-6 text-zinc-500 mb-4" />
                  <p className="text-3xl font-black">{orders.length}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Total Orders</p>
                </div>
                <div className="glass-card rounded-3xl p-8 border-white/5">
                  <Truck className="w-6 h-6 text-zinc-500 mb-4" />
                  <p className="text-3xl font-black">{orders.filter(o => o.orderStatus === "shipped").length}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">In Transit</p>
                </div>
                <div className="glass-card rounded-3xl p-8 border-white/5">
                  <CheckCircle className="w-6 h-6 text-zinc-500 mb-4" />
                  <p className="text-3xl font-black">{orders.filter(o => o.paymentStatus === "paid").length}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Confirmed Orders</p>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 px-4">Order History</h3>
                
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order.id}
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className="glass-card rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 border-white/5 hover:border-accent/20 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-16 bg-zinc-900 rounded-lg border border-white/5" />
                          <div>
                            <p className="font-black uppercase tracking-widest text-xs">
                              {order.stripeSessionId ? order.stripeSessionId.slice(-10).toUpperCase() : order.id.slice(-10).toUpperCase()}
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-12">
                          <div className="text-center md:text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Status</p>
                            <p className="text-xs font-black uppercase tracking-tighter text-accent mt-1">{order.orderStatus === "pending" ? "Confirmed" : order.orderStatus}</p>
                          </div>
                          <div className="text-center md:text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Total</p>
                            <p className="text-sm font-black mt-1">{formatCurrency(order.totalAmount)}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-zinc-800 group-hover:text-accent transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card rounded-[2rem] p-20 text-center space-y-8 border-dashed border-white/10 bg-transparent">
                    <Package className="w-12 h-12 text-zinc-800 mx-auto" />
                    <div className="space-y-2">
                      <p className="text-sm font-black uppercase tracking-widest">No orders detected</p>
                      <p className="text-xs text-zinc-600 font-light">Your order history is currently empty. Start your first purchase below.</p>
                    </div>
                    <Button variant="outline" size="md" onClick={() => router.push("/shop")}>
                      Access the Collection
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}
