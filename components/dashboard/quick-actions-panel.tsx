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
import { triggerQuickActionServer } from "@/lib/actions";
import { QUICK_ACTIONS } from "@/lib/mock-data";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import { RevealOnShow } from "@/components/public/reveal-on-show";
import type { QuickActionItem } from "@/types/kiosk";

interface QuickActionsPanelProps {
  onActionCompleted?: () => void;
}

export function QuickActionsPanel({
  onActionCompleted,
}: QuickActionsPanelProps = {}) {
  const { t } = useAppSettings();
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleActionClick = async (action: QuickActionItem) => {
    setFeedbackMessage(`${action.title} triggered.`);
    try {
      await triggerQuickActionServer(action.id);
      onActionCompleted?.();
    } catch {
      // Fallback
    }
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  return (
    <section
      id="tour-quick-actions"
      aria-labelledby="quick-actions-heading"
      className="w-full"
    >
      {/* Section Header */}
      <RevealOnShow variant="fade-up" delayMs={410} className="mb-2.5 sm:mb-3">
        <h2
          id="quick-actions-heading"
          className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-[0.08em] text-[#6D48DF]"
        >
          {t("QUICK ACTIONS", "MABILISANG AKSYON")}
        </h2>
        <p className="text-[10.5px] sm:text-[12px] text-[#766F8E] mt-0.5">
          {t(
            "Control the current session.",
            "Kontrolin ang kasalukuyang sesyon."
          )}
        </p>
      </RevealOnShow>

      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className="wishpix-reveal-pop-scale mb-3 rounded-[12px] bg-[#EFE9FC] border border-[#D5C5F7] px-3.5 py-2 text-[11.5px] font-semibold text-[#6D48DF]"
        >
          {feedbackMessage}
        </div>
      )}

      {/* Action Cards: Stacked on Mobile, 2x2 on Tablet, 4 Columns on Desktop (xl+) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3.5">
        {QUICK_ACTIONS.map((action, index) => {
          const actionDelay = 445 + index * 50;
          if (action.variant === "primary") {
            return (
              <RevealOnShow
                key={action.id}
                variant="fade-up"
                delayMs={actionDelay}
                className="flex"
              >
                <Link
                  href={action.href ?? "/session-setup"}
                  className="group wishpix-public-card-hover w-full rounded-[18px] bg-[#6D48DF] hover:bg-[#5B36CA] active:scale-[0.99] px-4 py-3.5 sm:py-4 text-white shadow-[0_6px_18px_rgba(109,72,223,0.24)] flex items-center justify-between gap-3 transition"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-[11px] bg-white/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
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
                    className="w-4 h-4 text-white/85 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </RevealOnShow>
            );
          }

          const iconBoxStyle =
            action.variant === "muted-coral"
              ? "bg-[#FFE4E6] text-[#E11D48]"
              : action.variant === "muted-amber"
                ? "bg-[#FEF3C7] text-[#D97706]"
                : "bg-[#EFE9FC] text-[#6D48DF]";

          return (
            <RevealOnShow
              key={action.id}
              variant="fade-up"
              delayMs={actionDelay}
              className="flex"
            >
              <button
                type="button"
                data-tour-action="true"
                onClick={() => handleActionClick(action)}
                className="group wishpix-public-card-hover w-full rounded-[18px] bg-white hover:bg-[#FAF8FF] border border-[#F2EEFB] px-4 py-3 sm:py-3.5 text-left flex items-center gap-3.5 shadow-[0_4px_20px_rgba(109,72,223,0.03)] transition cursor-pointer"
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${iconBoxStyle}`}
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
                  <p className="text-[12px] sm:text-[13px] font-bold text-[#231B3B] leading-snug">
                    {action.title}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[#766F8E] truncate mt-0.5">
                    {action.description}
                  </p>
                </div>
              </button>
            </RevealOnShow>
          );
        })}
      </div>

      {/* Bottom Next Step Prompt Banner */}
      <RevealOnShow variant="pop-scale" delayMs={645}>
        <div className="wishpix-public-card-hover mt-3 sm:mt-4 rounded-[14px] border border-[#E2D6FA] bg-[#EFE9FC] px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          <p className="text-[10.5px] sm:text-[12px] font-medium text-[#231B3B] flex items-center gap-1.5">
            <span className="text-[#6D48DF] font-bold" aria-hidden="true">
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
            className="group text-[10.5px] sm:text-[12px] font-bold text-[#6D48DF] hover:underline inline-flex items-center gap-1 flex-shrink-0"
          >
            <span>{t("Plan activity", "Planuhin ang aktibidad")}</span>
            <ArrowRight
              className="w-3.5 h-3.5 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </RevealOnShow>
    </section>
  );
}
