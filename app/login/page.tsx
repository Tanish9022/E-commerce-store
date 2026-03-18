"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="pt-40 pb-20">
        <Container size="sm">
          <div className="glass-card rounded-[3rem] p-12 md:p-16 space-y-12">
            <div className="text-center space-y-4">
              <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px]">Access Granted</span>
              <Heading size="lg">WELCOME <span className="text-accent italic">BACK.</span></Heading>
              <p className="text-zinc-500 font-light">Enter your credentials to access the GenZ Archive.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-widest text-center">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-accent transition-colors" />
                  <input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 pl-16 pr-6 outline-none focus:border-accent/50 transition-all font-bold text-sm tracking-widest"
                    required
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-accent transition-colors" />
                  <input
                    type="password"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-5 pl-16 pr-6 outline-none focus:border-accent/50 transition-all font-bold text-sm tracking-widest"
                    required
                  />
                </div>
              </div>

              <Button variant="accent" size="xl" className="w-full" disabled={loading}>
                {loading ? "Authenticating..." : "Login to Studio"}
                <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
            </form>

            <div className="text-center pt-8 border-t border-white/5">
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                Don't have an account?{" "}
                <Link href="/register" className="text-white hover:text-accent transition-colors">
                  Join the Revolution
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}
