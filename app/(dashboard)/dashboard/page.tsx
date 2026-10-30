"use client";

import React, { useState } from "react";
import { KioskStatusBanner } from "@/components/dashboard/kiosk-status-banner";
import { MetricStatCard } from "@/components/dashboard/metric-stat-card";
import { QuickActionsPanel } from "@/components/dashboard/quick-actions-panel";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import { DASHBOARD_METRICS, KIOSK_INFO } from "@/lib/mock-data";

export default function DashboardPage() {
  const { t } = useAppSettings();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshSummary = () => {
    setIsRefreshing(true);
    window.setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Greeting Header */}
      <div>
        <h1 className="text-[18px] sm:text-[22px] lg:text-[26px] font-extrabold text-[#0F253E] tracking-tight">
          {t(
            `Good morning, ${KIOSK_INFO.educatorName}`,
            `Magandang umaga, ${KIOSK_INFO.educatorName}`
          )}
        </h1>
        <p className="text-[11.5px] sm:text-[13px] text-[#64748B] mt-0.5">
          {t(
            "Here's what's happening at your kiosk today.",
            "Narito ang nangyayari sa iyong kiosk ngayong araw."
          )}
        </p>
      </div>

      {/* Kiosk Status Card */}
      <KioskStatusBanner kiosk={KIOSK_INFO} />

      {/* Today's Summary Section: 2x2 on Mobile/Tablet, 4 Columns on Desktop */}
      <section
        id="tour-todays-summary"
        aria-labelledby="todays-summary-heading"
      >
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <h2
            id="todays-summary-heading"
            className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-[0.08em] text-[#64748B]"
          >
            {t("TODAY'S SUMMARY", "BUOD NGAYONG ARAW")}
          </h2>
          <button
            id="tour-summary-refresh"
            type="button"
            onClick={handleRefreshSummary}
            className="text-[11px] sm:text-[12px] font-semibold text-[#0077C8] hover:underline cursor-pointer"
          >
            {isRefreshing
              ? t("Updated!", "Na-update!")
              : t("Refresh", "I-refresh")}
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {DASHBOARD_METRICS.map((metric) => (
            <MetricStatCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <QuickActionsPanel />
    </div>
  );
}
