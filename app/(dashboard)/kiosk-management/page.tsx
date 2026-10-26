"use client";

import React, { useState } from "react";
import {
  FileWarning,
  Monitor,
  Moon,
  Power,
  Printer,
  RotateCcw,
  Sun,
  Thermometer,
  Volume2,
  Wifi,
} from "lucide-react";
import { KIOSK_CONTROLS, KIOSK_INFO } from "@/lib/mock-data";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import type { KioskControlItem } from "@/types/kiosk";

export default function KioskManagementPage() {
  const { t, volume } = useAppSettings();
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [controlFeedback, setControlFeedback] = useState<string | null>(null);
  const [kioskPowerState, setKioskPowerState] = useState<
    "Online" | "Sleeping" | "Restarting" | "Offline"
  >("Online");

  const handleRunDiagnostics = () => {
    setIsRunningDiagnostics(true);
    setTimeout(() => {
      setIsRunningDiagnostics(false);
      setControlFeedback("Live diagnostics completed: All sensors healthy.");
      setTimeout(() => setControlFeedback(null), 3000);
    }, 900);
  };

  const handleControlAction = (control: KioskControlItem) => {
    if (control.id === "restart") setKioskPowerState("Restarting");
    if (control.id === "shutdown") setKioskPowerState("Offline");
    if (control.id === "sleep") setKioskPowerState("Sleeping");
    if (control.id === "wakeup") setKioskPowerState("Online");

    setControlFeedback(
      `${control.title} command sent to ${KIOSK_INFO.roomName}.`
    );
    setTimeout(() => {
      if (control.id === "restart") setKioskPowerState("Online");
      setControlFeedback(null);
    }, 2500);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Top White Hardware Header Card */}
      <section className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]">
        <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#0077C8]">
          <Monitor className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
          <span>{t("HARDWARE", "KAGAMITAN")}</span>
        </div>
        <h1 className="text-[18px] sm:text-[22px] lg:text-[24px] font-extrabold text-[#0F253E] tracking-tight mt-1">
          {t("Kiosk Management", "Pamamahala ng Kiosk")}
        </h1>
        <p className="text-[11px] sm:text-[12.5px] text-[#64748B] mt-0.5">
          {t(
            "Check hardware health and control the kiosk.",
            "Suriin ang kalagayan ng hardware at kontrolin ang kiosk."
          )}
        </p>
      </section>

      {/* Dark Navy Registered Kiosk Banner */}
      <section
        aria-label="Registered Kiosk"
        className="relative overflow-hidden rounded-[16px] bg-[#0F233A] px-4 sm:px-5 py-4 sm:py-5 text-white flex items-start justify-between gap-3 shadow-[0_8px_24px_rgba(15,35,58,0.16)] transition-colors duration-200"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -right-8 w-40 h-40 rounded-full bg-[#0284C7]/20 blur-2xl"
        />
        <div className="relative min-w-0">
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] text-white/75">
            {t("REGISTERED KIOSK", "REHISTRADONG KIOSK")}
          </p>
          <h2 className="text-[15px] sm:text-[18px] font-extrabold text-white mt-0.5">
            {KIOSK_INFO.roomName}
          </h2>
          <p className="text-[10.5px] sm:text-[12px] text-white/75 mt-0.5">
            Firmware {KIOSK_INFO.firmwareVersion ?? "2.4.1"} • Local network{" "}
            {KIOSK_INFO.ipAddress ?? "192.168.1.42"}
          </p>
        </div>

        <span className="relative inline-flex items-center gap-1.5 rounded-full bg-[#113934] border border-[#22C55E]/35 px-3 py-1 text-[10px] sm:text-[11px] font-bold text-[#4ADE80] flex-shrink-0">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"
            aria-hidden="true"
          />
          <span>{kioskPowerState}</span>
        </span>
      </section>

      {controlFeedback && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-[12px] bg-[#E6F2FF] border border-[#B9DCFF] px-4 py-2.5 text-[11.5px] sm:text-[12.5px] font-semibold text-[#005A9C]"
        >
          {controlFeedback}
        </div>
      )}

      {/* Health Monitoring Section */}
      <section aria-labelledby="health-monitoring-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            id="health-monitoring-heading"
            className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-[0.08em] text-[#64748B]"
          >
            {t("HEALTH MONITORING", "PAGSUBAYBAY SA HARDWARE")}
          </h2>

          <button
            type="button"
            onClick={handleRunDiagnostics}
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold text-[#0077C8] hover:underline cursor-pointer"
          >
            <RotateCcw
              className={`w-3.5 h-3.5 ${
                isRunningDiagnostics ? "animate-spin" : ""
              }`}
              aria-hidden="true"
            />
            <span>{t("Live Diagnostics", "Live na Diyagnostiko")}</span>
          </button>
        </div>

        {/* 5 Health Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-3.5">
          {/* 1. Printer */}
          <article className="rounded-[15px] bg-white border border-[#E6EDF5] p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-[0_2px_8px_rgba(15,37,62,0.02)]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#EBF5FF] text-[#0077C8] flex items-center justify-center flex-shrink-0">
                <Printer className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[12px] sm:text-[13px] font-bold text-[#0F253E]">
                  Printer
                </h3>
                <p className="text-[10.5px] sm:text-[11.5px] text-[#64748B] truncate mt-0.5">
                  Connection: USB - Connected
                </p>
              </div>
            </div>

            <span className="rounded-full bg-[#DCFCE7] border border-[#BBF7D0] px-3 py-1 text-[10px] sm:text-[11px] font-bold text-[#15803D] flex-shrink-0">
              {t("Ready", "Handa")}
            </span>
          </article>

          {/* 2. Temperature */}
          <article className="rounded-[15px] bg-white border border-[#E6EDF5] p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-[0_2px_8px_rgba(15,37,62,0.02)]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#EBF5FF] text-[#0077C8] flex items-center justify-center flex-shrink-0">
                <Thermometer className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[12px] sm:text-[13px] font-bold text-[#0F253E]">
                  {t("Temperature", "Temperatura")}
                </h3>
                <p className="text-[10.5px] sm:text-[11.5px] text-[#64748B] truncate mt-0.5">
                  {t("Internal sensor", "Panloob na sensor")}
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-[12px] sm:text-[13px] font-extrabold text-[#0F253E]">
                41 °C
              </p>
              <p className="text-[9.5px] sm:text-[10.5px] font-bold text-[#16A34A] mt-0.5">
                Normal
              </p>
            </div>
          </article>

          {/* 3. Paper Status */}
          <article className="lg:col-span-2 rounded-[15px] bg-[#FFFDF5] border border-[#FDE68A] p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(217,119,6,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#FEF3C7] text-[#B45309] flex items-center justify-center flex-shrink-0">
                  <FileWarning className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[12px] sm:text-[13px] font-bold text-[#0F253E]">
                    {t("Paper Status", "Status ng Papel")}
                  </h3>
                  <p className="text-[10.5px] sm:text-[11.5px] font-medium text-[#B45309] mt-0.5">
                    {t("Tray level: 18%", "Antas ng tray: 18%")}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-[#FEF3C7] border border-[#FDE68A] px-3 py-1 text-[10px] sm:text-[11px] font-bold text-[#B45309] flex-shrink-0">
                {t("Low - refill soon", "Mababa - dagdagan agad")}
              </span>
            </div>

            <div
              role="progressbar"
              aria-valuenow={18}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Paper tray level"
              className="mt-3 h-1.5 w-full rounded-full bg-[#E2E8F0] overflow-hidden"
            >
              <div className="h-full w-[18%] rounded-full bg-[#F59E0B]" />
            </div>
          </article>

          {/* 4. Audio (reflects live volume setting) */}
          <article className="rounded-[15px] bg-white border border-[#E6EDF5] p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-[0_2px_8px_rgba(15,37,62,0.02)]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#EBF5FF] text-[#0077C8] flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[12px] sm:text-[13px] font-bold text-[#0F253E]">
                  Audio
                </h3>
                <p className="text-[10.5px] sm:text-[11.5px] text-[#64748B] truncate mt-0.5">
                  {t("Microphone: Active", "Mikropono: Aktibo")}
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-[12px] sm:text-[13px] font-extrabold text-[#0F253E]">
                {t(`Active - ${volume}%`, `Aktibo - ${volume}%`)}
              </p>
              <p className="text-[9.5px] sm:text-[10.5px] text-[#94A3B8] mt-0.5">
                {t("Speaker output", "Speaker output")}
              </p>
            </div>
          </article>

          {/* 5. Network */}
          <article className="rounded-[15px] bg-white border border-[#E6EDF5] p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-[0_2px_8px_rgba(15,37,62,0.02)]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#EBF5FF] text-[#0077C8] flex items-center justify-center flex-shrink-0">
                <Wifi className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[12px] sm:text-[13px] font-bold text-[#0F253E]">
                  Network
                </h3>
                <p className="text-[10.5px] sm:text-[11.5px] text-[#64748B] truncate mt-0.5">
                  Latency: 24 ms
                </p>
              </div>
            </div>

            <span className="rounded-full bg-[#DCFCE7] border border-[#BBF7D0] px-3 py-1 text-[10px] sm:text-[11px] font-bold text-[#15803D] flex-shrink-0">
              {t("Excellent", "Napakahusay")}
            </span>
          </article>
        </div>
      </section>

      {/* Controls Section */}
      <section aria-labelledby="controls-heading" className="space-y-3">
        <h2
          id="controls-heading"
          className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-[0.08em] text-[#64748B]"
        >
          {t("CONTROLS", "MGA KONTROL")}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {KIOSK_CONTROLS.map((control) => {
            const iconStyles =
              control.accent === "blue"
                ? "bg-[#EBF5FF] text-[#0077C8]"
                : control.accent === "red"
                  ? "bg-[#FFE4E6] text-[#E11D48]"
                  : control.accent === "amber"
                    ? "bg-[#FEF3C7] text-[#D97706]"
                    : "bg-[#DCFCE7] text-[#15803D]";

            return (
              <button
                key={control.id}
                type="button"
                onClick={() => handleControlAction(control)}
                className="rounded-[15px] bg-white hover:bg-[#F8FAFC] active:scale-[0.99] border border-[#E6EDF5] p-4 text-left flex flex-col justify-between gap-3 shadow-[0_2px_8px_rgba(15,37,62,0.02)] transition cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${iconStyles}`}
                >
                  {control.id === "restart" && (
                    <RotateCcw className="w-4 h-4 stroke-[2.2]" />
                  )}
                  {control.id === "shutdown" && (
                    <Power className="w-4 h-4 stroke-[2.2]" />
                  )}
                  {control.id === "sleep" && (
                    <Moon className="w-4 h-4 stroke-[2.2]" />
                  )}
                  {control.id === "wakeup" && (
                    <Sun className="w-4 h-4 stroke-[2.2]" />
                  )}
                </div>

                <div>
                  <p className="text-[12.5px] sm:text-[13.5px] font-bold text-[#0F253E]">
                    {control.title}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5">
                    {control.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
