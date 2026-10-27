"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { INITIAL_CONNECTION_CHECKS } from "@/lib/mock-data";
import type { ConnectionCheckItem } from "@/types/kiosk";

export function ConnectionCheckCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stayOnPage = searchParams.get("stay") === "1";
  const forcedState = searchParams.get("state"); // "checking" | "ready" | null

  const [autoReady, setAutoReady] = useState(false);

  const isAllReady =
    forcedState === "ready" || (forcedState !== "checking" && autoReady);

  useEffect(() => {
    if (forcedState === "checking" || forcedState === "ready") {
      return;
    }

    router.prefetch("/dashboard");

    const readyTimer = setTimeout(() => {
      setAutoReady(true);
    }, 1600);

    let redirectTimer: ReturnType<typeof setTimeout> | undefined;
    let hardFallbackTimer: ReturnType<typeof setTimeout> | undefined;
    if (!stayOnPage) {
      redirectTimer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);

      hardFallbackTimer = setTimeout(() => {
        if (window.location.pathname.startsWith("/checking-connections")) {
          window.location.assign("/dashboard");
        }
      }, 4500);
    }

    return () => {
      clearTimeout(readyTimer);
      if (redirectTimer) clearTimeout(redirectTimer);
      if (hardFallbackTimer) clearTimeout(hardFallbackTimer);
    };
  }, [forcedState, router, stayOnPage]);

  const items: ConnectionCheckItem[] = INITIAL_CONNECTION_CHECKS.map((item) =>
    isAllReady
      ? {
          ...item,
          state: "online",
          statusText: item.readyText,
        }
      : item
  );

  return (
    <Link
      href="/dashboard"
      aria-labelledby="system-check-heading"
      title="Tap to continue to Dashboard"
      className="block w-full rounded-[16px] bg-[#162F4D] border border-white/25 px-5 sm:px-6 pt-5 pb-5 text-white shadow-[0_18px_38px_rgba(7,22,40,0.42)] cursor-pointer no-underline"
    >
      {/* Card Top Brand */}
      <p className="text-[15px] sm:text-[16px] font-bold text-white text-center tracking-tight mb-3">
        WishPix
      </p>

      {/* Overline & Heading */}
      <p className="text-[9px] sm:text-[9.5px] font-semibold tracking-[0.14em] text-[#94A8BE] uppercase">
        SYSTEM CHECK
      </p>
      <h2
        id="system-check-heading"
        className="text-[19px] sm:text-[21px] font-bold text-white tracking-tight mt-0.5 leading-snug"
      >
        Getting ready...
      </h2>
      <p className="text-[10.5px] sm:text-[11px] text-[#8FA5BC] mt-1">
        Making sure everything is connected before starting
      </p>

      {/* Divider Line */}
      <hr className="border-t border-white/20 my-3.5" />

      {/* Connection Status Checklist */}
      <ul className="space-y-3.5">
        {items.map((item) => (
          <ConnectionRow key={item.id} item={item} />
        ))}
      </ul>

      {/* Bottom Note */}
      <p className="text-[9.5px] sm:text-[10px] font-medium text-[#B0C4D8] mt-4">
        {isAllReady
          ? "All systems are ready, redirecting to dashboard..."
          : "This only takes a moment."}
      </p>
    </Link>
  );
}

function ConnectionRow({ item }: { item: ConnectionCheckItem }) {
  const isOnline = item.state === "online";

  return (
    <li className="flex items-center gap-3">
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {isOnline && (
          <span className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center text-white shadow-[0_0_8px_rgba(34,197,94,0.45)]">
            <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
          </span>
        )}
        {item.state === "checking" && (
          <span
            className="w-5 h-5 rounded-full border-[1.75px] border-[#94A8BE] border-t-white animate-spin"
            aria-hidden="true"
          />
        )}
        {item.state === "waiting" && (
          <span
            className="w-5 h-5 rounded-full border-[1.75px] border-[#94A8BE]/80"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="leading-tight">
        <p className="text-[11.5px] sm:text-[12px] font-bold text-white">
          {item.label}
        </p>
        <p
          className={`text-[10px] sm:text-[10.5px] mt-0.5 font-medium ${
            isOnline ? "text-[#22C55E]" : "text-[#8FA5BC]"
          }`}
        >
          {item.statusText}
        </p>
      </div>
    </li>
  );
}
