import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { ThemeProvider } from "@/components/theme-provider";
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
      <body>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <Providers>
          
          {children}</Providers>
          </ThemeProvider>
      </body>
    </html>
  );
}
