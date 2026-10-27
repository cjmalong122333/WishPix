"use client";

import React from "react";
import Link from "next/link";
import { Bell, Download, Menu, MonitorSmartphone } from "lucide-react";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import { usePwaInstall } from "@/components/providers/pwa-install-provider";
import type { KioskInfo } from "@/types/kiosk";

interface TopNavbarProps {
  kiosk: KioskInfo;
  onOpenMenu: () => void;
}

export function TopNavbar({ kiosk, onOpenMenu }: TopNavbarProps) {
  const { t } = useAppSettings();
  const { isStandalone, triggerInstall } = usePwaInstall();

  return (
    <header className="sticky top-0 z-30 bg-white px-4 sm:px-6 py-3 border-b border-[#E6EDF5] flex items-center justify-between gap-4">
      {/* Left: Hamburger + WishPix Brand with Blue Dot */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Toggle navigation menu"
          className="p-1.5 -ml-1 rounded-lg text-[#0F253E] hover:bg-[#F2F6FA] active:scale-95 transition cursor-pointer"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
        </button>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-[16px] sm:text-[17px] font-extrabold text-[#0F253E] tracking-tight"
        >
          <span>WishPix</span>
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full bg-[#0077C8] inline-block"
          />
        </Link>
      </div>

      {/* Right: Install App Button + Notification Bell + Circular JM Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {isStandalone ? (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] text-[11px] font-bold">
            <MonitorSmartphone className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t("App Mode", "App Mode")}</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => triggerInstall()}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#F0F7FF] hover:bg-[#E0EFFE] border border-[#BAE0FD] px-2.5 sm:px-3 py-1 text-[11px] sm:text-[11.5px] font-bold text-[#0066B2] transition cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
            <span>{t("Get App", "Kunin ang App")}</span>
          </button>
        )}

        <button
          type="button"
          aria-label={`${kiosk.notificationCount} unread notifications`}
          className="relative p-1.5 rounded-full text-[#334E68] hover:bg-[#F2F6FA] transition cursor-pointer"
        >
          <Bell className="w-5 h-5 stroke-[1.9]" aria-hidden="true" />
          {kiosk.notificationCount > 0 && (
            <span
              aria-hidden="true"
              className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white"
            />
          )}
        </button>

        <div
          aria-label={`Educator profile ${kiosk.educatorInitials}`}
          className="w-8 h-8 rounded-full bg-[#004E89] text-white text-[11px] font-bold flex items-center justify-center shadow-xs select-none"
        >
          {kiosk.educatorInitials}
        </div>
      </div>
    </header>
  );
}
