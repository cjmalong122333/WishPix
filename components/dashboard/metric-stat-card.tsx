import React from "react";
import { BarChart2, Calendar, Play, Printer } from "lucide-react";
import type { StatAccentVariant, StatMetric } from "@/types/kiosk";

interface MetricStatCardProps {
  metric: StatMetric;
}

const BADGE_STYLES: Record<StatAccentVariant, string> = {
  blue: "bg-[#EDE7FC] text-[#6D48DF]",
  purple: "bg-[#F3E8FF] text-[#9333EA]",
  indigo: "bg-[#EEF2FF] text-[#4F46E5]",
  green: "bg-[#DCFCE7] text-[#15803D]",
};

export function MetricStatCard({ metric }: MetricStatCardProps) {
  return (
    <article className="group wishpix-public-card-hover w-full rounded-[18px] bg-white border border-[#F2EEFB] px-3.5 sm:px-4 py-3.5 shadow-[0_4px_20px_rgba(109,72,223,0.04)] flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[11px] sm:text-[11.5px] font-medium text-[#766F8E] leading-snug">
          {metric.label}
        </h3>

        {/* Tinted Pill Icon Box */}
        <div
          className={`w-7 h-6 rounded-[8px] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
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
        <p className="text-[19px] sm:text-[21px] font-extrabold text-[#231B3B] tracking-tight leading-none">
          {metric.value}
        </p>
        <p className="text-[10px] sm:text-[10.5px] text-[#8881A3] mt-1.5">
          {metric.subtitle}
        </p>
      </div>
    </article>
  );
}
