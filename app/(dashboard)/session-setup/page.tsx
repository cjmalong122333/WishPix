"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Apple,
  ArrowLeft,
  ArrowRight,
  Check,
  Flower2,
  Globe,
  Lock,
  Palette,
  PawPrint,
  Pencil,
  Plane,
  Play,
  Plus,
  Shapes,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {
  KIOSK_INFO,
  SAFETY_MODES,
  SESSION_ACTIVITIES,
  SESSION_THEMES,
} from "@/lib/mock-data";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import type { SafetyRuleMode, ThemeOption } from "@/types/kiosk";

const SETUP_STEPS = [
  { number: 1, labelEn: "Activity", labelFil: "Aktibidad" },
  { number: 2, labelEn: "Theme", labelFil: "Tema" },
  { number: 3, labelEn: "Safety", labelFil: "Kaligtasan" },
  { number: 4, labelEn: "Start", labelFil: "Simulan" },
];

const AVAILABLE_LANGUAGES = ["English", "Filipino", "Taglish"] as const;

export default function SessionSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useAppSettings();

  const initialStepParam = Number(searchParams.get("step"));
  const initialStep =
    initialStepParam >= 1 && initialStepParam <= 4 ? initialStepParam : 1;

  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  // Step 1 State: Activity & Sub-Option
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    "color-create"
  );
  const [selectedSubOptionId, setSelectedSubOptionId] = useState<string | null>(
    "single-object"
  );

  // Step 2 State: Theme & Custom Theme
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(
    "animals"
  );
  const [customThemeText, setCustomThemeText] = useState<string>("");

  // Step 3 State: Safety Level, Custom Words & Languages
  const [safetyMode, setSafetyMode] = useState<SafetyRuleMode>("STANDARD");
  const [blockedWordInput, setBlockedWordInput] = useState("");
  const [blockedWords, setBlockedWords] = useState<string[]>([]);
  const [allowedWordInput, setAllowedWordInput] = useState("");
  const [allowedWords, setAllowedWords] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "English",
    "Filipino",
  ]);

  const selectedActivity = SESSION_ACTIVITIES.find(
    (item) => item.id === selectedActivityId
  );

  const selectedSubOption = selectedActivity?.subOptions?.find(
    (sub) => sub.id === selectedSubOptionId
  );

  const selectedTheme = SESSION_THEMES.find((tItem) => tItem.id === selectedThemeId);

  const activitySummaryLabel = selectedActivity
    ? selectedSubOption
      ? `${selectedActivity.summaryTitle ?? selectedActivity.title} - ${selectedSubOption.title}`
      : (selectedActivity.summaryTitle ?? selectedActivity.title)
    : t("Not selected", "Hindi pa napili");

  const activityReviewLabel = selectedActivity
    ? selectedSubOption
      ? `${selectedActivity.title} - ${selectedSubOption.title}`
      : selectedActivity.title
    : t("Not selected", "Hindi pa napili");

  const themeSummaryLabel =
    selectedThemeId === "custom"
      ? customThemeText.trim() || "Custom Theme"
      : selectedTheme
        ? selectedTheme.title
        : t("Not selected", "Hindi pa napili");

  const handleSelectActivity = (activityId: string) => {
    setSelectedActivityId(activityId);
    const activity = SESSION_ACTIVITIES.find((a) => a.id === activityId);
    if (activity?.subOptions && activity.subOptions.length > 0) {
      setSelectedSubOptionId(activity.subOptions[0].id);
    } else {
      setSelectedSubOptionId(null);
    }
  };

  const handleAddBlockedWord = () => {
    const trimmed = blockedWordInput.trim();
    if (!trimmed) return;
    if (!blockedWords.includes(trimmed)) {
      setBlockedWords((prev) => [...prev, trimmed]);
    }
    setBlockedWordInput("");
  };

  const handleAddAllowedWord = () => {
    const trimmed = allowedWordInput.trim();
    if (!trimmed) return;
    if (!allowedWords.includes(trimmed)) {
      setAllowedWords((prev) => [...prev, trimmed]);
    }
    setAllowedWordInput("");
  };

  const handleToggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) => {
      if (prev.includes(lang)) {
        return prev.length > 1 ? prev.filter((item) => item !== lang) : prev;
      }
      return [...prev, lang];
    });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.push("/dashboard");
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      router.push("/live-session?session=active");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Page Title & Step Badge */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[18px] sm:text-[22px] lg:text-[26px] font-extrabold text-[#0F253E] tracking-tight">
            {t("Session Setup", "Pag-setup ng Sesyon")}
          </h1>
          <p className="text-[11px] sm:text-[13px] text-[#64748B] mt-0.5">
            {t(
              "Choose activity, theme and safety, then start.",
              "Pumili ng aktibidad, tema at kaligtasan, pagkatapos ay magsimula."
            )}
          </p>
        </div>

        <span className="rounded-full bg-[#E6F2FF] border border-[#B9DCFF] px-3 py-1 text-[10.5px] sm:text-[11.5px] font-bold text-[#0077C8] flex-shrink-0">
          {t(`Step ${currentStep} of 4`, `Hakbang ${currentStep} ng 4`)}
        </span>
      </div>

      {/* 4-Step Segmented Progress Bar */}
      <div
        role="tablist"
        aria-label="Session setup steps"
        className="rounded-[12px] bg-[#E6EEF6] p-1 grid grid-cols-4 gap-1"
      >
        {SETUP_STEPS.map((step) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <button
              key={step.number}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setCurrentStep(step.number)}
              className={`rounded-[9px] py-1.5 sm:py-2 px-1.5 sm:px-2 flex items-center justify-center gap-1.5 text-[10.5px] sm:text-[12px] transition cursor-pointer ${
                isActive
                  ? "bg-white text-[#0077C8] font-bold shadow-xs"
                  : isCompleted
                    ? "text-[#15803D] font-bold hover:bg-white/50"
                    : "text-[#64748B] hover:text-[#0F253E] font-medium"
              }`}
            >
              <span
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full text-[9.5px] sm:text-[10.5px] font-bold flex items-center justify-center flex-shrink-0 ${
                  isActive
                    ? "bg-[#0077C8] text-white"
                    : isCompleted
                      ? "bg-[#16A34A] text-white"
                      : "bg-[#CBD5E1] text-[#475569]"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                ) : (
                  step.number
                )}
              </span>
              <span className="truncate">
                {t(step.labelEn, step.labelFil)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Responsive Split Layout: Stacked on Mobile, 2-Column on Desktop (lg+) */}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
        {/* Left Column: Active Step Content */}
        <div key={`step-${currentStep}`} className="wishpix-step-transition lg:col-span-7 space-y-4">
          {/* STEP 1: ACTIVITY SETUP */}
          {currentStep === 1 && (
            <section
              aria-labelledby="activity-setup-heading"
              className="space-y-3.5"
            >
              <div>
                <h2
                  id="activity-setup-heading"
                  className="text-[13px] sm:text-[15px] font-bold text-[#0F253E]"
                >
                  {t("Activity Setup", "Pag-setup ng Aktibidad")}
                </h2>
                <p className="text-[11px] sm:text-[12.5px] text-[#64748B] mt-0.5">
                  {t(
                    "Choose how children will use the kiosk.",
                    "Piliin kung paano gagamitin ng mga bata ang kiosk."
                  )}
                </p>
              </div>

              {/* Primary Activity Cards */}
              <div className="rounded-[16px] bg-white border border-[#E6EDF5] p-3 sm:p-4 space-y-2.5 sm:space-y-3 shadow-[0_2px_10px_rgba(15,37,62,0.03)]">
                {SESSION_ACTIVITIES.map((activity) => {
                  const isSelected = activity.id === selectedActivityId;

                  const iconBoxClasses =
                    activity.accent === "blue"
                      ? "bg-[#E6F2FF] text-[#0077C8]"
                      : activity.accent === "purple"
                        ? "bg-[#F3E8FF] text-[#9333EA]"
                        : "bg-[#DCFCE7] text-[#15803D]";

                  return (
                    <button
                      key={activity.id}
                      type="button"
                      onClick={() => handleSelectActivity(activity.id)}
                      className={`w-full rounded-[13px] p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 transition cursor-pointer ${
                        isSelected
                          ? "bg-[#F5FAFF] border-[1.75px] border-[#0077C8] shadow-[0_2px_10px_rgba(0,119,200,0.08)]"
                          : "bg-white border border-[#E6EDF5] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 ${iconBoxClasses}`}
                        >
                          {activity.icon === "palette" && (
                            <Palette
                              className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2]"
                              aria-hidden="true"
                            />
                          )}
                          {activity.icon === "pencil" && (
                            <Pencil
                              className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2]"
                              aria-hidden="true"
                            />
                          )}
                          {activity.icon === "sparkles" && (
                            <Sparkles
                              className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2]"
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-[12.5px] sm:text-[13.5px] font-bold text-[#0F253E]">
                            {activity.title}
                          </p>
                          <p className="text-[10.5px] sm:text-[11.5px] text-[#64748B] mt-0.5">
                            {activity.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Radio / Check Circle */}
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full border-[1.5px] border-[#0077C8] text-[#0077C8] bg-white flex items-center justify-center">
                            <Check
                              className="w-3 h-3 stroke-[2.75]"
                              aria-hidden="true"
                            />
                          </span>
                        ) : (
                          <span
                            className="w-5 h-5 rounded-full border border-[#CBD5E1] block"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Sub-Options Card */}
              {selectedActivity?.subOptions &&
                selectedActivity.subOptions.length > 0 && (
                  <div className="rounded-[16px] bg-white border border-[#E6EDF5] p-3 sm:p-4 space-y-2.5 shadow-[0_2px_10px_rgba(15,37,62,0.03)]">
                    {selectedActivity.subOptions.map((sub) => {
                      const isSubSelected = sub.id === selectedSubOptionId;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() =>
                            setSelectedSubOptionId((prev) =>
                              prev === sub.id ? null : sub.id
                            )
                          }
                          className={`w-full rounded-[12px] p-3 sm:p-3.5 text-left flex items-center gap-3 transition cursor-pointer ${
                            isSubSelected
                              ? "bg-[#F5FAFF] border-[1.5px] border-[#0077C8]"
                              : "bg-white border border-[#E6EDF5] hover:bg-[#F8FAFC]"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isSubSelected
                                ? "border-[4.5px] border-[#0077C8] bg-white"
                                : "border border-[#CBD5E1]"
                            }`}
                            aria-hidden="true"
                          />
                          <div className="min-w-0">
                            <p className="text-[12px] sm:text-[13px] font-bold text-[#0F253E]">
                              {sub.title}
                            </p>
                            <p className="text-[10px] sm:text-[11px] text-[#64748B] mt-0.5">
                              {sub.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
            </section>
          )}

          {/* STEP 2: THEME SETUP */}
          {currentStep === 2 && (
            <section
              aria-labelledby="theme-setup-heading"
              className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_10px_rgba(15,37,62,0.03)]"
            >
              <div>
                <h2
                  id="theme-setup-heading"
                  className="text-[14px] sm:text-[16px] font-extrabold text-[#005A9C]"
                >
                  {t("Theme Setup", "Pag-setup ng Tema")}
                </h2>
                <p className="text-[11px] sm:text-[12px] text-[#64748B] mt-0.5 leading-relaxed">
                  {t(
                    "Pick the learning topic. It is pushed to the kiosk when you continue.",
                    "Piliin ang paksa ng pag-aaral. Ipapadala ito sa kiosk kapag nagpatuloy ka."
                  )}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
                {SESSION_THEMES.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`rounded-[14px] p-3 sm:p-3.5 text-left flex flex-col justify-between gap-2.5 transition cursor-pointer ${
                        isSelected
                          ? "bg-[#F5FAFF] border-[1.75px] border-[#0077C8] shadow-[0_2px_10px_rgba(0,119,200,0.08)]"
                          : "bg-white border border-[#E6EDF5] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ThemeIconBadge
                          icon={theme.icon}
                          accent={theme.accent}
                        />
                        <span className="text-[12px] sm:text-[13px] font-bold text-[#0F253E] leading-tight">
                          {theme.title}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {theme.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-[#F1F5F9] px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-medium text-[#475569]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}

                {/* + Custom Theme Card */}
                <div
                  onClick={() => setSelectedThemeId("custom")}
                  className={`rounded-[14px] p-3 sm:p-3.5 flex flex-col justify-between gap-2.5 transition cursor-pointer ${
                    selectedThemeId === "custom"
                      ? "bg-[#F5FAFF] border-[1.75px] border-dashed border-[#0077C8]"
                      : "bg-[#FAFCFF] border-[1.5px] border-dashed border-[#CBD5E1] hover:border-[#94A3B8]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-[7px] bg-[#DCFCE7] text-[#15803D] flex items-center justify-center flex-shrink-0">
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="text-[12px] sm:text-[13px] font-bold text-[#0F253E] leading-tight">
                      Custom Theme
                    </span>
                  </div>

                  <input
                    type="text"
                    value={customThemeText}
                    onFocus={() => setSelectedThemeId("custom")}
                    onChange={(e) => {
                      setSelectedThemeId("custom");
                      setCustomThemeText(e.target.value);
                    }}
                    placeholder="e.g. YOUR LIFE"
                    aria-label="Custom theme name"
                    className="w-full rounded-[8px] bg-white border border-[#E2E8F0] px-2.5 py-1.5 text-[10.5px] sm:text-[11px] font-medium text-[#0F253E] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0077C8]"
                  />
                </div>
              </div>
            </section>
          )}

          {/* STEP 3: SAFETY SETUP */}
          {currentStep === 3 && (
            <section
              aria-labelledby="safety-setup-heading"
              className="space-y-3.5"
            >
              <div>
                <h2
                  id="safety-setup-heading"
                  className="text-[13px] sm:text-[15px] font-bold text-[#0F253E]"
                >
                  {t("Safety Setup", "Pag-setup ng Kaligtasan")}
                </h2>
                <p className="text-[11px] sm:text-[12.5px] text-[#64748B] mt-0.5">
                  {t(
                    "Child Safe Mode decides what the kiosk will accept.",
                    "Ang Child Safe Mode ang magpapasya kung ano ang tatanggapin ng kiosk."
                  )}
                </p>
              </div>

              <div className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 space-y-3.5 shadow-[0_2px_10px_rgba(15,37,62,0.03)]">
                {/* 3 Safety Mode Cards */}
                <div className="space-y-2.5 sm:space-y-3">
                  {SAFETY_MODES.map((mode) => {
                    const isSelected = safetyMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSafetyMode(mode.id)}
                        className={`w-full rounded-[13px] p-3.5 sm:p-4 text-left transition cursor-pointer ${
                          isSelected
                            ? "bg-[#F8FBFF] border-[1.75px] border-[#0B5384] shadow-[0_2px_10px_rgba(11,83,132,0.08)]"
                            : "bg-white border border-[#E6EDF5] hover:bg-[#F8FAFC]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-8 h-8 rounded-[9px] flex items-center justify-center ${
                              isSelected
                                ? "bg-[#0B5384] text-white"
                                : "bg-[#F1F5F9] text-[#64748B]"
                            }`}
                          >
                            {mode.icon === "lock" && (
                              <Lock className="w-4 h-4" aria-hidden="true" />
                            )}
                            {mode.icon === "shield" && (
                              <Shield className="w-4 h-4" aria-hidden="true" />
                            )}
                            {mode.icon === "sliders" && (
                              <SlidersHorizontal
                                className="w-4 h-4"
                                aria-hidden="true"
                              />
                            )}
                          </div>

                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#0B5384] text-white flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[2.75]" />
                            </span>
                          )}
                        </div>

                        <p className="mt-2.5 text-[12.5px] sm:text-[13.5px] font-extrabold text-[#0F253E] tracking-wide">
                          {mode.title}
                        </p>
                        <p
                          className={`text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.12em] mt-0.5 ${
                            mode.id === "STRICT"
                              ? "text-[#94A3B8]"
                              : "text-[#0077C8]"
                          }`}
                        >
                          {mode.subtitle}
                        </p>
                        <p className="text-[10.5px] sm:text-[11.5px] text-[#64748B] mt-1.5 leading-relaxed">
                          {mode.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Optional Fine-Tuning Rules */}
                <div className="pt-3 border-t border-[#EDF2F7] space-y-3.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[11.5px] sm:text-[12.5px] font-extrabold text-[#005A9C]">
                      {t("Optional", "Opsyonal")}
                    </span>
                    <span className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8]">
                      {t(
                        "Fine-tune the rules.",
                        "I-customize ang mga panuntunan."
                      )}
                    </span>
                  </div>

                  {/* Custom Blocked Words */}
                  <div>
                    <label
                      htmlFor="blocked-word-input"
                      className="block text-[11px] sm:text-[12px] font-bold text-[#0F253E]"
                    >
                      Custom Blocked Words
                    </label>
                    <p className="text-[9.5px] sm:text-[10.5px] text-[#94A3B8]">
                      {t("Always rejected", "Palaging hinaharang")}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <input
                        id="blocked-word-input"
                        type="text"
                        value={blockedWordInput}
                        onChange={(e) => setBlockedWordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                            e.preventDefault();
                            handleAddBlockedWord();
                          }
                        }}
                        placeholder="Type a word, press Enter"
                        className="flex-1 rounded-[9px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[11px] sm:text-[12px] text-[#0F253E] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#0077C8]"
                      />
                      <button
                        type="button"
                        onClick={handleAddBlockedWord}
                        aria-label="Add blocked word"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-[9px] bg-[#0B5384] hover:opacity-95 text-white flex items-center justify-center flex-shrink-0 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                    {blockedWords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {blockedWords.map((word) => (
                          <span
                            key={word}
                            className="inline-flex items-center gap-1 rounded-full bg-[#FFE4E6] px-2.5 py-0.5 text-[10px] font-bold text-[#E11D48]"
                          >
                            <span>{word}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setBlockedWords((prev) =>
                                  prev.filter((w) => w !== word)
                                )
                              }
                              aria-label={`Remove ${word}`}
                              className="hover:opacity-75 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Custom Allowed Words */}
                  <div>
                    <label
                      htmlFor="allowed-word-input"
                      className="block text-[11px] sm:text-[12px] font-bold text-[#0F253E]"
                    >
                      Custom Allowed Words
                    </label>
                    <p className="text-[9.5px] sm:text-[10.5px] text-[#94A3B8]">
                      {t("Always accepted", "Palaging tinatanggap")}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <input
                        id="allowed-word-input"
                        type="text"
                        value={allowedWordInput}
                        onChange={(e) => setAllowedWordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                            e.preventDefault();
                            handleAddAllowedWord();
                          }
                        }}
                        placeholder="Type a word, press Enter"
                        className="flex-1 rounded-[9px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[11px] sm:text-[12px] text-[#0F253E] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#0077C8]"
                      />
                      <button
                        type="button"
                        onClick={handleAddAllowedWord}
                        aria-label="Add allowed word"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-[9px] bg-[#0B5384] hover:opacity-95 text-white flex items-center justify-center flex-shrink-0 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                    {allowedWords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {allowedWords.map((word) => (
                          <span
                            key={word}
                            className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[10px] font-bold text-[#15803D]"
                          >
                            <span>{word}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setAllowedWords((prev) =>
                                  prev.filter((w) => w !== word)
                                )
                              }
                              aria-label={`Remove ${word}`}
                              className="hover:opacity-75 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Language Restrictions */}
                  <div>
                    <p className="text-[11px] sm:text-[12px] font-bold text-[#0F253E]">
                      Language Restrictions
                    </p>
                    <p className="text-[9.5px] sm:text-[10.5px] text-[#94A3B8]">
                      {t(
                        "Languages the kiosk will listen for",
                        "Mga wikang pakikinggan ng kiosk"
                      )}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {AVAILABLE_LANGUAGES.map((lang) => {
                        const isChecked = selectedLanguages.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => handleToggleLanguage(lang)}
                            className={`inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[10.5px] sm:text-[11.5px] font-bold transition cursor-pointer ${
                              isChecked
                                ? "bg-[#EBF5FF] border border-[#93C5FD] text-[#0066B2]"
                                : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F253E]"
                            }`}
                          >
                            {isChecked && (
                              <Check className="w-3 h-3 stroke-[2.75]" />
                            )}
                            <span>{lang}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3 Card Footer Buttons */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 rounded-[10px] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-2 text-[11px] sm:text-[12px] font-semibold text-[#64748B] transition cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{t("Back", "Bumalik")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#0B5384] hover:opacity-95 text-white px-4 py-2 text-[11px] sm:text-[12px] font-bold shadow-xs transition cursor-pointer"
                    >
                      <span>{t("Save Settings", "I-save ang Setting")}</span>
                      <ArrowRight
                        className="w-3.5 h-3.5 stroke-[2.5]"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* STEP 4: START SESSION */}
          {currentStep === 4 && (
            <section
              aria-labelledby="start-session-heading"
              className="space-y-3.5"
            >
              <div>
                <h2
                  id="start-session-heading"
                  className="text-[13px] sm:text-[15px] font-bold text-[#0F253E]"
                >
                  {t("Start Session", "Simulan ang Sesyon")}
                </h2>
                <p className="text-[11px] sm:text-[12.5px] text-[#64748B] mt-0.5">
                  {t(
                    "Review what will be sent to the kiosk.",
                    "Suriin ang ipapadala sa kiosk."
                  )}
                </p>
              </div>

              <div className="rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 space-y-3.5 shadow-[0_2px_10px_rgba(15,37,62,0.03)]">
                <div>
                  <h3 className="text-[14px] sm:text-[16px] font-extrabold text-[#005A9C]">
                    {t("Start Session", "Simulan ang Sesyon")}
                  </h3>
                  <p className="text-[10.5px] sm:text-[11.5px] text-[#64748B] mt-0.5">
                    {t(
                      "Review what will be sent to the kiosk.",
                      "Suriin ang ipapadala sa kiosk."
                    )}
                  </p>
                </div>

                {/* Review Item 1: Activity Type */}
                <div className="rounded-[12px] border border-[#E6EDF5] bg-[#F8FAFC] p-3 sm:p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-[9px] bg-[#E6F2FF] text-[#0077C8] flex items-center justify-center flex-shrink-0">
                      <Palette className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
                        {t("ACTIVITY TYPE", "URI NG AKTIBIDAD")}
                      </p>
                      <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#0F253E] truncate mt-0.5">
                        {activityReviewLabel}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-[10.5px] sm:text-[11.5px] font-bold text-[#0077C8] hover:underline flex-shrink-0 cursor-pointer"
                  >
                    {t("Edit", "Baguhin")}
                  </button>
                </div>

                {/* Review Item 2: Theme */}
                <div className="rounded-[12px] border border-[#E6EDF5] bg-[#F8FAFC] p-3 sm:p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-[9px] bg-[#F1F5F9] text-[#475569] flex items-center justify-center flex-shrink-0">
                      <PawPrint className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
                        {t("THEME", "TEMA")}
                      </p>
                      <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#0F253E] truncate mt-0.5">
                        {themeSummaryLabel}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-[10.5px] sm:text-[11.5px] font-bold text-[#0077C8] hover:underline flex-shrink-0 cursor-pointer"
                  >
                    {t("Edit", "Baguhin")}
                  </button>
                </div>

                {/* Review Item 3: Safety Rules */}
                <div className="rounded-[12px] border border-[#E6EDF5] bg-[#F8FAFC] p-3 sm:p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-[9px] bg-[#0B5384] text-white flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
                        {t("SAFETY RULES", "PANUNTUNAN SA KALIGTASAN")}
                      </p>
                      <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#0F253E] truncate mt-0.5">
                        {safetyMode}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-[10.5px] sm:text-[11.5px] font-bold text-[#0077C8] hover:underline flex-shrink-0 cursor-pointer"
                  >
                    {t("Edit", "Baguhin")}
                  </button>
                </div>

                {/* Start Session Action Row */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2.5 text-[11.5px] sm:text-[12.5px] font-semibold text-[#64748B] transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t("Back", "Bumalik")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/live-session?session=active")}
                    className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#0B5384] hover:opacity-95 text-white px-5 py-2.5 text-[11.5px] sm:text-[12.5px] font-bold shadow-[0_4px_12px_rgba(11,83,132,0.25)] transition cursor-pointer"
                  >
                    <Play
                      className="w-3.5 h-3.5 fill-white text-white"
                      aria-hidden="true"
                    />
                    <span>{t("Start Session", "Simulan ang Sesyon")}</span>
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Persistent Session Summary Card */}
        <section
          aria-labelledby="session-summary-heading"
          className="lg:col-span-5 rounded-[16px] bg-white border border-[#E6EDF5] p-4 sm:p-5 shadow-[0_2px_10px_rgba(15,37,62,0.03)]"
        >
          <h2
            id="session-summary-heading"
            className="text-[14px] sm:text-[15.5px] font-extrabold text-[#005A9C]"
          >
            {t("Session Summary", "Buod ng Sesyon")}
          </h2>
          <p className="text-[10.5px] sm:text-[11.5px] text-[#94A3B8] mt-0.5">
            {t("Sent to kiosk on start", "Ipapadala sa kiosk sa pagsisimula")}
          </p>

          <div className="mt-3.5 divide-y divide-[#EEF2F6]">
            {/* Row 1: Activity Type */}
            <div className="py-2.5 flex items-start gap-3">
              <Palette
                className="w-4 h-4 text-[#0077C8] mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
                  {t("ACTIVITY TYPE", "URI NG AKTIBIDAD")}
                </p>
                <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#0F253E] mt-0.5">
                  {activitySummaryLabel}
                </p>
              </div>
            </div>

            {/* Row 2: Theme */}
            <div className="py-2.5 flex items-start gap-3">
              <Flower2
                className="w-4 h-4 text-[#0077C8] mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
                  {t("THEME", "TEMA")}
                </p>
                <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#0F253E] mt-0.5">
                  {currentStep === 1 && selectedThemeId === "animals"
                    ? t("Not selected", "Hindi pa napili")
                    : themeSummaryLabel}
                </p>
              </div>
            </div>

            {/* Row 3: Safety Rules */}
            <div className="py-2.5 flex items-start gap-3">
              <ShieldCheck
                className="w-4 h-4 text-[#0077C8] mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
                  {t("SAFETY RULES", "PANUNTUNAN SA KALIGTASAN")}
                </p>
                <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#0F253E] mt-0.5">
                  {safetyMode}
                </p>
              </div>
            </div>

            {/* Row 4: Languages */}
            <div className="py-2.5 flex items-start gap-3">
              <Globe
                className="w-4 h-4 text-[#0077C8] mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">
                  {t("LANGUAGES", "MGA WIKA")}
                </p>
                <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#0F253E] mt-0.5">
                  {selectedLanguages.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Online Kiosk Status Pill Box */}
          <div className="mt-3 rounded-[10px] bg-[#E2F5EA] px-3.5 py-2.5 flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-[#16A34A] flex-shrink-0"
              aria-hidden="true"
            />
            <span className="text-[11px] sm:text-[11.5px] font-semibold text-[#15803D]">
              {t(
                `${KIOSK_INFO.roomName} kiosk is online`,
                `Online ang kiosk sa ${KIOSK_INFO.roomName}`
              )}
            </span>
          </div>
        </section>
      </div>

      {/* Bottom Back / Continue Footer for Steps 1 & 2 */}
      {(currentStep === 1 || currentStep === 2) && (
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2.5 text-[11.5px] sm:text-[12.5px] font-semibold text-[#64748B] transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t("Back", "Bumalik")}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#0077C8] hover:opacity-95 text-white px-5 py-2.5 text-[11.5px] sm:text-[12.5px] font-bold shadow-[0_4px_12px_rgba(0,119,200,0.25)] transition cursor-pointer"
          >
            <span>{t("Continue", "Magpatuloy")}</span>
            <ArrowRight
              className="w-3.5 h-3.5 stroke-[2.5]"
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </div>
  );
}

function ThemeIconBadge({
  icon,
  accent,
}: {
  icon: ThemeOption["icon"];
  accent: ThemeOption["accent"];
}) {
  const accentStyles: Record<ThemeOption["accent"], string> = {
    blue: "bg-[#E6F2FF] text-[#0077C8]",
    orange: "bg-[#FEF3C7] text-[#D97706]",
    red: "bg-[#FFE4E6] text-[#E11D48]",
    green: "bg-[#DCFCE7] text-[#15803D]",
    indigo: "bg-[#EEF2FF] text-[#4F46E5]",
    amber: "bg-[#FEF9C3] text-[#CA8A04]",
    pink: "bg-[#FCE7F3] text-[#DB2777]",
  };

  return (
    <span
      className={`w-6 h-6 rounded-[7px] flex items-center justify-center flex-shrink-0 ${accentStyles[accent]}`}
    >
      {icon === "paw" && <PawPrint className="w-3.5 h-3.5" />}
      {icon === "plane" && <Plane className="w-3.5 h-3.5" />}
      {icon === "apple" && <Apple className="w-3.5 h-3.5" />}
      {icon === "users" && <Users className="w-3.5 h-3.5" />}
      {icon === "shapes" && <Shapes className="w-3.5 h-3.5" />}
      {icon === "palette" && <Palette className="w-3.5 h-3.5" />}
      {icon === "flower" && <Flower2 className="w-3.5 h-3.5" />}
    </span>
  );
}
