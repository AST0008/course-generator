import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

const lexend = Lexend({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coursely",
  description: "AI powered course generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          lexend.className,
          "min-h-screen bg-background text-foreground"
        )}
      >
        
        <Navbar />
        {children}
    
      </body>
    </html>
  );
}
