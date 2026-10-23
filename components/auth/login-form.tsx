"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";

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
      className="w-full bg-white rounded-[26px] sm:rounded-[30px] px-6 sm:px-9 pt-7 sm:pt-9 pb-7 sm:pb-9 shadow-[0_18px_42px_rgba(9,45,80,0.14)]"
    >
      <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.14em] text-[#1D70B8] uppercase">
        EDUCATOR ACCESS
      </p>
      <h2
        id="login-heading"
        className="text-[26px] sm:text-[30px] font-normal text-[#143350] tracking-tight mt-1 leading-tight"
      >
        Welcome back
      </h2>
      <p className="text-[11.5px] sm:text-[13px] text-[#7D8E9F] mt-1.5">
        Sign in to securely manage your daycare kiosk.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 sm:mt-7 space-y-4" noValidate>
        <div>
          <label
            htmlFor="educator-username"
            className="block text-[11.5px] sm:text-[12.5px] font-semibold text-[#1E3B58] mb-1.5"
          >
            Educator ID / Username
          </label>
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
            placeholder="Enter your Username"
            className="w-full rounded-[11px] border border-[#DCE4EE] bg-white px-4 py-3 text-[13px] sm:text-[14px] text-[#143350] placeholder:text-[#98A6B5] focus:border-[#1D70B8] focus:outline-none focus:ring-2 focus:ring-[#1D70B8]/15 transition"
          />
        </div>

        <div>
          <label
            htmlFor="educator-password"
            className="block text-[11.5px] sm:text-[12.5px] font-semibold text-[#1E3B58] mb-1.5"
          >
            Password
          </label>
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
            className="w-full rounded-[11px] border border-[#DCE4EE] bg-white px-4 py-3 text-[13px] sm:text-[14px] text-[#143350] placeholder:text-[#98A6B5] focus:border-[#1D70B8] focus:outline-none focus:ring-2 focus:ring-[#1D70B8]/15 transition"
          />
        </div>

        {hasError ? (
          <div
            role="alert"
            aria-live="polite"
            className="pt-1 pb-0.5 text-center"
          >
            <p className="text-[11.5px] sm:text-[12.5px] font-normal text-[#EF4444]">
              Incorrect username or password. Try again.
            </p>
          </div>
        ) : (
          <div className="pt-2" />
        )}

        <button
          type="submit"
          className="w-full rounded-[12px] bg-[#004A7C] hover:bg-[#003D66] active:scale-[0.99] text-white font-semibold text-[13px] sm:text-[14px] py-3.5 sm:py-4 px-4 shadow-[0_6px_16px_rgba(0,74,124,0.24)] flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <span>Login</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
