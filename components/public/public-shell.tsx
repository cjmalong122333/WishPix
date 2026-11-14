"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StarLoader } from "@/components/layout/star-loader";
import { usePwaInstall } from "@/components/providers/pwa-install-provider";
import { PublicNavbar } from "@/components/public/public-navbar";
import {
  PublicDisplayProvider,
  RevealOnShow,
} from "@/components/public/reveal-on-show";

interface PublicShellProps {
  children: React.ReactNode;
  footerText: string;
}

export function PublicShell({ children, footerText }: PublicShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isStandalone } = usePwaInstall();

  useEffect(() => {
    if (isStandalone && pathname === "/") {
      router.replace("/login");
    }
  }, [isStandalone, pathname, router]);

  if (isStandalone && pathname === "/") {
    return <StarLoader fullScreen />;
  }

  return (
    <PublicDisplayProvider>
      <div className="min-h-dvh w-full bg-[#FAF8FF] text-[#231B3B] flex flex-col justify-between overflow-x-hidden selection:bg-[#EDE7FC] selection:text-[#6D48DF]">
        {/* Top Floating Navbar */}
        <PublicNavbar />

        {/* Main Content Area — Scales fluidly with viewport width & height */}
        <main
          key={pathname}
          className="flex-1 w-full max-w-[1200px] 2xl:max-w-[1320px] mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-[clamp(16px,3vh,40px)] flex flex-col justify-center"
        >
          {children}
        </main>

        {/* Bottom Subtle Caption Footer */}
        <footer className="w-full max-w-[1200px] 2xl:max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-[clamp(14px,2.2vh,28px)] pt-1 text-center shrink-0">
          <RevealOnShow
            key={`${pathname}-footer`}
            as="p"
            variant="blur-in"
            delayMs={480}
            className="text-[11.5px] sm:text-[13px] lg:text-[13.5px] font-medium text-[#7A7393]"
          >
            {footerText}
          </RevealOnShow>
        </footer>
      </div>
    </PublicDisplayProvider>
  );
}
