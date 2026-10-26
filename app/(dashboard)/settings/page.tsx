"use client";

import React, { useState } from "react";
import { Check, Volume2 } from "lucide-react";
import { THEME_SWATCHES } from "@/lib/mock-data";

export default function SettingsPage() {
  const [displayLanguage, setDisplayLanguage] = useState<
    "English" | "Filipino"
  >("English");
  const [volume, setVolume] = useState<number>(70);
  const [selectedSwatchId, setSelectedSwatchId] =
    useState<string>("deep-blue");
  const [autoSleepEnabled, setAutoSleepEnabled] = useState<boolean>(true);
  const [autoSleepDuration, setAutoSleepDuration] =
    useState<string>("15 minutes");
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState<boolean>(true);
  const [autoLogoutDuration, setAutoLogoutDuration] =
    useState<string>("30 minutes");

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Page Title */}
      <div>
        <h1 className="text-[20px] sm:text-[24px] lg:text-[26px] font-extrabold text-[#0F253E] tracking-tight">
          Settings
        </h1>
        <p className="text-[11px] sm:text-[13px] text-[#64748B] mt-0.5">
          Language, audio, display and system preferences.
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
              Language
            </h2>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
              Interface language for the teacher application.
            </p>
          </div>

          <div className="pt-3.5">
            <p className="text-[12px] sm:text-[13px] font-bold text-[#0F253E]">
              Display language
            </p>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
              Navigation and page titles update immediately.
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
              Audio
            </h2>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
              Kiosk speaker output.
            </p>
          </div>

          <div className="pt-3.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <label
                  htmlFor="kiosk-volume-slider"
                  className="block text-[12px] sm:text-[13px] font-bold text-[#0F253E]"
                >
                  Volume
                </label>
                <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
                  Applies to the kiosk speaker.
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
                className="w-full h-2 rounded-lg bg-[#CBD5E1] accent-[#0F253E] cursor-pointer"
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
              Display
            </h2>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
              Theme colors for this application.
            </p>
          </div>

          <div
            role="radiogroup"
            aria-label="Theme color"
            className="pt-4 pb-1 flex items-center justify-center sm:justify-around gap-4 sm:gap-6"
          >
            {THEME_SWATCHES.map((swatch) => {
              const isSelected = selectedSwatchId === swatch.id;
              return (
                <button
                  key={swatch.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedSwatchId(swatch.id)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <span
                    style={{ backgroundColor: swatch.hex }}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[12px] flex items-center justify-center transition ${
                      isSelected
                        ? "ring-2 ring-[#0F253E] ring-offset-2"
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
                    {swatch.label}
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
              System
            </h2>
            <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
              Power and security behavior.
            </p>
          </div>

          <div className="pt-3.5 space-y-4">
            {/* Auto sleep */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] sm:text-[13px] font-bold text-[#0F253E]">
                    Auto sleep
                  </p>
                  <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
                    Put the kiosk to sleep when idle.
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
                  <option value="5 minutes">5 minutes</option>
                  <option value="15 minutes">15 minutes</option>
                  <option value="30 minutes">30 minutes</option>
                  <option value="1 hour">1 hour</option>
                </select>
              </div>
            </div>

            {/* Auto logout */}
            <div className="pt-3.5 border-t border-[#F1F5F9]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] sm:text-[13px] font-bold text-[#0F253E]">
                    Auto logout
                  </p>
                  <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
                    Sign out after a period of no activity.
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
                  <option value="15 minutes">15 minutes</option>
                  <option value="30 minutes">30 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="Never">Never</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
