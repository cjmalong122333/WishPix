"use client";

import React, { useState } from "react";
import { ChevronDown, Download, History } from "lucide-react";
import { ACTIVITY_LOGS_DATA } from "@/lib/mock-data";

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
  const [activityFilter, setActivityFilter] = useState("All activities");
  const [themeFilter, setThemeFilter] = useState("All themes");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecords = ACTIVITY_LOGS_DATA.filter((record) => {
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
      <section className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]">
        <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#0077C8]">
          <History className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
          <span>INSIGHTS</span>
        </div>
        <h1 className="text-[18px] sm:text-[22px] lg:text-[24px] font-extrabold text-[#0F253E] tracking-tight mt-1">
          Activity Logs
        </h1>
        <p className="text-[11px] sm:text-[12.5px] text-[#64748B] mt-0.5">
          Historical usage without any child names.
        </p>
      </section>

      {/* Filter & Export CSV Card */}
      <section
        aria-label="Filter and export activity logs"
        className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[12.5px] sm:text-[14px] font-extrabold text-[#0F253E]">
              Historical usage
            </h2>
            <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-0.5">
              {totalRecords} records
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#0B5384] hover:bg-[#083E66] text-white px-3.5 py-2 text-[11px] sm:text-[12px] font-bold shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* 2-Column Filter Selects */}
        <div className="mt-3.5 grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label
              htmlFor="activity-filter"
              className="block text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#94A3B8] mb-1"
            >
              ACTIVITY
            </label>
            <div className="relative">
              <select
                id="activity-filter"
                value={activityFilter}
                onChange={(e) => {
                  setActivityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] pl-3 pr-8 py-2 text-[11px] sm:text-[12px] font-semibold text-[#0F253E] focus:bg-white focus:outline-none focus:border-[#0077C8] cursor-pointer"
              >
                {ACTIVITY_FILTERS.map((act) => (
                  <option key={act} value={act}>
                    {act}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B]"
                aria-hidden="true"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="theme-filter"
              className="block text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#94A3B8] mb-1"
            >
              THEME
            </label>
            <div className="relative">
              <select
                id="theme-filter"
                value={themeFilter}
                onChange={(e) => {
                  setThemeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] pl-3 pr-8 py-2 text-[11px] sm:text-[12px] font-semibold text-[#0F253E] focus:bg-white focus:outline-none focus:border-[#0077C8] cursor-pointer"
              >
                {THEME_FILTERS.map((thm) => (
                  <option key={thm} value={thm}>
                    {thm}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Log Record Cards: Single Column on Mobile, 2-Column Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3">
        {paginatedRecords.map((record) => {
          const isSuccess = record.safetyStatus === "Success";

          const printBadgeStyle =
            record.printStatus === "Printed"
              ? "bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D]"
              : record.printStatus === "Failed"
                ? "bg-[#FFE4E6] border border-[#FECDD3] text-[#E11D48]"
                : "bg-[#F1F5F9] border border-[#E2E8F0] text-[#475569]";

          return (
            <article
              key={record.id}
              className="rounded-[14px] bg-white border border-[#E6EDF5] p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(15,37,62,0.02)]"
            >
              {/* Top Row: Date/Time + Status Badges */}
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#F1F5F9]">
                <p className="text-[11px] sm:text-[12px] text-[#64748B]">
                  <span className="font-extrabold text-[#0F253E]">
                    {record.date}
                  </span>{" "}
                  <span className="mx-1 text-[#CBD5E1]">•</span>
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

              {/* Bottom Row: Theme & Activity Type */}
              <div className="pt-2.5 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
                    THEME
                  </p>
                  <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#0F253E] mt-0.5">
                    {record.theme}
                  </p>
                </div>

                <div>
                  <p className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
                    ACTIVITY TYPE
                  </p>
                  <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#0F253E] mt-0.5">
                    {record.activityType}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination Footer Card */}
      <div className="rounded-[14px] bg-white border border-[#E6EDF5] px-4 py-3 flex items-center justify-between gap-3 shadow-[0_2px_8px_rgba(15,37,62,0.02)]">
        <p className="text-[10.5px] sm:text-[11.5px] text-[#64748B]">
          Showing{" "}
          <span className="font-semibold text-[#0F253E]">
            {totalRecords === 0 ? 0 : startIndex + 1}–
            {Math.min(startIndex + PAGE_SIZE, totalRecords)}
          </span>{" "}
          of <span className="font-semibold text-[#0F253E]">{totalRecords}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="rounded-[9px] border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F1F5F9] disabled:opacity-45 disabled:pointer-events-none px-3 py-1.5 text-[10.5px] sm:text-[11.5px] font-semibold text-[#64748B] transition cursor-pointer"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-[9px] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] disabled:opacity-45 disabled:pointer-events-none px-3.5 py-1.5 text-[10.5px] sm:text-[11.5px] font-bold text-[#0F253E] transition cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
