import React from "react";
import { cn } from "@/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "huge";
  glow?: boolean;
}

const Heading = ({
  as: Component = "h2",
  size = "md",
  glow = false,
  className,
  children,
  ...props
}: HeadingProps) => {
  const sizes = {
    xs: "text-[10px] md:text-sm font-black tracking-widest uppercase font-syne",
    sm: "text-lg md:text-xl font-black uppercase tracking-tight font-syne",
    md: "text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-tight font-syne",
    lg: "text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] font-syne",
    xl: "text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] font-syne",
    "2xl": "text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-[-0.04em] leading-[0.8] font-syne",
    huge: "text-8xl md:text-[12rem] lg:text-[20rem] font-black uppercase tracking-[-0.05em] leading-none opacity-5 font-syne",
  };

  return (
    <Component
      className={cn(
        "text-white",
        sizes[size],
        glow && "text-glow",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export { Heading };
