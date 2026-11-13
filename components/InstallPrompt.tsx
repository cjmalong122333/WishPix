"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Download,
  MonitorSmartphone,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import { usePwaInstall } from "@/components/providers/pwa-install-provider";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const DISMISS_SESSION_KEY = "wishpix_install_prompt_dismissed_v1";
const PUBLIC_PATHS = new Set([
  "/",
  "/about",
  "/team",
  "/login",
  "/loading-screen",
]);

export function InstallPrompt() {
  const pathname = usePathname();
  const { t } = useAppSettings();
  const { isStandalone, platform, openInstallGuide } = usePwaInstall();

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default browser mini-infobar from appearing on mobile/desktop
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsDismissed(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
          setDeferredPrompt(null);
          setIsDismissed(true);
        } else {
          setIsDismissed(true);
        }
      } catch {
        setIsDismissed(true);
        openInstallGuide();
      } finally {
        setIsInstalling(false);
      }
      return;
    }

    // Fallback when native prompt hasn't fired yet (e.g. Android manual guide / APK modal)
    setIsDismissed(true);
    openInstallGuide();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISS_SESSION_KEY, "1");
    } catch {
      // Ignore storage errors
    }
  };

  const isVisible =
    !PUBLIC_PATHS.has(pathname) &&
    !isStandalone &&
    !isDismissed &&
    (Boolean(deferredPrompt) || platform === "android");

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label={t(
        "Install WishPix Application",
        "I-install ang WishPix Application"
      )}
      className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 sm:w-full sm:max-w-[415px] animate-[wishpix-popover-enter_260ms_cubic-bezier(0.22,1,0.36,1)_both]"
    >
      <div className="relative overflow-hidden rounded-[16px] bg-[#0F233A] border border-[#38BDF8]/35 p-4 sm:p-4.5 text-white shadow-[0_20px_44px_rgba(4,12,24,0.62)]">
        {/* Ambient Cyan Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#0284C7]/25 blur-2xl"
        />

        {/* Dismiss / Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={t(
            "Dismiss install prompt",
            "Isara ang prompt sa pag-install"
          )}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-[#94A8BE] hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="relative flex items-start gap-3.5 pr-6">
          {/* App Icon Badge */}
          <div className="w-11 h-11 rounded-[12px] bg-gradient-to-br from-[#0077C8] to-[#085081] border border-[#38BDF8]/40 text-white flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(2,132,199,0.35)]">
            {platform === "android" ? (
              <Smartphone className="w-5 h-5" aria-hidden="true" />
            ) : (
              <MonitorSmartphone className="w-5 h-5" aria-hidden="true" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0284C7]/20 border border-[#38BDF8]/30 text-[#7DD3FC] text-[9.5px] font-extrabold uppercase tracking-wider mb-1">
              <Sparkles className="w-2.5 h-2.5" aria-hidden="true" />
              <span>
                {platform === "android"
                  ? t("Android App Ready", "Handa para sa Android")
                  : t("Desktop & Mobile App", "Desktop at Mobile App")}
              </span>
            </div>

            <h3 className="text-[14px] sm:text-[15px] font-extrabold text-white tracking-tight leading-snug">
              {t("Download WishPix App", "I-download ang WishPix App")}
            </h3>

            <p className="mt-1 text-[11.5px] text-[#B8CDE2] leading-relaxed">
              {t(
                "Install WishPix on your Android or Desktop device for a dedicated full-screen classroom window.",
                "I-install ang WishPix sa iyong Android o Desktop para sa sariling full-screen window."
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative mt-3.5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
          <a
            href="/wishpix-android.apk"
            download="WishPix-Teacher-App.apk"
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#132F4C] hover:bg-[#1B3F66] border border-[#38BDF8]/30 text-[#7DD3FC] hover:text-white font-bold text-[11.5px] px-3 py-2 transition cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t("Download .APK", "I-download ang .APK")}</span>
          </a>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-[10px] bg-white/8 hover:bg-white/14 border border-white/12 text-[#CBD5E1] hover:text-white font-semibold text-[11.5px] px-3 py-2 transition cursor-pointer"
            >
              {t("Not Now", "Mamaya Na")}
            </button>

            <button
              type="button"
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#0077C8] hover:bg-[#0284C7] active:scale-[0.98] disabled:opacity-60 border border-[#38BDF8]/40 text-white font-bold text-[12px] px-3.5 py-2 shadow-[0_4px_14px_rgba(2,132,199,0.4)] transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.3]" aria-hidden="true" />
              <span>
                {isInstalling
                  ? t("Installing...", "Ini-install...")
                  : t("Install App", "I-install ang App")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
