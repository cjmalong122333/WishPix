import React from "react";
import { KioskStatusBanner } from "@/components/dashboard/kiosk-status-banner";
import { MetricStatCard } from "@/components/dashboard/metric-stat-card";
import { QuickActionsPanel } from "@/components/dashboard/quick-actions-panel";
import { DASHBOARD_METRICS, KIOSK_INFO } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Kiosk Status Card */}
      <KioskStatusBanner kiosk={KIOSK_INFO} />

      {/* 4 Summary Metric Cards (1 col mobile, 2x2 tablet, 4 cols desktop) */}
      <section
        aria-label="Kiosk Metrics"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-5"
      >
        {DASHBOARD_METRICS.map((metric) => (
          <MetricStatCard key={metric.id} metric={metric} />
        ))}
      </section>

      {/* Quick Actions Card */}
      <QuickActionsPanel />
    </div>
  );
}
