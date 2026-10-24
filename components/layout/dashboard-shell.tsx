"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { TopNavbar } from "@/components/layout/top-navbar";
import { NavigationDrawer } from "@/components/layout/navigation-drawer";
import { KIOSK_INFO } from "@/lib/mock-data";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navParam = searchParams.get("nav");

  const [isMobileManualOpen, setIsMobileManualOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const isMobileDrawerOpen = isMobileManualOpen || navParam === "open";
  const effectiveDesktopSidebarOpen =
    isDesktopSidebarOpen || navParam === "open";

  const handleToggleMenu = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsDesktopSidebarOpen((prev) => !prev);
      if (navParam === "open") {
        router.replace(pathname, { scroll: false });
      }
    } else {
      setIsMobileManualOpen((prev) => !prev);
    }
  };

  const handleCloseMobileDrawer = () => {
    setIsMobileManualOpen(false);
    if (navParam === "open") {
      router.replace(pathname, { scroll: false });
    }
  };

  return (
    <div className="relative flex-1 flex min-h-screen w-full bg-[#F2F6FA] text-[#0F253E]">
      {/* Responsive Navigation: Docked Left Sidebar on Desktop (lg+), Slide-Over Drawer on Mobile/Tablet */}
      <NavigationDrawer
        isOpen={isMobileDrawerOpen}
        isDesktopSidebarOpen={effectiveDesktopSidebarOpen}
        onCloseMobile={handleCloseMobileDrawer}
        kiosk={KIOSK_INFO}
      />

      {/* Right Main Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Educator App Bar */}
        <TopNavbar kiosk={KIOSK_INFO} onOpenMenu={handleToggleMenu} />

        {/* Main Responsive Content Container */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
