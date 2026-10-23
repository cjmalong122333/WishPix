import React from "react";
import { BarChart2, Layers, Play, Printer } from "lucide-react";
import type { StatMetric } from "@/types/kiosk";

interface MetricStatCardProps {
  metric: StatMetric;
}

export function MetricStatCard({ metric }: MetricStatCardProps) {
  const isPurple = metric.variant === "purple";

  const subtitleColor =
    metric.id === "active-session"
      ? "text-[#7D8E9F] font-normal"
      : metric.id === "total-prints"
        ? "text-[#045A94] font-semibold"
        : "text-[#1A73B8] font-medium";

  return (
    <article className="relative overflow-hidden rounded-[16px] sm:rounded-[18px] bg-white px-4 sm:px-5 py-4 sm:py-5 shadow-[0_4px_14px_rgba(3,70,119,0.06)] hover:shadow-[0_8px_22px_rgba(3,70,119,0.1)] transition">
      {/* Subtle Top Gradient Accent Line */}
      <div
        aria-hidden="true"
        className={`absolute top-0 left-0 right-0 h-[3px] ${
          isPurple
            ? "bg-gradient-to-r from-[#5D55E7] via-[#9A94F7] to-transparent"
            : "bg-gradient-to-r from-[#1E6FA8] via-[#6BA9D6] to-transparent"
        }`}
      />

      {/* Soft Radial Glow in Bottom Right */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-6 right-4 w-28 h-24 rounded-full blur-2xl ${
          isPurple ? "bg-[#E2DFFE]/75" : "bg-[#D5E9FA]/80"
        }`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[11.5px] sm:text-[12.5px] font-semibold text-[#5A6F85]">
            {metric.label}
          </h3>
          <p className="text-[23px] sm:text-[27px] font-extrabold text-[#004A7C] tracking-tight leading-none mt-2 sm:mt-2.5">
            {metric.value}
          </p>
          <p className={`text-[11px] sm:text-[12px] mt-2 sm:mt-2.5 ${subtitleColor}`}>
            {metric.subtitle}
          </p>
        </div>

        {/* Tinted Icon Box */}
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[11px] flex items-center justify-center shadow-[0_4px_10px_rgba(15,45,80,0.08)] flex-shrink-0 ${
            isPurple
              ? "bg-[#EAE8FE] text-[#5B53E6]"
              : "bg-[#DCEBFA] text-[#216EA3]"
          }`}
        >
          {metric.icon === "layers" && (
            <Layers className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2]" aria-hidden="true" />
          )}
          {metric.icon === "printer" && (
            <Printer className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2]" aria-hidden="true" />
          )}
          {metric.icon === "play" && (
            <Play className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2]" aria-hidden="true" />
          )}
          {metric.icon === "chart" && (
            <BarChart2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2]" aria-hidden="true" />
          )}
        </div>
      </div>
    </article>
  );
}
