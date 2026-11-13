"use client";

import React, { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { StarLoader } from "@/components/layout/star-loader";
import { PublicNavbar } from "@/components/public/public-navbar";

interface PublicShellProps {
  children: React.ReactNode;
  footerText: string;
}

let hasShownInitialStarLoadInMemory = false;

function PublicShellContent({ children, footerText }: PublicShellProps) {
  const pathname = usePathname();
  const [isLoadingStar, setIsLoadingStar] = useState(
    () => !hasShownInitialStarLoadInMemory
  );

  useEffect(() => {
    if (hasShownInitialStarLoadInMemory) {
      return;
    }

    let alreadyLoaded = false;
    try {
      alreadyLoaded =
        window.sessionStorage.getItem("wishpix_initial_loaded") === "1";
    } catch {
      // Ignore storage errors
    }

    const duration = alreadyLoaded ? 320 : 750;
    const timer = setTimeout(() => {
      hasShownInitialStarLoadInMemory = true;
      try {
        window.sessionStorage.setItem("wishpix_initial_loaded", "1");
      } catch {
        // Ignore storage errors
      }
      setIsLoadingStar(false);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (targetHref: string) => {
    if (targetHref !== pathname) {
      setIsLoadingStar(true);
    }
  };

  if (isLoadingStar) {
    return (
      <StarLoader
        fullScreen
        onClick={() => {
          hasShownInitialStarLoadInMemory = true;
          setIsLoadingStar(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-dvh w-full bg-[#FAF8FF] text-[#231B3B] flex flex-col justify-between overflow-x-hidden selection:bg-[#EDE7FC] selection:text-[#6D48DF]">
      {/* Top Floating Navbar */}
      <PublicNavbar onNavigate={handleNavigate} />

      {/* Main Content Area — Scales fluidly with viewport width & height */}
      <main className="wishpix-page-transition flex-1 w-full max-w-[1200px] 2xl:max-w-[1320px] mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-[clamp(16px,3vh,40px)] flex flex-col justify-center">
        {children}
      </main>

      {/* Bottom Subtle Caption Footer */}
      <footer className="w-full max-w-[1200px] 2xl:max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-[clamp(14px,2.2vh,28px)] pt-1 text-center shrink-0">
        <p className="text-[11.5px] sm:text-[13px] lg:text-[13.5px] font-medium text-[#7A7393]">
          {footerText}
        </p>
      </footer>
    </div>
  );
}

export function PublicShell(props: PublicShellProps) {
  return (
    <Suspense fallback={<StarLoader fullScreen />}>
      <PublicShellContent {...props} />
    </Suspense>
  );
}
