"use client";

import React, { useEffect, useState } from "react";
import { Download, FileText, Trash2 } from "lucide-react";
import {
  clearReportsAction,
  generateReportAction,
  getReportsDataAction,
} from "@/lib/actions";
import { REPORT_TYPES } from "@/lib/mock-data";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import type { GeneratedReportItem } from "@/types/kiosk";

export default function ReportsPage() {
  const { t } = useAppSettings();
  const [selectedReportType, setSelectedReportType] = useState<
    "session" | "research"
  >("session");
  const [generatedReports, setGeneratedReports] = useState<
    GeneratedReportItem[]
  >([]);

  useEffect(() => {
    getReportsDataAction()
      .then((reports) => {
        setGeneratedReports(reports);
      })
      .catch(() => {
        // Ignore initial fetch error
      });
  }, []);

  const handleGenerateReport = async () => {
    const selectedMeta =
      REPORT_TYPES.find((r) => r.id === selectedReportType) ?? REPORT_TYPES[0];
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    const optimisticReport: GeneratedReportItem = {
      id: `rep-${Date.now()}`,
      title: selectedMeta.title,
      type: selectedMeta.id,
      generatedAt: `Oct 12 • ${formattedTime}`,
      summary:
        selectedMeta.id === "session"
          ? "Rainbow Room • 47 prints • 63 generations • Animals (Color & Create)"
          : "Pilot Usability Evaluation • 97.1% Safety Pass Rate • 3,864 Total Generations",
    };

    setGeneratedReports((prev) => [optimisticReport, ...prev]);

    try {
      const updated = await generateReportAction(selectedReportType);
      setGeneratedReports(updated);
    } catch {
      // Keep optimistic report if offline
    }
  };

  const handleClearReports = async () => {
    setGeneratedReports([]);
    try {
      await clearReportsAction();
    } catch {
      // Ignore offline error
    }
  };

  const handleDownloadReport = (report: GeneratedReportItem) => {
    const content = `WishPix ${report.title}\nGenerated: ${report.generatedAt}\nSummary: ${report.summary}\n`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${report.title.toLowerCase().replace(/\s+/g, "-")}.txt`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Top White Insights Header Card */}
      <section className="rounded-[18px] bg-white border border-[#F2EEFB] p-4 sm:p-5 shadow-[0_4px_20px_rgba(109,72,223,0.04)]">
        <p className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#6D48DF]">
          {t("INSIGHTS", "MGA INSIGHT")}
        </p>
        <h1 className="text-[18px] sm:text-[22px] lg:text-[24px] font-extrabold text-[#231B3B] tracking-tight mt-1">
          {t("Reports", "Mga Ulat")}
        </h1>
        <p className="text-[11px] sm:text-[12.5px] text-[#766F8E] mt-0.5">
          {t(
            "Generate and research evaluation reports.",
            "Gumawa ng mga ulat sa sesyon at pagsusuri sa pananaliksik."
          )}
        </p>
      </section>

      {/* Responsive Split: Stacked on Mobile, 2 Columns on Desktop */}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
        {/* Generate a Report Card */}
        <section
          id="tour-reports-selector"
          aria-labelledby="generate-report-heading"
          className="lg:col-span-6 rounded-[18px] bg-white border border-[#F2EEFB] p-4 sm:p-5 shadow-[0_4px_20px_rgba(109,72,223,0.04)]"
        >
          <h2
            id="generate-report-heading"
            className="text-[13.5px] sm:text-[15px] font-extrabold text-[#231B3B]"
          >
            {t("Generate a Report", "Gumawa ng Ulat")}
          </h2>
          <p className="text-[10.5px] sm:text-[11.5px] text-[#8881A3] mt-0.5">
            {t("Select a report type.", "Pumili ng uri ng ulat.")}
          </p>

          <div className="mt-3.5 space-y-2.5 sm:space-y-3">
            {REPORT_TYPES.map((report) => {
              const isSelected = selectedReportType === report.id;

              return (
                <button
                  key={report.id}
                  type="button"
                  onClick={() => setSelectedReportType(report.id)}
                  className={`w-full rounded-[14px] p-3.5 sm:p-4 text-left transition cursor-pointer ${
                    isSelected
                      ? "bg-[#EFE9FC] border-[1.5px] border-[#6D48DF]"
                      : "bg-white border border-[#F2EEFB] hover:bg-[#FAF8FF]"
                  }`}
                >
                  <p
                    className={`text-[12px] sm:text-[13px] font-bold ${
                      isSelected ? "text-[#5333B8]" : "text-[#231B3B]"
                    }`}
                  >
                    {report.title}
                  </p>
                  <p
                    className={`text-[10.5px] sm:text-[11.5px] mt-0.5 leading-relaxed ${
                      isSelected ? "text-[#6D48DF]" : "text-[#766F8E]"
                    }`}
                  >
                    {report.description}
                  </p>
                </button>
              );
            })}
          </div>

          <button
            id="tour-reports-generate-btn"
            type="button"
            onClick={handleGenerateReport}
            className="mt-4 w-full rounded-[12px] bg-[#6D48DF] hover:bg-[#5B36CA] active:scale-[0.99] text-white py-2.5 sm:py-3 px-4 text-[12px] sm:text-[13px] font-bold shadow-[0_6px_16px_rgba(109,72,223,0.24)] transition cursor-pointer"
          >
            {t("Generate Report", "Gumawa ng Ulat")}
          </button>
        </section>

        {/* Recent Reports Card */}
        <section
          id="tour-reports-recent"
          aria-labelledby="recent-reports-heading"
          className="lg:col-span-6 rounded-[18px] bg-white border border-[#F2EEFB] p-4 sm:p-5 shadow-[0_4px_20px_rgba(109,72,223,0.04)]"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2
                id="recent-reports-heading"
                className="text-[13.5px] sm:text-[15px] font-extrabold text-[#231B3B]"
              >
                {t("Recent Reports", "Mga Kamakailang Ulat")}
              </h2>
              <p className="text-[10.5px] sm:text-[11.5px] text-[#8881A3] mt-0.5">
                {t(
                  "Generated reports will appear here.",
                  "Makikita rito ang mga ginawang ulat."
                )}
              </p>
            </div>

            {generatedReports.length > 0 && (
              <button
                type="button"
                onClick={handleClearReports}
                className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#766F8E] hover:text-[#E11D48] transition cursor-pointer"
              >
                <Trash2 className="w-3 h-3" aria-hidden="true" />
                <span>{t("Clear", "Burahin")}</span>
              </button>
            )}
          </div>

          {generatedReports.length === 0 ? (
            <div className="mt-3.5 rounded-[14px] bg-[#FAF8FF] border border-[#F2EEFB] py-10 sm:py-12 px-4 flex flex-col items-center text-center">
              <div
                className="w-10 h-10 rounded-full bg-[#EDE7FC]"
                aria-hidden="true"
              />
              <p className="mt-3 text-[12px] sm:text-[13px] font-bold text-[#4A4168]">
                {t("Nothing generated yet", "Wala pang nagagawang ulat")}
              </p>
              <p className="mt-1 text-[10.5px] sm:text-[11.5px] text-[#8881A3]">
                {t(
                  "Use the form above to generate your first report.",
                  "Gamitin ang form sa itaas upang gumawa ng iyong unang ulat."
                )}
              </p>
            </div>
          ) : (
            <div className="mt-3.5 space-y-2.5">
              {generatedReports.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[12px] border border-[#F2EEFB] bg-[#FAF8FF] p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-[9px] bg-[#EDE7FC] text-[#6D48DF] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] sm:text-[13px] font-bold text-[#231B3B]">
                        {item.title}
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-[#766F8E] truncate mt-0.5">
                        {item.summary}
                      </p>
                      <p className="text-[9.5px] text-[#8881A3] mt-0.5">
                        {item.generatedAt}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadReport(item)}
                    className="inline-flex items-center gap-1 rounded-[9px] bg-white hover:bg-[#EFE9FC] border border-[#E2DCF3] px-2.5 py-1.5 text-[10.5px] font-bold text-[#6D48DF] transition flex-shrink-0 cursor-pointer"
                  >
                    <Download className="w-3 h-3" aria-hidden="true" />
                    <span>{t("Export", "I-export")}</span>
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
