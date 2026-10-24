import React from "react";
import { BarChart2, Calendar, Play, Printer } from "lucide-react";
import type { StatAccentVariant, StatMetric } from "@/types/kiosk";

interface MetricStatCardProps {
  metric: StatMetric;
}

const BADGE_STYLES: Record<StatAccentVariant, string> = {
  blue: "bg-[#E6F2FF] text-[#0077C8]",
  purple: "bg-[#F3E8FF] text-[#9333EA]",
  indigo: "bg-[#EEF2FF] text-[#4F46E5]",
  green: "bg-[#DCFCE7] text-[#15803D]",
};

export function MetricStatCard({ metric }: MetricStatCardProps) {
  return (
    <article className="rounded-[14px] bg-white border border-[#E6EDF5] px-3.5 sm:px-4 py-3.5 shadow-[0_2px_8px_rgba(15,37,62,0.03)] flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[11px] sm:text-[11.5px] font-medium text-[#64748B] leading-snug">
          {metric.label}
        </h3>

        {/* Tinted Pill Icon Box */}
        <div
          className={`w-7 h-6 rounded-[8px] flex items-center justify-center flex-shrink-0 ${
            BADGE_STYLES[metric.variant]
          }`}
        >
          {metric.icon === "layers" && (
            <Calendar className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
          )}
          {metric.icon === "printer" && (
            <Printer className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
          )}
          {metric.icon === "play" && (
            <Play
              className="w-3.5 h-3.5 stroke-[2.2] fill-current"
              aria-hidden="true"
            />
          )}
          {metric.icon === "chart" && (
            <BarChart2 className="w-3.5 h-3.5 stroke-[2.4]" aria-hidden="true" />
          )}
        </div>
      </div>

      <div className="mt-2">
        <p className="text-[19px] sm:text-[21px] font-extrabold text-[#0F253E] tracking-tight leading-none">
          {metric.value}
        </p>
        <p className="text-[10px] sm:text-[10.5px] text-[#94A3B8] mt-1.5">
          {metric.subtitle}
        </p>
      </div>
    </article>
  );
}
