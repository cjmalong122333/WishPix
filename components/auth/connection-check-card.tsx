"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { RevealOnShow } from "@/components/public/reveal-on-show";
import { checkSystemConnectionsAction } from "@/lib/actions";
import { INITIAL_CONNECTION_CHECKS } from "@/lib/mock-data";
import type { ConnectionCheckItem } from "@/types/kiosk";

export function ConnectionCheckCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stayOnPage = searchParams.get("stay") === "1";
  const forcedState = searchParams.get("state"); // "checking" | "ready" | null
  const redirectParam = searchParams.get("redirect");
  const targetDashboardUrl =
    redirectParam &&
    redirectParam.startsWith("/") &&
    !redirectParam.startsWith("//")
      ? redirectParam
      : "/dashboard";

  const [autoReady, setAutoReady] = useState(false);
  const [liveChecks, setLiveChecks] = useState<ConnectionCheckItem[] | null>(
    null
  );

  const isAllReady =
    forcedState === "ready" || (forcedState !== "checking" && autoReady);

  useEffect(() => {
    if (forcedState === "checking" || forcedState === "ready") {
      return;
    }

    router.prefetch(targetDashboardUrl);

    let cancelled = false;
    checkSystemConnectionsAction()
      .then((res) => {
        if (!cancelled && res.ok) {
          setLiveChecks(res.checks);
        }
      })
      .catch(() => {
        // Fallback to timer-based check
      });

    const readyTimer = setTimeout(() => {
      if (!cancelled) {
        setAutoReady(true);
      }
    }, 1600);

    let redirectTimer: ReturnType<typeof setTimeout> | undefined;
    let hardFallbackTimer: ReturnType<typeof setTimeout> | undefined;
    if (!stayOnPage) {
      redirectTimer = setTimeout(() => {
        router.push(targetDashboardUrl);
      }, 3000);

      hardFallbackTimer = setTimeout(() => {
        if (window.location.pathname.startsWith("/checking-connections")) {
          window.location.assign(targetDashboardUrl);
        }
      }, 4500);
    }

    return () => {
      cancelled = true;
      clearTimeout(readyTimer);
      if (redirectTimer) clearTimeout(redirectTimer);
      if (hardFallbackTimer) clearTimeout(hardFallbackTimer);
    };
  }, [forcedState, router, stayOnPage, targetDashboardUrl]);

  const items: ConnectionCheckItem[] =
    isAllReady && liveChecks
      ? liveChecks
      : INITIAL_CONNECTION_CHECKS.map((item) =>
          isAllReady
            ? {
                ...item,
                state: "online",
                statusText: item.readyText,
              }
            : item
        );

  return (
    <RevealOnShow variant="pop-scale" delayMs={40}>
      <Link
        href={targetDashboardUrl}
        aria-labelledby="system-check-heading"
        title="Tap to continue to Dashboard"
        className="wishpix-public-card-hover block w-full rounded-[24px] bg-white border border-[#F2EEFB] px-6 sm:px-8 pt-6 pb-6 text-[#231B3B] shadow-[0_8px_30px_rgba(109,72,223,0.06)] cursor-pointer no-underline"
      >
        {/* Card Top Brand */}
        <RevealOnShow
          as="p"
          variant="fade-down"
          delayMs={80}
          className="text-[15px] sm:text-[16px] font-extrabold text-[#231B3B] text-center tracking-tight mb-3"
        >
          WishPix
        </RevealOnShow>

        {/* Overline & Heading */}
        <RevealOnShow
          as="p"
          variant="fade-down"
          delayMs={115}
          className="text-[9px] sm:text-[9.5px] font-extrabold tracking-[0.14em] text-[#6D48DF] uppercase"
        >
          SYSTEM CHECK
        </RevealOnShow>
        <RevealOnShow
          as="h2"
          id="system-check-heading"
          variant="fade-up"
          delayMs={150}
          className="text-[19px] sm:text-[21px] font-extrabold text-[#231B3B] tracking-tight mt-0.5 leading-snug"
        >
          Getting ready...
        </RevealOnShow>
        <RevealOnShow
          as="p"
          variant="blur-in"
          delayMs={185}
          className="text-[10.5px] sm:text-[11px] text-[#766F8E] mt-1 font-medium"
        >
          Making sure everything is connected before starting
        </RevealOnShow>

        {/* Divider Line */}
        <hr className="border-t border-[#F3EFFC] my-4" />

        {/* Connection Status Checklist */}
        <ul className="space-y-3.5">
          {items.map((item, idx) => (
            <RevealOnShow
              as="li"
              key={item.id}
              variant="fade-up"
              delayMs={220 + idx * 55}
              className="flex items-center gap-3"
            >
              <ConnectionRow item={item} />
            </RevealOnShow>
          ))}
        </ul>

        {/* Bottom Note */}
        <RevealOnShow
          as="p"
          variant="blur-in"
          delayMs={440}
          className="text-[9.5px] sm:text-[10px] font-semibold text-[#7A7393] mt-4"
        >
          {isAllReady
            ? "All systems are ready, redirecting to dashboard..."
            : "This only takes a moment."}
        </RevealOnShow>
      </Link>
    </RevealOnShow>
  );
}

function ConnectionRow({ item }: { item: ConnectionCheckItem }) {
  const isOnline = item.state === "online";

  return (
    <>
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {isOnline && (
          <span className="wishpix-reveal-pop-scale w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center text-white shadow-[0_0_8px_rgba(34,197,94,0.35)]">
            <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
          </span>
        )}
        {item.state === "checking" && (
          <span
            className="w-5 h-5 rounded-full border-[1.75px] border-[#E2DCF3] border-t-[#6D48DF] animate-spin"
            aria-hidden="true"
          />
        )}
        {item.state === "waiting" && (
          <span
            className="w-5 h-5 rounded-full border-[1.75px] border-[#E2DCF3]"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="leading-tight">
        <p className="text-[11.5px] sm:text-[12px] font-bold text-[#231B3B]">
          {item.label}
        </p>
        <p
          className={`text-[10px] sm:text-[10.5px] mt-0.5 font-medium transition-colors duration-300 ${
            isOnline ? "text-[#16A34A]" : "text-[#766F8E]"
          }`}
        >
          {item.statusText}
        </p>
      </div>
    </>
  );
}
