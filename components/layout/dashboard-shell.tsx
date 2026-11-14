"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { NavigationDrawer } from "@/components/layout/navigation-drawer";
import { PageTransition } from "@/components/layout/page-transition";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import { OnboardingTourProvider } from "@/components/providers/onboarding-tour-provider";
import { logoutEducatorAction } from "@/lib/actions";
import { KIOSK_INFO } from "@/lib/mock-data";
import type { KioskInfo } from "@/types/kiosk";

const EDUCATOR_SESSION_STORAGE_KEY = "wishpix_educator_session_v1";

function subscribeEducatorSession(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getEducatorSessionSnapshot(): string | null {
  try {
    return window.localStorage.getItem(EDUCATOR_SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

function getEducatorSessionServerSnapshot(): string | null {
  return null;
}

function parseLogoutDurationMs(duration: string): number | null {
  switch (duration) {
    case "5 minutes":
      return 5 * 60 * 1000;
    case "15 minutes":
      return 15 * 60 * 1000;
    case "30 minutes":
      return 30 * 60 * 1000;
    case "1 hour":
      return 60 * 60 * 1000;
    case "Never":
    default:
      return null;
  }
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navParam = searchParams.get("nav");

  const { autoLogoutEnabled, autoLogoutDuration, t } = useAppSettings();

  const [isMobileManualOpen, setIsMobileManualOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const rawEducatorSession = useSyncExternalStore(
    subscribeEducatorSession,
    getEducatorSessionSnapshot,
    getEducatorSessionServerSnapshot
  );

  const kioskInfo = useMemo<KioskInfo>(() => {
    if (!rawEducatorSession) return KIOSK_INFO;
    try {
      const parsed = JSON.parse(rawEducatorSession) as {
        displayName?: string;
        initials?: string;
      };
      return {
        ...KIOSK_INFO,
        educatorName: parsed.displayName || KIOSK_INFO.educatorName,
        educatorInitials: parsed.initials || KIOSK_INFO.educatorInitials,
      };
    } catch {
      return KIOSK_INFO;
    }
  }, [rawEducatorSession]);

  const isMobileDrawerOpen = isMobileManualOpen || navParam === "open";
  const effectiveDesktopSidebarOpen =
    isDesktopSidebarOpen || navParam === "open";

  const executeLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      window.localStorage.removeItem(EDUCATOR_SESSION_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }

    try {
      await logoutEducatorAction();
    } catch {
      // Fallback if offline
    }

    setIsLogoutModalOpen(false);
    router.replace("/login");
  }, [router]);

  const handleRequestLogout = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);

  // Allow child pages (such as Settings) to trigger the logout confirmation modal
  useEffect(() => {
    const handleCustomLogoutRequest = () => {
      setIsLogoutModalOpen(true);
    };
    window.addEventListener(
      "wishpix:request-logout",
      handleCustomLogoutRequest
    );
    return () => {
      window.removeEventListener(
        "wishpix:request-logout",
        handleCustomLogoutRequest
      );
    };
  }, []);

  // Close logout modal on Escape key
  useEffect(() => {
    if (!isLogoutModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoggingOut) {
        setIsLogoutModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLogoutModalOpen, isLoggingOut]);

  // Idle Auto-Logout Timer based on Settings
  useEffect(() => {
    if (!autoLogoutEnabled) return;
    const timeoutMs = parseLogoutDurationMs(autoLogoutDuration);
    if (!timeoutMs) return;

    let timerId: ReturnType<typeof setTimeout> = setTimeout(() => {
      void executeLogout();
    }, timeoutMs);

    const resetIdleTimer = () => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        void executeLogout();
      }, timeoutMs);
    };

    const activityEvents: Array<keyof WindowEventMap> = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    activityEvents.forEach((evt) =>
      window.addEventListener(evt, resetIdleTimer, { passive: true })
    );

    return () => {
      clearTimeout(timerId);
      activityEvents.forEach((evt) =>
        window.removeEventListener(evt, resetIdleTimer)
      );
    };
  }, [autoLogoutEnabled, autoLogoutDuration, executeLogout]);

  const handleToggleMenu = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setIsDesktopSidebarOpen((prev) => !prev);
      if (navParam === "open") {
        router.replace(pathname, { scroll: false });
      }
    } else {
      setIsMobileManualOpen((prev) => !prev);
    }
  };

  const handleCloseMobileDrawer = () => {
    setIsMobileManualOpen(false);
    if (navParam === "open") {
      router.replace(pathname, { scroll: false });
    }
  };

  return (
    <OnboardingTourProvider>
      <div className="relative flex-1 flex min-h-screen w-full bg-[#FAF8FF] text-[#231B3B] selection:bg-[#EDE7FC] selection:text-[#6D48DF]">
        {/* Responsive Navigation: Docked Left Sidebar on Desktop (lg+), Slide-Over Drawer on Mobile/Tablet */}
        <NavigationDrawer
          isOpen={isMobileDrawerOpen}
          isDesktopSidebarOpen={effectiveDesktopSidebarOpen}
          onCloseMobile={handleCloseMobileDrawer}
          onLogout={handleRequestLogout}
          kiosk={kioskInfo}
        />

        {/* Right Main Column */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top Educator App Bar */}
          <TopNavbar
            kiosk={kioskInfo}
            onOpenMenu={handleToggleMenu}
            onLogout={handleRequestLogout}
          />

          {/* Main Responsive Content Container */}
          <main className="wishpix-page-stage flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>

        {/* Logout Confirmation Modal */}
        {isLogoutModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231B3B]/60 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
          >
            <div className="w-full max-w-sm rounded-[22px] bg-white border border-[#F2EEFB] p-5 sm:p-6 shadow-[0_20px_50px_rgba(35,27,59,0.25)] text-[#231B3B]">
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
                </div>

                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={() => setIsLogoutModalOpen(false)}
                  aria-label={t("Close dialog", "Isara ang dialog")}
                  className="p-1.5 rounded-lg text-[#766F8E] hover:bg-[#F5F1FE] hover:text-[#231B3B] transition cursor-pointer disabled:opacity-50"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <h2
                id="logout-modal-title"
                className="mt-3.5 text-[16px] sm:text-[17px] font-extrabold text-[#231B3B] tracking-tight"
              >
                {t("Log out of WishPix?", "Mag-logout sa WishPix?")}
              </h2>
              <p className="mt-1.5 text-[12px] sm:text-[12.5px] text-[#766F8E] leading-relaxed">
                {t(
                  "You will be returned to the Educator Login screen. Any active classroom kiosk activity will continue running until paused or ended.",
                  "Ibabalik ka sa screen ng Login ng Guro. Ang anumang aktibong sesyon sa kiosk ay magpapatuloy hanggang sa i-pause o tapusin."
                )}
              </p>

              <div className="mt-5 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="rounded-[12px] bg-[#F5F1FE] hover:bg-[#EDE7FC] text-[#231B3B] font-bold text-[12px] px-4 py-2.5 transition cursor-pointer disabled:opacity-50"
                >
                  {t("Cancel", "Kanselahin")}
                </button>

                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={() => void executeLogout()}
                  className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#DC2626] hover:bg-[#B91C1C] active:scale-[0.98] text-white font-bold text-[12px] px-4 py-2.5 shadow-xs transition cursor-pointer disabled:opacity-60"
                >
                  <LogOut className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
                  <span>
                    {isLoggingOut
                      ? t("Logging out...", "Nagla-logout...")
                      : t("Log Out", "Mag-logout")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </OnboardingTourProvider>
  );
}
