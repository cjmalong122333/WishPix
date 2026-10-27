"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Check,
  Download,
  Globe,
  MonitorSmartphone,
  Sparkles,
} from "lucide-react";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import { usePwaInstall } from "@/components/providers/pwa-install-provider";

interface AccessChoiceCardProps {
  onContinueToLogin: () => void;
}

export function AccessChoiceCard({ onContinueToLogin }: AccessChoiceCardProps) {
  const { t } = useAppSettings();
  const {
    canPromptNative,
    isInstalled,
    setAccessChoice,
    triggerInstall,
  } = usePwaInstall();

  const [rememberChoice, setRememberChoice] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);

  const handleChooseApp = async () => {
    setIsInstalling(true);
    try {
      const result = await triggerInstall({
        onFallbackContinue: () => {
          setAccessChoice("browser", rememberChoice);
          onContinueToLogin();
        },
      });
      if (result === "accepted") {
        setAccessChoice("app", true);
        onContinueToLogin();
      }
    } finally {
      setIsInstalling(false);
    }
  };

  const handleChooseBrowser = () => {
    setAccessChoice("browser", rememberChoice);
    onContinueToLogin();
  };

  return (
    <section
      aria-labelledby="access-choice-heading"
      className="w-full rounded-[16px] bg-[#0D223B] border border-[#1E3A5F]/80 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 text-white shadow-[0_18px_38px_rgba(7,22,40,0.42)]"
    >
      {/* Top Pill */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0284C7]/20 border border-[#38BDF8]/30 text-[#38BDF8] text-[10px] font-bold uppercase tracking-wider">
        <Sparkles className="w-3 h-3" aria-hidden="true" />
        <span>{t("Choose Your Experience", "Piliin Kung Paano Buksan")}</span>
      </div>

      <h2
        id="access-choice-heading"
        className="mt-2.5 text-[17px] sm:text-[18.5px] font-bold text-white tracking-tight leading-snug"
      >
        {t(
          "How would you like to use WishPix?",
          "Paano mo gustong gamitin ang WishPix?"
        )}
      </h2>
      <p className="text-[11px] sm:text-[11.5px] text-[#94A8BE] mt-1 leading-relaxed">
        {t(
          "Download the standalone app to your device or continue directly in your web browser.",
          "I-download ang app sa iyong device o magpatuloy mismo sa iyong web browser."
        )}
      </p>

      {/* Two Choice Cards */}
      <div className="mt-4 space-y-3">
        {/* Option 1: Download & Open in App */}
        <button
          type="button"
          onClick={handleChooseApp}
          disabled={isInstalling}
          className="group w-full text-left rounded-[12px] bg-gradient-to-r from-[#0B3B66] to-[#082B4B] hover:from-[#0E4A80] hover:to-[#0B365E] border border-[#0284C7]/60 p-3.5 sm:p-4 transition shadow-[0_6px_20px_rgba(2,132,199,0.2)] cursor-pointer active:scale-[0.99]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-[#0284C7] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                {isInstalled ? (
                  <MonitorSmartphone className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Download className="w-4 h-4" aria-hidden="true" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] sm:text-[13.5px] font-extrabold text-white">
                    {isInstalled
                      ? t("Open Installed App", "Buksan ang Naka-install na App")
                      : t(
                          "Download & Use WishPix App",
                          "I-download at Gamitin ang App"
                        )}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#38BDF8]/20 text-[#7DD3FC] text-[9.5px] font-bold uppercase tracking-wide">
                    {canPromptNative
                      ? t("1-Click Install", "1-Click Install")
                      : t("Recommended", "Inirerekomenda")}
                  </span>
                </div>

                <p className="text-[11px] text-[#B8CDE2] mt-1 leading-snug">
                  {t(
                    "Installs on your Desktop or Home Screen with a dedicated full-screen classroom window.",
                    "I-install sa iyong Desktop o Home Screen para sa sariling full-screen window."
                  )}
                </p>
              </div>
            </div>

            <ArrowRight
              className="w-4 h-4 text-[#38BDF8] shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
            />
          </div>
        </button>

        {/* Option 2: Continue in Browser */}
        <button
          type="button"
          onClick={handleChooseBrowser}
          className="group w-full text-left rounded-[12px] bg-[#081729] hover:bg-[#0B1F36] border border-[#1C3654] hover:border-[#2C5282] p-3.5 sm:p-4 transition cursor-pointer active:scale-[0.99]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-[#132C47] text-[#94A8BE] group-hover:text-white flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                <Globe className="w-4 h-4" aria-hidden="true" />
              </div>

              <div>
                <span className="text-[13px] sm:text-[13.5px] font-bold text-white">
                  {t("Continue in Web Browser", "Magpatuloy sa Web Browser")}
                </span>
                <p className="text-[11px] text-[#8DA2B9] mt-1 leading-snug">
                  {t(
                    "Use all WishPix teacher controls right here in your browser tab without installing.",
                    "Gamitin ang lahat ng kontrol ng WishPix dito mismo sa iyong browser nang walang dina-download."
                  )}
                </p>
              </div>
            </div>

            <ArrowRight
              className="w-4 h-4 text-[#7C93AC] group-hover:text-white shrink-0 mt-1 group-hover:translate-x-0.5 transition-all"
              aria-hidden="true"
            />
          </div>
        </button>
      </div>

      {/* Remember my choice toggle */}
      <div className="mt-4 pt-3 border-t border-[#1C3654]/80 flex items-center justify-between gap-2">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <button
            type="button"
            role="checkbox"
            aria-checked={rememberChoice}
            onClick={() => setRememberChoice((prev) => !prev)}
            className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition cursor-pointer ${
              rememberChoice
                ? "bg-[#0284C7] border-[#38BDF8] text-white"
                : "bg-[#081729] border-[#334E68] text-transparent"
            }`}
          >
            <Check className="w-3 h-3 stroke-[3]" aria-hidden="true" />
          </button>
          <span
            onClick={() => setRememberChoice((prev) => !prev)}
            className="text-[11px] text-[#94A8BE] hover:text-white transition"
          >
            {t(
              "Remember my choice on this device",
              "Tandaan ang aking pinili sa device na ito"
            )}
          </span>
        </label>
      </div>
    </section>
  );
}
