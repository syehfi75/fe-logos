import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { Suspense } from "react";
import Providers from "./providers";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar/navbar";
import FullPageLoader from "@/components/FullPageLoader";

const grostek = localFont({
  src: "./fonts/Grostek-vf.ttf",
  variable: "--font-grostek",
  display: "swap",
  preload: true,
});

const grostekItalic = localFont({
  src: "./fonts/Grostek-italic-vf.ttf",
  variable: "--font-italic-grostek",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "SEFT Learning - One Platform. Many Life Solutions.",
  description:
    "Begin your healing and growth journey today. Release inner blocks and resolve life challenges with SEFT.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${grostek.variable} ${grostekItalic.variable} antialiased`}
      >
        <Suspense>
          <Providers>
            <FullPageLoader />
            <Navbar />
            {children}
            <Toaster position="top-center" closeButton richColors />
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
