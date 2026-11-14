"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Loader2, ShieldAlert } from "lucide-react";
import {
  authenticateEducatorAction,
  type AuthErrorCode,
} from "@/lib/actions";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const redirectParam = searchParams.get("redirect");

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotNote, setShowForgotNote] = useState(false);

  const [errorCode, setErrorCode] = useState<AuthErrorCode | null>(
    errorParam ? "INVALID_CREDENTIALS" : null
  );
  const [remainingAttempts, setRemainingAttempts] = useState<
    number | undefined
  >(undefined);
  const [retryAfterMinutes, setRetryAfterMinutes] = useState<
    number | undefined
  >(undefined);

  const hasError = Boolean(errorParam) || errorCode !== null;

  const clearErrors = () => {
    if (errorCode !== null) {
      setErrorCode(null);
      setRemainingAttempts(undefined);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedUser = emailOrUsername.trim();
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
        false
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
      className="w-full rounded-[24px] sm:rounded-[28px] bg-white border border-[#F2EEFB] shadow-[0_6px_28px_rgba(109,72,223,0.05)] px-6 sm:px-9 lg:px-10 py-6 sm:py-8 lg:py-[clamp(22px,3.2vh,38px)] flex flex-col justify-center"
    >
      <div>
        <p className="text-[10.5px] sm:text-[11.5px] lg:text-[12px] font-extrabold tracking-[0.06em] text-[#6D48DF] uppercase">
          FOR EDUCATORS &amp; TEACHERS
        </p>

        <h2
          id="login-heading"
          className="mt-2 text-[clamp(25px,2.9vw,36px)] font-extrabold text-[#231B3B] tracking-tight leading-tight"
        >
          Welcome back!
        </h2>

        <p className="mt-1.5 sm:mt-2 text-[13.5px] sm:text-[15px] text-[#766F8E]">
          Log in to start your next learning adventure.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-5 sm:mt-6 lg:mt-7 space-y-4 sm:space-y-5"
        noValidate
      >
        {/* Email Address Field */}
        <div>
          <label
            htmlFor="educator-email"
            className="block text-[13px] sm:text-[14px] font-bold text-[#231B3B] mb-1.5 sm:mb-2"
          >
            Email address
          </label>
          <input
            id="educator-email"
            name="username"
            type="email"
            required
            disabled={isSubmitting}
            autoComplete="username"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            value={emailOrUsername}
            onChange={(e) => {
              setEmailOrUsername(e.target.value);
              clearErrors();
            }}
            placeholder="you@example.com"
            className="w-full rounded-[12px] sm:rounded-[14px] border border-[#E2DCF3] bg-[#FBF9FF] px-3.5 sm:px-4 py-3 sm:py-3.5 text-[14px] sm:text-[14.5px] text-[#231B3B] placeholder:text-[#8881A3] focus:border-[#6D48DF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D48DF]/20 disabled:opacity-60 transition"
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="educator-password"
            className="block text-[13px] sm:text-[14px] font-bold text-[#231B3B] mb-1.5 sm:mb-2"
          >
            Password
          </label>
          <input
            id="educator-password"
            name="password"
            type="password"
            required
            disabled={isSubmitting}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearErrors();
            }}
            placeholder="Enter your password"
            className="w-full rounded-[12px] sm:rounded-[14px] border border-[#E2DCF3] bg-[#FBF9FF] px-3.5 sm:px-4 py-3 sm:py-3.5 text-[14px] sm:text-[14.5px] text-[#231B3B] placeholder:text-[#8881A3] focus:border-[#6D48DF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6D48DF]/20 disabled:opacity-60 transition"
          />

          {/* Forgot password link */}
          <div className="mt-2 sm:mt-2.5 flex justify-end">
            <button
              type="button"
              onClick={() => setShowForgotNote((prev) => !prev)}
              className="text-[12px] sm:text-[13px] font-bold text-[#6D48DF] hover:text-[#5B36CA] transition cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {showForgotNote && (
            <p className="mt-2 rounded-[12px] bg-[#EFE9FC] px-3.5 py-2.5 text-[12px] font-medium text-[#5A3BB8]">
              Please contact your WishPix school or centre administrator to
              reset your password.
            </p>
          )}

          {/* Contextual Security & Validation Alerts */}
          {hasError && (
            <div
              role="alert"
              aria-live="polite"
              className={`mt-3 rounded-[12px] px-3.5 py-2.5 text-[12px] font-medium flex items-start gap-2.5 ${
                errorCode === "ACCOUNT_LOCKED"
                  ? "bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C]"
                  : "bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]"
              }`}
            >
              {errorCode === "ACCOUNT_LOCKED" ? (
                <ShieldAlert
                  className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              ) : (
                <AlertTriangle
                  className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              )}

              <div className="space-y-0.5">
                {errorCode === "MISSING_CREDENTIALS" ? (
                  <p>Please enter both your email address and password.</p>
                ) : errorCode === "ACCOUNT_LOCKED" ? (
                  <p>
                    Too many failed attempts. Account is locked for{" "}
                    {retryAfterMinutes ?? 15} minute
                    {(retryAfterMinutes ?? 15) === 1 ? "" : "s"}.
                  </p>
                ) : (
                  <p>Incorrect email address or password. Try again.</p>
                )}

                {errorCode === "INVALID_CREDENTIALS" &&
                  typeof remainingAttempts === "number" &&
                  remainingAttempts <= 2 &&
                  remainingAttempts > 0 && (
                    <p className="text-[11px] font-bold text-[#B45309]">
                      Warning: {remainingAttempts} attempt
                      {remainingAttempts === 1 ? "" : "s"} remaining before
                      15-minute lockout.
                    </p>
                  )}
              </div>
            </div>
          )}
        </div>

        {/* Log in Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-[#6D48DF] hover:bg-[#5B36CA] active:scale-[0.99] disabled:opacity-60 text-white font-bold text-[14.5px] sm:text-[15.5px] lg:text-[16px] py-3 sm:py-3.5 lg:py-4 px-6 shadow-[0_6px_18px_rgba(109,72,223,0.28)] flex items-center justify-center gap-2 transition cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Logging in...</span>
            </>
          ) : (
            <span>Log in</span>
          )}
        </button>
      </form>
    </section>
  );
}
