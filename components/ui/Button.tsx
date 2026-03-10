"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg" | "xl";
  withArrow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", withArrow, children, ...props }, ref) => {
    const variants = {
      primary: "bg-white text-black hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]",
      secondary: "bg-zinc-900 text-white hover:bg-zinc-800 border border-white/5 hover:border-white/20",
      outline: "bg-transparent border border-white/10 text-white hover:border-white/40 hover:bg-white/5",
      ghost: "bg-transparent text-white hover:bg-white/5",
      accent: "bg-accent text-black hover:bg-accent/80 shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]",
    };

    const sizes = {
      sm: "px-5 py-2.5 text-[10px]",
      md: "px-7 py-3.5 text-xs",
      lg: "px-10 py-4.5 text-sm",
      xl: "px-14 py-7 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-black uppercase tracking-[0.2em] transition-all duration-500 ease-apple transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none group",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
        {withArrow && (
          <ArrowRight className="ml-3 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
