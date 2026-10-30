"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Ban,
  Check,
  Eye,
  FileText,
  Mic,
  Shield,
  X,
} from "lucide-react";
import { MODERATION_ITEMS } from "@/lib/mock-data";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import type { ModerationQueueItem, SafetyRuleMode } from "@/types/kiosk";

type FilterTab = "all" | "pending" | "resolved";

export default function ModerationPage() {
  const { t } = useAppSettings();
  const [items, setItems] = useState<ModerationQueueItem[]>(MODERATION_ITEMS);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [safetyLevel, setSafetyLevel] = useState<SafetyRuleMode>("STANDARD");
  const [inspectedItem, setInspectedItem] =
    useState<ModerationQueueItem | null>(null);

  const pendingCount = items.filter((i) => i.status === "pending").length;
  const resolvedCount = items.filter((i) => i.status !== "pending").length;

  const filteredItems = items.filter((item) => {
    if (activeTab === "pending") return item.status === "pending";
    if (activeTab === "resolved") return item.status !== "pending";
    return true;
  });

  const handleDecision = (
    id: string,
    decision: "blocked" | "overridden"
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: decision,
              statusBadge:
                decision === "blocked" ? "Kept blocked" : "Overridden",
              resolutionNote:
                decision === "blocked"
                  ? "Action completed by Teacher"
                  : "Approved & printed",
            }
          : item
      )
    );
  };

  const handleCycleSafetyLevel = () => {
    const order: SafetyRuleMode[] = ["STRICT", "STANDARD", "CUSTOM"];
    const nextIdx = (order.indexOf(safetyLevel) + 1) % order.length;
    setSafetyLevel(order[nextIdx]);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-[18px] sm:text-[22px] lg:text-[26px] font-extrabold text-[#0F253E] tracking-tight">
          {t("Moderation Center", "Sentro ng Moderasyon")}
        </h1>
        <p className="text-[11px] sm:text-[13px] text-[#64748B] mt-0.5">
          {t(
            "Review prompts blocked by the safety filter.",
            "Suriin ang mga prompt na hinarang ng safety filter."
          )}
        </p>
      </div>

      {/* Top Overview Grid */}
      <div
        id="tour-moderation-stats"
        className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
      >
        {/* Awaiting Review */}
        <article className="rounded-[14px] bg-white border border-[#E6EDF5] p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(15,37,62,0.03)]">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.06em] text-[#64748B]">
              {t("AWAITING REVIEW", "NAGHIHINTAY NG SURI")}
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[8px] bg-[#FEF3C7] text-[#D97706] flex items-center justify-center flex-shrink-0">
              <AlertTriangle
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]"
                aria-hidden="true"
              />
            </div>
          </div>
          <p className="text-[20px] sm:text-[24px] font-extrabold text-[#0F253E] mt-1 leading-none">
            {pendingCount}
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-1.5">
            {t(
              "Blocked prompts to decide on",
              "Mga hinarang na prompt na pagpapasyahan"
            )}
          </p>
        </article>

        {/* Blocked Today */}
        <article className="rounded-[14px] bg-white border border-[#E6EDF5] p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(15,37,62,0.03)]">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[9.5px] sm:text-[10.5px] font-bold uppercase tracking-[0.06em] text-[#64748B]">
              {t("BLOCKED TODAY", "HINARANG NGAYON")}
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[8px] bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center flex-shrink-0">
              <Ban
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]"
                aria-hidden="true"
              />
            </div>
          </div>
          <p className="text-[20px] sm:text-[24px] font-extrabold text-[#0F253E] mt-1 leading-none">
            {items.length}
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-1.5">
            {t("Rejected by Safety Filter", "Tinanggihan ng Safety Filter")}
          </p>
        </article>

        {/* Safety Level Card */}
        <div className="col-span-2 lg:col-span-1 rounded-[14px] bg-white border border-[#E6EDF5] px-3.5 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-3 shadow-[0_2px_8px_rgba(15,37,62,0.02)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E6F2FF] text-[#0077C8] flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 stroke-[2.2]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
                {t("SAFETY LEVEL", "ANTAS NG KALIGTASAN")}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[12px] sm:text-[13px] font-extrabold text-[#0F253E]">
                  {safetyLevel}
                </span>
                <span className="rounded-md bg-[#DCFCE7] px-1.5 py-0.5 text-[9px] sm:text-[9.5px] font-bold text-[#15803D]">
                  {t("Active", "Aktibo")}
                </span>
              </div>
            </div>
          </div>

          <button
            id="tour-safety-level-btn"
            type="button"
            onClick={handleCycleSafetyLevel}
            className="text-[11px] sm:text-[12px] font-bold text-[#0077C8] hover:underline cursor-pointer"
          >
            {t("Change", "Palitan")}
          </button>
        </div>
      </div>

      {/* Filter Pills Row */}
      <div id="tour-moderation-tabs" className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`rounded-full px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-[12px] font-bold transition cursor-pointer ${
            activeTab === "all"
              ? "bg-[#0F253E] text-white"
              : "bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]"
          }`}
        >
          {t("All", "Lahat")} ({items.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`rounded-full px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-[12px] font-bold transition cursor-pointer ${
            activeTab === "pending"
              ? "bg-[#0F253E] text-white"
              : "bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]"
          }`}
        >
          {t("Pending", "Nakabinbin")} ({pendingCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("resolved")}
          className={`rounded-full px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-[12px] font-bold transition cursor-pointer ${
            activeTab === "resolved"
              ? "bg-[#0F253E] text-white"
              : "bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]"
          }`}
        >
          {t("Resolved", "Nalutas")} ({resolvedCount})
        </button>
      </div>

      {/* Moderation Queue Cards */}
      <div id="tour-moderation-queue" className="space-y-3 sm:space-y-4">
        {filteredItems.map((item) => {
          const isPending = item.status === "pending";

          const categoryBadgeStyle =
            item.categoryVariant === "danger"
              ? "bg-[#FFE4E6] text-[#E11D48]"
              : item.categoryVariant === "warning"
                ? "bg-[#FEF3C7] text-[#B45309]"
                : "bg-[#F3E8FF] text-[#7E22CE]";

          const statusPillStyle =
            item.status === "pending"
              ? "bg-[#FEF3C7] text-[#B45309]"
              : item.status === "blocked"
                ? "bg-[#FFE4E6] text-[#E11D48]"
                : "bg-[#DCFCE7] text-[#15803D]";

          return (
            <article
              key={item.id}
              className={`rounded-[16px] bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgba(15,37,62,0.03)] ${
                isPending
                  ? "border-[1.75px] border-[#FBBF24]"
                  : "border border-[#E6EDF5]"
              }`}
            >
              {/* Card Top Meta Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold ${categoryBadgeStyle}`}
                  >
                    {item.categoryVariant === "danger" && (
                      <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                    )}
                    {item.categoryVariant === "warning" && (
                      <Ban className="w-3 h-3" aria-hidden="true" />
                    )}
                    <span>{item.categoryLabel}</span>
                  </span>

                  <span className="text-[10px] sm:text-[11px] text-[#94A3B8]">
                    {item.timestamp} - {item.theme}
                  </span>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[9.5px] sm:text-[10.5px] font-bold flex-shrink-0 ${statusPillStyle}`}
                >
                  {item.statusBadge}
                </span>
              </div>

              {/* Speech & Recognized Text Boxes */}
              <div
                className={`mt-3 ${
                  item.recognizedText
                    ? "space-y-2 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-3"
                    : ""
                }`}
              >
                <div className="rounded-[10px] bg-[#F8FAFC] border border-[#EDF2F7] px-3.5 py-2.5">
                  <p className="text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[0.08em] text-[#94A3B8] flex items-center gap-1">
                    {isPending && (
                      <Mic className="w-2.5 h-2.5" aria-hidden="true" />
                    )}
                    <span>ORIGINAL SPEECH</span>
                  </p>
                  <p className="text-[11.5px] sm:text-[12.5px] italic text-[#334E68] mt-1">
                    {item.originalSpeech}
                  </p>
                </div>

                {item.recognizedText && (
                  <div className="rounded-[10px] bg-[#F0F7FF] border border-[#D4E7FF] px-3.5 py-2.5">
                    <p className="text-[9px] sm:text-[9.5px] font-bold uppercase tracking-[0.08em] text-[#0077C8] flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5" aria-hidden="true" />
                      <span>RECOGNIZED TEXT</span>
                    </p>
                    <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#0F253E] mt-1">
                      {item.recognizedText}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions or Resolved Footer */}
              {isPending ? (
                <div className="mt-3.5 flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => handleDecision(item.id, "blocked")}
                    className="flex-1 rounded-[10px] bg-[#0F253E] hover:bg-[#193556] text-white py-2.5 px-3 text-[11px] sm:text-[12px] font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Ban className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t("Keep Blocked", "Panatilihing Hinarang")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDecision(item.id, "overridden")}
                    className="flex-1 rounded-[10px] bg-[#10B981] hover:bg-[#059669] text-white py-2.5 px-3 text-[11px] sm:text-[12px] font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Check
                      className="w-3.5 h-3.5 stroke-[2.5]"
                      aria-hidden="true"
                    />
                    <span>{t("Override", "Payagan")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectedItem(item)}
                    aria-label="Inspect prompt details"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] flex items-center justify-center flex-shrink-0 transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-[10px] sm:text-[11px] text-[#94A3B8]">
                    {item.resolutionNote}
                  </span>

                  <button
                    type="button"
                    onClick={() => setInspectedItem(item)}
                    className="inline-flex items-center gap-1 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334E68] px-3 py-1 text-[10px] sm:text-[11px] font-bold transition cursor-pointer"
                  >
                    <Eye className="w-3 h-3" aria-hidden="true" />
                    <span>{t("Review Log", "Tingnan ang Log")}</span>
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Inspection Modal */}
      {inspectedItem && (
        <div
          className="fixed inset-0 z-50 bg-[#09192C]/50 backdrop-blur-[1px] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="inspect-modal-title"
        >
          <div className="w-full max-w-md rounded-[18px] bg-white border border-[#E6EDF5] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2
                id="inspect-modal-title"
                className="text-[15px] font-extrabold text-[#0F253E]"
              >
                {t("Moderation Log Detail", "Detalye ng Moderation Log")}
              </h2>
              <button
                type="button"
                onClick={() => setInspectedItem(null)}
                aria-label="Close detail dialog"
                className="p-1 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-[12px]">
              <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Category</span>
                <span className="font-bold text-[#0F253E]">
                  {inspectedItem.categoryLabel}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Time &amp; Theme</span>
                <span className="font-bold text-[#0F253E]">
                  {inspectedItem.timestamp} • {inspectedItem.theme}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Status</span>
                <span className="font-bold text-[#0F253E]">
                  {inspectedItem.statusBadge}
                </span>
              </div>
              <div className="pt-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Transcript
                </p>
                <p className="mt-1 italic text-[#334E68] bg-[#F8FAFC] p-2.5 rounded-[9px] border border-[#E6EDF5]">
                  {inspectedItem.originalSpeech}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/session-setup?step=3"
                className="text-[11.5px] font-bold text-[#0077C8] hover:underline"
              >
                {t("Configure Safety Rules", "I-configure ang Kaligtasan")}
              </Link>
              <button
                type="button"
                onClick={() => setInspectedItem(null)}
                className="rounded-[9px] bg-[#0F253E] text-white px-4 py-2 text-[12px] font-bold cursor-pointer"
              >
                {t("Done", "Tapos na")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
