"use client";

import React from "react";
import { Bell, Menu } from "lucide-react";
import type { KioskInfo } from "@/types/kiosk";

interface TopNavbarProps {
  kiosk: KioskInfo;
  onOpenMenu: () => void;
}

export function TopNavbar({ kiosk, onOpenMenu }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 border-b border-[#E5EFF9] flex items-center justify-between gap-4 shadow-[0_2px_10px_rgba(3,70,119,0.03)]">
      {/* Left: Hamburger + Welcome Text */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Toggle navigation menu"
          className="p-2 -ml-1 rounded-xl text-[#005288] hover:bg-[#EFF6FC] active:scale-95 transition cursor-pointer flex-shrink-0"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.25]" aria-hidden="true" />
        </button>

        <div className="min-w-0">
          <h1 className="text-[15.5px] sm:text-[18px] lg:text-[20px] font-bold text-[#143350] tracking-tight truncate leading-snug">
            Welcome Back, {kiosk.educatorName}
          </h1>
          <p className="text-[10.5px] sm:text-[12px] text-[#5B82A6] truncate leading-tight">
            Here&apos;s what&apos;s happening at your kiosk today.
          </p>
        </div>
      </div>

      {/* Right: Notification Bell & Educator Initials Badge */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
        <button
          type="button"
          aria-label={`${kiosk.notificationCount} unread notifications`}
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-[11px] bg-[#F2F7FC] border border-[#DCE8F5] hover:bg-[#E6F0FA] flex items-center justify-center text-[#3B5977] transition cursor-pointer"
        >
          <Bell className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[1.85]" aria-hidden="true" />
          {kiosk.notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-xs">
              {kiosk.notificationCount}
            </span>
          )}
        </button>

        <div
          aria-label={`Educator profile ${kiosk.educatorInitials}`}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-[11px] bg-[#D6E8FA] text-[#004A7C] text-[11.5px] sm:text-[12.5px] font-bold flex items-center justify-center select-none"
        >
          {kiosk.educatorInitials}
        </div>
      </div>
    </header>
  );
}
