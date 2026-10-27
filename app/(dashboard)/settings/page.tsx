"use client";

import React, { useState } from "react";
import {
  Check,
  Download,
  Globe,
  MonitorSmartphone,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { THEME_SWATCHES } from "@/lib/mock-data";
import {
  useAppSettings,
  type DisplayThemeId,
} from "@/components/providers/app-settings-provider";
import { usePwaInstall } from "@/components/providers/pwa-install-provider";

const SWATCH_LABEL_FILIPINO: Record<string, string> = {
  "deep-blue": "Deep Blue",
  ocean: "Ocean",
  midnight: "Midnight",
  slate: "Slate",
};

export default function SettingsPage() {
  const {
    displayLanguage,
    setDisplayLanguage,
    themeId,
    setThemeId,
    volume,
    setVolume,
    autoSleepEnabled,
    setAutoSleepEnabled,
    autoSleepDuration,
    setAutoSleepDuration,
    autoLogoutEnabled,
    setAutoLogoutEnabled,
    autoLogoutDuration,
    setAutoLogoutDuration,
    t,
  } = useAppSettings();

  const {
    isStandalone,
    isInstalled,
    accessChoice,
    isChoiceRemembered,
    resetAccessChoice,
    triggerInstall,
  } = usePwaInstall();

  const [resetFeedback, setResetFeedback] = useState(false);

  const handleResetAccessPreference = () => {
    resetAccessChoice();
    setResetFeedback(true);
    setTimeout(() => setResetFeedback(false), 2500);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Page Title */}
      <div>
        <h1 className="text-[20px] sm:text-[24px] lg:text-[26px] font-extrabold text-[#0F253E] tracking-tight">
          {t("Settings", "Mga Setting")}
        </h1>
        <p className="text-[11px] sm:text-[13px] text-[#64748B] mt-0.5">
          {t(
            "Language, audio, display and system preferences.",
            "Mga kagustuhan sa wika, audio, display at sistema."
          )}
        </p>
      </div>

      {/* Settings Cards: Stacked on Mobile, 2x2 Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-start">
        {/* 1. Language Card */}
        <section
          aria-labelledby="language-settings-heading"
          className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]"
        >
          <div className="pb-3 border-b border-[#F1F5F9]">
            <h2
              id="language-settings-heading"
              className="text-[14px] sm:text-[15.5px] font-extrabold text-[#0F253E]"
            >
              {t("Language", "Wika")}
            </h2>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
              {t(
                "Interface language for the teacher application.",
                "Wika ng interface para sa aplikasyon ng guro."
              )}
            </p>
          </div>

          <div className="pt-3.5">
            <p className="text-[12px] sm:text-[13px] font-bold text-[#0F253E]">
              {t("Display language", "Wika ng display")}
            </p>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
              {t(
                "Navigation and page titles update immediately.",
                "Agad na mag-a-update ang nabigasyon at mga pamagat ng pahina."
              )}
            </p>

            <div
              role="radiogroup"
              aria-label="Display language"
              className="mt-3 rounded-[11px] bg-[#EEF2F6] p-1 grid grid-cols-2 gap-1"
            >
              {(["English", "Filipino"] as const).map((lang) => {
                const isSelected = displayLanguage === lang;
                return (
                  <button
                    key={lang}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setDisplayLanguage(lang)}
                    className={`rounded-[8px] py-2 px-3 text-[11.5px] sm:text-[12.5px] transition cursor-pointer ${
                      isSelected
                        ? "bg-white text-[#0F253E] font-bold shadow-xs"
                        : "text-[#475569] hover:text-[#0F253E] font-medium"
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. Audio Card */}
        <section
          aria-labelledby="audio-settings-heading"
          className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]"
        >
          <div className="pb-3 border-b border-[#F1F5F9]">
            <h2
              id="audio-settings-heading"
              className="text-[14px] sm:text-[15.5px] font-extrabold text-[#0F253E]"
            >
              {t("Audio", "Audio")}
            </h2>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
              {t("Kiosk speaker output.", "Lakas ng tunog sa speaker ng kiosk.")}
            </p>
          </div>

          <div className="pt-3.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <label
                  htmlFor="kiosk-volume-slider"
                  className="block text-[12px] sm:text-[13px] font-bold text-[#0F253E]"
                >
                  {t("Volume", "Lakas ng Tunog")}
                </label>
                <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
                  {t(
                    "Applies to the kiosk speaker.",
                    "Inilalapat sa speaker ng kiosk."
                  )}
                </p>
              </div>

              <div className="min-w-[88px] sm:min-w-[100px] rounded-[8px] bg-[#F1F5F9] px-3 py-1.5 text-[11px] sm:text-[12px] font-extrabold text-[#0F253E]">
                {volume}%
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Volume2
                className="w-4 h-4 text-[#475569] flex-shrink-0"
                aria-hidden="true"
              />
              <input
                id="kiosk-volume-slider"
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                style={{ accentColor: "var(--wp-primary-dark)" }}
                className="w-full h-2 rounded-lg bg-[#CBD5E1] cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* 3. Display Card */}
        <section
          aria-labelledby="display-settings-heading"
          className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]"
        >
          <div className="pb-3 border-b border-[#F1F5F9]">
            <h2
              id="display-settings-heading"
              className="text-[14px] sm:text-[15.5px] font-extrabold text-[#0F253E]"
            >
              {t("Display", "Display")}
            </h2>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
              {t(
                "Theme colors for this application.",
                "Mga kulay ng tema para sa aplikasyong ito."
              )}
            </p>
          </div>

          <div
            role="radiogroup"
            aria-label="Theme color"
            className="pt-4 pb-1 flex items-center justify-center sm:justify-around gap-4 sm:gap-6"
          >
            {THEME_SWATCHES.map((swatch) => {
              const isSelected = themeId === swatch.id;
              return (
                <button
                  key={swatch.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setThemeId(swatch.id as DisplayThemeId)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <span
                    style={{ backgroundColor: swatch.hex }}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[12px] flex items-center justify-center transition ${
                      isSelected
                        ? "ring-2 ring-[#0F253E] ring-offset-2 scale-105"
                        : "opacity-90 group-hover:opacity-100"
                    }`}
                  >
                    {isSelected && (
                      <Check
                        className="w-4 h-4 text-white stroke-[2.75]"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  <span
                    className={`text-[10px] sm:text-[11px] ${
                      isSelected
                        ? "font-bold text-[#0F253E]"
                        : "font-medium text-[#64748B]"
                    }`}
                  >
                    {t(
                      swatch.label,
                      SWATCH_LABEL_FILIPINO[swatch.id] ?? swatch.label
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. System Card */}
        <section
          aria-labelledby="system-settings-heading"
          className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]"
        >
          <div className="pb-3 border-b border-[#F1F5F9]">
            <h2
              id="system-settings-heading"
              className="text-[14px] sm:text-[15.5px] font-extrabold text-[#0F253E]"
            >
              {t("System", "Sistema")}
            </h2>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
              {t(
                "Power and security behavior.",
                "Gawi sa kuryente at seguridad."
              )}
            </p>
          </div>

          <div className="pt-3.5 space-y-4">
            {/* Auto sleep */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] sm:text-[13px] font-bold text-[#0F253E]">
                    {t("Auto sleep", "Auto sleep")}
                  </p>
                  <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
                    {t(
                      "Put the kiosk to sleep when idle.",
                      "Patulugin ang kiosk kapag hindi ginagamit."
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={autoSleepEnabled}
                  aria-label="Toggle auto sleep"
                  onClick={() => setAutoSleepEnabled((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full p-0.5 transition-colors cursor-pointer ${
                    autoSleepEnabled ? "bg-[#0077C8]" : "bg-[#CBD5E1]"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                      autoSleepEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-2.5">
                <select
                  aria-label="Auto sleep timeout"
                  disabled={!autoSleepEnabled}
                  value={autoSleepDuration}
                  onChange={(e) => setAutoSleepDuration(e.target.value)}
                  className="w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-[11px] sm:text-[12px] font-bold text-[#0F253E] disabled:opacity-50 focus:bg-white focus:outline-none focus:border-[#0077C8] cursor-pointer"
                >
                  <option value="5 minutes">
                    {t("5 minutes", "5 minuto")}
                  </option>
                  <option value="15 minutes">
                    {t("15 minutes", "15 minuto")}
                  </option>
                  <option value="30 minutes">
                    {t("30 minutes", "30 minuto")}
                  </option>
                  <option value="1 hour">{t("1 hour", "1 oras")}</option>
                </select>
              </div>
            </div>

            {/* Auto logout */}
            <div className="pt-3.5 border-t border-[#F1F5F9]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] sm:text-[13px] font-bold text-[#0F253E]">
                    {t("Auto logout", "Auto logout")}
                  </p>
                  <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
                    {t(
                      "Sign out after a period of no activity.",
                      "Mag-sign out pagkatapos ng walang aktibidad."
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={autoLogoutEnabled}
                  aria-label="Toggle auto logout"
                  onClick={() => setAutoLogoutEnabled((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full p-0.5 transition-colors cursor-pointer ${
                    autoLogoutEnabled ? "bg-[#0077C8]" : "bg-[#CBD5E1]"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                      autoLogoutEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-2.5">
                <select
                  aria-label="Auto logout timeout"
                  disabled={!autoLogoutEnabled}
                  value={autoLogoutDuration}
                  onChange={(e) => setAutoLogoutDuration(e.target.value)}
                  className="w-full rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-[11px] sm:text-[12px] font-bold text-[#0F253E] disabled:opacity-50 focus:bg-white focus:outline-none focus:border-[#0077C8] cursor-pointer"
                >
                  <option value="15 minutes">
                    {t("15 minutes", "15 minuto")}
                  </option>
                  <option value="30 minutes">
                    {t("30 minutes", "30 minuto")}
                  </option>
                  <option value="1 hour">{t("1 hour", "1 oras")}</option>
                  <option value="Never">{t("Never", "Hindi kailanman")}</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* 5. App & Browser Access Card (Full Width on Desktop) */}
        <section
          aria-labelledby="app-access-settings-heading"
          className="lg:col-span-2 rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_8px_rgba(15,37,62,0.03)]"
        >
          <div className="pb-3 border-b border-[#F1F5F9] flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2
                id="app-access-settings-heading"
                className="text-[14px] sm:text-[15.5px] font-extrabold text-[#0F253E]"
              >
                {t("App & Browser Access", "Pag-access sa App at Browser")}
              </h2>
              <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
                {t(
                  "Choose whether to use WishPix as a downloaded standalone app or inside your web browser.",
                  "Piliin kung gagamitin ang WishPix bilang naka-download na app o sa loob ng iyong web browser."
                )}
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                isStandalone || isInstalled
                  ? "bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]"
                  : "bg-[#F0F7FF] text-[#0066B2] border border-[#BAE0FD]"
              }`}
            >
              {isStandalone || isInstalled ? (
                <>
                  <MonitorSmartphone className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {t("Running in App Mode", "Tumatakbo sa App Mode")}
                  </span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {t("Running in Web Browser", "Tumatakbo sa Web Browser")}
                  </span>
                </>
              )}
            </span>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[12px] sm:text-[13px] font-bold text-[#0F253E]">
                {isStandalone
                  ? t(
                      "WishPix is installed on this device",
                      "Naka-install ang WishPix sa device na ito"
                    )
                  : t(
                      "Download the WishPix Teacher App",
                      "I-download ang WishPix Teacher App"
                    )}
              </p>
              <p className="text-[11px] sm:text-[11.5px] text-[#64748B]">
                {isStandalone
                  ? t(
                      "You are currently accessing WishPix through the standalone desktop/mobile app.",
                      "Kasalukuyan mong binubuksan ang WishPix gamit ang standalone desktop/mobile app."
                    )
                  : t(
                      "Install WishPix to launch it directly from your Desktop, Dock, or Home Screen without browser tabs.",
                      "I-install ang WishPix upang mabuksan ito nang direkta mula sa iyong Desktop o Home Screen."
                    )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {!isStandalone && (
                <button
                  type="button"
                  onClick={() => triggerInstall()}
                  className="inline-flex items-center gap-2 rounded-[10px] bg-[#0077C8] hover:bg-[#0062A6] text-white font-bold text-[12px] px-4 py-2.5 shadow-xs transition cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {t("Download & Install App", "I-download at I-install ang App")}
                  </span>
                </button>
              )}

              {(isChoiceRemembered || accessChoice !== "unset" || resetFeedback) && (
                <button
                  type="button"
                  onClick={handleResetAccessPreference}
                  className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334E68] font-bold text-[11.5px] px-3.5 py-2.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {resetFeedback
                      ? t(
                          "Choice screen will show on next Login!",
                          "Lalabas muli ang pagpipilian sa susunod na Login!"
                        )
                      : t(
                          "Reset App/Browser Choice on Login",
                          "I-reset ang Pagpipilian sa Login"
                        )}
                  </span>
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
