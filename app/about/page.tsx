"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { Sparkles, Zap, Shield, Cpu } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <SectionWrapper centered className="pt-40 pb-20 bg-[radial-gradient(circle_at_top,rgba(57,255,20,0.05)_0%,transparent_70%)]">
        <Container className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
            <Cpu className="w-4 h-4" />
            System Protocol 02
          </div>
          <Heading size="xl" className="tracking-tighter leading-[0.8] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            ABOUT GEN-Z<br />
            <span className="text-accent italic drop-shadow-[0_0_20px_rgba(57,255,20,0.3)]">COLLECTION.</span>
          </Heading>
          <p className="text-xl text-zinc-500 font-light uppercase tracking-[0.3em] max-w-2xl mx-auto">
            Built for the digital generation.
          </p>
        </Container>
      </SectionWrapper>

      {/* About Content Section */}
      <SectionWrapper className="py-32">
        <Container size="md">
          <div className="glass-card rounded-[3rem] p-12 md:p-20 space-y-12 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Zap className="w-64 h-64 text-white" />
            </div>
            
            <div className="space-y-6 relative z-10">
              <Heading size="sm" className="text-accent tracking-[0.3em]">The Genesis</Heading>
              <p className="text-2xl md:text-3xl font-light leading-relaxed text-zinc-300">
                GEN-Z Collection is more than a fashion label—it&apos;s a <span className="text-white font-bold">creative sandbox</span> for the digital vanguard. We believe that identity shouldn&apos;t be mass-produced. 
              </p>
              <p className="text-lg md:text-xl text-zinc-500 font-light leading-relaxed">
                Our platform merges premium high-performance fabrics with cutting-edge customization tools, allowing you to bridge the gap between digital vision and physical reality. We provide the canvas; you provide the soul.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4 hover:border-accent/30 transition-colors group">
                <Zap className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-black uppercase tracking-widest">Rapid Creation</h3>
                <p className="text-xs text-zinc-500 uppercase tracking-widest leading-loose">Real-time studio tools designed for instant creative execution.</p>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4 hover:border-accent/30 transition-colors group">
                <Shield className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-black uppercase tracking-widest">Premium Spec</h3>
                <p className="text-xs text-zinc-500 uppercase tracking-widest leading-loose">Ethically sourced, high-grade materials engineered for durability.</p>
              </div>
            </div>
          </div>
        </Container>
      </SectionWrapper>

      {/* Mission Section */}
      <SectionWrapper className="bg-zinc-950 py-40 border-y border-white/5">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <Heading size="lg">OUR<br /><span className="text-accent italic">MISSION.</span></Heading>
              <p className="text-xl text-zinc-400 font-light leading-relaxed">
                To empower the next generation of creators with the tools to redefine global streetwear. We are decentralizing fashion by putting the design power directly into the hands of the youth.
              </p>
              <div className="flex gap-6">
                <Button size="lg" variant="accent" withArrow onClick={() => window.location.href='/customize'}>
                  Join the Lab
                </Button>
              </div>
            </div>
            
            <div className="relative aspect-square">
               <div className="absolute inset-0 bg-accent/10 rounded-[4rem] rotate-6 scale-95 border border-accent/20" />
               <div className="absolute inset-0 bg-zinc-900 rounded-[4rem] border border-white/10 flex items-center justify-center p-20 text-center">
                  <div className="space-y-6">
                    <Sparkles className="w-16 h-16 text-accent mx-auto animate-pulse" />
                    <Heading size="sm">CREATIVITY WITHOUT BOUNDARIES</Heading>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">Protocol Active // 2026</p>
                  </div>
               </div>
            </div>
          </div>
        </Container>
      </SectionWrapper>

      {/* Footer */}
      <footer className="bg-black pt-40 pb-20 border-t border-white/5">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-32">
            <div className="md:col-span-5 space-y-8">
              <Heading size="sm" className="tracking-[0.2em]">GEN-Z COLLECTION</Heading>
              <p className="text-zinc-500 text-lg font-light leading-relaxed max-w-sm">
                Redefining the boundaries between digital art and physical fashion. Engineered for the digital generation.
              </p>
            </div>
            
            <div className="md:col-span-2 space-y-8">
              <Heading size="xs" className="text-accent tracking-widest">Menu</Heading>
              <ul className="space-y-4">
                {['Home', 'Shop', 'Customize', 'Collections'].map(item => (
                  <li key={item}>
                    <a href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-xl font-bold uppercase tracking-tight text-zinc-500 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-5 space-y-8">
               <Heading size="xs" className="text-accent tracking-widest">Newsletter</Heading>
               <p className="text-zinc-500 font-light">Get early access to drops and exclusive custom assets.</p>
               <div className="relative group">
                  <input 
                    type="email" 
                    placeholder="ENTER YOUR EMAIL" 
                    className="w-full bg-transparent border-b-2 border-zinc-800 py-4 font-black uppercase tracking-widest text-sm focus:border-accent outline-none transition-colors"
                  />
                  <div className="absolute right-0 bottom-4 text-accent">
                    <Sparkles className="w-5 h-5" />
                  </div>
               </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-600 gap-8">
            <p>© 2026 GEN-Z COLLECTION. BUILT FOR THE NEXT GENERATION.</p>
            <div className="flex gap-10">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}
