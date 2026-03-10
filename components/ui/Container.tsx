import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const Container = ({ className, size = "lg", ...props }: ContainerProps) => {
  const sizes = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-[1440px]",
    full: "max-w-full",
  };

  return (
    <div
      className={cn("mx-auto px-6 md:px-10 w-full", sizes[size], className)}
      {...props}
    />
  );
};

export { Container };
