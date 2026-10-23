"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import { PROTOTYPE_SCREENS } from "@/config/navigation";

export function PrototypeScreenSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(true);

  const currentFullUrl =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  return (
    <div className="fixed bottom-3 right-3 z-50 font-sans select-none">
      <div className="rounded-2xl bg-[#0A2540]/95 text-white border border-white/15 shadow-2xl backdrop-blur-md overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-3.5 py-2 border-b border-white/10">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-sky-200">
            <Layers className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
            <span>Screen Navigator (5 Mockups)</span>
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-label={isExpanded ? "Minimize screen navigator" : "Expand screen navigator"}
            className="p-1 rounded-md hover:bg-white/10 text-sky-200 transition cursor-pointer"
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="p-2 flex flex-wrap sm:flex-col gap-1 max-w-[240px]">
            {PROTOTYPE_SCREENS.map((screen) => {
              const isActive =
                currentFullUrl === screen.href ||
                (screen.id === "checking-connections" &&
                  pathname === "/checking-connections");

              return (
                <Link
                  key={screen.id}
                  href={screen.href}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition flex items-center justify-between ${
                    isActive
                      ? "bg-[#1D70B8] text-white font-semibold shadow-xs"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{screen.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
