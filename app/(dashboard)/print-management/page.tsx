"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Ban,
  Check,
  Clock,
  Layers,
  Printer,
  RotateCcw,
  RotateCw,
  Volume2,
} from "lucide-react";
import { KIOSK_INFO, REPRINT_HISTORY } from "@/lib/mock-data";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import type { PrinterHardwareState, ReprintItem } from "@/types/kiosk";

export default function PrintManagementPage() {
  const { t } = useAppSettings();
  const [printerState, setPrinterState] =
    useState<PrinterHardwareState>("ready");
  const [reprintItems, setReprintItems] =
    useState<ReprintItem[]>(REPRINT_HISTORY);
  const [todaysPrints, setTodaysPrints] = useState(47);
  const [queuedJobTitle, setQueuedJobTitle] = useState<string | null>(null);

  const handleReprint = (item: ReprintItem) => {
    setQueuedJobTitle(item.title);
    setPrinterState("printing");
    setTodaysPrints((prev) => prev + 1);
    setReprintItems((prev) =>
      prev.map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              status: "printed",
              reprintCount: (entry.reprintCount ?? 0) + 1,
            }
          : entry
      )
    );

    setTimeout(() => {
      setQueuedJobTitle(null);
      setPrinterState("ready");
    }, 1800);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Top White Hardware Header Card */}
      <section className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]">
        <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#0077C8]">
          <Printer className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
          <span>{t("HARDWARE", "KAGAMITAN")}</span>
        </div>
        <h1 className="text-[18px] sm:text-[22px] lg:text-[24px] font-extrabold text-[#0F253E] tracking-tight mt-1">
          {t("Print Management", "Pamamahala ng Print")}
        </h1>
        <p className="text-[11px] sm:text-[12.5px] text-[#64748B] mt-0.5">
          {t(
            "Monitor printing and reprint earlier activities.",
            "Subaybayan ang pag-print at muling i-print ang mga naunang aktibidad."
          )}
        </p>
      </section>

      {/* Dark Navy Connected Kiosk Banner */}
      <section
        aria-label="Connected Kiosk"
        className="relative overflow-hidden rounded-[16px] bg-[#0F233A] px-4 sm:px-5 py-4 text-white flex items-center justify-between gap-3 shadow-[0_8px_24px_rgba(15,35,58,0.16)] transition-colors duration-200"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -right-8 w-40 h-40 rounded-full bg-[#0284C7]/20 blur-2xl"
        />
        <div className="relative min-w-0">
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] text-white/75">
            {t("CONNECTED KIOSK", "KONEKTADONG KIOSK")}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <h2 className="text-[15px] sm:text-[17px] font-extrabold text-white truncate">
              {KIOSK_INFO.roomName}
            </h2>
            <span
              className="w-2 h-2 rounded-full bg-[#22C55E] flex-shrink-0"
              aria-hidden="true"
            />
          </div>
          <p className="text-[10.5px] sm:text-[12px] text-white/75 mt-0.5">
            {t(
              "Online & ready for classroom tasks",
              "Online at handa para sa mga gawain sa klase"
            )}
          </p>
        </div>

        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-white/10 border border-white/10 text-white/90 flex items-center justify-center flex-shrink-0">
          <Volume2 className="w-4 h-4 stroke-[2]" aria-hidden="true" />
        </div>
      </section>

      {/* Print Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Today's Prints */}
        <article className="col-span-2 lg:col-span-1 rounded-[16px] bg-white border border-[#E6EDF5] border-r-[4px] border-r-[#0077C8] p-4 sm:p-5 flex items-center justify-between gap-3 shadow-[0_2px_8px_rgba(15,37,62,0.03)]">
          <div>
            <p className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#64748B]">
              {t("TODAY'S PRINTS", "PRINT NGAYONG ARAW")}
            </p>
            <p className="text-[24px] sm:text-[28px] font-extrabold text-[#0F253E] leading-none mt-1.5">
              {todaysPrints}
            </p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#0077C8] flex items-center gap-1 mt-2">
              <Clock className="w-3 h-3" aria-hidden="true" />
              <span>{t("Since 7:00 AM", "Mula 7:00 AM")}</span>
            </p>
          </div>

          <div className="w-10 h-10 rounded-[11px] bg-[#EBF5FF] text-[#0077C8] flex items-center justify-center flex-shrink-0">
            <Printer className="w-5 h-5 stroke-[2]" aria-hidden="true" />
          </div>
        </article>

        {/* Weekly Prints */}
        <article className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]">
          <p className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#64748B]">
            {t("WEEKLY PRINTS", "LINGGUHANG PRINT")}
          </p>
          <p className="text-[20px] sm:text-[24px] font-extrabold text-[#0F253E] leading-none mt-2">
            312
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-2">
            {t("Last 7 days", "Nakaraang 7 araw")}
          </p>
        </article>

        {/* Monthly Prints */}
        <article className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]">
          <p className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#64748B]">
            {t("MONTHLY PRINTS", "BUWANANG PRINT")}
          </p>
          <p className="text-[20px] sm:text-[24px] font-extrabold text-[#0F253E] leading-none mt-2">
            1,096
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-2">
            October 2026
          </p>
        </article>
      </div>

      {/* Responsive Split Grid */}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
        {/* Left Column: Printer Status + Print Queue */}
        <div className="space-y-4 lg:col-span-5">
          {/* Printer Status Card */}
          <section
            aria-labelledby="printer-status-heading"
            className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]"
          >
            <h2
              id="printer-status-heading"
              className="text-[13px] sm:text-[14.5px] font-extrabold text-[#0F253E]"
            >
              {t("Printer Status", "Status ng Printer")}
            </h2>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#64748B] mt-0.5">
              {t(
                "Kiosk printer • connected over USB",
                "Printer ng kiosk • nakakonekta sa USB"
              )}
            </p>

            {/* 4 Status Selector Pills */}
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setPrinterState("ready")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] sm:text-[11px] font-bold transition cursor-pointer ${
                  printerState === "ready"
                    ? "bg-[#0F253E] text-white shadow-xs"
                    : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full bg-[#22C55E]"
                  aria-hidden="true"
                />
                <span>{t("Ready", "Handa")}</span>
              </button>

              <button
                type="button"
                onClick={() => setPrinterState("printing")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] sm:text-[11px] font-bold transition cursor-pointer ${
                  printerState === "printing"
                    ? "bg-[#0F253E] text-white shadow-xs"
                    : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]"
                }`}
              >
                <RotateCw className="w-3 h-3" aria-hidden="true" />
                <span>{t("Printing", "Nagpi-print")}</span>
              </button>

              <button
                type="button"
                onClick={() => setPrinterState("error")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] sm:text-[11px] font-bold transition cursor-pointer ${
                  printerState === "error"
                    ? "bg-[#E11D48] text-white shadow-xs"
                    : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]"
                }`}
              >
                <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                <span>{t("Error", "Error")}</span>
              </button>

              <button
                type="button"
                onClick={() => setPrinterState("no-paper")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] sm:text-[11px] font-bold transition cursor-pointer ${
                  printerState === "no-paper"
                    ? "bg-[#D97706] text-white shadow-xs"
                    : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]"
                }`}
              >
                <Ban className="w-3 h-3" aria-hidden="true" />
                <span>{t("No Paper", "Walang Papel")}</span>
              </button>
            </div>

            {/* Paper Tray Low Alert Box */}
            <div className="mt-4 rounded-[12px] bg-[#FFFBEB] border border-[#FDE68A] p-3.5">
              <div className="flex items-center justify-between text-[11px] sm:text-[12px]">
                <span className="font-bold text-[#0F253E]">
                  {t("Paper tray", "Lalagyan ng papel")}
                </span>
                <span className="font-extrabold text-[#D97706]">
                  18% - Low
                </span>
              </div>

              <div
                role="progressbar"
                aria-valuenow={18}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Paper tray level"
                className="mt-2 h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden"
              >
                <div className="h-full w-[18%] rounded-full bg-[#F59E0B]" />
              </div>

              <p className="mt-2 text-[10px] sm:text-[11px] font-semibold text-[#B45309] flex items-center gap-1.5">
                <AlertTriangle
                  className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0"
                  aria-hidden="true"
                />
                <span>
                  {t(
                    "About 36 sheets left. Refill before the next session.",
                    "Humigit-kumulang 36 piraso na lang. Dagdagan bago ang susunod na sesyon."
                  )}
                </span>
              </p>
            </div>
          </section>

          {/* Print Queue Card */}
          <section
            aria-labelledby="print-queue-heading"
            className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]"
          >
            <div className="flex items-center justify-between mb-3">
              <h2
                id="print-queue-heading"
                className="text-[13px] sm:text-[14.5px] font-extrabold text-[#0F253E]"
              >
                {t("Print Queue", "Pila ng Print")}
              </h2>
              <span className="text-[10.5px] sm:text-[11.5px] font-medium text-[#94A3B8]">
                {queuedJobTitle
                  ? t("1 job active", "1 aktibong print")
                  : t("Nothing waiting", "Walang naghihintay")}
              </span>
            </div>

            <div className="rounded-[12px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] py-6 px-4 flex flex-col items-center text-center">
              <Layers
                className="w-5 h-5 text-[#CBD5E1] stroke-[1.8]"
                aria-hidden="true"
              />
              {queuedJobTitle ? (
                <p className="mt-2 text-[11.5px] sm:text-[12.5px] font-bold text-[#0077C8]">
                  Printing &ldquo;{queuedJobTitle}&rdquo;...
                </p>
              ) : (
                <p className="mt-2 text-[11px] sm:text-[12px] font-medium text-[#94A3B8]">
                  {t("The print queue is empty.", "Walang laman ang pila ng print.")}
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Reprint Output */}
        <section
          aria-labelledby="reprint-output-heading"
          className="lg:col-span-7 rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]"
        >
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#EEF2F6]">
            <div>
              <h2
                id="reprint-output-heading"
                className="text-[13.5px] sm:text-[15px] font-extrabold text-[#0F253E]"
              >
                {t("Reprint Output", "I-reprint ang Output")}
              </h2>
              <p className="text-[10.5px] sm:text-[11.5px] text-[#64748B] mt-0.5">
                {t(
                  "Reprint any earlier activity sheet.",
                  "Muling i-print ang alinmang naunang activity sheet."
                )}
              </p>
            </div>

            <span className="rounded-full bg-[#F1F5F9] px-3 py-1 text-[10px] sm:text-[11px] font-bold text-[#475569] flex-shrink-0">
              {reprintItems.length} {t("items", "item")}
            </span>
          </div>

          <div className="divide-y divide-[#EEF2F6]">
            {reprintItems.map((item) => {
              const isPrinted = item.status === "printed";

              return (
                <div
                  key={item.id}
                  className="py-3 sm:py-3.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[12px] sm:text-[13px] font-bold text-[#0F253E]">
                        {item.title}
                      </span>

                      {item.reprintCount !== undefined &&
                        item.reprintCount > 0 && (
                          <span className="rounded-full bg-[#E0F2FE] px-2 py-0.5 text-[9px] sm:text-[9.5px] font-bold text-[#0284C7]">
                            {item.reprintCount}x reprinted
                          </span>
                        )}

                      {isPrinted ? (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[9px] sm:text-[9.5px] font-bold text-[#15803D]">
                          <Check className="w-2.5 h-2.5 stroke-[2.75]" />
                          <span>Printed</span>
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#FFE4E6] px-2 py-0.5 text-[9px] sm:text-[9.5px] font-bold text-[#E11D48]">
                          Failed
                        </span>
                      )}
                    </div>

                    <p className="text-[10.5px] sm:text-[11.5px] text-[#64748B] mt-0.5">
                      {item.theme} • {item.activity}
                    </p>
                    <p className="text-[9.5px] sm:text-[10px] text-[#94A3B8] flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5" aria-hidden="true" />
                      <span>{item.timestamp}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleReprint(item)}
                    className="inline-flex items-center gap-1 rounded-[9px] bg-[#F0F7FF] hover:bg-[#E0EFFE] border border-[#B9DCFF] px-3 py-1.5 text-[10.5px] sm:text-[11.5px] font-bold text-[#0077C8] transition flex-shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3 stroke-[2.2]" />
                    <span>{t("Reprint", "I-reprint")}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
