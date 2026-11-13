"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Compass,
  Download,
  LogOut,
  Menu,
  MonitorSmartphone,
  Settings,
} from "lucide-react";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import { useOnboardingTour } from "@/components/providers/onboarding-tour-provider";
import { usePwaInstall } from "@/components/providers/pwa-install-provider";
import type { KioskInfo } from "@/types/kiosk";

interface TopNavbarProps {
  kiosk: KioskInfo;
  onOpenMenu: () => void;
  onLogout: () => void;
}

export function TopNavbar({ kiosk, onOpenMenu, onLogout }: TopNavbarProps) {
  const { t } = useAppSettings();
  const { isStandalone, triggerInstall } = usePwaInstall();
  const {
    hasCompletedTour,
    completedPagesCount,
    totalTourPages,
    resetAndReplayTour,
  } = useOnboardingTour();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isProfileOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen]);

  return (
    <header className="sticky top-0 z-30 bg-white px-4 sm:px-6 py-3 border-b border-[#E6EDF5] flex items-center justify-between gap-4">
      {/* Left: Hamburger + WishPix Brand with Blue Dot */}
      <div className="flex items-center gap-2.5">
        <button
          id="tour-nav-trigger"
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

      {/* Right: Tour Guide + Install App Button + Notification Bell + Circular JM Avatar */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          id="tour-replay-button"
          type="button"
          onClick={resetAndReplayTour}
          title={t(
            `Replay interactive page guide (${completedPagesCount}/${totalTourPages} modules explored)`,
            `Ulitin ang interactive na gabay (${completedPagesCount}/${totalTourPages} pahina ang natapos)`
          )}
          className="group relative inline-flex items-center gap-1.5 rounded-full bg-[#0F233A] hover:bg-[#163252] border border-[#38BDF8]/35 px-2.5 sm:px-3 py-1 text-[11px] sm:text-[11.5px] font-bold text-white shadow-[0_2px_10px_rgba(15,35,58,0.16)] transition cursor-pointer active:scale-95"
        >
          <Compass
            className="w-3.5 h-3.5 text-[#38BDF8] stroke-[2.2] group-hover:rotate-45 transition-transform duration-300"
            aria-hidden="true"
          />
          <span>{t("Tour", "Gabay")}</span>
          <span
            aria-hidden="true"
            className={`w-1.5 h-1.5 rounded-full ${
              hasCompletedTour
                ? "bg-[#34D399]"
                : "bg-[#38BDF8] shadow-[0_0_6px_rgba(56,189,248,0.9)]"
            }`}
          />
        </button>

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

        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            aria-expanded={isProfileOpen}
            aria-haspopup="menu"
            aria-label={`Educator profile ${kiosk.educatorInitials}`}
            title={t("Teacher Account Menu", "Menu ng Account ng Guro")}
            className="w-8 h-8 rounded-full bg-[#004E89] hover:bg-[#003E6E] text-white text-[11px] font-bold flex items-center justify-center shadow-xs select-none cursor-pointer transition active:scale-95 ring-2 ring-transparent focus:outline-none focus:ring-[#0077C8]/40"
          >
            {kiosk.educatorInitials}
          </button>

          {isProfileOpen && (
            <div
              role="menu"
              aria-label="Educator account menu"
              className="absolute right-0 mt-2 w-56 rounded-[14px] bg-white border border-[#E2E8F0] shadow-[0_12px_28px_rgba(15,37,62,0.14)] py-2 z-50 text-[#0F253E]"
            >
              <div className="px-3.5 py-2 border-b border-[#F1F5F9]">
                <p className="text-[12.5px] font-extrabold text-[#0F253E] truncate">
                  {kiosk.educatorName || "Jamie"}
                </p>
                <p className="text-[10.5px] font-medium text-[#64748B] truncate mt-0.5">
                  {t("Educator", "Guro")} • {kiosk.roomName}
                </p>
              </div>

              <div className="py-1 px-1.5 space-y-0.5">
                <Link
                  href="/settings"
                  role="menuitem"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-[12px] font-semibold text-[#334E68] hover:bg-[#F2F6FA] hover:text-[#0F253E] transition"
                >
                  <Settings className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
                  <span>{t("Account & Settings", "Account at Mga Setting")}</span>
                </Link>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-[12px] font-bold text-[#DC2626] hover:bg-[#FEF2F2] transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span>{t("Log Out", "Mag-logout")}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
