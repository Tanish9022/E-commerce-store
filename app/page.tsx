"use client";

import { Navbar } from "@/components/layout/Navbar";
import { HeroAnimation } from "@/components/animation/HeroAnimation";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        setFeaturedProducts(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="bg-black text-white">
      <Navbar />
      
      {/* Cinematic Hero */}
      <HeroAnimation />

      {/* Feature Section */}
      <SectionWrapper fullHeight centered className="bg-black py-20 md:py-0">
        <Container size="lg" className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
          <div className="text-center lg:text-left space-y-6 md:space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-[8px] md:text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3 md:w-4 h-4" />
              The Future of Streetwear
            </div>
            <Heading size="xl">
              YOUR VISION.<br />
              <span className="text-accent italic">OUR CRAFT.</span>
            </Heading>
            <p className="text-base md:text-xl text-zinc-400 font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
              We&apos;ve combined premium materials with cutting-edge customization. Every thread is a statement. Every print is your identity.
            </p>
            <div className="flex justify-center lg:justify-start gap-6 pt-4">
              <Button size="lg" variant="accent" withArrow onClick={() => window.location.href='/customize'}>
                Start Creating
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-3 md:space-y-4">
              <div className="aspect-square bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center p-4 md:p-8 text-center group hover:border-accent/50 transition-colors">
                <Sparkles className="w-6 h-6 md:w-10 h-10 mb-2 md:mb-4 text-accent group-hover:scale-110 transition-transform" />
                <h3 className="font-bold uppercase tracking-widest text-[10px] md:text-sm">Premium Quality</h3>
              </div>
              <div className="aspect-[3/4] bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-3xl overflow-hidden relative group">
                 <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                    <span className="text-2xl md:text-4xl font-black opacity-10 uppercase italic leading-none">GEN-Z</span>
                 </div>
              </div>
            </div>
            <div className="space-y-3 md:space-y-4 pt-8 md:pt-12">
               <div className="aspect-[3/4] bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-3xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                    <span className="text-2xl md:text-4xl font-black opacity-10 uppercase italic leading-none">DROP 01</span>
                 </div>
               </div>
               <div className="aspect-square bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center p-4 md:p-8 text-center group hover:border-accent/50 transition-colors">
                <Sparkles className="w-6 h-6 md:w-10 h-10 mb-2 md:mb-4 text-accent group-hover:scale-110 transition-transform rotate-45" />
                <h3 className="font-bold uppercase tracking-widest text-[10px] md:text-sm">Global Shipping</h3>
              </div>
            </div>
          </div>
        </Container>
      </SectionWrapper>

      {/* Featured Drops */}
      <SectionWrapper className="bg-zinc-950">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-24">
            <div>
              <Heading size="xs" className="text-accent mb-4 tracking-[0.3em]">Seasonal</Heading>
              <Heading size="lg">Featured Drops</Heading>
            </div>
            <Button 
              variant="ghost" 
              className="border-b-2 border-accent rounded-none pb-2 px-0 hover:bg-transparent" 
              withArrow
              onClick={() => window.location.href = "/shop"}
            >
               Explore All Products
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                category={product.category}
                tag={product.stock < 10 ? "Limited" : ""}
              />
            ))}
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
                {[
                  { name: 'Home', href: '/' },
                  { name: 'Shop', href: '/shop' },
                  { name: 'Customize', href: '/customize' },
                  { name: 'Collections', href: '/collections' }
                ].map(item => (
                  <li key={item.name}>
                    <a href={item.href} className="text-xl font-bold uppercase tracking-tight text-zinc-500 hover:text-white transition-colors">{item.name}</a>
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
