"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, Globe, Lock, MonitorSmartphone, User } from "lucide-react";
import { AccessChoiceCard } from "@/components/auth/access-choice-card";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import { usePwaInstall } from "@/components/providers/pwa-install-provider";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const chooseParam = searchParams.get("choose") === "1";

  const { t } = useAppSettings();
  const {
    isStandalone,
    isInstalled,
    accessChoice,
    resetAccessChoice,
    triggerInstall,
  } = usePwaInstall();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasSubmitError, setHasSubmitError] = useState(false);
  const [sessionProceeded, setSessionProceeded] = useState(false);

  const hasError = Boolean(errorParam) || hasSubmitError;

  // Show the App vs. Browser choice screen when not in standalone mode
  // and the user hasn't chosen yet (or explicitly requested via ?choose=1)
  const shouldShowChoiceScreen =
    !isStandalone &&
    !sessionProceeded &&
    (accessChoice === "unset" || chooseParam);

  if (shouldShowChoiceScreen) {
    return (
      <AccessChoiceCard
        onContinueToLogin={() => {
          setSessionProceeded(true);
          if (chooseParam) {
            router.replace("/login", { scroll: false });
          }
        }}
      />
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedUser = username.trim().toLowerCase();

    if (
      trimmedUser === "wrong" ||
      trimmedUser === "invalid" ||
      password === "wrong"
    ) {
      setHasSubmitError(true);
      return;
    }

    setHasSubmitError(false);
    router.push("/checking-connections");
  };

  return (
    <section
      aria-labelledby="login-heading"
      className="w-full rounded-[16px] bg-[#0D223B] border border-[#1E3A5F]/80 px-5 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 text-white shadow-[0_18px_38px_rgba(7,22,40,0.42)]"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2
            id="login-heading"
            className="text-[17px] sm:text-[18px] font-bold text-white tracking-tight leading-snug"
          >
            {t("Welcome back", "Maligayang pagbabalik")}
          </h2>
          <p className="text-[11px] sm:text-[11.5px] text-[#94A8BE] mt-1">
            {t(
              "Sign in to run activities on your daycare kiosk.",
              "Mag-sign in upang magpatakbo ng mga aktibidad sa iyong kiosk."
            )}
          </p>
        </div>

        {/* Access Mode Indicator Pill */}
        {isStandalone || isInstalled ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#34D399]/15 border border-[#34D399]/30 text-[#34D399] text-[10px] font-bold shrink-0">
            <MonitorSmartphone className="w-3 h-3" aria-hidden="true" />
            <span>{t("App Mode", "App Mode")}</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => {
              resetAccessChoice();
              setSessionProceeded(false);
            }}
            title={t(
              "Switch between App and Browser access",
              "Lumipat sa pagitan ng App at Browser"
            )}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#081729] hover:bg-[#132C47] border border-[#1C3654] text-[#94A8BE] hover:text-white text-[10px] font-semibold transition cursor-pointer shrink-0"
          >
            <Globe className="w-3 h-3 text-[#38BDF8]" aria-hidden="true" />
            <span>{t("Browser Mode", "Browser Mode")}</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3.5" noValidate>
        {/* Username Field */}
        <div>
          <label
            htmlFor="educator-username"
            className="block text-[11px] sm:text-[11.5px] font-bold text-white mb-1.5"
          >
            {t("Username", "Username")}
          </label>
          <div className="relative flex items-center">
            <User
              className="pointer-events-none absolute left-3.5 w-3.5 h-3.5 text-[#7C93AC]"
              aria-hidden="true"
            />
            <input
              id="educator-username"
              name="username"
              type="text"
              autoComplete="username"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (hasSubmitError) setHasSubmitError(false);
              }}
              placeholder={t("Enter your username", "Ilagay ang iyong username")}
              className="w-full rounded-[8px] border border-[#1C3654] bg-[#081729] pl-9 pr-3.5 py-2.5 text-[12px] sm:text-[12.5px] text-white placeholder:text-[#6E849E] focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/25 transition"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="educator-password"
            className="block text-[11px] sm:text-[11.5px] font-bold text-white mb-1.5"
          >
            {t("Password", "Password")}
          </label>
          <div className="relative flex items-center">
            <Lock
              className="pointer-events-none absolute left-3.5 w-3.5 h-3.5 text-[#7C93AC]"
              aria-hidden="true"
            />
            <input
              id="educator-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (hasSubmitError) setHasSubmitError(false);
              }}
              placeholder={t("Enter your password", "Ilagay ang iyong password")}
              className="w-full rounded-[8px] border border-[#1C3654] bg-[#081729] pl-9 pr-3.5 py-2.5 text-[12px] sm:text-[12.5px] text-white placeholder:text-[#6E849E] focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/25 transition"
            />
          </div>

          {hasError && (
            <p
              role="alert"
              aria-live="polite"
              className="mt-1.5 text-[10.5px] sm:text-[11px] font-medium text-[#EF4444]"
            >
              {t(
                "Incorrect username or password. Try again.",
                "Maling username o password. Subukan muli."
              )}
            </p>
          )}
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full rounded-[8px] bg-[#03588C] hover:bg-[#0468A4] active:scale-[0.99] text-white font-bold text-[12.5px] sm:text-[13px] py-2.5 sm:py-3 px-4 shadow-[0_0_16px_rgba(2,132,199,0.35)] border border-[#0284C7]/40 flex items-center justify-center transition cursor-pointer"
        >
          {t("Login", "Mag-login")}
        </button>

        {/* Bottom Credential Recovery Note */}
        <p className="text-[10px] sm:text-[10.5px] text-[#7D93AB] text-center pt-0.5">
          {t(
            "Contact your System Administrator for credential recovery.",
            "Makipag-ugnayan sa iyong System Administrator para sa pagbawi ng account."
          )}
        </p>

        {/* Quick App Download Bar when in Browser Mode */}
        {!isStandalone && (
          <div className="pt-2.5 border-t border-[#1C3654]/80 flex items-center justify-between gap-2 text-[11px]">
            <span className="text-[#8DA2B9]">
              {t("Want the dedicated app?", "Gusto mo ba ang dedicated app?")}
            </span>
            <button
              type="button"
              onClick={() => triggerInstall()}
              className="inline-flex items-center gap-1.5 font-bold text-[#38BDF8] hover:text-[#7DD3FC] transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t("Download App", "I-download ang App")}</span>
            </button>
          </div>
        )}
      </form>
    </section>
  );
}
