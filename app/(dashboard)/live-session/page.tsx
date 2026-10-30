"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Activity,
  Ban,
  Eye,
  Pause,
  Plane,
  Play,
  Sparkles,
  UserPlus,
} from "lucide-react";
import {
  KIOSK_INFO,
  LIVE_GENERATION_FEED,
  LIVE_STATUS_STAGES,
} from "@/lib/mock-data";
import { useAppSettings } from "@/components/providers/app-settings-provider";

export default function LiveSessionPage() {
  const searchParams = useSearchParams();
  const { t } = useAppSettings();
  const initialActive = searchParams.get("session") === "active";

  const [isSessionActive, setIsSessionActive] = useState(initialActive);
  const [activeStage, setActiveStage] = useState(1);

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Top Dark Navy Live Session Monitor Banner */}
      <section
        id="tour-live-banner"
        aria-label="Live Session Monitor"
        className="relative overflow-hidden rounded-[18px] bg-[#0F233A] px-4 sm:px-6 py-4 sm:py-5 text-white shadow-[0_8px_24px_rgba(15,35,58,0.18)] transition-colors duration-200"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -right-8 w-44 h-44 rounded-full bg-[#0284C7]/25 blur-2xl"
        />

        {/* Top Row */}
        <div className="relative flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Activity
              className="w-3.5 h-3.5 text-[#38BDF8] stroke-[2.2] flex-shrink-0"
              aria-hidden="true"
            />
            <p className="text-[9.5px] sm:text-[10.5px] font-bold tracking-[0.12em] text-[#CBD5E1] uppercase truncate">
              {t("LIVE SESSION", "LIVE NA SESYON")} •{" "}
              {KIOSK_INFO.roomName.toUpperCase()}
            </p>
          </div>

          {isSessionActive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#113934] border border-[#22C55E]/40 px-2.5 py-0.5 text-[10px] font-semibold text-[#4ADE80] flex-shrink-0">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"
                aria-hidden="true"
              />
              <span>{t("Active session", "Aktibong sesyon")}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3A2E1E] border border-[#F59E0B]/40 px-2.5 py-0.5 text-[10px] font-semibold text-[#FBBF24] flex-shrink-0">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"
                aria-hidden="true"
              />
              <span>{t("No active session", "Walang aktibong sesyon")}</span>
            </span>
          )}
        </div>

        {/* Heading, Description & CTA */}
        <div className="relative mt-2.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-[16px] sm:text-[20px] font-extrabold text-white tracking-tight">
              {t("Live Session Monitor", "Monitor ng Live na Sesyon")}
            </h1>
            <p className="text-[11px] sm:text-[12.5px] text-[#94A8BE] mt-1 leading-relaxed max-w-xl">
              {t(
                "Watch children use the kiosk in real time and manage safety filters.",
                "Subaybayan ang paggamit ng mga bata sa kiosk nang real-time at pamahalaan ang safety filters."
              )}
            </p>
          </div>

          {isSessionActive ? (
            <button
              type="button"
              onClick={() => setIsSessionActive(false)}
              className="w-full lg:w-auto lg:min-w-[180px] rounded-[10px] bg-white/15 hover:bg-white/25 border border-white/15 text-white text-[12px] sm:text-[13px] font-bold py-2.5 px-5 flex items-center justify-center gap-2 transition flex-shrink-0 cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 fill-white text-white" />
              <span>{t("Pause Session", "I-pause ang Sesyon")}</span>
            </button>
          ) : (
            <Link
              href="/session-setup"
              className="w-full lg:w-auto lg:min-w-[180px] rounded-[10px] bg-[#0077C8] hover:opacity-95 text-white text-[12px] sm:text-[13px] font-bold py-2.5 px-5 flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,119,200,0.3)] transition flex-shrink-0"
            >
              <Play
                className="w-3.5 h-3.5 fill-white text-white"
                aria-hidden="true"
              />
              <span>{t("Start Session", "Simulan ang Sesyon")}</span>
            </Link>
          )}
        </div>
      </section>

      {/* Responsive Content Grid */}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
        {/* Left Column on Desktop: Status Pipeline + Queue */}
        <div className="space-y-4 lg:col-span-5">
          {/* Current Status Card */}
          <section
            id="tour-live-pipeline"
            aria-labelledby="current-status-heading"
            className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]"
          >
            <div className="flex items-center justify-between">
              <h2
                id="current-status-heading"
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748B]"
              >
                {t("CURRENT STATUS", "KASALUKUYANG STATUS")}
              </h2>
              <span className="rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-[10px] font-bold text-[#475569]">
                {isSessionActive
                  ? (LIVE_STATUS_STAGES.find((s) => s.step === activeStage)
                      ?.label ?? "Waiting")
                  : "Idle"}
              </span>
            </div>

            {/* 5-Stage Pipeline Stepper */}
            <div className="mt-3.5 grid grid-cols-5 gap-1 text-center">
              {LIVE_STATUS_STAGES.map((stage) => {
                const isActive = stage.step === activeStage;
                return (
                  <button
                    key={stage.step}
                    type="button"
                    onClick={() => setActiveStage(stage.step)}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-[11px] sm:text-[12px] font-bold flex items-center justify-center transition ${
                        isActive
                          ? "bg-[#0077C8] text-white shadow-xs"
                          : "bg-[#F1F5F9] text-[#94A3B8] group-hover:bg-[#E2E8F0]"
                      }`}
                    >
                      {stage.step}
                    </div>
                    <span
                      className={`mt-1.5 text-[9.5px] sm:text-[10.5px] ${
                        isActive
                          ? "font-bold text-[#0F253E]"
                          : "font-medium text-[#94A3B8]"
                      }`}
                    >
                      {stage.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Current Queue Card */}
          <section
            id="tour-live-queue"
            aria-labelledby="current-queue-heading"
            className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]"
          >
            <div className="flex items-center justify-between mb-3">
              <h2
                id="current-queue-heading"
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748B]"
              >
                {t("CURRENT QUEUE", "KASALUKUYANG PILA")}
              </h2>
              <span className="text-[10.5px] sm:text-[11px] font-medium text-[#94A3B8]">
                {t("0 children waiting", "0 bata ang naghihintay")}
              </span>
            </div>

            <div className="rounded-[12px] bg-[#F4F7FA] py-5 sm:py-6 px-4 flex flex-col items-center text-center">
              <UserPlus
                className="w-6 h-6 text-[#CBD5E1] stroke-[1.8]"
                aria-hidden="true"
              />
              <p className="mt-2 text-[11.5px] sm:text-[12.5px] font-bold text-[#334E68]">
                {t("No children in the queue", "Walang bata sa pila")}
              </p>
              <p className="mt-0.5 text-[10px] sm:text-[11px] text-[#94A3B8]">
                {t(
                  "Kiosk is ready for the next participant.",
                  "Handa na ang kiosk para sa susunod na kalahok."
                )}
              </p>
            </div>

            <p className="mt-2.5 text-center text-[9.5px] sm:text-[10.5px] italic text-[#94A3B8]">
              {t(
                "Children are numbered by position only. No names are stored.",
                "Naka-numero lamang ang mga bata ayon sa pila. Walang pangalang iniimbak."
              )}
            </p>
          </section>
        </div>

        {/* Right Column on Desktop: Live Generation Feed */}
        <section
          id="tour-live-feed"
          aria-labelledby="live-feed-heading"
          className="lg:col-span-7"
        >
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <h2
              id="live-feed-heading"
              className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748B]"
            >
              {t("LIVE GENERATION FEED", "LIVE GENERATION FEED")}
            </h2>
            <span className="text-[10.5px] sm:text-[11.5px] font-bold text-[#0077C8]">
              {t("Updated live", "Live na ina-update")}
            </span>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {LIVE_GENERATION_FEED.map((item) => {
              const isDanger = item.badgeVariant === "danger";

              const badgeClass =
                item.badgeVariant === "danger"
                  ? "bg-[#FFE4E6] text-[#E11D48]"
                  : item.badgeVariant === "success"
                    ? "bg-[#DCFCE7] text-[#15803D]"
                    : "bg-[#E0F2FE] text-[#0284C7]";

              const iconBoxClass =
                item.icon === "ban"
                  ? "bg-[#FFF1F2] text-[#E11D48]"
                  : item.icon === "plane"
                    ? "bg-[#DCFCE7] text-[#15803D]"
                    : "bg-[#E0F2FE] text-[#0284C7]";

              return (
                <article
                  key={item.id}
                  className={`rounded-[14px] bg-white p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(15,37,62,0.02)] ${
                    isDanger
                      ? "border-[1.5px] border-[#FDA4AF]"
                      : "border border-[#E6EDF5]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-[9px] flex items-center justify-center flex-shrink-0 ${iconBoxClass}`}
                      >
                        {item.icon === "ban" && (
                          <Ban
                            className="w-4 h-4 stroke-[2]"
                            aria-hidden="true"
                          />
                        )}
                        {item.icon === "plane" && (
                          <Plane
                            className="w-4 h-4 stroke-[2]"
                            aria-hidden="true"
                          />
                        )}
                        {item.icon === "cat" && (
                          <Sparkles
                            className="w-4 h-4 stroke-[2]"
                            aria-hidden="true"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="text-[12px] sm:text-[13px] font-bold text-[#0F253E]">
                            {item.title}
                          </h3>
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[9px] sm:text-[9.5px] font-bold ${badgeClass}`}
                          >
                            {item.badgeText}
                          </span>
                        </div>
                        <p className="text-[10.5px] sm:text-[11.5px] text-[#64748B] mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <span className="text-[9.5px] sm:text-[10.5px] text-[#94A3B8] flex-shrink-0">
                      {item.timestamp}
                    </span>
                  </div>

                  {item.requiresAction && (
                    <div className="mt-3 pt-2.5 border-t border-[#FFF1F2] flex items-center justify-between gap-2">
                      <span className="text-[10px] sm:text-[11px] font-medium text-[#64748B]">
                        {item.actionNote}
                      </span>

                      <Link
                        href="/moderation"
                        className="inline-flex items-center gap-1 rounded-full bg-[#F43F5E] hover:bg-[#E11D48] text-white px-3 py-1 text-[10px] sm:text-[11px] font-bold shadow-xs transition"
                      >
                        <Eye className="w-3 h-3" aria-hidden="true" />
                        <span>{t("Review", "Suriin")}</span>
                      </Link>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
