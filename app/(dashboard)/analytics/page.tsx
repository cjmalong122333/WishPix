"use client";

import React, { useState } from "react";
import {
  Ban,
  GraduationCap,
  Palette,
  Printer,
  ShieldCheck,
  WandSparkles,
} from "lucide-react";
import {
  ACTIVITY_MIX,
  ANALYTICS_DAILY_USAGE,
  ANALYTICS_MONTHLY_USAGE,
  ANALYTICS_WEEKLY_USAGE,
  THEME_DISTRIBUTION,
} from "@/lib/mock-data";
import { useAppSettings } from "@/components/providers/app-settings-provider";

type TimeRange = "daily" | "weekly" | "monthly";

export default function AnalyticsPage() {
  const { t } = useAppSettings();
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  const usageData =
    timeRange === "daily"
      ? ANALYTICS_DAILY_USAGE
      : timeRange === "weekly"
        ? ANALYTICS_WEEKLY_USAGE
        : ANALYTICS_MONTHLY_USAGE;

  const maxUsageValue = Math.max(
    ...usageData.map((d) => Math.max(d.generations, d.prints)),
    1
  );

  // SVG Donut Chart geometry
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Top Header with Live Kiosk Pill */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[18px] sm:text-[22px] lg:text-[26px] font-extrabold text-[#0F253E] tracking-tight">
            {t("Analytics", "Pagsusuri (Analytics)")}
          </h1>
          <p className="text-[11px] sm:text-[13px] text-[#64748B] mt-0.5">
            {t(
              "Usage, success rate and blocked requests.",
              "Paggamit, antas ng tagumpay at mga hinarang na kahilingan."
            )}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] px-3 py-1 text-[10.5px] sm:text-[11.5px] font-bold text-[#15803D] flex-shrink-0">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"
            aria-hidden="true"
          />
          <span>{t("Live Kiosk", "Live na Kiosk")}</span>
        </span>
      </div>

      {/* 6 KPI Summary Cards */}
      <div
        id="tour-analytics-kpis"
        className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
      >
        {/* 1. Most Used Theme */}
        <article className="rounded-[15px] bg-white border border-[#E6EDF5] p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(15,37,62,0.03)] flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[10.5px] sm:text-[11.5px] font-medium text-[#64748B]">
              {t("Most Used Theme", "Pinakaginagamit na Tema")}
            </span>
            <div className="w-7 h-7 rounded-[8px] bg-[#EBF5FF] text-[#0077C8] flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-[17px] sm:text-[20px] font-extrabold text-[#0F253E] leading-tight">
              Animals
            </p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#0077C8] mt-1">
              1,033 generations
            </p>
          </div>
        </article>

        {/* 2. Most Used Activity */}
        <article className="rounded-[15px] bg-white border border-[#E6EDF5] p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(15,37,62,0.03)] flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[10.5px] sm:text-[11.5px] font-medium text-[#64748B]">
              {t("Most Used Activity", "Pinakaginagamit na Aktibidad")}
            </span>
            <div className="w-7 h-7 rounded-[8px] bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center flex-shrink-0">
              <Palette className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-[15.5px] sm:text-[19px] font-extrabold text-[#0F253E] leading-tight">
              Color &amp; Create
            </p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#9333EA] mt-1">
              46% of sessions
            </p>
          </div>
        </article>

        {/* 3. Total Prints */}
        <article className="rounded-[15px] bg-white border border-[#E6EDF5] p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(15,37,62,0.03)] flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[10.5px] sm:text-[11.5px] font-medium text-[#64748B]">
              {t("Total Prints", "Kabuuang Print")}
            </span>
            <div className="w-7 h-7 rounded-[8px] bg-[#EBF5FF] text-[#0077C8] flex items-center justify-center flex-shrink-0">
              <Printer className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-[18px] sm:text-[22px] font-extrabold text-[#0F253E] leading-none">
              3,259
            </p>
            <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-1.5">
              {t("All time", "Lahat ng panahon")}
            </p>
          </div>
        </article>

        {/* 4. Total Generations */}
        <article className="rounded-[15px] bg-white border border-[#E6EDF5] p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(15,37,62,0.03)] flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[10.5px] sm:text-[11.5px] font-medium text-[#64748B]">
              {t("Total Generations", "Kabuuang Nalikha")}
            </span>
            <div className="w-7 h-7 rounded-[8px] bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center flex-shrink-0">
              <WandSparkles className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-[18px] sm:text-[22px] font-extrabold text-[#0F253E] leading-none">
              3,864
            </p>
            <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-1.5">
              {t("All time", "Lahat ng panahon")}
            </p>
          </div>
        </article>

        {/* 5. Blocked Requests */}
        <article className="rounded-[15px] bg-white border border-[#FDE68A] p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(217,119,6,0.04)] flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[10.5px] sm:text-[11.5px] font-medium text-[#64748B]">
              {t("Blocked Requests", "Hinarang na Kahilingan")}
            </span>
            <div className="w-7 h-7 rounded-[8px] bg-[#FEF3C7] text-[#D97706] flex items-center justify-center flex-shrink-0">
              <Ban className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-[18px] sm:text-[22px] font-extrabold text-[#0F253E] leading-none">
              115
            </p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#D97706] mt-1.5">
              {t("Rejected by Safety", "Tinanggihan ng Safety")}
            </p>
          </div>
        </article>

        {/* 6. Success Rate */}
        <article className="rounded-[15px] bg-white border border-[#BBF7D0] p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(22,163,74,0.04)] flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[10.5px] sm:text-[11.5px] font-medium text-[#64748B]">
              {t("Success Rate", "Antas ng Tagumpay")}
            </span>
            <div className="w-7 h-7 rounded-[8px] bg-[#DCFCE7] text-[#15803D] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-[18px] sm:text-[22px] font-extrabold text-[#0F253E] leading-none">
              97.1%
            </p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#15803D] mt-1.5">
              {t("Passing safety", "Pumasa sa safety")}
            </p>
          </div>
        </article>
      </div>

      {/* Usage Over Time Card */}
      <section
        id="tour-analytics-chart"
        aria-labelledby="usage-over-time-heading"
        className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="usage-over-time-heading"
              className="text-[14px] sm:text-[16px] font-extrabold text-[#0F253E] leading-snug"
            >
              {t("Usage Over Time", "Paggamit sa Paglipas ng Panahon")}
            </h2>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
              {t(
                "Pictures generated and printed",
                "Mga larawang nalikha at na-print"
              )}
            </p>
          </div>

          {/* Daily / Weekly / Monthly Switcher */}
          <div
            id="tour-analytics-range-tabs"
            role="tablist"
            aria-label="Usage time range"
            className="rounded-[10px] bg-[#F1F5F9] p-1 flex items-center gap-0.5 flex-shrink-0"
          >
            {(["daily", "weekly", "monthly"] as const).map((range) => {
              const isActive = timeRange === range;
              return (
                <button
                  key={range}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setTimeRange(range)}
                  className={`rounded-[7px] px-2.5 py-1 text-[10px] sm:text-[11px] capitalize transition cursor-pointer ${
                    isActive
                      ? "bg-white text-[#0F253E] font-bold shadow-xs"
                      : "text-[#64748B] hover:text-[#0F253E] font-medium"
                  }`}
                >
                  {range}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-4 text-[10.5px] sm:text-[11.5px] font-medium text-[#475569]">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-[3px] bg-[#0F253E]"
              aria-hidden="true"
            />
            <span>Generations</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-[3px] bg-[#93C5FD]"
              aria-hidden="true"
            />
            <span>Prints</span>
          </span>
        </div>

        {/* Grouped Bar Chart */}
        <div className="mt-5 pt-2">
          <div className="h-[135px] sm:h-[165px] flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-6 border-b border-[#EEF2F6] pb-2">
            {usageData.map((point) => {
              const genHeightPercent = Math.round(
                (point.generations / maxUsageValue) * 100
              );
              const printHeightPercent = Math.round(
                (point.prints / maxUsageValue) * 100
              );

              return (
                <div
                  key={point.label}
                  className="flex-1 h-full flex items-end justify-center gap-1 sm:gap-1.5"
                >
                  <div
                    title={`${point.label} Generations: ${point.generations}`}
                    style={{ height: `${genHeightPercent}%` }}
                    className={`w-2.5 sm:w-4 rounded-t-[4px] transition-all ${
                      point.isCurrent ? "bg-[#0077C8]" : "bg-[#0F253E]"
                    }`}
                  />
                  <div
                    title={`${point.label} Prints: ${point.prints}`}
                    style={{ height: `${printHeightPercent}%` }}
                    className="w-2.5 sm:w-4 rounded-t-[4px] bg-[#93C5FD] transition-all"
                  />
                </div>
              );
            })}
          </div>

          {/* X-Axis Labels */}
          <div className="mt-2 flex items-center justify-between gap-2 sm:gap-4 px-2 sm:px-6 text-center">
            {usageData.map((point) => (
              <div key={point.label} className="flex-1">
                <span
                  className={`text-[9.5px] sm:text-[11px] ${
                    point.isCurrent
                      ? "font-extrabold text-[#0077C8]"
                      : point.label === "Oct 10"
                        ? "font-bold text-[#0F253E]"
                        : "font-medium text-[#94A3B8]"
                  }`}
                >
                  {point.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom 2 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Theme Distribution Card */}
        <section
          id="tour-analytics-themes"
          aria-labelledby="theme-distribution-heading"
          className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]"
        >
          <h2
            id="theme-distribution-heading"
            className="text-[13.5px] sm:text-[15px] font-extrabold text-[#0F253E]"
          >
            {t("Theme Distribution", "Distribusyon ng Tema")}
          </h2>
          <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
            {t("Share of all generations", "Bahagi sa lahat ng nalikha")}
          </p>

          <div className="mt-4 flex items-center justify-between gap-4 sm:gap-6">
            {/* SVG Donut Chart */}
            <div className="relative w-[132px] h-[132px] sm:w-[148px] sm:h-[148px] flex items-center justify-center flex-shrink-0">
              <svg
                viewBox="0 0 140 140"
                className="w-full h-full -rotate-90"
                aria-label="Theme distribution donut chart"
              >
                {THEME_DISTRIBUTION.reduce<{
                  offset: number;
                  elements: React.ReactNode[];
                }>(
                  (acc, slice) => {
                    const strokeLength =
                      (slice.percentage / 100) * circumference;
                    const element = (
                      <circle
                        key={slice.id}
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth="16"
                        strokeDasharray={`${strokeLength} ${circumference}`}
                        strokeDashoffset={-acc.offset}
                      />
                    );
                    acc.offset += strokeLength;
                    acc.elements.push(element);
                    return acc;
                  },
                  { offset: 0, elements: [] }
                ).elements}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[20px] sm:text-[22px] font-extrabold text-[#0F253E] leading-none">
                  7
                </span>
                <span className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.12em] text-[#94A3B8] mt-1">
                  {t("THEMES", "TEMA")}
                </span>
              </div>
            </div>

            {/* Legend */}
            <ul className="flex-1 space-y-2.5">
              {THEME_DISTRIBUTION.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2 text-[11px] sm:text-[12px]"
                >
                  <span className="flex items-center gap-2 text-[#334E68] font-medium">
                    <span
                      style={{ backgroundColor: item.color }}
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="leading-tight">{item.name}</span>
                  </span>
                  <span className="font-extrabold text-[#0F253E]">
                    {item.percentage}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Activity Mix Card */}
        <section
          id="tour-analytics-mix"
          aria-labelledby="activity-mix-heading"
          className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)] flex flex-col justify-between"
        >
          <div>
            <h2
              id="activity-mix-heading"
              className="text-[13.5px] sm:text-[15px] font-extrabold text-[#0F253E]"
            >
              {t("Activity Mix", "Kombinasyon ng Aktibidad")}
            </h2>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
              {t("Sessions by activity type", "Mga sesyon ayon sa uri")}
            </p>
          </div>

          <div className="mt-4 space-y-4 my-auto">
            {ACTIVITY_MIX.map((activity) => (
              <div key={activity.id}>
                <div className="flex items-center justify-between text-[11.5px] sm:text-[12.5px] mb-1.5">
                  <span className="font-semibold text-[#334E68]">
                    {activity.name}
                  </span>
                  <span className={`font-extrabold ${activity.textColor}`}>
                    {activity.percentage}%
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={activity.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${activity.name} share`}
                  className="h-2 w-full rounded-full bg-[#F1F5F9] overflow-hidden"
                >
                  <div
                    style={{ width: `${activity.percentage}%` }}
                    className={`h-full rounded-full ${activity.barColor}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
