"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Square,
} from "lucide-react";
import { QUICK_ACTIONS } from "@/lib/mock-data";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import type { QuickActionItem } from "@/types/kiosk";

export function QuickActionsPanel() {
  const { t } = useAppSettings();
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleActionClick = (action: QuickActionItem) => {
    setFeedbackMessage(`${action.title} triggered.`);
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  return (
    <section
      id="tour-quick-actions"
      aria-labelledby="quick-actions-heading"
      className="w-full"
    >
      {/* Section Header */}
      <div className="mb-2.5 sm:mb-3">
        <h2
          id="quick-actions-heading"
          className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-[0.08em] text-[#64748B]"
        >
          {t("QUICK ACTIONS", "MABILISANG AKSYON")}
        </h2>
        <p className="text-[10.5px] sm:text-[12px] text-[#94A3B8] mt-0.5">
          {t(
            "Control the current session.",
            "Kontrolin ang kasalukuyang sesyon."
          )}
        </p>
      </div>

      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mb-3 rounded-[10px] bg-[#E6F2FF] border border-[#B9DCFF] px-3.5 py-2 text-[11.5px] font-semibold text-[#005A9C]"
        >
          {feedbackMessage}
        </div>
      )}

      {/* Action Cards: Stacked on Mobile, 2x2 on Tablet, 4 Columns on Desktop (xl+) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3.5">
        {QUICK_ACTIONS.map((action) => {
          if (action.variant === "primary") {
            return (
              <Link
                key={action.id}
                href={action.href ?? "/session-setup"}
                className="w-full rounded-[14px] bg-[#0077C8] hover:opacity-95 active:scale-[0.99] px-4 py-3.5 sm:py-4 text-white shadow-[0_6px_16px_rgba(0,119,200,0.22)] flex items-center justify-between gap-3 transition"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-[10px] bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Play
                      className="w-4 h-4 text-white fill-white"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] sm:text-[14px] font-bold text-white leading-snug">
                      {t(action.title, "Simulan ang Sesyon")}
                    </p>
                    <p className="text-[10.5px] sm:text-[11.5px] text-white/80 truncate mt-0.5">
                      {action.description}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  className="w-4 h-4 text-white/85 flex-shrink-0"
                  aria-hidden="true"
                />
              </Link>
            );
          }

          const iconBoxStyle =
            action.variant === "muted-coral"
              ? "bg-[#FFE4E6] text-[#E11D48]"
              : action.variant === "muted-amber"
                ? "bg-[#FEF3C7] text-[#D97706]"
                : "bg-[#F1F5F9] text-[#475569]";

          return (
            <button
              key={action.id}
              type="button"
              data-tour-action="true"
              onClick={() => handleActionClick(action)}
              className="w-full rounded-[14px] bg-white hover:bg-[#F8FAFC] border border-[#E6EDF5] px-4 py-3 sm:py-3.5 text-left flex items-center gap-3.5 shadow-[0_1px_4px_rgba(15,37,62,0.02)] transition cursor-pointer"
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-[9px] flex items-center justify-center flex-shrink-0 ${iconBoxStyle}`}
              >
                {action.icon === "pause" && (
                  <Pause
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] fill-current"
                    aria-hidden="true"
                  />
                )}
                {action.icon === "stop" && (
                  <Square
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] fill-current"
                    aria-hidden="true"
                  />
                )}
                {action.icon === "restart" && (
                  <RotateCcw
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-[12px] sm:text-[13px] font-bold text-[#334E68] leading-snug">
                  {action.title}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#94A3B8] truncate mt-0.5">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Next Step Prompt Banner */}
      <div className="mt-3 sm:mt-4 rounded-[12px] border border-[#D8E8F8] bg-[#EBF4FC] px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        <p className="text-[10.5px] sm:text-[12px] font-medium text-[#334E68] flex items-center gap-1.5">
          <span className="text-[#94A3B8] font-bold" aria-hidden="true">
            &gt;
          </span>
          <span>
            {t(
              "Next: decide which activity to run.",
              "Susunod: piliin kung aling aktibidad ang patatakbuhin."
            )}
          </span>
        </p>
        <Link
          href="/session-setup"
          className="text-[10.5px] sm:text-[12px] font-bold text-[#0077C8] hover:underline inline-flex items-center gap-1 flex-shrink-0"
        >
          <span>{t("Plan activity", "Planuhin ang aktibidad")}</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
