import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { PrototypeScreenSwitcher } from "@/components/layout/prototype-screen-switcher";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WishPix Educator Admin | AI Voice-Activated Kiosk",
  description:
    "WishPix: An AI-Powered Voice-Activated Generative Learning and Thermal Sticker Printing Kiosk for Early Childhood Education Centers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen w-full bg-[#CFE2F6] text-[#143350] font-sans flex flex-col">
        {children}

        {/* Floating Quick-Navigator for all 5 Design Mockups */}
        <Suspense fallback={null}>
          <PrototypeScreenSwitcher />
        </Suspense>
      </body>
    </html>
  );
}
