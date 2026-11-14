"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { usePublicDisplay } from "@/components/public/reveal-on-show";
import type { KioskInfo } from "@/types/kiosk";

interface TopNavbarProps {
  kiosk: KioskInfo;
  onOpenMenu: () => void;
  onLogout: () => void;
}

export function TopNavbar({ kiosk, onOpenMenu, onLogout }: TopNavbarProps) {
  const pathname = usePathname();
  const { t } = useAppSettings();
  const { isStandalone, triggerInstall } = usePwaInstall();
  const { triggerDisplayReplay } = usePublicDisplay();
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
    <header className="sticky top-0 z-30 bg-white px-4 sm:px-6 py-3 border-b border-[#EFEAFA] shadow-[0_4px_24px_rgba(109,72,223,0.04)] flex items-center justify-between gap-4">
      {/* Left: Hamburger + WishPix Brand with Violet Dot */}
      <div className="flex items-center gap-2.5">
        <button
          id="tour-nav-trigger"
          type="button"
          onClick={onOpenMenu}
          aria-label="Toggle navigation menu"
          className="p-1.5 -ml-1 rounded-lg text-[#231B3B] hover:bg-[#F5F1FE] active:scale-95 transition cursor-pointer"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
        </button>

        <Link
          href="/dashboard"
          onClick={() => {
            if (pathname === "/dashboard") {
              triggerDisplayReplay();
            }
          }}
          className="inline-flex items-center gap-1 text-[16px] sm:text-[17px] font-extrabold text-[#231B3B] tracking-tight transition-transform duration-300 hover:scale-[1.02]"
        >
          <span>WishPix</span>
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 rounded-full bg-[#6D48DF] inline-block"
          />
        </Link>
      </div>

      {/* Right: Tour Guide + Install App Button + Notification Bell + Circular Avatar */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          id="tour-replay-button"
          type="button"
          onClick={resetAndReplayTour}
          title={t(
            `Replay interactive page guide (${completedPagesCount}/${totalTourPages} modules explored)`,
            `Ulitin ang interactive na gabay (${completedPagesCount}/${totalTourPages} pahina ang natapos)`
          )}
          className="group relative inline-flex items-center gap-1.5 rounded-full bg-[#231B3B] hover:bg-[#312552] border border-[#A78BFA]/35 px-2.5 sm:px-3 py-1 text-[11px] sm:text-[11.5px] font-bold text-white shadow-[0_2px_10px_rgba(35,27,59,0.16)] transition cursor-pointer active:scale-95"
        >
          <Compass
            className="w-3.5 h-3.5 text-[#A78BFA] stroke-[2.2] group-hover:rotate-45 transition-transform duration-300"
            aria-hidden="true"
          />
          <span>{t("Tour", "Gabay")}</span>
          <span
            aria-hidden="true"
            className={`w-1.5 h-1.5 rounded-full ${
              hasCompletedTour
                ? "bg-[#34D399]"
                : "bg-[#A78BFA] shadow-[0_0_6px_rgba(167,139,250,0.9)]"
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
            className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE9FC] hover:bg-[#E2D6FA] border border-[#D5C5F7] px-2.5 sm:px-3 py-1 text-[11px] sm:text-[11.5px] font-bold text-[#6D48DF] transition cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
            <span>{t("Get App", "Kunin ang App")}</span>
          </button>
        )}

        <button
          type="button"
          aria-label={`${kiosk.notificationCount} unread notifications`}
          className="relative p-1.5 rounded-full text-[#4A4168] hover:bg-[#F5F1FE] transition cursor-pointer"
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
            className="w-8 h-8 rounded-full bg-[#6D48DF] hover:bg-[#5B36CA] text-white text-[11px] font-bold flex items-center justify-center shadow-xs select-none cursor-pointer transition active:scale-95 ring-2 ring-transparent focus:outline-none focus:ring-[#6D48DF]/40"
          >
            {kiosk.educatorInitials}
          </button>

          {isProfileOpen && (
            <div
              role="menu"
              aria-label="Educator account menu"
              className="wishpix-reveal-pop-scale absolute right-0 mt-2 w-56 rounded-[16px] bg-white border border-[#F2EEFB] shadow-[0_12px_28px_rgba(109,72,223,0.12)] py-2 z-50 text-[#231B3B]"
            >
              <div className="px-3.5 py-2 border-b border-[#F3EFFC]">
                <p className="text-[12.5px] font-extrabold text-[#231B3B] truncate">
                  {kiosk.educatorName || "Jamie"}
                </p>
                <p className="text-[10.5px] font-medium text-[#766F8E] truncate mt-0.5">
                  {t("Educator", "Guro")} • {kiosk.roomName}
                </p>
              </div>

              <div className="py-1 px-1.5 space-y-0.5">
                <Link
                  href="/settings"
                  role="menuitem"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[12px] font-semibold text-[#4A4168] hover:bg-[#F5F1FE] hover:text-[#6D48DF] transition"
                >
                  <Settings className="w-4 h-4 text-[#766F8E]" aria-hidden="true" />
                  <span>{t("Account & Settings", "Account at Mga Setting")}</span>
                </Link>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[12px] font-bold text-[#DC2626] hover:bg-[#FEF2F2] transition cursor-pointer"
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
