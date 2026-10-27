"use client";

import React, { useEffect } from "react";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  MonitorSmartphone,
  Share,
  PlusSquare,
  Sparkles,
  X,
} from "lucide-react";
import { useAppSettings } from "@/components/providers/app-settings-provider";

export type DetectedPlatform = "ios" | "android" | "desktop";

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueInBrowser?: () => void;
  platform: DetectedPlatform;
  isStandalone: boolean;
  justInstalled: boolean;
}

export function InstallGuideModal({
  isOpen,
  onClose,
  onContinueInBrowser,
  platform,
  isStandalone,
  justInstalled,
}: InstallGuideModalProps) {
  const { t } = useAppSettings();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061220]/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-guide-title"
    >
      <div className="relative w-full max-w-[430px] rounded-[18px] bg-[#0D223B] border border-[#1E3A5F] p-5 sm:p-6 text-white shadow-[0_22px_48px_rgba(4,15,28,0.65)]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t("Close install dialog", "Isara ang dialog sa pag-install")}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#94A8BE] hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0284C7]/20 border border-[#38BDF8]/30 text-[#38BDF8] text-[10.5px] font-bold tracking-wide uppercase">
          <Sparkles className="w-3 h-3" aria-hidden="true" />
          <span>{t("WishPix App Installer", "WishPix App Installer")}</span>
        </div>

        {isStandalone || justInstalled ? (
          <div className="mt-4">
            <div className="flex items-center gap-2.5 text-[#34D399]">
              <CheckCircle2 className="w-6 h-6 shrink-0" aria-hidden="true" />
              <h3
                id="install-guide-title"
                className="text-[17px] sm:text-[18px] font-extrabold text-white tracking-tight"
              >
                {t(
                  "WishPix App is Ready!",
                  "Handa na ang WishPix App!"
                )}
              </h3>
            </div>
            <p className="mt-2 text-[12px] sm:text-[12.5px] text-[#B0C4D8] leading-relaxed">
              {isStandalone
                ? t(
                    "You are already using the installed WishPix standalone application.",
                    "Ginagamit mo na ang naka-install na WishPix standalone application."
                  )
                : t(
                    "WishPix has been added to your device! You can open it directly from your Desktop, Dock, or Home Screen anytime.",
                    "Naidagdag na ang WishPix sa iyong device! Maaari mo na itong buksan mula sa iyong Desktop o Home Screen anumang oras."
                  )}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-[10px] bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-[12.5px] py-2.5 px-4 transition cursor-pointer"
            >
              {t("Continue to WishPix", "Magpatuloy sa WishPix")}
            </button>
          </div>
        ) : (
          <div className="mt-3.5">
            <h3
              id="install-guide-title"
              className="text-[17px] sm:text-[18.5px] font-extrabold text-white tracking-tight"
            >
              {t(
                "Install WishPix on Your Device",
                "I-install ang WishPix sa Iyong Device"
              )}
            </h3>
            <p className="mt-1 text-[11.5px] sm:text-[12px] text-[#94A8BE] leading-relaxed">
              {t(
                "Follow these quick steps to launch WishPix in its own dedicated app window:",
                "Sundin ang mabilis na hakbang na ito upang buksan ang WishPix bilang sariling app:"
              )}
            </p>

            {/* Step-by-step instructions tailored by platform */}
            <div className="mt-4 space-y-2.5">
              {platform === "ios" ? (
                <>
                  <div className="flex items-start gap-3 rounded-[12px] bg-[#081729] border border-[#1C3654] p-3">
                    <div className="w-7 h-7 rounded-lg bg-[#0284C7]/20 text-[#38BDF8] flex items-center justify-center shrink-0 mt-0.5">
                      <Share className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-white">
                        {t("1. Tap the Share button", "1. Pindutin ang Share button")}
                      </p>
                      <p className="text-[11px] text-[#94A8BE] mt-0.5">
                        {t(
                          "Located at the bottom or top bar of Safari.",
                          "Makikita sa ibaba o itaas na bar ng Safari."
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-[12px] bg-[#081729] border border-[#1C3654] p-3">
                    <div className="w-7 h-7 rounded-lg bg-[#0284C7]/20 text-[#38BDF8] flex items-center justify-center shrink-0 mt-0.5">
                      <PlusSquare className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-white">
                        {t(
                          '2. Select "Add to Home Screen"',
                          '2. Piliin ang "Add to Home Screen"'
                        )}
                      </p>
                      <p className="text-[11px] text-[#94A8BE] mt-0.5">
                        {t(
                          'Tap "Add" in the top-right corner to finish installing the app.',
                          'Pindutin ang "Add" sa kanang itaas upang matapos ang pag-install.'
                        )}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 rounded-[12px] bg-[#081729] border border-[#1C3654] p-3">
                    <div className="w-7 h-7 rounded-lg bg-[#0284C7]/20 text-[#38BDF8] flex items-center justify-center shrink-0 mt-0.5">
                      <Download className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-white">
                        {t(
                          "1. Click the Install icon in your browser bar",
                          "1. I-click ang Install icon sa address bar ng browser"
                        )}
                      </p>
                      <p className="text-[11px] text-[#94A8BE] mt-0.5">
                        {t(
                          "Look for the computer/download icon on the right side of the address bar (or open the browser ⋮ menu).",
                          "Hanapin ang download/app icon sa kanang bahagi ng address bar (o buksan ang ⋮ menu ng browser)."
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-[12px] bg-[#081729] border border-[#1C3654] p-3">
                    <div className="w-7 h-7 rounded-lg bg-[#0284C7]/20 text-[#38BDF8] flex items-center justify-center shrink-0 mt-0.5">
                      <MonitorSmartphone className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-white">
                        {t(
                          '2. Choose "Install WishPix Teacher App"',
                          '2. Piliin ang "Install WishPix Teacher App"'
                        )}
                      </p>
                      <p className="text-[11px] text-[#94A8BE] mt-0.5">
                        {t(
                          "WishPix will launch in its own standalone window and create a shortcut on your device.",
                          "Magbubukas ang WishPix sa sarili nitong window at gagawa ng shortcut sa iyong device."
                        )}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
              {onContinueInBrowser && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onContinueInBrowser();
                  }}
                  className="flex-1 rounded-[10px] bg-[#132F4C] hover:bg-[#1B3F66] border border-[#274B73] text-white font-semibold text-[12px] py-2.5 px-3.5 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {t("Continue in Browser", "Magpatuloy sa Browser")}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-[10px] bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-[12px] py-2.5 px-3.5 transition cursor-pointer"
              >
                {t("Got It", "Nakuha Ko")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
