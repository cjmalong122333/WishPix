"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Download,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  MonitorSmartphone,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import { AccessChoiceCard } from "@/components/auth/access-choice-card";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import { usePwaInstall } from "@/components/providers/pwa-install-provider";
import {
  authenticateEducatorAction,
  type AuthErrorCode,
} from "@/lib/actions";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const chooseParam = searchParams.get("choose") === "1";
  const redirectParam = searchParams.get("redirect");

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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorCode, setErrorCode] = useState<AuthErrorCode | null>(
    errorParam ? "INVALID_CREDENTIALS" : null
  );
  const [remainingAttempts, setRemainingAttempts] = useState<
    number | undefined
  >(undefined);
  const [retryAfterMinutes, setRetryAfterMinutes] = useState<
    number | undefined
  >(undefined);
  const [sessionProceeded, setSessionProceeded] = useState(false);

  const hasError = Boolean(errorParam) || errorCode !== null;

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

  const clearErrors = () => {
    if (errorCode !== null) {
      setErrorCode(null);
      setRemainingAttempts(undefined);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setErrorCode("MISSING_CREDENTIALS");
      setRemainingAttempts(undefined);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authenticateEducatorAction(
        trimmedUser,
        password,
        rememberMe
      );

      if (!result.ok || !result.educator) {
        setErrorCode(result.code ?? "INVALID_CREDENTIALS");
        setRemainingAttempts(result.remainingAttempts);
        setRetryAfterMinutes(result.retryAfterMinutes);
        setIsSubmitting(false);
        return;
      }

      try {
        window.localStorage.setItem(
          "wishpix_educator_session_v1",
          JSON.stringify({
            ...result.educator,
            loggedInAt: new Date().toISOString(),
          })
        );
      } catch {
        // Ignore storage errors
      }

      setErrorCode(null);
      const nextUrl =
        redirectParam &&
        redirectParam.startsWith("/") &&
        !redirectParam.startsWith("//")
          ? `/checking-connections?redirect=${encodeURIComponent(redirectParam)}`
          : "/checking-connections";
      router.push(nextUrl);
    } catch {
      setErrorCode("INVALID_CREDENTIALS");
      setIsSubmitting(false);
    }
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
              required
              disabled={isSubmitting}
              autoComplete="username"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                clearErrors();
              }}
              placeholder={t("Enter your username", "Ilagay ang iyong username")}
              className="w-full rounded-[8px] border border-[#1C3654] bg-[#081729] pl-9 pr-3.5 py-2.5 text-[12px] sm:text-[12.5px] text-white placeholder:text-[#6E849E] focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/25 disabled:opacity-60 transition"
            />
          </div>
        </div>

        {/* Password Field with Show/Hide Toggle */}
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
              type={showPassword ? "text" : "password"}
              required
              disabled={isSubmitting}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearErrors();
              }}
              placeholder={t("Enter your password", "Ilagay ang iyong password")}
              className="w-full rounded-[8px] border border-[#1C3654] bg-[#081729] pl-9 pr-10 py-2.5 text-[12px] sm:text-[12.5px] text-white placeholder:text-[#6E849E] focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/25 disabled:opacity-60 transition"
            />
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={
                showPassword
                  ? t("Hide password", "Itago ang password")
                  : t("Show password", "Ipakita ang password")
              }
              title={
                showPassword
                  ? t("Hide password", "Itago ang password")
                  : t("Show password", "Ipakita ang password")
              }
              className="absolute right-2.5 p-1 rounded-md text-[#7C93AC] hover:text-white hover:bg-[#132C47] transition cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Contextual Security & Validation Alerts */}
          {hasError && (
            <div
              role="alert"
              aria-live="polite"
              className={`mt-2.5 rounded-[8px] px-3 py-2 text-[10.5px] sm:text-[11px] font-medium flex items-start gap-2 ${
                errorCode === "ACCOUNT_LOCKED"
                  ? "bg-[#7F1D1D]/40 border border-[#EF4444]/50 text-[#FCA5A5]"
                  : "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#F87171]"
              }`}
            >
              {errorCode === "ACCOUNT_LOCKED" ? (
                <ShieldAlert
                  className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              ) : (
                <AlertTriangle
                  className="w-3.5 h-3.5 text-[#EF4444] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              )}

              <div className="space-y-0.5">
                {errorCode === "MISSING_CREDENTIALS" ? (
                  <p>
                    {t(
                      "Please enter both your username and password.",
                      "Pakilagay ang iyong username at password."
                    )}
                  </p>
                ) : errorCode === "ACCOUNT_LOCKED" ? (
                  <p>
                    {t(
                      `Too many failed attempts. Account is locked for ${retryAfterMinutes ?? 15} minute${(retryAfterMinutes ?? 15) === 1 ? "" : "s"}.`,
                      `Masyadong maraming maling pagsubok. Naka-lock ang account nang ${retryAfterMinutes ?? 15} minuto.`
                    )}
                  </p>
                ) : (
                  <p>
                    {t(
                      "Incorrect username or password. Try again.",
                      "Maling username o password. Subukan muli."
                    )}
                  </p>
                )}

                {errorCode === "INVALID_CREDENTIALS" &&
                  typeof remainingAttempts === "number" &&
                  remainingAttempts <= 2 &&
                  remainingAttempts > 0 && (
                    <p className="text-[10px] font-bold text-[#FBBF24]">
                      {t(
                        `Warning: ${remainingAttempts} attempt${remainingAttempts === 1 ? "" : "s"} remaining before 15-minute lockout.`,
                        `Babala: ${remainingAttempts} pagsubok na lang bago ma-lock nang 15 minuto.`
                      )}
                    </p>
                  )}
              </div>
            </div>
          )}
        </div>

        {/* Remember Me & Session Security Indicator */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <label
            htmlFor="educator-remember-me"
            className="inline-flex items-center gap-2 cursor-pointer select-none"
          >
            <input
              id="educator-remember-me"
              name="rememberMe"
              type="checkbox"
              disabled={isSubmitting}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-[#1C3654] bg-[#081729] text-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/30 cursor-pointer accent-[#0284C7]"
            />
            <span className="text-[11px] font-medium text-[#B8CDE2]">
              {t("Remember me (7 days)", "Tandaan ako (7 araw)")}
            </span>
          </label>

          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#7C93AC]">
            <ShieldCheck
              className="w-3 h-3 text-[#38BDF8]"
              aria-hidden="true"
            />
            <span>
              {rememberMe
                ? t("7-day session", "7-araw na sesyon")
                : t("8h shift session", "8-oras na sesyon")}
            </span>
          </span>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-[8px] bg-[#03588C] hover:bg-[#0468A4] active:scale-[0.99] disabled:opacity-60 text-white font-bold text-[12.5px] sm:text-[13px] py-2.5 sm:py-3 px-4 shadow-[0_0_16px_rgba(2,132,199,0.35)] border border-[#0284C7]/40 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>{t("Verifying...", "Bine-verify...")}</span>
            </>
          ) : (
            <span>{t("Login", "Mag-login")}</span>
          )}
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
