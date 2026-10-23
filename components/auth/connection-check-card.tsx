"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { INITIAL_CONNECTION_CHECKS } from "@/lib/mock-data";
import type { ConnectionCheckItem } from "@/types/kiosk";

export function ConnectionCheckCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stayOnPage = searchParams.get("stay") === "1";

  useEffect(() => {
    if (stayOnPage) return;
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3200);
    return () => clearTimeout(timer);
  }, [router, stayOnPage]);

  return (
    <section
      aria-labelledby="system-check-heading"
      onClick={() => router.push("/dashboard")}
      title="Click to continue to Dashboard"
      className="w-full bg-white rounded-[26px] sm:rounded-[30px] px-6 sm:px-9 pt-6 sm:pt-8 pb-7 sm:pb-9 shadow-[0_18px_42px_rgba(9,45,80,0.14)] cursor-pointer"
    >
      {/* Card Top Brand */}
      <p className="text-[21px] sm:text-[24px] font-bold text-[#004A7C] text-center tracking-tight mb-4 sm:mb-5">
        WishPix
      </p>

      {/* Overline & Heading */}
      <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.14em] text-[#1D70B8] uppercase">
        SYSTEM CHECK
      </p>
      <h2
        id="system-check-heading"
        className="text-[26px] sm:text-[30px] font-normal text-[#143350] tracking-tight mt-1 leading-tight"
      >
        Getting ready...
      </h2>
      <p className="text-[11.5px] sm:text-[13px] text-[#7D8E9F] mt-1.5">
        Making sure everything is connected before starting
      </p>

      {/* Connection Status Checklist */}
      <ul className="mt-6 sm:mt-7 space-y-5 sm:space-y-6 pl-3">
        {INITIAL_CONNECTION_CHECKS.map((item) => (
          <ConnectionRow key={item.id} item={item} />
        ))}
      </ul>

      {/* Bottom Note */}
      <p className="text-[11px] sm:text-[12px] font-bold text-[#1D70B8] mt-7 sm:mt-8 pl-3">
        This only takes a moment.
      </p>
    </section>
  );
}

function ConnectionRow({ item }: { item: ConnectionCheckItem }) {
  return (
    <li className="flex items-center gap-4">
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {item.state === "online" && (
          <span className="w-5 h-5 rounded-full bg-[#15803D] flex items-center justify-center text-white">
            <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
          </span>
        )}
        {item.state === "checking" && (
          <span
            className="w-[19px] h-[19px] rounded-full border-2 border-[#CBD5E1] border-t-[#1E293B] border-r-[#1E293B] animate-spin"
            aria-hidden="true"
          />
        )}
        {item.state === "waiting" && (
          <span
            className="w-[19px] h-[19px] rounded-full border-[1.75px] border-[#94A3B8]"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="leading-tight">
        <p className="text-[12.5px] sm:text-[13.5px] font-bold text-[#1E3B58]">
          {item.label}
        </p>
        <p className="text-[11px] sm:text-[12px] text-[#7D8E9F] mt-0.5">
          {item.statusText}
        </p>
      </div>
    </li>
  );
}
