import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10">
          <h1 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">System Core / v1.0.4</h1>
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
