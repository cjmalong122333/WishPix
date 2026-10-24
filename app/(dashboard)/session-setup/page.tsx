"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flower2,
  Globe,
  Palette,
  Pencil,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { KIOSK_INFO, SESSION_ACTIVITIES } from "@/lib/mock-data";

const SETUP_STEPS = [
  { number: 1, label: "Activity" },
  { number: 2, label: "Theme" },
  { number: 3, label: "Safety" },
  { number: 4, label: "Start" },
];

export default function SessionSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedActivityId, setSelectedActivityId] =
    useState<string>("color-create");
  const [hasInteractedWithActivity, setHasInteractedWithActivity] =
    useState(false);

  const selectedActivity = SESSION_ACTIVITIES.find(
    (item) => item.id === selectedActivityId
  );

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Page Title & Step Badge */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[18px] sm:text-[22px] lg:text-[26px] font-extrabold text-[#0F253E] tracking-tight">
            Session Setup
          </h1>
          <p className="text-[11px] sm:text-[13px] text-[#64748B] mt-0.5">
            Choose activity, theme and safety, then start.
          </p>
        </div>

        <span className="rounded-full bg-[#E6F2FF] border border-[#B9DCFF] px-3 py-1 text-[10.5px] sm:text-[11.5px] font-bold text-[#0077C8] flex-shrink-0">
          Step {currentStep} of 4
        </span>
      </div>

      {/* 4-Step Segmented Bar */}
      <div
        role="tablist"
        aria-label="Session setup steps"
        className="rounded-[12px] bg-[#E6EEF6] p-1 grid grid-cols-4 gap-1"
      >
        {SETUP_STEPS.map((step) => {
          const isActive = step.number === currentStep;
          return (
            <button
              key={step.number}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setCurrentStep(step.number)}
              className={`rounded-[9px] py-1.5 sm:py-2 px-2 flex items-center justify-center gap-1.5 text-[10.5px] sm:text-[12px] transition cursor-pointer ${
                isActive
                  ? "bg-white text-[#0077C8] font-bold shadow-xs"
                  : "text-[#64748B] hover:text-[#0F253E] font-medium"
              }`}
            >
              <span
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full text-[9.5px] sm:text-[10.5px] font-bold flex items-center justify-center flex-shrink-0 ${
                  isActive
                    ? "bg-[#0077C8] text-white"
                    : "bg-[#CBD5E1] text-[#475569]"
                }`}
              >
                {step.number}
              </span>
              <span className="truncate">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Responsive Split Layout: Stacked on Mobile, 2-Column on Desktop (lg+) */}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
        {/* Left Column: Activity Setup Options */}
        <section
          aria-labelledby="activity-setup-heading"
          className="lg:col-span-7"
        >
          <div className="mb-2.5 sm:mb-3">
            <h2
              id="activity-setup-heading"
              className="text-[12.5px] sm:text-[14px] font-bold text-[#0F253E]"
            >
              Activity Setup
            </h2>
            <p className="text-[10.5px] sm:text-[12px] text-[#64748B] mt-0.5">
              Choose how children will use the kiosk.
            </p>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {SESSION_ACTIVITIES.map((activity) => {
              const isSelected = activity.id === selectedActivityId;

              const iconBoxClasses =
                activity.accent === "blue"
                  ? "bg-[#E6F2FF] text-[#0077C8]"
                  : activity.accent === "purple"
                    ? "bg-[#F3E8FF] text-[#9333EA]"
                    : "bg-[#DCFCE7] text-[#15803D]";

              return (
                <button
                  key={activity.id}
                  type="button"
                  onClick={() => {
                    setSelectedActivityId(activity.id);
                    setHasInteractedWithActivity(true);
                  }}
                  className={`w-full rounded-[14px] p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 transition cursor-pointer ${
                    isSelected
                      ? "bg-[#F5FAFF] border-[1.75px] border-[#0077C8] shadow-[0_2px_10px_rgba(0,119,200,0.08)]"
                      : "bg-white border border-[#E6EDF5] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 ${iconBoxClasses}`}
                    >
                      {activity.icon === "palette" && (
                        <Palette
                          className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2]"
                          aria-hidden="true"
                        />
                      )}
                      {activity.icon === "pencil" && (
                        <Pencil
                          className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2]"
                          aria-hidden="true"
                        />
                      )}
                      {activity.icon === "sparkles" && (
                        <Sparkles
                          className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2]"
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[12.5px] sm:text-[13.5px] font-bold text-[#0F253E]">
                        {activity.title}
                      </p>
                      <p className="text-[10.5px] sm:text-[11.5px] text-[#64748B] mt-0.5">
                        {activity.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Radio / Check Circle */}
                  <div className="flex-shrink-0">
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full border-[1.5px] border-[#0077C8] text-[#0077C8] bg-white flex items-center justify-center">
                        <Check
                          className="w-3 h-3 stroke-[2.75]"
                          aria-hidden="true"
                        />
                      </span>
                    ) : (
                      <span
                        className="w-5 h-5 rounded-full border border-[#CBD5E1] block"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Right Column: Session Summary Card */}
        <section
          aria-labelledby="session-summary-heading"
          className="lg:col-span-5 rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_10px_rgba(15,37,62,0.03)]"
        >
          <h2
            id="session-summary-heading"
            className="text-[14px] sm:text-[15.5px] font-extrabold text-[#005A9C]"
          >
            Session Summary
          </h2>
          <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
            Sent to kiosk on start
          </p>

          <div className="mt-3.5 divide-y divide-[#EEF2F6]">
            {/* Row 1: Activity Type */}
            <div className="py-2.5 flex items-start gap-3">
              <Palette
                className="w-4 h-4 text-[#0077C8] mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
                  ACTIVITY TYPE
                </p>
                <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#0F253E] mt-0.5">
                  {hasInteractedWithActivity && selectedActivity
                    ? selectedActivity.title
                    : "Not selected"}
                </p>
              </div>
            </div>

            {/* Row 2: Theme */}
            <div className="py-2.5 flex items-start gap-3">
              <Flower2
                className="w-4 h-4 text-[#0077C8] mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
                  THEME
                </p>
                <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#0F253E] mt-0.5">
                  Not selected
                </p>
              </div>
            </div>

            {/* Row 3: Safety Rules */}
            <div className="py-2.5 flex items-start gap-3">
              <ShieldCheck
                className="w-4 h-4 text-[#0077C8] mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
                  SAFETY RULES
                </p>
                <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#0F253E] mt-0.5">
                  STANDARD
                </p>
              </div>
            </div>

            {/* Row 4: Languages */}
            <div className="py-2.5 flex items-start gap-3">
              <Globe
                className="w-4 h-4 text-[#0077C8] mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
                  LANGUAGES
                </p>
                <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#0F253E] mt-0.5">
                  English, Filipino
                </p>
              </div>
            </div>
          </div>

          {/* Online Kiosk Status Pill Box */}
          <div className="mt-3 rounded-[10px] bg-[#E2F5EA] px-3.5 py-2.5 flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-[#16A34A] flex-shrink-0"
              aria-hidden="true"
            />
            <span className="text-[11px] sm:text-[11.5px] font-semibold text-[#15803D]">
              {KIOSK_INFO.roomName} kiosk is online
            </span>
          </div>
        </section>
      </div>

      {/* Bottom Back / Continue Footer */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-[10px] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2.5 text-[11.5px] sm:text-[12.5px] font-semibold text-[#64748B] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back</span>
        </Link>

        <button
          type="button"
          onClick={() => router.push("/live-session")}
          className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#0077C8] hover:bg-[#0267AD] text-white px-5 py-2.5 text-[11.5px] sm:text-[12.5px] font-bold shadow-[0_4px_12px_rgba(0,119,200,0.25)] transition cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
