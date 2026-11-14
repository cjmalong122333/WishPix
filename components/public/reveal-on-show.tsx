"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

export type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "pop-scale"
  | "slide-left"
  | "slide-right"
  | "blur-in";

interface PublicDisplayContextValue {
  displayCycle: number;
  triggerDisplayReplay: () => void;
}

const PublicDisplayContext = createContext<PublicDisplayContextValue>({
  displayCycle: 0,
  triggerDisplayReplay: () => {},
});

export function usePublicDisplay() {
  return useContext(PublicDisplayContext);
}

export function PublicDisplayProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [displayCycle, setDisplayCycle] = useState(0);

  const triggerDisplayReplay = useCallback(() => {
    setDisplayCycle((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setDisplayCycle((prev) => prev + 1);
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return (
    <PublicDisplayContext.Provider
      value={{ displayCycle, triggerDisplayReplay }}
    >
      {children}
    </PublicDisplayContext.Provider>
  );
}

interface RevealOnShowProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delayMs?: number;
  className?: string;
  as?:
    | "div"
    | "section"
    | "footer"
    | "header"
    | "nav"
    | "span"
    | "p"
    | "h1"
    | "h2"
    | "h3";
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const VARIANT_CLASS_MAP: Record<RevealVariant, [string, string]> = {
  "fade-up": ["wishpix-reveal-fade-up-a", "wishpix-reveal-fade-up-b"],
  "fade-down": ["wishpix-reveal-fade-down-a", "wishpix-reveal-fade-down-b"],
  "pop-scale": ["wishpix-reveal-pop-scale-a", "wishpix-reveal-pop-scale-b"],
  "slide-left": ["wishpix-reveal-slide-left-a", "wishpix-reveal-slide-left-b"],
  "slide-right": [
    "wishpix-reveal-slide-right-a",
    "wishpix-reveal-slide-right-b",
  ],
  "blur-in": ["wishpix-reveal-blur-in-a", "wishpix-reveal-blur-in-b"],
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
  const { displayCycle } = usePublicDisplay();
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [viewportCycle, setViewportCycle] = useState(0);
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
              setViewportCycle((prev) => prev + 1);
            }
          } else {
            hasLeftViewportRef.current = true;
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.06,
        rootMargin: "0px 0px -10px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [pathname, displayCycle]);

  const totalCycle = displayCycle + viewportCycle;
  const parityIndex = totalCycle % 2;

  // On scroll re-entry, keep stagger compact so elements glide in immediately
  const effectiveDelay =
    viewportCycle > 0 ? Math.min(delayMs, 160) : delayMs;

  const animationClass = isVisible
    ? VARIANT_CLASS_MAP[variant][parityIndex]
    : "wishpix-reveal-hidden";

  return (
    <Component
      ref={ref as React.RefObject<never>}
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      data-reveal-cycle={totalCycle}
      data-reveal-parity={parityIndex === 0 ? "a" : "b"}
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
