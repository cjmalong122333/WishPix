"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePwaInstall } from "@/components/providers/pwa-install-provider";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const { isStandalone } = usePwaInstall();

  const brandHref = isStandalone ? "/login" : "/";
  const visibleNavLinks = isStandalone
    ? NAV_LINKS.filter((item) => item.href !== "/")
    : NAV_LINKS;

  return (
    <header className="w-full max-w-[1200px] 2xl:max-w-[1320px] mx-auto pt-3 sm:pt-5 lg:pt-[clamp(14px,2.2vh,28px)] px-3 sm:px-6 lg:px-8 shrink-0">
      <div className="w-full rounded-[18px] sm:rounded-[24px] bg-white border border-[#EFEAFA] shadow-[0_4px_24px_rgba(109,72,223,0.05)] px-3.5 sm:px-6 lg:px-7 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
        {/* Top Row on Mobile / Left on sm+: WishPix Brand Mark + Mobile Log in */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href={brandHref}
            prefetch
            className="inline-flex items-center gap-2.5 sm:gap-3.5 no-underline group min-w-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-[12px] sm:rounded-[14px] bg-[#6D48DF] group-hover:bg-[#5E38D0] transition-colors flex items-center justify-center text-white shadow-[0_4px_12px_rgba(109,72,223,0.25)] shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                aria-hidden="true"
              >
                <path
                  d="M12 2.75L14.72 8.26L20.8 9.14L16.4 13.43L17.44 19.49L12 16.63L6.56 19.49L7.6 13.43L3.2 9.14L9.28 8.26L12 2.75Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="flex flex-col leading-none truncate">
              <span className="text-[19px] sm:text-[22px] lg:text-[25px] font-extrabold text-[#231B3B] tracking-tight">
                WishPix
              </span>
              <span className="mt-1 text-[8px] sm:text-[9.5px] lg:text-[10px] font-semibold tracking-[0.14em] text-[#7A7393] uppercase">
                IMAGINATION STATION
              </span>
            </div>
          </Link>

          {/* Mobile-only compact Log in button on top right */}
          <Link
            href="/login"
            prefetch
            aria-current={pathname === "/login" ? "page" : undefined}
            className="sm:hidden px-4 py-2 rounded-full bg-[#6D48DF] hover:bg-[#5B36CA] active:scale-[0.98] text-white text-[12.5px] font-bold shadow-[0_4px_12px_rgba(109,72,223,0.25)] transition-all no-underline shrink-0"
          >
            Log in
          </Link>
        </div>

        {/* Navigation Links + Desktop/Tablet Log in Pill Button */}
        <nav
          aria-label="Primary navigation"
          className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-3 md:gap-5 lg:gap-7 border-t border-[#F3EFFC] sm:border-t-0 pt-2 sm:pt-0"
        >
          <div className="flex items-center justify-around sm:justify-end w-full sm:w-auto gap-1 sm:gap-2 md:gap-3">
            {visibleNavLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  aria-current={isActive ? "page" : undefined}
                  className={`flex-1 sm:flex-initial text-center px-3.5 sm:px-5 lg:px-6 py-1.5 sm:py-2 rounded-full text-[13px] sm:text-[14px] lg:text-[15px] font-bold transition-all no-underline ${
                    isActive
                      ? "bg-[#EDE7FC] text-[#6D48DF]"
                      : "text-[#231B3B] hover:text-[#6D48DF] hover:bg-[#F5F1FE]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <Link
            href="/login"
            prefetch
            aria-current={pathname === "/login" ? "page" : undefined}
            className="hidden sm:inline-flex items-center justify-center px-6 md:px-8 lg:px-9 py-2 sm:py-2.5 lg:py-3 rounded-full bg-[#6D48DF] hover:bg-[#5B36CA] active:scale-[0.98] text-white text-[13.5px] sm:text-[14px] lg:text-[15px] font-bold shadow-[0_4px_14px_rgba(109,72,223,0.28)] transition-all no-underline shrink-0"
          >
            Log in
          </Link>
        </nav>
      </div>
    </header>
  );
}
