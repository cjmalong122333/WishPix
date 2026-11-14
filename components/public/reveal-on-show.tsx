"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export type RevealVariant =
  | "fade-up"
  | "pop-scale"
  | "slide-left"
  | "slide-right";

interface RevealOnShowProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delayMs?: number;
  className?: string;
  as?: "div" | "section" | "footer" | "header" | "p" | "h1" | "h2";
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const VARIANT_CLASS_MAP: Record<RevealVariant, string> = {
  "fade-up": "wishpix-reveal-fade-up",
  "pop-scale": "wishpix-reveal-pop-scale",
  "slide-left": "wishpix-reveal-slide-left",
  "slide-right": "wishpix-reveal-slide-right",
};

export function RevealOnShow({
  children,
  variant = "fade-up",
  delayMs = 0,
  className = "",
  as: Component = "div",
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: RevealOnShowProps) {
  const pathname = usePathname();
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [animCycle, setAnimCycle] = useState(0);
  const hasLeftViewportRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (hasLeftViewportRef.current) {
              hasLeftViewportRef.current = false;
              setAnimCycle((prev) => prev + 1);
            }
          } else {
            hasLeftViewportRef.current = true;
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -12px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  // Once the user scrolls an element out of view and back in, use a compact
  // stagger so viewport re-entry feels immediate and responsive.
  const effectiveDelay =
    animCycle > 0 ? Math.min(delayMs, 180) : delayMs;

  const animationClass = isVisible
    ? VARIANT_CLASS_MAP[variant]
    : "wishpix-reveal-hidden";

  return (
    <Component
      ref={ref as React.RefObject<never>}
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      data-reveal-cycle={animCycle}
      style={
        {
          "--reveal-delay": `${effectiveDelay}ms`,
        } as React.CSSProperties
      }
      className={`${animationClass} ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
