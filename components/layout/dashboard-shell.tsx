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
      setIsMobileManualOpen(true);
    }
  };

  const handleCloseMobileDrawer = () => {
    setIsMobileManualOpen(false);
    if (navParam === "open") {
      router.replace(pathname, { scroll: false });
    }
  };

  return (
    <div className="relative flex-1 flex min-h-screen w-full bg-[#CFE2F6]">
      {/* Responsive Sidebar (Docked on Desktop lg+, Slide-Over Drawer on Mobile/Tablet) */}
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

        {/* Main Dashboard Scrollable Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
