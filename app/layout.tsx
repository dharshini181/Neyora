import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/landing/CursorGlow";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"], display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Neyora — AI Tailoring Assistant",
  description:
    "Neyora is an AI-powered tailoring platform for tailors, boutique owners, and fashion designers — measurements, patterns, fabric calculation, and business management in one workspace.",
  metadataBase: new URL("https://neyora.app"),
  openGraph: {
    title: "Neyora — AI Tailoring Assistant",
    description:
      "Manage customers, measurements, production, and business operations in one connected workspace.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="relative bg-background font-sans text-white antialiased">
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
