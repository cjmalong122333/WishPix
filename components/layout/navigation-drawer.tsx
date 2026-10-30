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
import { useAppSettings } from "@/components/providers/app-settings-provider";
import type { KioskInfo, NavIconName } from "@/types/kiosk";

interface NavigationDrawerProps {
  isOpen: boolean;
  isDesktopSidebarOpen: boolean;
  onCloseMobile: () => void;
  kiosk: KioskInfo;
}

const SECTION_TITLE_FILIPINO: Record<string, string> = {
  TEACH: "PAGTUTURO",
  HARDWARE: "KAGAMITAN",
  INSIGHTS: "MGA INSIGHT",
  SYSTEM: "SISTEMA",
};

const NAV_ITEM_FILIPINO: Record<string, string> = {
  dashboard: "Dashboard",
  "session-setup": "Pag-setup ng Sesyon",
  "live-session": "Live na Sesyon",
  moderation: "Moderasyon",
  "print-management": "Pamamahala ng Print",
  "kiosk-management": "Pamamahala ng Kiosk",
  "activity-logs": "Talaan ng Aktibidad",
  analytics: "Pagsusuri (Analytics)",
  reports: "Mga Ulat",
  settings: "Mga Setting",
};

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
          id="tour-sidebar-nav"
          aria-label="Desktop sidebar navigation"
          className="hidden lg:flex w-[265px] xl:w-[280px] shrink-0 min-h-screen bg-[#085081] text-white flex-col justify-between border-r border-white/10 select-none transition-colors duration-200"
        >
          <SidebarContent kiosk={kiosk} />
        </aside>
      )}

      {/* Slide-Over Modal Drawer on Mobile/Tablet (< lg) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <aside className="wishpix-drawer-slide relative z-10 w-[82%] max-w-[290px] h-full bg-[#085081] text-white flex flex-col justify-between shadow-[8px_0_30px_rgba(0,18,36,0.45)] overflow-y-auto select-none transition-colors duration-200">
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
            className="wishpix-backdrop-fade flex-1 bg-[#09192C]/50 backdrop-blur-[1px] cursor-pointer"
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
  const { t } = useAppSettings();

  return (
    <>
      <div>
        {/* Top Brand Header */}
        <div className="px-5 pt-5 pb-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] bg-white text-[#085081] flex items-center justify-center shadow-xs flex-shrink-0">
              <WandSparkles
                className="w-4 h-4 stroke-[2.2]"
                aria-hidden="true"
              />
            </div>
            <span className="text-[17px] font-extrabold tracking-tight text-white">
              WishPix
            </span>
          </div>

          {showCloseButton && onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation drawer"
              className="p-1.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition cursor-pointer lg:hidden"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Connected Kiosk Status Card */}
        <div className="mx-3.5 mt-1 rounded-[12px] bg-[#1D6393] border border-white/15 px-3.5 py-3 flex items-start justify-between gap-2.5 transition-colors duration-200">
          <div className="flex items-start gap-2.5 min-w-0">
            <Monitor
              className="w-4 h-4 text-white/85 stroke-[1.9] mt-1 flex-shrink-0"
              aria-hidden="true"
            />
            <div className="min-w-0 leading-tight">
              <p className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-white/75">
                {t("CONNECTED KIOSK", "KONEKTADONG KIOSK")}
              </p>
              <p className="text-[12.5px] font-bold text-white truncate mt-0.5">
                {kiosk.roomName}
              </p>
              <p className="text-[10.5px] text-white/80 font-medium mt-0.5">
                {kiosk.isOnline
                  ? t("Online", "Online")
                  : t("Offline", "Offline")}
              </p>
            </div>
          </div>

          <span
            className="w-2.5 h-2.5 rounded-full bg-[#34D399] mt-1 flex-shrink-0"
            aria-hidden="true"
          />
        </div>

        {/* Categorized Navigation Links */}
        <nav
          className="mt-5 space-y-4 px-3.5 pb-6"
          aria-label="Educator sections"
        >
          {NAVIGATION_SECTIONS.map((section) => (
            <div key={section.id}>
              <p className="px-2.5 text-[9.5px] font-bold uppercase tracking-[0.15em] text-white/65 mb-1.5">
                {t(
                  section.title,
                  SECTION_TITLE_FILIPINO[section.title] ?? section.title
                )}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href === "/dashboard" && pathname === "/");

                  return (
                    <li key={item.id} className="relative">
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className={`flex items-center justify-between rounded-[10px] px-3 py-2.5 text-[12.5px] transition-all duration-200 ease-out active:scale-[0.98] ${
                          isActive
                            ? "bg-white text-[#085081] font-bold shadow-xs"
                            : "text-white/90 hover:bg-white/10 hover:translate-x-0.5 hover:text-white font-medium"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <NavIcon name={item.icon} isActive={isActive} />
                          <span>
                            {t(
                              item.label,
                              NAV_ITEM_FILIPINO[item.id] ?? item.label
                            )}
                          </span>
                        </span>

                        {item.badge !== undefined && (
                          <span className="w-[19px] h-[19px] rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center leading-none">
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
      <div className="px-4 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#35749F] text-white text-[10.5px] font-bold flex items-center justify-center flex-shrink-0 transition-colors duration-200">
          WP
        </div>
        <div className="leading-tight min-w-0">
          <p className="text-[12px] font-bold text-white truncate">
            {t("WishPix Teacher", "Guro ng WishPix")}
          </p>
          <p className="text-[10px] text-white/70 mt-0.5">
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
    isActive ? "text-[#085081] stroke-[2.2]" : "text-white/75 stroke-[1.85]"
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
