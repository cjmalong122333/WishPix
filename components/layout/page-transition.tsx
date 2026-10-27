"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, Sparkles } from "lucide-react";
import { useAppSettings } from "@/components/providers/app-settings-provider";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({
  children,
  className = "",
}: PageTransitionProps) {
  const pathname = usePathname();
  const { t } = useAppSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const previousPathnameRef = useRef<string>(pathname);
  const lastScrollYRef = useRef<number>(0);
  const scrollDirectionRef = useRef<"up" | "down">("down");

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  // Accessibility focus management on route change
  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;
    previousPathnameRef.current = pathname;

    const container = containerRef.current;
    if (!container) return;

    const active = document.activeElement;
    if (!active || active === document.body || !document.body.contains(active)) {
      const heading = container.querySelector<HTMLElement>("h1, h2");
      if (heading) {
        if (!heading.hasAttribute("tabindex")) {
          heading.setAttribute("tabindex", "-1");
          heading.classList.add("outline-none");
        }
        heading.focus({ preventScroll: true });
      } else {
        container.focus({ preventScroll: true });
      }
    }
  }, [pathname]);

  // Track scroll direction & trigger scroll-up reveal animations on page sections
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let ticking = false;
    let stopUpGlowTimeout: ReturnType<typeof setTimeout> | undefined;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollYRef.current;

        if (delta < -4) {
          scrollDirectionRef.current = "up";
          document.documentElement.setAttribute("data-scroll-dir", "up");
          setIsScrollingUp(true);
          if (stopUpGlowTimeout) clearTimeout(stopUpGlowTimeout);
          stopUpGlowTimeout = setTimeout(() => {
            setIsScrollingUp(false);
          }, 650);
        } else if (delta > 4) {
          scrollDirectionRef.current = "down";
          document.documentElement.setAttribute("data-scroll-dir", "down");
          setIsScrollingUp(false);
        }

        setShowScrollTop(currentY > 180);
        lastScrollYRef.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Observe cards and sections inside the active page so they play a smooth
    // cascade animation when entering the viewport while scrolling
    const container = containerRef.current;
    let observer: IntersectionObserver | undefined;
    let hasUserScrolled = false;

    const markScrolled = () => {
      hasUserScrolled = true;
    };
    window.addEventListener("scroll", markScrolled, {
      passive: true,
      once: true,
    });

    if (container && !prefersReducedMotion && "IntersectionObserver" in window) {
      const pageRoot =
        (container.firstElementChild as HTMLElement | null) ?? container;
      const targets = Array.from(
        pageRoot.querySelectorAll<HTMLElement>(
          ":scope > *, :scope > div > section, :scope > div > div"
        )
      );

      observer = new IntersectionObserver(
        (entries) => {
          if (!hasUserScrolled) return;
          entries.forEach((entry) => {
            const el = entry.target as HTMLElement;

            if (entry.isIntersecting) {
              if (scrollDirectionRef.current === "up") {
                el.classList.remove("wishpix-scroll-down-reveal");
                el.classList.add("wishpix-scroll-up-reveal");
              } else {
                el.classList.remove("wishpix-scroll-up-reveal");
                el.classList.add("wishpix-scroll-down-reveal");
              }
              el.dataset.scrollVisible = "true";
            } else {
              el.dataset.scrollVisible = "false";
              el.classList.remove(
                "wishpix-scroll-up-reveal",
                "wishpix-scroll-down-reveal"
              );
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: "24px 0px 24px 0px",
        }
      );

      targets.forEach((el) => observer?.observe(el));
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", markScrolled);
      if (stopUpGlowTimeout) clearTimeout(stopUpGlowTimeout);
      observer?.disconnect();
    };
  }, [pathname]);

  const handleBackToTop = () => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && containerRef.current) {
      containerRef.current.classList.remove("wishpix-scroll-top-boost");
      void containerRef.current.offsetWidth;
      containerRef.current.classList.add("wishpix-scroll-top-boost");
    }

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <>
      {/* Subtle Top Scroll-Up Aurora Indicator */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 inset-x-0 z-40 h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent transition-opacity duration-300 ${
          isScrollingUp && showScrollTop ? "opacity-90" : "opacity-0"
        }`}
      />

      <div
        key={pathname}
        ref={containerRef}
        tabIndex={-1}
        className={`wishpix-page-transition outline-none ${className}`}
      >
        {children}
      </div>

      {/* Floating Scroll-Up Action Pill */}
      <button
        type="button"
        onClick={handleBackToTop}
        aria-label={t("Scroll back to top", "Bumalik sa itaas")}
        className={`fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#085081] text-white px-3.5 py-2.5 text-[11.5px] font-bold shadow-[0_10px_25px_rgba(8,80,129,0.35)] border border-white/20 cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${
          showScrollTop
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-6 opacity-0 pointer-events-none"
        } ${
          isScrollingUp
            ? "ring-4 ring-[#38BDF8]/35 shadow-[0_12px_30px_rgba(0,119,200,0.45)]"
            : ""
        }`}
      >
        <span
          className={`w-6 h-6 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-300 ${
            isScrollingUp ? "-translate-y-0.5 scale-110" : ""
          }`}
        >
          <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
        </span>
        <span className="hidden sm:inline">{t("Top", "Itaas")}</span>
        {isScrollingUp && (
          <Sparkles
            className="w-3 h-3 text-[#38BDF8] animate-pulse"
            aria-hidden="true"
          />
        )}
      </button>
    </>
  );
}
