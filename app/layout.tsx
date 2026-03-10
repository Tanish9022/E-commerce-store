import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

export const metadata: Metadata = {
  title: "KIRO | Custom Gen-Z Streetwear",
  description: "The ultimate platform for customizable clothing. Your vision, our fabric.",
};

import { CartSlider } from "@/components/shop/CartSlider";
import { SearchOverlay } from "@/components/layout/SearchOverlay";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${syne.variable} font-sans antialiased bg-black text-white selection:bg-accent selection:text-black`}>
        {children}
        <CartSlider />
        <SearchOverlay />
      </body>
    </html>
  );
}
