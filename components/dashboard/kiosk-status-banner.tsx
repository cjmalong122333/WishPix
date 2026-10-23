import React from "react";
import { Monitor } from "lucide-react";
import type { KioskInfo } from "@/types/kiosk";

interface KioskStatusBannerProps {
  kiosk: KioskInfo;
}

export function KioskStatusBanner({ kiosk }: KioskStatusBannerProps) {
  return (
    <section
      aria-label="Kiosk Status"
      className="w-full rounded-[16px] sm:rounded-[20px] bg-gradient-to-br from-[#035388] via-[#014573] to-[#00385F] px-4 sm:px-6 lg:px-7 py-4 sm:py-5 lg:py-6 text-white shadow-[0_8px_22px_rgba(0,56,95,0.22)]"
    >
      <p className="text-[9.5px] sm:text-[10.5px] font-semibold tracking-[0.15em] text-[#B4D4EE] uppercase">
        KIOSK STATUS • {kiosk.roomName.toUpperCase()}
      </p>

      <div className="mt-2.5 sm:mt-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          {/* Frosted Glass Monitor Icon Box */}
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-[12px] sm:rounded-[14px] bg-[#2D709E]/80 border border-white/25 shadow-[0_4px_10px_rgba(0,0,0,0.12)] flex items-center justify-center flex-shrink-0">
            <Monitor
              className="w-5 h-5 sm:w-6 sm:h-6 text-white/95 stroke-[1.75]"
              aria-hidden="true"
            />
          </div>

          {/* Status Text */}
          <h2 className="text-[18px] sm:text-[22px] lg:text-[25px] font-normal tracking-wide leading-[1.2] text-white uppercase">
            WAITING FOR{" "}
            <br className="sm:hidden" />
            TEACHER
          </h2>
        </div>

        {/* Online Pill */}
        <div className="rounded-[10px] sm:rounded-[12px] bg-white border-[1.5px] border-[#22C55E] px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 shadow-xs flex-shrink-0">
          <span
            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#16A34A]"
            aria-hidden="true"
          />
          <span className="text-[11px] sm:text-[12.5px] font-bold text-[#15803D]">
            {kiosk.isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>
    </section>
  );
}
