"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasSubmitError, setHasSubmitError] = useState(false);

  const hasError = Boolean(errorParam) || hasSubmitError;

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
      <h2
        id="login-heading"
        className="text-[17px] sm:text-[18px] font-bold text-white tracking-tight leading-snug"
      >
        Welcome back
      </h2>
      <p className="text-[11px] sm:text-[11.5px] text-[#94A8BE] mt-1">
        Sign in to run activities on your daycare kiosk.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3.5" noValidate>
        {/* Username Field */}
        <div>
          <label
            htmlFor="educator-username"
            className="block text-[11px] sm:text-[11.5px] font-bold text-white mb-1.5"
          >
            Username
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
              placeholder="Enter your username"
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
            Password
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
              placeholder="Enter your password"
              className="w-full rounded-[8px] border border-[#1C3654] bg-[#081729] pl-9 pr-3.5 py-2.5 text-[12px] sm:text-[12.5px] text-white placeholder:text-[#6E849E] focus:border-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0284C7]/25 transition"
            />
          </div>

          {hasError && (
            <p
              role="alert"
              aria-live="polite"
              className="mt-1.5 text-[10.5px] sm:text-[11px] font-medium text-[#EF4444]"
            >
              Incorrect username or password. Try again.
            </p>
          )}
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full rounded-[8px] bg-[#03588C] hover:bg-[#0468A4] active:scale-[0.99] text-white font-bold text-[12.5px] sm:text-[13px] py-2.5 sm:py-3 px-4 shadow-[0_0_16px_rgba(2,132,199,0.35)] border border-[#0284C7]/40 flex items-center justify-center transition cursor-pointer"
        >
          Login
        </button>

        {/* Bottom Credential Recovery Note */}
        <p className="text-[10px] sm:text-[10.5px] text-[#7D93AB] text-center pt-0.5">
          Contact your System Administrator for credential recovery.
        </p>
      </form>
    </section>
  );
}
