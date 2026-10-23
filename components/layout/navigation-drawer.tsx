"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart2,
  FileText,
  History,
  LayoutGrid,
  Monitor,
  Printer,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  WandSparkles,
  X,
} from "lucide-react";
import { NAVIGATION_SECTIONS } from "@/config/navigation";
import type { KioskInfo, NavIconName } from "@/types/kiosk";

interface NavigationDrawerProps {
  isOpen: boolean;
  isDesktopSidebarOpen: boolean;
  onCloseMobile: () => void;
  kiosk: KioskInfo;
}

export function NavigationDrawer({
  isOpen,
  isDesktopSidebarOpen,
  onCloseMobile,
  kiosk,
}: NavigationDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseMobile();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCloseMobile]);

  return (
    <>
      {/* Persistent Docked Left Sidebar on Desktop (lg+) */}
      {isDesktopSidebarOpen && (
        <aside
          aria-label="Desktop sidebar navigation"
          className="hidden lg:flex w-[275px] xl:w-[290px] shrink-0 min-h-screen bg-[#004E82] text-white flex-col justify-between border-r border-[#003E68] select-none"
        >
          <SidebarContent kiosk={kiosk} />
        </aside>
      )}

      {/* Slide-Over Modal Drawer on Mobile/Tablet (< lg) or when explicitly opened via ?nav=open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <aside className="relative z-10 w-[80%] max-w-[300px] h-full bg-[#004E82] text-white flex flex-col justify-between shadow-[8px_0_30px_rgba(0,25,45,0.4)] overflow-y-auto">
            <SidebarContent
              kiosk={kiosk}
              onNavigate={onCloseMobile}
              showCloseButton
              onClose={onCloseMobile}
            />
          </aside>

          {/* Translucent Right Backdrop */}
          <div
            onClick={onCloseMobile}
            aria-hidden="true"
            className="flex-1 bg-[#10253A]/45 backdrop-blur-[1px] cursor-pointer"
          />
        </div>
      )}
    </>
  );
}

function SidebarContent({
  kiosk,
  onNavigate,
  showCloseButton,
  onClose,
}: {
  kiosk: KioskInfo;
  onNavigate?: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div>
        {/* Top Brand Header */}
        <div className="px-5 pt-5 pb-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-white text-[#004E82] flex items-center justify-center shadow-xs flex-shrink-0">
              <WandSparkles
                className="w-5 h-5 stroke-[2.2]"
                aria-hidden="true"
              />
            </div>
            <span className="text-[18px] font-bold tracking-tight text-white">
              WishPix
            </span>
          </div>

          {showCloseButton && onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation drawer"
              className="p-1.5 rounded-lg text-sky-200 hover:bg-white/10 hover:text-white transition cursor-pointer lg:hidden"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Connected Kiosk Status Card */}
        <div className="mx-3.5 mt-1 rounded-[13px] bg-[#165F91] border border-[#2C78AA] px-3.5 py-3 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-[10px] bg-[#2970A0] flex items-center justify-center flex-shrink-0">
              <Monitor
                className="w-4 h-4 text-white/90 stroke-[1.85]"
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-[8.5px] font-semibold uppercase tracking-[0.12em] text-[#9BC6E6]">
                CONNECTED KIOSK
              </p>
              <p className="text-[12.5px] font-bold text-white truncate mt-0.5">
                {kiosk.roomName}
              </p>
              <p className="text-[10px] text-[#B3D6F0] mt-0.5">
                {kiosk.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          <span
            className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] flex-shrink-0"
            aria-hidden="true"
          />
        </div>

        {/* Categorized Navigation Links */}
        <nav
          className="mt-5 space-y-5 px-3.5 pb-6"
          aria-label="Educator sections"
        >
          {NAVIGATION_SECTIONS.map((section) => (
            <div key={section.id}>
              <p className="px-2.5 text-[9.5px] font-semibold uppercase tracking-[0.15em] text-[#8AB8DA] mb-1.5">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href === "/dashboard" && pathname === "/");

                  return (
                    <li key={item.id} className="relative">
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-[3.5px] h-5 rounded-r-full bg-[#38BDF8]"
                        />
                      )}
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={`flex items-center justify-between rounded-[11px] px-3.5 py-2.5 text-[12.5px] transition ${
                          isActive
                            ? "bg-white text-[#004E82] font-bold shadow-xs"
                            : "text-[#D4E7F7] hover:bg-white/10 hover:text-white font-normal"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <NavIcon name={item.icon} isActive={isActive} />
                          <span>{item.label}</span>
                        </span>

                        {item.badge !== undefined && (
                          <span className="w-[19px] h-[19px] rounded-full bg-[#F87171] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Teacher / System Version Footer */}
      <div className="border-t border-white/15 px-4 py-4 flex items-center gap-3 bg-[#00497A]">
        <div className="w-9 h-9 rounded-full bg-[#1E6798] border border-white/15 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
          WP
        </div>
        <div className="leading-tight min-w-0">
          <p className="text-[12px] font-bold text-white truncate">
            WishPix Teacher
          </p>
          <p className="text-[10px] text-[#8AB8DA] mt-0.5">
            {kiosk.systemVersion}
          </p>
        </div>
      </div>
    </>
  );
}

function NavIcon({
  name,
  isActive,
}: {
  name: NavIconName;
  isActive: boolean;
}) {
  const className = `w-4 h-4 flex-shrink-0 ${
    isActive ? "text-[#004E82] stroke-[2.2]" : "text-[#9EC7E6] stroke-[1.75]"
  }`;

  switch (name) {
    case "dashboard":
      return <LayoutGrid className={className} aria-hidden="true" />;
    case "session-setup":
      return <SlidersHorizontal className={className} aria-hidden="true" />;
    case "live-session":
      return <Activity className={className} aria-hidden="true" />;
    case "moderation":
      return <ShieldCheck className={className} aria-hidden="true" />;
    case "print-management":
      return <Printer className={className} aria-hidden="true" />;
    case "kiosk-management":
      return <Monitor className={className} aria-hidden="true" />;
    case "activity-logs":
      return <History className={className} aria-hidden="true" />;
    case "analytics":
      return <BarChart2 className={className} aria-hidden="true" />;
    case "reports":
      return <FileText className={className} aria-hidden="true" />;
    case "settings":
      return <Settings className={className} aria-hidden="true" />;
  }
}
