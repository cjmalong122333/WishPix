"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, Download, History } from "lucide-react";
import { getActivityLogsDataAction } from "@/lib/actions";
import { ACTIVITY_LOGS_DATA } from "@/lib/mock-data";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import type { ActivityLogRecord } from "@/types/kiosk";

const PAGE_SIZE = 8;

const ACTIVITY_FILTERS = [
  "All activities",
  "Color & Create",
  "Trace & Learn",
  "Free Play",
];

const THEME_FILTERS = [
  "All themes",
  "Animals",
  "Fruits",
  "Transportation",
  "Community Helpers",
  "Shapes",
  "Colors",
  "Nature",
];

export default function ActivityLogsPage() {
  const { t } = useAppSettings();
  const [records, setRecords] =
    useState<ActivityLogRecord[]>(ACTIVITY_LOGS_DATA);
  const [activityFilter, setActivityFilter] = useState("All activities");
  const [themeFilter, setThemeFilter] = useState("All themes");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getActivityLogsDataAction()
      .then((dbRecords) => {
        if (dbRecords.length > 0) {
          setRecords(dbRecords);
        }
      })
      .catch(() => {
        // Fallback to initial seeded constants
      });
  }, []);

  const filteredRecords = records.filter((record) => {
    const matchesActivity =
      activityFilter === "All activities" ||
      record.activityType === activityFilter;
    const matchesTheme =
      themeFilter === "All themes" || record.theme === themeFilter;
    return matchesActivity && matchesTheme;
  });

  const totalRecords = filteredRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const handleExportCsv = () => {
    const headers = [
      "Date",
      "Time",
      "Theme",
      "Activity Type",
      "Safety Status",
      "Print Status",
    ];
    const rows = filteredRecords.map((r) => [
      r.date,
      r.time,
      r.theme,
      r.activityType,
      r.safetyStatus,
      r.printStatus,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "wishpix-activity-logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-8">
      {/* Top White Insights Header Card */}
      <section className="rounded-[18px] bg-white border border-[#F2EEFB] p-4 sm:p-5 shadow-[0_4px_20px_rgba(109,72,223,0.04)]">
        <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#6D48DF]">
          <History className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
          <span>{t("INSIGHTS", "MGA INSIGHT")}</span>
        </div>
        <h1 className="text-[18px] sm:text-[22px] lg:text-[24px] font-extrabold text-[#231B3B] tracking-tight mt-1">
          {t("Activity Logs", "Talaan ng Aktibidad")}
        </h1>
        <p className="text-[11px] sm:text-[12.5px] text-[#766F8E] mt-0.5">
          {t(
            "Historical usage without any child names.",
            "Talaan ng paggamit nang walang pangalan ng mga bata."
          )}
        </p>
      </section>

      {/* Filter & Export CSV Card */}
      <section
        id="tour-logs-filter-bar"
        aria-label="Filter and export activity logs"
        className="rounded-[18px] bg-white border border-[#F2EEFB] p-4 sm:p-5 shadow-[0_4px_20px_rgba(109,72,223,0.04)]"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[12.5px] sm:text-[14px] font-extrabold text-[#231B3B]">
              {t("Historical usage", "Kasaysayan ng paggamit")}
            </h2>
            <p className="text-[10px] sm:text-[11px] text-[#8881A3] mt-0.5">
              {totalRecords} {t("records", "rekord")}
            </p>
          </div>

          <button
            id="tour-logs-export-btn"
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#6D48DF] hover:bg-[#5B36CA] text-white px-3.5 py-2 text-[11px] sm:text-[12px] font-bold shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
            <span>{t("Export CSV", "I-export ang CSV")}</span>
          </button>
        </div>

        {/* 2-Column Filter Selects */}
        <div className="mt-3.5 grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label
              htmlFor="activity-filter"
              className="block text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#8881A3] mb-1"
            >
              {t("ACTIVITY", "AKTIBIDAD")}
            </label>
            <div className="relative">
              <select
                id="activity-filter"
                value={activityFilter}
                onChange={(e) => {
                  setActivityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none rounded-[10px] border border-[#E2DCF3] bg-[#FAF8FF] pl-3 pr-8 py-2 text-[11px] sm:text-[12px] font-semibold text-[#231B3B] focus:bg-white focus:outline-none focus:border-[#6D48DF] cursor-pointer"
              >
                {ACTIVITY_FILTERS.map((act) => (
                  <option key={act} value={act}>
                    {act}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#766F8E]"
                aria-hidden="true"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="theme-filter"
              className="block text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#8881A3] mb-1"
            >
              {t("THEME", "TEMA")}
            </label>
            <div className="relative">
              <select
                id="theme-filter"
                value={themeFilter}
                onChange={(e) => {
                  setThemeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none rounded-[10px] border border-[#E2DCF3] bg-[#FAF8FF] pl-3 pr-8 py-2 text-[11px] sm:text-[12px] font-semibold text-[#231B3B] focus:bg-white focus:outline-none focus:border-[#6D48DF] cursor-pointer"
              >
                {THEME_FILTERS.map((thm) => (
                  <option key={thm} value={thm}>
                    {thm}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#766F8E]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Log Record Cards */}
      <div
        id="tour-logs-grid"
        className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3"
      >
        {paginatedRecords.map((record) => {
          const isSuccess = record.safetyStatus === "Success";

          const printBadgeStyle =
            record.printStatus === "Printed"
              ? "bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D]"
              : record.printStatus === "Failed"
                ? "bg-[#FFE4E6] border border-[#FECDD3] text-[#E11D48]"
                : "bg-[#FAF8FF] border border-[#E2DCF3] text-[#4A4168]";

          return (
            <article
              key={record.id}
              className="rounded-[16px] bg-white border border-[#F2EEFB] p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(109,72,223,0.03)]"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#F2EEFB]">
                <p className="text-[11px] sm:text-[12px] text-[#766F8E]">
                  <span className="font-extrabold text-[#231B3B]">
                    {record.date}
                  </span>{" "}
                  <span className="mx-1 text-[#D8CEFA]">•</span>
                  <span>{record.time}</span>
                </p>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9.5px] sm:text-[10px] font-bold ${
                      isSuccess
                        ? "bg-[#DCFCE7] text-[#15803D]"
                        : "bg-[#FFE4E6] text-[#E11D48]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSuccess ? "bg-[#16A34A]" : "bg-[#E11D48]"
                      }`}
                      aria-hidden="true"
                    />
                    <span>{record.safetyStatus}</span>
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[9.5px] sm:text-[10px] font-bold ${printBadgeStyle}`}
                  >
                    {record.printStatus}
                  </span>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="pt-2.5 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.1em] text-[#8881A3]">
                    {t("THEME", "TEMA")}
                  </p>
                  <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#231B3B] mt-0.5">
                    {record.theme}
                  </p>
                </div>

                <div>
                  <p className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.1em] text-[#8881A3]">
                    {t("ACTIVITY TYPE", "URI NG AKTIBIDAD")}
                  </p>
                  <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#231B3B] mt-0.5">
                    {record.activityType}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination Footer Card */}
      <div
        id="tour-logs-pagination"
        className="rounded-[16px] bg-white border border-[#F2EEFB] px-4 py-3 flex items-center justify-between gap-3 shadow-[0_4px_20px_rgba(109,72,223,0.03)]"
      >
        <p className="text-[10.5px] sm:text-[11.5px] text-[#766F8E]">
          {t("Showing", "Ipinapakita")}{" "}
          <span className="font-semibold text-[#231B3B]">
            {totalRecords === 0 ? 0 : startIndex + 1}–
            {Math.min(startIndex + PAGE_SIZE, totalRecords)}
          </span>{" "}
          {t("of", "ng")}{" "}
          <span className="font-semibold text-[#231B3B]">{totalRecords}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="rounded-[9px] border border-[#E2DCF3] bg-[#FAF8FF] hover:bg-[#EFE9FC] disabled:opacity-45 disabled:pointer-events-none px-3 py-1.5 text-[10.5px] sm:text-[11.5px] font-semibold text-[#766F8E] transition cursor-pointer"
          >
            {t("Previous", "Nakaraan")}
          </button>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-[9px] border border-[#E2DCF3] bg-white hover:bg-[#FAF8FF] disabled:opacity-45 disabled:pointer-events-none px-3.5 py-1.5 text-[10.5px] sm:text-[11.5px] font-bold text-[#231B3B] transition cursor-pointer"
          >
            {t("Next", "Susunod")}
          </button>
        </div>
      </div>
    </div>
  );
}
