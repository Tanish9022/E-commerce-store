"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";

gsap.registerPlugin(ScrollTrigger);

interface HeroAnimationProps {
  frameCount?: number;
  priorityFrames?: number;
}

const HeroAnimation = ({ 
  frameCount = 32, 
  priorityFrames = 15 
}: HeroAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const scrollData = useRef({ frame: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.scale(dpr, dpr);
    };
    
    setCanvasSize();

    const getFramePath = (index: number) => `/frames/frame_${index}.jpg`;

    const renderFrame = (index: number) => {
      const img = imagesRef.current[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const canvasW = window.innerWidth;
      const canvasH = window.innerHeight;
      
      const scale = Math.max(canvasW / img.naturalWidth, canvasH / img.naturalHeight);
      const x = (canvasW / 2) - (img.naturalWidth / 2) * scale;
      const y = (canvasH / 2) - (img.naturalHeight / 2) * scale;
      
      context.clearRect(0, 0, canvasW, canvasH);
      context.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
    };

    const loadImages = async () => {
      const priorityPromises = [];

      // 1. Load priority frames
      for (let i = 1; i <= Math.min(priorityFrames, frameCount); i++) {
        const img = new Image();
        img.src = getFramePath(i);
        imagesRef.current[i - 1] = img;
        priorityPromises.push(new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        }));
      }

      await Promise.all(priorityPromises);
      setIsLoaded(true);
      renderFrame(0);

      // 2. Load remaining frames sequentially to avoid network congestion
      const loadRemaining = async () => {
        for (let i = priorityFrames + 1; i <= frameCount; i++) {
          await new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = getFramePath(i);
            imagesRef.current[i - 1] = img;
          });
        }
      };
      loadRemaining();
    };

    loadImages();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%",
        scrub: 0.5,
        pin: true,
        invalidateOnRefresh: true,
      },
    });

    tl.to(scrollData.current, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      onUpdate: () => renderFrame(scrollData.current.frame),
    }, 0);

    if (contentRef.current) {
      tl.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        ease: "power2.inOut",
      }, 0);
    }

    const handleResize = debounce(() => {
      setCanvasSize();
      renderFrame(scrollData.current.frame);
    }, 150);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
      handleResize.cancel();
    };
  }, [frameCount, priorityFrames]);

  return (
    <div ref={sectionRef} className="relative h-screen bg-black overflow-hidden select-none">
      <div className={cn(
        "absolute inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-1000",
        isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
      )}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/50">Initialising GenZ Collection</span>
        </div>
      </div>

      <canvas 
        ref={canvasRef} 
        style={{ imageRendering: 'crisp-edges' }}
        className={cn(
          "absolute inset-0 z-0 transition-opacity duration-1000",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />

      <Container className="relative h-full z-10 flex flex-col items-center justify-center">
        <div 
          ref={contentRef}
          className="flex flex-col items-center text-center pointer-events-none"
        >
          <div className="mb-6 overflow-hidden">
            <span className="inline-block text-accent font-black uppercase tracking-[0.6em] text-[10px] animate-pulse">
              Drop 01
            </span>
          </div>
          
          <Heading size="xl" className="mb-4 md:mb-8 tracking-[-0.05em] leading-[0.8] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            GEN-Z<br />
            <span className="text-accent italic drop-shadow-[0_0_20px_rgba(57,255,20,0.3)]">COLLECTION.</span>
          </Heading>

          <p className="text-sm md:text-xl text-zinc-500 font-light max-w-[280px] md:max-w-lg mb-8 md:mb-12 uppercase tracking-[0.2em] md:tracking-[0.3em] italic">
            Engineered for the digital generation
          </p>

          <div className="pointer-events-auto">
            <Button 
              size="lg" 
              variant="accent" 
              withArrow 
              className="md:hidden"
              onClick={() => window.location.href='/shop'}
            >
              Shop
            </Button>
            <Button 
              size="xl" 
              variant="accent" 
              withArrow 
              className="hidden md:flex"
              onClick={() => window.location.href='/shop'}
            >
              Shop the Collection
            </Button>
          </div>
        </div>
      </Container>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 opacity-40">
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent animate-bounce" />
        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white">Scroll to Rotate</span>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-[1]" />
    </div>
  );
};

export { HeroAnimation };
