"use client";

import React from "react";
import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import type { KioskInfo } from "@/types/kiosk";

interface TopNavbarProps {
  kiosk: KioskInfo;
  onOpenMenu: () => void;
}

export function TopNavbar({ kiosk, onOpenMenu }: TopNavbarProps) {
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

      {/* Right: Notification Bell with Red Dot + Circular JM Avatar */}
      <div className="flex items-center gap-3">
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
