"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Pause, Play, RotateCcw, Square } from "lucide-react";
import { QUICK_ACTIONS } from "@/lib/mock-data";
import type { QuickActionItem } from "@/types/kiosk";

export function QuickActionsPanel() {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleActionClick = (action: QuickActionItem) => {
    setFeedbackMessage(`${action.title} triggered.`);
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  return (
    <section
      aria-labelledby="quick-actions-heading"
      className="w-full rounded-[18px] sm:rounded-[20px] bg-white p-4 sm:p-6 shadow-[0_4px_14px_rgba(3,70,119,0.06)]"
    >
      {/* Header */}
      <div>
        <h2
          id="quick-actions-heading"
          className="text-[13.5px] sm:text-[15.5px] font-semibold text-[#1E5C8A]"
        >
          Quick Actions
        </h2>
        <p className="text-[11px] sm:text-[12.5px] text-[#7D8E9F] mt-0.5">
          Control the current session.
        </p>
      </div>

      <hr className="border-t border-[#EDF2F7] my-3.5 sm:my-4" />

      {feedbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 rounded-[10px] bg-[#EBF4FC] border border-[#CDE1F5] px-3.5 py-2.5 text-[12px] font-medium text-[#004A7C]"
        >
          {feedbackMessage}
        </div>
      )}

      {/* Action Cards Grid: 1 col mobile, 2 cols tablet, 4 cols desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {QUICK_ACTIONS.map((action) => {
          if (action.variant === "primary") {
            return (
              <Link
                key={action.id}
                href={action.href ?? "/session-setup"}
                className="flex flex-col justify-between w-[94%] sm:w-full rounded-[14px] sm:rounded-[16px] bg-gradient-to-br from-[#176EA6] via-[#075285] to-[#003D69] p-4 sm:p-5 text-white shadow-[0_8px_18px_rgba(0,62,107,0.26)] hover:brightness-105 active:scale-[0.99] transition"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[9px] sm:rounded-[10px] bg-white/15 border border-white/15 flex items-center justify-center">
                  <Play
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white stroke-[2]"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3.5 sm:mt-5">
                  <p className="text-[13px] sm:text-[14px] font-bold text-white">
                    {action.title}
                  </p>
                  <p className="text-[11px] sm:text-[12px] text-[#B8DBF3] mt-0.5">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          }

          if (
            action.variant === "muted-blue" ||
            action.variant === "muted-coral"
          ) {
            const isCoral = action.variant === "muted-coral";
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => handleActionClick(action)}
                className="flex flex-col justify-between w-full rounded-[14px] sm:rounded-[16px] border border-[#E6EDF5] bg-[#FAFBFD] hover:bg-[#F3F7FB] p-4 sm:p-5 text-left transition cursor-pointer"
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-[9px] sm:rounded-[10px] flex items-center justify-center ${
                    isCoral
                      ? "bg-[#FCECEB] text-[#E28379]"
                      : "bg-[#E6F0FA] text-[#6B9AC4]"
                  }`}
                >
                  {isCoral ? (
                    <Square
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]"
                      aria-hidden="true"
                    />
                  ) : (
                    <Pause
                      className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2]"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="mt-3 sm:mt-5">
                  <p className="text-[12.5px] sm:text-[13.5px] font-semibold text-[#8A98A8]">
                    {action.title}
                  </p>
                  <p className="text-[11px] sm:text-[12px] text-[#B2BECA] mt-0.5">
                    {action.description}
                  </p>
                </div>
              </button>
            );
          }

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => handleActionClick(action)}
              className="flex flex-col justify-between w-full rounded-[14px] sm:rounded-[16px] border border-[#DCE6F2] bg-[#F8FBFE] hover:bg-[#EFF6FC] p-4 sm:p-5 text-left transition cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[9px] sm:rounded-[10px] bg-[#E1F0FC] text-[#1464A6] flex items-center justify-center">
                <RotateCcw
                  className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2]"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 sm:mt-5">
                <p className="text-[13px] sm:text-[14px] font-bold text-[#143350]">
                  {action.title}
                </p>
                <p className="text-[11px] sm:text-[12px] text-[#7D8E9F] mt-0.5">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Next Step Prompt Banner */}
      <div className="mt-3.5 sm:mt-4 rounded-[12px] sm:rounded-[14px] border border-[#CFE2F5] bg-[#EAF3FC] px-4 sm:px-5 py-3.5 flex items-center justify-between gap-4">
        <p className="text-[11px] sm:text-[12.5px] text-[#4A6580] leading-snug">
          Next: decide which activity to run.
        </p>
        <Link
          href="/session-setup"
          className="text-[11px] sm:text-[12.5px] font-bold text-[#004A7C] hover:underline flex items-center gap-1.5 flex-shrink-0"
        >
          <span>Plan activity</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
