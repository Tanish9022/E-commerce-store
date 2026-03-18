"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { ImageGallery } from "@/components/shop/ImageGallery";
import { SizeSelector } from "@/components/shop/SizeSelector";
import { useCartStore } from "@/store/useCartStore";
import { Sparkles, ShoppingBag, Paintbrush } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("M");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
        } else {
          router.push("/shop");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: 1,
    });
  };

  const goToCustomize = () => {
    if (!product) return;
    router.push(`/customize?productId=${product.id}`);
  };

  if (loading) {
    return (
      <main className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="pt-32 pb-40">
          <Container>
            <div className="animate-pulse flex flex-col lg:flex-row gap-20">
              <div className="flex-1 aspect-square bg-zinc-900 rounded-[2rem]" />
              <div className="flex-1 space-y-8">
                <div className="h-8 bg-zinc-900 rounded w-1/2" />
                <div className="h-4 bg-zinc-900 rounded w-1/4" />
                <div className="h-20 bg-zinc-900 rounded" />
              </div>
            </div>
          </Container>
        </div>
      </main>
    );
  }

  if (!product) return null;

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="pt-32 pb-40">
        <Container>
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Left: Cinematic Gallery */}
            <div className="flex-1">
              <ImageGallery images={product.images || []} />
            </div>

            {/* Right: Product Info */}
            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-accent font-black uppercase tracking-[0.4em] text-[10px]">
                  <Sparkles className="w-4 h-4" />
                  {product.category} / Limited Drop
                </div>
                <Heading size="lg">{product.name}</Heading>
                <p className="text-3xl font-light text-accent">{formatCurrency(product.price)}</p>
              </div>

              <p className="text-zinc-500 text-lg font-light leading-relaxed">
                {product.description}
              </p>

              <div className="space-y-10 pt-6 border-t border-white/5">
                <SizeSelector 
                  sizes={product.sizes || ["S", "M", "L", "XL"]} 
                  selectedSize={selectedSize} 
                  onSelect={setSelectedSize} 
                />

                <div className="flex flex-col gap-4">
                  <Button 
                    variant="accent" 
                    size="xl" 
                    className="w-full"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="w-5 h-5 mr-3" />
                    Add to Cart — {formatCurrency(product.price)}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="xl" 
                    className="w-full"
                    onClick={goToCustomize}
                  >
                    <Paintbrush className="w-5 h-5 mr-3" />
                    Customize This Design
                  </Button>
                </div>
              </div>

              {/* Product Specs */}
              <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                <div className="space-y-2">
                  <p className="text-white/40">Composition</p>
                  <p>100% Premium Cotton</p>
                </div>
                <div className="space-y-2">
                  <p className="text-white/40">Weight</p>
                  <p>450 GSM Heavyweight</p>
                </div>
                <div className="space-y-2">
                  <p className="text-white/40">Origin</p>
                  <p>Cyber Studio / Designed in JP</p>
                </div>
                <div className="space-y-2">
                  <p className="text-white/40">Shipping</p>
                  <p>2-4 Business Days</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}
