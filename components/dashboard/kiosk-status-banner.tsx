"use client";

import React, { useState } from "react";
import { Volume2 } from "lucide-react";
import { KIOSK_STATUS_PILLS } from "@/lib/mock-data";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import type { KioskHardwareStatus, KioskInfo } from "@/types/kiosk";

interface KioskStatusBannerProps {
  kiosk: KioskInfo;
}

export function KioskStatusBanner({ kiosk }: KioskStatusBannerProps) {
  const { t } = useAppSettings();
  const [activeStatus, setActiveStatus] =
    useState<KioskHardwareStatus>("online");

  const currentPill =
    KIOSK_STATUS_PILLS.find((p) => p.id === activeStatus) ??
    KIOSK_STATUS_PILLS[0];

  return (
    <section
      id="tour-kiosk-status"
      aria-label="Kiosk Status"
      className="relative overflow-hidden w-full rounded-[18px] bg-[#0F233A] px-4 sm:px-5 py-4 sm:py-5 text-white shadow-[0_8px_24px_rgba(15,35,58,0.18)] transition-colors duration-200"
    >
      {/* Subtle Blue Radial Glow in Bottom-Right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-8 w-44 h-44 rounded-full bg-[#0284C7]/25 blur-2xl"
      />

      {/* Top Row: Megaphone + Room Label & Online Pill */}
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Volume2
            className="w-4 h-4 text-[#38BDF8] stroke-[2] flex-shrink-0"
            aria-hidden="true"
          />
          <p className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.12em] text-[#CBD5E1] uppercase truncate">
            {t("KIOSK STATUS", "STATUS NG KIOSK")} •{" "}
            {kiosk.roomName.toUpperCase()}
          </p>
        </div>

        {/* Status Pill Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#113934] border border-[#22C55E]/35 px-2.5 py-0.5 text-[10px] font-semibold text-[#4ADE80] flex-shrink-0">
          <span
            className={`w-1.5 h-1.5 rounded-full ${currentPill.dotColor}`}
            aria-hidden="true"
          />
          <span>{currentPill.label}</span>
        </span>
      </div>

      {/* Main Heading & Description */}
      <div className="relative mt-2.5">
        <h2 className="text-[16px] sm:text-[18px] font-extrabold tracking-wide text-white uppercase leading-snug">
          {t(kiosk.statusHeading, "NAGHIHINTAY SA GURO")}
        </h2>
        <p className="text-[11px] sm:text-[11.5px] text-[#94A8BE] mt-1 leading-relaxed max-w-md">
          {t(
            kiosk.statusDescription,
            "Walang aktibidad na tumatakbo. Piliin kung ano ang susunod na gagawin ng mga bata."
          )}
        </p>
      </div>

      {/* 5 Hardware Status Pills Row */}
      <div
        id="tour-hardware-pills"
        className="relative mt-3.5 flex flex-wrap items-center gap-1.5"
      >
        {KIOSK_STATUS_PILLS.map((pill) => {
          const isSelected = pill.id === activeStatus;
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => setActiveStatus(pill.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium transition cursor-pointer ${
                isSelected
                  ? "bg-white/20 border border-white/40 text-white shadow-xs"
                  : "bg-black/20 border border-white/10 text-white/75 hover:text-white"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${pill.dotColor}`}
                aria-hidden="true"
              />
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
