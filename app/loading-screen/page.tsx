"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, WandSparkles } from "lucide-react";

const LOADING_STAGES = [
  "Initializing WishPix Educator Environment...",
  "Syncing Rainbow Room Kiosk Telemetry...",
  "Preparing Voice & Safety Modules...",
  "Ready! Launching Teacher App...",
];

function LoadingScreenContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stayOnPage = searchParams.get("stay") === "1";

  const [progress, setProgress] = useState(18);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return stayOnPage ? 22 : 100;
        return Math.min(100, prev + 4);
      });
    }, 95);

    const stageInterval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % LOADING_STAGES.length);
    }, 850);

    let redirectTimer: ReturnType<typeof setTimeout> | undefined;
    if (!stayOnPage) {
      redirectTimer = setTimeout(() => {
        router.push("/login");
      }, 2700);
    }

    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [router, stayOnPage]);

  return (
    <div
      onClick={() => router.push("/login")}
      title="Click anywhere to proceed to Login"
      className="relative flex-1 min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-[#C7D6EB] via-[#A8BBD3] to-[#8F969E] overflow-hidden cursor-pointer select-none py-8"
    >
      {/* Subtle Ambient Background Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute w-56 h-56 rounded-full bg-[#0077C8]/15 blur-2xl" />
      </div>

      {/* Top Spacer */}
      <div className="px-6 text-center relative z-10">
        <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#155E95]/80 uppercase">
          LOCAL. SECURE. MADE FOR TEACHERS.
        </p>
      </div>

      {/* Center Multi-Layer Animated Orbital Loader */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 my-auto">
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
          {/* Expanding Ripple Pulse Ring */}
          <span
            aria-hidden="true"
            className="wishpix-ring-ripple absolute inset-2 rounded-full border-2 border-[#0F253E]/30"
          />

          {/* Outer Dashed Counter-Rotating Ring */}
          <svg
            viewBox="0 0 120 120"
            className="wishpix-orbit-reverse absolute inset-0 w-full h-full"
            aria-hidden="true"
          >
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#0F253E"
              strokeOpacity="0.16"
              strokeWidth="2"
              strokeDasharray="6 8"
            />
          </svg>

          {/* Primary Bold Spinner Ring */}
          <svg
            viewBox="0 0 100 100"
            className="wishpix-orbit-ring w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_6px_16px_rgba(15,37,62,0.22)]"
            role="status"
            aria-label="Loading WishPix Teacher App"
          >
            {/* Base Track Ring */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#4B5B6B"
              strokeOpacity="0.72"
              strokeWidth="8.5"
            />
            {/* Active Dark-Navy & Blue Quarter Arc */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="url(#wishpixSpinnerGrad)"
              strokeWidth="8.5"
              strokeLinecap="round"
              strokeDasharray="66 180"
            />
            <defs>
              <linearGradient
                id="wishpixSpinnerGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#050D17" />
                <stop offset="65%" stopColor="#0F253E" />
                <stop offset="100%" stopColor="#0077C8" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Floating Brand Emblem */}
          <div className="wishpix-float-pulse absolute w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#0F253E] border border-white/15 shadow-[0_8px_20px_rgba(15,37,62,0.35)] flex items-center justify-center text-[#38BDF8]">
            <WandSparkles className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
          </div>
        </div>

        {/* Brand & Animated Progress Indicator */}
        <div className="mt-7 flex flex-col items-center text-center max-w-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F253E]/10 border border-[#0F253E]/15 backdrop-blur-xs">
            <Sparkles
              className="w-3.5 h-3.5 text-[#0066B2]"
              aria-hidden="true"
            />
            <span className="text-[11px] font-bold tracking-wide text-[#0F253E]">
              WishPix Teacher App
            </span>
          </div>

          <p
            aria-live="polite"
            className="mt-3 text-[12.5px] sm:text-[13.5px] font-semibold text-[#16324F] min-h-[20px] transition-opacity duration-300"
          >
            {LOADING_STAGES[stageIndex]}
          </p>

          {/* Sleek Shimmer Progress Bar */}
          <div className="mt-3.5 w-48 sm:w-56 h-1.5 rounded-full bg-[#0F253E]/15 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0F253E] via-[#0066B2] to-[#38BDF8] transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
            <div
              aria-hidden="true"
              className="wishpix-shimmer absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent"
            />
          </div>
        </div>
      </main>

      <div aria-hidden="true" />
    </div>
  );
}

export default function LoadingScreenPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-gradient-to-b from-[#C7D6EB] via-[#A8BBD3] to-[#8F969E]" />
      }
    >
      <LoadingScreenContent />
    </Suspense>
  );
}
