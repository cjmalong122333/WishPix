"use client";

import React, { useState } from "react";
import {
  Check,
  Compass,
  Download,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Loader2,
  LogOut,
  MonitorSmartphone,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
} from "lucide-react";
import { changeEducatorPasswordAction } from "@/lib/actions";
import { THEME_SWATCHES } from "@/lib/mock-data";
import {
  useAppSettings,
  type DisplayThemeId,
} from "@/components/providers/app-settings-provider";
import {
  TOUR_ROUTE_META,
  useOnboardingTour,
} from "@/components/providers/onboarding-tour-provider";
import { usePwaInstall } from "@/components/providers/pwa-install-provider";
import { RevealOnShow } from "@/components/public/reveal-on-show";

const SWATCH_LABEL_FILIPINO: Record<string, string> = {
  "deep-blue": "WishPix Violet",
  amethyst: "Royal Amethyst",
  orchid: "Orchid Berry",
  "midnight-violet": "Midnight Plum",
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

  const {
    completedRoutes,
    completedPagesCount,
    totalTourPages,
    resetAndReplayTour,
    resetAllPageTours,
    launchTourForRoute,
  } = useOnboardingTour();

  const [resetFeedback, setResetFeedback] = useState(false);

  // Password Change State
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{
    type: "success" | "error";
    messageEn: string;
    messageFil: string;
  } | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSavingPassword) return;
    setIsSavingPassword(true);
    setPasswordStatus(null);

    try {
      const res = await changeEducatorPasswordAction(
        currentPassword,
        newPassword
      );
      if (!res.ok) {
        setPasswordStatus({
          type: "error",
          messageEn: res.errorEn ?? "Could not update password.",
          messageFil: res.errorFil ?? "Hindi ma-update ang password.",
        });
      } else {
        setPasswordStatus({
          type: "success",
          messageEn: "Password updated! Other active sessions were signed out.",
          messageFil:
            "Na-update ang password! Ang ibang sesyon ay na-sign out.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setTimeout(() => {
          setIsPasswordFormOpen(false);
          setPasswordStatus(null);
        }, 2500);
      }
    } catch {
      setPasswordStatus({
        type: "error",
        messageEn: "An unexpected error occurred.",
        messageFil: "May nangyaring hindi inaasahang error.",
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleResetAccessPreference = () => {
    resetAccessChoice();
    setResetFeedback(true);
    setTimeout(() => setResetFeedback(false), 2500);
  };

  const progressPercentage = Math.round(
    (completedPagesCount / Math.max(1, totalTourPages)) * 100
  );

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Page Title */}
      <div>
        <RevealOnShow variant="fade-down" delayMs={25}>
          <h1 className="text-[20px] sm:text-[24px] lg:text-[26px] font-extrabold text-[#231B3B] tracking-tight">
            {t("Settings", "Mga Setting")}
          </h1>
        </RevealOnShow>
        <RevealOnShow variant="blur-in" delayMs={65}>
          <p className="text-[11px] sm:text-[13px] text-[#766F8E] mt-0.5">
            {t(
              "Language, audio, display and system preferences.",
              "Mga kagustuhan sa wika, audio, display at sistema."
            )}
          </p>
        </RevealOnShow>
      </div>

      {/* Settings Cards: Stacked on Mobile, 2x2 Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-start">
        {/* 1. Language Card */}
        <RevealOnShow
          as="section"
          id="tour-settings-language"
          ariaLabelledBy="language-settings-heading"
          variant="fade-up"
          delayMs={100}
          className="wishpix-public-card-hover rounded-[18px] bg-white border border-[#F2EEFB] p-4 sm:p-5 shadow-[0_4px_20px_rgba(109,72,223,0.04)]"
        >
          <div className="pb-3 border-b border-[#F2EEFB]">
            <h2
              id="language-settings-heading"
              className="text-[14px] sm:text-[15.5px] font-extrabold text-[#231B3B]"
            >
              {t("Language", "Wika")}
            </h2>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#8881A3] mt-0.5">
              {t(
                "Interface language for the teacher application.",
                "Wika ng interface para sa aplikasyon ng guro."
              )}
            </p>
          </div>

          <div className="pt-3.5">
            <p className="text-[12px] sm:text-[13px] font-bold text-[#231B3B]">
              {t("Display language", "Wika ng display")}
            </p>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#8881A3] mt-0.5">
              {t(
                "Navigation and page titles update immediately.",
                "Agad na mag-a-update ang nabigasyon at mga pamagat ng pahina."
              )}
            </p>

            <div
              role="radiogroup"
              aria-label="Display language"
              className="mt-3 rounded-[11px] bg-[#FAF8FF] border border-[#E2DCF3] p-1 grid grid-cols-2 gap-1"
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
                        ? "bg-[#6D48DF] text-white font-bold shadow-xs"
                        : "text-[#4A4168] hover:text-[#231B3B] font-medium"
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>
        </RevealOnShow>

        {/* 2. Audio Card */}
        <RevealOnShow
          as="section"
          id="tour-settings-audio"
          ariaLabelledBy="audio-settings-heading"
          variant="fade-up"
          delayMs={150}
          className="wishpix-public-card-hover rounded-[18px] bg-white border border-[#F2EEFB] p-4 sm:p-5 shadow-[0_4px_20px_rgba(109,72,223,0.04)]"
        >
          <div className="pb-3 border-b border-[#F2EEFB]">
            <h2
              id="audio-settings-heading"
              className="text-[14px] sm:text-[15.5px] font-extrabold text-[#231B3B]"
            >
              {t("Audio", "Audio")}
            </h2>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#8881A3] mt-0.5">
              {t("Kiosk speaker output.", "Lakas ng tunog sa speaker ng kiosk.")}
            </p>
          </div>

          <div className="pt-3.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <label
                  htmlFor="kiosk-volume-slider"
                  className="block text-[12px] sm:text-[13px] font-bold text-[#231B3B]"
                >
                  {t("Volume", "Lakas ng Tunog")}
                </label>
                <p className="text-[10.5px] sm:text-[11.5px] text-[#8881A3] mt-0.5">
                  {t(
                    "Applies to the kiosk speaker.",
                    "Inilalapat sa speaker ng kiosk."
                  )}
                </p>
              </div>

              <div className="min-w-[88px] sm:min-w-[100px] rounded-[8px] bg-[#EFE9FC] px-3 py-1.5 text-[11px] sm:text-[12px] font-extrabold text-[#6D48DF]">
                {volume}%
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Volume2
                className="w-4 h-4 text-[#6D48DF] flex-shrink-0"
                aria-hidden="true"
              />
              <input
                id="kiosk-volume-slider"
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                style={{ accentColor: "var(--wp-primary)" }}
                className="w-full h-2 rounded-lg bg-[#E2DCF3] cursor-pointer"
              />
            </div>
          </div>
        </RevealOnShow>

        {/* 3. Display Card */}
        <RevealOnShow
          as="section"
          id="tour-settings-display"
          ariaLabelledBy="display-settings-heading"
          variant="fade-up"
          delayMs={200}
          className="wishpix-public-card-hover rounded-[18px] bg-white border border-[#F2EEFB] p-4 sm:p-5 shadow-[0_4px_20px_rgba(109,72,223,0.04)]"
        >
          <div className="pb-3 border-b border-[#F2EEFB]">
            <h2
              id="display-settings-heading"
              className="text-[14px] sm:text-[15.5px] font-extrabold text-[#231B3B]"
            >
              {t("Display", "Display")}
            </h2>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#8881A3] mt-0.5">
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
                        ? "ring-2 ring-[#231B3B] ring-offset-2 scale-105"
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
                        ? "font-bold text-[#231B3B]"
                        : "font-medium text-[#766F8E]"
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
        </RevealOnShow>

        {/* 4. System Card */}
        <RevealOnShow
          as="section"
          id="tour-settings-system"
          ariaLabelledBy="system-settings-heading"
          variant="fade-up"
          delayMs={250}
          className="wishpix-public-card-hover rounded-[18px] bg-white border border-[#F2EEFB] p-4 sm:p-5 shadow-[0_4px_20px_rgba(109,72,223,0.04)]"
        >
          <div className="pb-3 border-b border-[#F2EEFB]">
            <h2
              id="system-settings-heading"
              className="text-[14px] sm:text-[15.5px] font-extrabold text-[#231B3B]"
            >
              {t("System", "Sistema")}
            </h2>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#8881A3] mt-0.5">
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
                  <p className="text-[12px] sm:text-[13px] font-bold text-[#231B3B]">
                    {t("Auto sleep", "Auto sleep")}
                  </p>
                  <p className="text-[10.5px] sm:text-[11.5px] text-[#8881A3] mt-0.5">
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
                    autoSleepEnabled ? "bg-[#6D48DF]" : "bg-[#D8CEFA]"
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
                  className="w-full rounded-[10px] border border-[#E2DCF3] bg-[#FAF8FF] px-3.5 py-2 text-[11px] sm:text-[12px] font-bold text-[#231B3B] disabled:opacity-50 focus:bg-white focus:outline-none focus:border-[#6D48DF] cursor-pointer"
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
            <div className="pt-3.5 border-t border-[#F2EEFB]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] sm:text-[13px] font-bold text-[#231B3B]">
                    {t("Auto logout", "Auto logout")}
                  </p>
                  <p className="text-[10.5px] sm:text-[11.5px] text-[#8881A3] mt-0.5">
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
                    autoLogoutEnabled ? "bg-[#6D48DF]" : "bg-[#D8CEFA]"
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
                  className="w-full rounded-[10px] border border-[#E2DCF3] bg-[#FAF8FF] px-3.5 py-2 text-[11px] sm:text-[12px] font-bold text-[#231B3B] disabled:opacity-50 focus:bg-white focus:outline-none focus:border-[#6D48DF] cursor-pointer"
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

            {/* Educator Password Security */}
            <div className="pt-3.5 border-t border-[#F2EEFB]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] sm:text-[13px] font-bold text-[#231B3B]">
                    {t("Password security", "Seguridad ng password")}
                  </p>
                  <p className="text-[10.5px] sm:text-[11.5px] text-[#8881A3] mt-0.5">
                    {t(
                      "Update your educator password (8+ chars, letters & numbers).",
                      "Palitan ang password ng guro (8+ karakter, titik at numero)."
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordFormOpen((prev) => !prev);
                    setPasswordStatus(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#FAF8FF] hover:bg-[#EFE9FC] border border-[#E2DCF3] text-[#231B3B] font-bold text-[11.5px] sm:text-[12px] px-3 py-2 transition cursor-pointer shrink-0"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#6D48DF]" aria-hidden="true" />
                  <span>
                    {isPasswordFormOpen
                      ? t("Cancel", "Kanselahin")
                      : t("Change Password", "Palitan ang Password")}
                  </span>
                </button>
              </div>

              {isPasswordFormOpen && (
                <form
                  onSubmit={handlePasswordSubmit}
                  className="mt-3 rounded-[12px] bg-[#FAF8FF] border border-[#E2DCF3] p-3.5 space-y-2.5"
                >
                  <div>
                    <label
                      htmlFor="settings-current-password"
                      className="block text-[11px] font-bold text-[#231B3B] mb-1"
                    >
                      {t("Current password", "Kasalukuyang password")}
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="settings-current-password"
                        type={showCurrentPw ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          if (passwordStatus) setPasswordStatus(null);
                        }}
                        placeholder={t(
                          "Enter current password",
                          "Ilagay ang kasalukuyang password"
                        )}
                        className="w-full rounded-[8px] border border-[#E2DCF3] bg-white pl-3 pr-9 py-2 text-[12px] text-[#231B3B] focus:border-[#6D48DF] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw((prev) => !prev)}
                        aria-label={t(
                          "Toggle current password visibility",
                          "Ipakita o itago ang kasalukuyang password"
                        )}
                        className="absolute right-2.5 p-1 text-[#766F8E] hover:text-[#231B3B] cursor-pointer"
                      >
                        {showCurrentPw ? (
                          <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="settings-new-password"
                      className="block text-[11px] font-bold text-[#231B3B] mb-1"
                    >
                      {t("New password", "Bagong password")}
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="settings-new-password"
                        type={showNewPw ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (passwordStatus) setPasswordStatus(null);
                        }}
                        placeholder={t(
                          "At least 8 characters (letters & numbers)",
                          "Hindi bababa sa 8 karakter (titik at numero)"
                        )}
                        className="w-full rounded-[8px] border border-[#E2DCF3] bg-white pl-3 pr-9 py-2 text-[12px] text-[#231B3B] focus:border-[#6D48DF] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw((prev) => !prev)}
                        aria-label={t(
                          "Toggle new password visibility",
                          "Ipakita o itago ang bagong password"
                        )}
                        className="absolute right-2.5 p-1 text-[#766F8E] hover:text-[#231B3B] cursor-pointer"
                      >
                        {showNewPw ? (
                          <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  {passwordStatus && (
                    <p
                      role="status"
                      className={`text-[11px] font-semibold ${
                        passwordStatus.type === "success"
                          ? "text-[#059669]"
                          : "text-[#DC2626]"
                      }`}
                    >
                      {t(passwordStatus.messageEn, passwordStatus.messageFil)}
                    </p>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={isSavingPassword}
                      className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#6D48DF] hover:bg-[#5B36CA] disabled:opacity-60 text-white font-bold text-[11.5px] px-3.5 py-2 transition cursor-pointer"
                    >
                      {isSavingPassword && (
                        <Loader2
                          className="w-3.5 h-3.5 animate-spin"
                          aria-hidden="true"
                        />
                      )}
                      <span>
                        {isSavingPassword
                          ? t("Saving...", "Sine-save...")
                          : t("Update Password", "I-update ang Password")}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Educator Account Sign Out */}
            <div className="pt-3.5 border-t border-[#F2EEFB] flex items-center justify-between gap-3">
              <div>
                <p className="text-[12px] sm:text-[13px] font-bold text-[#231B3B]">
                  {t("Teacher account", "Account ng guro")}
                </p>
                <p className="text-[10.5px] sm:text-[11.5px] text-[#8881A3] mt-0.5">
                  {t(
                    "Sign out of this educator session now.",
                    "Mag-sign out sa kasalukuyang sesyon ng guro."
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new Event("wishpix:request-logout"))
                }
                className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] font-bold text-[11.5px] sm:text-[12px] px-3.5 py-2 transition cursor-pointer active:scale-95 shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 stroke-[2.2]" aria-hidden="true" />
                <span>{t("Log Out", "Mag-logout")}</span>
              </button>
            </div>
          </div>
        </RevealOnShow>

        {/* 5. Interactive Onboarding Walkthrough Hub (Signature Deep Plum & Lavender Glow Card) */}
        <RevealOnShow
          as="section"
          id="tour-settings-onboarding"
          ariaLabelledBy="onboarding-tour-settings-heading"
          variant="pop-scale"
          delayMs={300}
          className="wishpix-public-card-hover relative overflow-hidden lg:col-span-2 rounded-[20px] bg-[#231B3B] border border-[#A78BFA]/30 p-4 sm:p-6 text-white shadow-[0_14px_34px_rgba(35,27,59,0.22)] transition-colors duration-200"
        >
          {/* Ambient Violet Radial Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 -right-10 w-52 h-52 rounded-full bg-[#6D48DF]/30 blur-2xl"
          />

          <div className="relative pb-4 border-b border-white/10 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6D48DF]/25 border border-[#A78BFA]/35 text-[#DDD6FE] text-[9.5px] font-extrabold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                <span>{t("WISHPIX ONBOARDING HUB", "SENTRO NG GABAY")}</span>
              </div>
              <h2
                id="onboarding-tour-settings-heading"
                className="text-[15px] sm:text-[17px] font-extrabold text-white tracking-tight"
              >
                {t(
                  "Interactive Page Walkthroughs",
                  "Interactive na Gabay sa Bawat Pahina"
                )}
              </h2>
              <p className="text-[11px] sm:text-[12px] text-[#C4B5FD]/80 mt-0.5 max-w-2xl">
                {t(
                  "Every module in WishPix includes a hands-on guided tour. Click any module below to jump straight into its interactive walkthrough.",
                  "Ang bawat bahagi ng WishPix ay may sariling interactive na gabay. Pumili ng pahina sa ibaba upang buksan ang gabay nito."
                )}
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold ${
                completedPagesCount === totalTourPages
                  ? "bg-[#113934] text-[#4ADE80] border border-[#22C55E]/40"
                  : "bg-[#6D48DF]/25 text-[#DDD6FE] border border-[#A78BFA]/35"
              }`}
            >
              <Compass className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {t(
                  `${completedPagesCount} of ${totalTourPages} Modules Explored`,
                  `${completedPagesCount} sa ${totalTourPages} Gabay ang Natapos`
                )}
              </span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative mt-4">
            <div className="flex items-center justify-between text-[10.5px] font-bold text-[#DDD6FE] mb-1.5">
              <span>
                {t("Educator Onboarding Progress", "Progreso ng Gabay ng Guro")}
              </span>
              <span className="text-[#C4B5FD]">{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/30 border border-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6D48DF] to-[#A78BFA] transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Interactive 10-Module Tour Launcher Grid */}
          <div className="relative mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {TOUR_ROUTE_META.map((meta) => {
              const isDone = Boolean(completedRoutes[meta.route]);
              return (
                <button
                  key={meta.route}
                  type="button"
                  onClick={() => launchTourForRoute(meta.route)}
                  className={`group text-left rounded-[11px] px-3 py-2.5 border transition cursor-pointer active:scale-[0.98] flex items-center justify-between gap-2 ${
                    isDone
                      ? "bg-white/10 hover:bg-white/15 border-white/20 text-white"
                      : "bg-black/20 hover:bg-white/10 border-white/10 text-[#DDD6FE] hover:text-white"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold truncate">
                      {t(meta.labelEn, meta.labelFil)}
                    </p>
                    <p className="text-[9.5px] text-[#C4B5FD]/75 mt-0.5">
                      {t(
                        `${meta.stepsCount} steps`,
                        `${meta.stepsCount} hakbang`
                      )}
                    </p>
                  </div>

                  {isDone ? (
                    <span className="w-5 h-5 rounded-full bg-[#22C55E]/20 border border-[#4ADE80]/40 text-[#4ADE80] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[2.75]" aria-hidden="true" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-[#A78BFA]/20 border border-[#A78BFA]/35 text-[#DDD6FE] group-hover:bg-[#A78BFA] group-hover:text-[#231B3B] flex items-center justify-center shrink-0 transition-colors">
                      <Play className="w-2.5 h-2.5 fill-current" aria-hidden="true" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Action Controls */}
          <div className="relative mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-[11px] text-[#C4B5FD]/80">
              {t(
                "Tip: Click the 'Tour' pill in the top bar anytime to replay the guide for the page you are viewing.",
                "Tip: Pindutin ang 'Gabay' button sa itaas anumang oras upang ulitin ang paliwanag sa pahina."
              )}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={resetAndReplayTour}
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#6D48DF] hover:bg-[#5B36CA] border border-[#A78BFA]/40 text-white font-bold text-[12px] px-4 py-2 shadow-[0_4px_12px_rgba(109,72,223,0.35)] transition cursor-pointer active:scale-95"
              >
                <Compass className="w-4 h-4" aria-hidden="true" />
                <span>{t("Tour This Page", "Gabay sa Pahinang Ito")}</span>
              </button>

              <button
                type="button"
                onClick={resetAllPageTours}
                className="inline-flex items-center gap-1.5 rounded-[10px] bg-white/10 hover:bg-white/15 border border-white/15 text-[#EDE7FC] font-bold text-[11.5px] px-3.5 py-2 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {t("Reset All 10 Page Tours", "I-reset ang Lahat ng 10 Gabay")}
                </span>
              </button>
            </div>
          </div>
        </RevealOnShow>

        {/* 6. App & Browser Access Card (Full Width on Desktop) */}
        <RevealOnShow
          as="section"
          ariaLabelledBy="app-access-settings-heading"
          variant="fade-up"
          delayMs={350}
          className="wishpix-public-card-hover lg:col-span-2 rounded-[18px] bg-white border border-[#F2EEFB] p-4 sm:p-5 shadow-[0_4px_20px_rgba(109,72,223,0.04)]"
        >
          <div className="pb-3 border-b border-[#F2EEFB] flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2
                id="app-access-settings-heading"
                className="text-[14px] sm:text-[15.5px] font-extrabold text-[#231B3B]"
              >
                {t("App & Browser Access", "Pag-access sa App at Browser")}
              </h2>
              <p className="text-[10.5px] sm:text-[11.5px] text-[#8881A3] mt-0.5">
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
                  : "bg-[#EFE9FC] text-[#6D48DF] border border-[#D8CEFA]"
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
              <p className="text-[12px] sm:text-[13px] font-bold text-[#231B3B]">
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
              <p className="text-[11px] sm:text-[11.5px] text-[#766F8E]">
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
                  className="inline-flex items-center gap-2 rounded-[10px] bg-[#6D48DF] hover:bg-[#5B36CA] text-white font-bold text-[12px] px-4 py-2.5 shadow-xs transition cursor-pointer active:scale-95"
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
                  className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#FAF8FF] hover:bg-[#EFE9FC] border border-[#E2DCF3] text-[#4A4168] font-bold text-[11.5px] px-3.5 py-2.5 transition cursor-pointer"
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
        </RevealOnShow>
      </div>
    </div>
  );
}
