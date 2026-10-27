import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppSettingsProvider } from "@/components/providers/app-settings-provider";
import { PwaInstallProvider } from "@/components/providers/pwa-install-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0F253E",
};

export const metadata: Metadata = {
  title: "WishPix Teacher App | AI Voice-Activated Kiosk",
  description:
    "WishPix: An AI-Powered Voice-Activated Generative Learning and Thermal Sticker Printing Kiosk for Early Childhood Education Centers.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WishPix",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="deep-blue"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col transition-colors duration-200">
        <AppSettingsProvider>
          <PwaInstallProvider>{children}</PwaInstallProvider>
        </AppSettingsProvider>
      </body>
    </html>
  );
}
