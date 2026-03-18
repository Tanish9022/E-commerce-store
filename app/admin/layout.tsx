"use client";

import React, { useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/hooks/useAuth";
import { ADMIN_EMAIL } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10">
          <div className="flex flex-col">
            <h1 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Admin Dashboard / v1.0.4</h1>
            {/* Debug UI */}
            <div className="text-[8px] text-zinc-600 uppercase tracking-widest mt-1">
              Auth: {user.email} | Owner: {String(user.email === ADMIN_EMAIL)}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-8 h-8 rounded-full bg-accent animate-pulse shadow-[0_0_15px_rgba(57,255,20,0.4)]" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-10 no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
