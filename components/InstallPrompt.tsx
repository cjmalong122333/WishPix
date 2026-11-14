"use client";

import React, { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Download, Smartphone, Sparkles } from "lucide-react";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import { usePwaInstall } from "@/components/providers/pwa-install-provider";

const DISMISS_SESSION_KEY = "wishpix_install_prompt_dismissed_v1";

let memoryDismissed = false;
const dismissListeners = new Set<() => void>();

function subscribeDismiss(listener: () => void): () => void {
  dismissListeners.add(listener);
  return () => {
    dismissListeners.delete(listener);
  };
}

function getDismissSnapshot(): boolean {
  if (memoryDismissed) return true;
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(DISMISS_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function getServerDismissSnapshot(): boolean {
  return true;
}

function markPromptDismissed() {
  memoryDismissed = true;
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(DISMISS_SESSION_KEY, "1");
    } catch {
      // Ignore storage errors
    }
  }
  dismissListeners.forEach((listener) => listener());
}

export function InstallPrompt() {
  const pathname = usePathname();
  const { t } = useAppSettings();
  const { isPhone, isStandalone, isInstalled, triggerInstall } =
    usePwaInstall();

  const isDismissed = useSyncExternalStore(
    subscribeDismiss,
    getDismissSnapshot,
    getServerDismissSnapshot
  );

  const [isInstalling, setIsInstalling] = useState(false);

  const handleYes = async () => {
    setIsInstalling(true);
    try {
      markPromptDismissed();
      await triggerInstall();
    } finally {
      setIsInstalling(false);
    }
  };

  const handleNo = () => {
    markPromptDismissed();
  };

  const isVisible =
    isPhone &&
    !isStandalone &&
    !isInstalled &&
    !isDismissed &&
    pathname !== "/loading-screen";

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="phone-install-popup-title"
      aria-describedby="phone-install-popup-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231B3B]/70 backdrop-blur-xs animate-[wishpix-fade-in_200ms_ease-out_both]"
    >
      <div className="relative w-full max-w-[360px] overflow-hidden rounded-[22px] bg-[#231B3B] border border-[#A78BFA]/40 p-5 text-white shadow-[0_24px_48px_rgba(20,12,42,0.72)] animate-[wishpix-popover-enter_240ms_cubic-bezier(0.22,1,0.36,1)_both]">
        {/* Ambient Violet Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#6D48DF]/30 blur-2xl"
        />

        <div className="relative flex flex-col items-center text-center">
          {/* Phone App Icon Badge */}
          <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#6D48DF] to-[#5333B8] border border-[#A78BFA]/45 text-white flex items-center justify-center shadow-[0_6px_18px_rgba(109,72,223,0.4)]">
            <Smartphone className="w-6 h-6" aria-hidden="true" />
          </div>

          {/* Pill Badge */}
          <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6D48DF]/30 border border-[#A78BFA]/35 text-[#DDD6FE] text-[10px] font-extrabold uppercase tracking-wider">
            <Sparkles className="w-2.5 h-2.5" aria-hidden="true" />
            <span>{t("Mobile App Available", "May Mobile App")}</span>
          </div>

          {/* Prompt Question */}
          <h2
            id="phone-install-popup-title"
            className="mt-2.5 text-[17px] font-extrabold text-white tracking-tight leading-snug"
          >
            {t("Install WishPix App?", "I-install ang WishPix App?")}
          </h2>

          <p
            id="phone-install-popup-description"
            className="mt-1.5 text-[12.5px] text-[#C4B5FD] leading-relaxed"
          >
            {t(
              "Do you want to install the WishPix app on your phone?",
              "Gusto mo bang i-install ang WishPix app sa iyong telepono?"
            )}
          </p>

          {/* Yes / No Buttons */}
          <div className="mt-5 w-full grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleNo}
              disabled={isInstalling}
              className="w-full rounded-[12px] bg-white/10 hover:bg-white/15 active:scale-[0.98] disabled:opacity-60 border border-white/15 text-[#DDD6FE] hover:text-white font-bold text-[13.5px] py-2.5 px-4 transition cursor-pointer"
            >
              {t("No", "Hindi")}
            </button>

            <button
              type="button"
              onClick={handleYes}
              disabled={isInstalling}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-[12px] bg-[#6D48DF] hover:bg-[#5B36CA] active:scale-[0.98] disabled:opacity-60 border border-[#A78BFA]/45 text-white font-bold text-[13.5px] py-2.5 px-4 shadow-[0_4px_14px_rgba(109,72,223,0.4)] transition cursor-pointer"
            >
              <Download
                className="w-3.5 h-3.5 stroke-[2.3]"
                aria-hidden="true"
              />
              <span>
                {isInstalling
                  ? t("Installing...", "Ini-install...")
                  : t("Yes", "Oo")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
