import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WishPix Teacher App | AI Voice-Activated Kiosk",
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
      <body className="min-h-screen w-full bg-[#F2F6FA] text-[#0F253E] font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
