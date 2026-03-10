"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const frameCount = 32;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Set initial size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
        if (loadedCount === 1) render(); // Render first frame as soon as it's ready
        if (loadedCount === frameCount) setImagesLoaded(true);
      };
      img.onerror = () => {
        console.error(`Failed to load frame: ${currentFrame(i)}`);
      };
      images.push(img);
    }

    // GSAP Scroll Animation
    const anim = gsap.to(sequence, {
      frame: frameCount,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%",
        scrub: 0.5,
        pin: true,
        onUpdate: (self) => {
           // Force render on scroll progress
           render();
        }
      },
      onUpdate: render,
    });

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    window.addEventListener("resize", handleResize);

    // Initial render attempt in case images are already cached
    if (images[0].complete) render();

    return () => {
      window.removeEventListener("resize", handleResize);
      anim.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative h-screen overflow-hidden bg-black">
      {/* Fallback while loading (optional) */}
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 w-full h-full object-cover" 
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center pointer-events-none px-4">
        <h1 className="text-6xl md:text-[10rem] font-black uppercase tracking-[-0.04em] leading-[0.85] mb-8 text-white text-glow">
          KIRO<br /><span className="text-accent">GEN-Z</span>
        </h1>
        <p className="text-lg md:text-2xl font-light text-white/50 max-w-2xl tracking-wide uppercase italic">
          Elevating streetwear for the digital age.
        </p>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 z-10">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-accent animate-pulse" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Scroll</span>
      </div>
    </div>
  );
};

export default HeroAnimation;
