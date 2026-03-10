"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const frameCount = 32;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Set initial size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    const currentFrame = (index: number) =>
      `/frames/frame_${index}.jpg`;

    const images: HTMLImageElement[] = [];
    const sequence = {
      frame: 1,
    };

    let loadedCount = 0;

    const render = () => {
      const img = images[sequence.frame - 1];
      if (img && img.complete && img.naturalWidth > 0) {
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
    };

    // Preload all images
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) render();
        if (loadedCount === frameCount) setImagesLoaded(true);
      };
      images.push(img);
    }

    // GSAP Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%",
        scrub: 0.5,
        pin: true,
      },
    });

    // Animate frames
    tl.to(sequence, {
      frame: frameCount,
      snap: "frame",
      ease: "none",
      onUpdate: render,
    }, 0);

    // Animate text elements
    if (textRef.current) {
      tl.to(textRef.current, {
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "10% top",
          end: "40% top",
          scrub: true,
        }
      }, 0);
    }

    const handleResize = () => {
      setCanvasSize();
      render();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative h-screen overflow-hidden bg-black">
      {/* Loading Overlay */}
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 w-full h-full object-cover" 
      />
      
      <Container className="h-full">
        <div 
          ref={textRef}
          className="relative h-full flex flex-col items-center justify-center z-10 text-center pointer-events-none"
        >
          <Heading size="2xl" glow className="mb-8">
            KIRO<br /><span className="text-accent italic">GEN-Z</span>
          </Heading>
          
          <p className="text-lg md:text-2xl font-light text-white/50 max-w-2xl tracking-[0.2em] uppercase italic mb-12">
            Elevating streetwear for the digital age.
          </p>
          
          <div className="pointer-events-auto">
            <Button size="xl" variant="accent" withArrow onClick={() => window.location.href='/shop'}>
              The Drop
            </Button>
          </div>
        </div>
      </Container>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 z-10">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-accent animate-pulse" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-accent">Scroll</span>
      </div>
    </div>
  );
};

export { HeroSection };
