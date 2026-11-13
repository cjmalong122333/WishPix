"use client";

import React, { useCallback, useEffect, useState } from "react";
import { KioskStatusBanner } from "@/components/dashboard/kiosk-status-banner";
import { MetricStatCard } from "@/components/dashboard/metric-stat-card";
import { QuickActionsPanel } from "@/components/dashboard/quick-actions-panel";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import { getDashboardDataAction } from "@/lib/actions";
import { DASHBOARD_METRICS, KIOSK_INFO } from "@/lib/mock-data";
import type { KioskHardwareStatus, KioskInfo, StatMetric } from "@/types/kiosk";

export default function DashboardPage() {
  const { t } = useAppSettings();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [kiosk, setKiosk] = useState<KioskInfo>(KIOSK_INFO);
  const [hardwareStatus, setHardwareStatus] =
    useState<KioskHardwareStatus>("online");
  const [metrics, setMetrics] = useState<StatMetric[]>(DASHBOARD_METRICS);

  const loadDashboard = useCallback(async () => {
    try {
      const data = await getDashboardDataAction();
      setKiosk(data.kiosk);
      setHardwareStatus(data.hardwareStatus);
      setMetrics(data.metrics);
    } catch {
      // Fallback to seeded initial constants
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getDashboardDataAction()
      .then((data) => {
        if (cancelled) return;
        setKiosk(data.kiosk);
        setHardwareStatus(data.hardwareStatus);
        setMetrics(data.metrics);
      })
      .catch(() => {
        // Fallback to seeded initial constants
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRefreshSummary = async () => {
    setIsRefreshing(true);
    await loadDashboard();
    window.setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Greeting Header */}
      <div>
        <h1 className="text-[18px] sm:text-[22px] lg:text-[26px] font-extrabold text-[#0F253E] tracking-tight">
          {t(
            `Good morning, ${kiosk.educatorName}`,
            `Magandang umaga, ${kiosk.educatorName}`
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
      <KioskStatusBanner
        kiosk={kiosk}
        hardwareStatus={hardwareStatus}
        onHardwareStatusChange={setHardwareStatus}
      />

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
          {metrics.map((metric) => (
            <MetricStatCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <QuickActionsPanel onActionCompleted={loadDashboard} />
    </div>
  );
}
