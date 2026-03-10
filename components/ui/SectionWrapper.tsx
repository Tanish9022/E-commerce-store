import React from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  fullHeight?: boolean;
  centered?: boolean;
}

const SectionWrapper = ({
  children,
  className,
  fullHeight = false,
  centered = false,
  ...props
}: SectionWrapperProps) => {
  return (
    <section
      className={cn(
        "relative py-24 md:py-40 px-6",
        fullHeight && "min-h-screen",
        centered && "flex flex-col items-center justify-center text-center",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};

export { SectionWrapper };
