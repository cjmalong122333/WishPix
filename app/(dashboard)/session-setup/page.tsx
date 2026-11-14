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
import { createSessionAction } from "@/lib/actions";
import { useAppSettings } from "@/components/providers/app-settings-provider";
import { RevealOnShow } from "@/components/public/reveal-on-show";
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

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      try {
        await createSessionAction({
          activityId: selectedActivityId ?? "color-create",
          activityTitle: selectedActivity?.title ?? "Color & Create",
          subOptionId: selectedSubOptionId,
          subOptionTitle: selectedSubOption?.title ?? null,
          themeId: selectedThemeId ?? "animals",
          themeTitle: themeSummaryLabel,
          customThemeText:
            selectedThemeId === "custom" ? customThemeText.trim() : undefined,
          safetyMode,
          blockedWords,
          allowedWords,
          allowedLanguages: selectedLanguages,
        });
      } catch {
        // Ignore offline errors
      }
      router.push("/live-session?session=active");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Page Title & Step Badge */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <RevealOnShow
            as="h1"
            variant="fade-down"
            delayMs={30}
            className="text-[18px] sm:text-[22px] lg:text-[26px] font-extrabold text-[#231B3B] tracking-tight"
          >
            {t("Session Setup", "Pag-setup ng Sesyon")}
          </RevealOnShow>
          <RevealOnShow
            as="p"
            variant="blur-in"
            delayMs={70}
            className="text-[11px] sm:text-[13px] text-[#766F8E] mt-0.5"
          >
            {t(
              "Choose activity, theme and safety, then start.",
              "Pumili ng aktibidad, tema at kaligtasan, pagkatapos ay magsimula."
            )}
          </RevealOnShow>
        </div>

        <RevealOnShow
          as="span"
          variant="pop-scale"
          delayMs={100}
          className="rounded-full bg-[#EFE9FC] border border-[#D5C5F7] px-3 py-1 text-[10.5px] sm:text-[11.5px] font-bold text-[#6D48DF] flex-shrink-0"
        >
          {t(`Step ${currentStep} of 4`, `Hakbang ${currentStep} ng 4`)}
        </RevealOnShow>
      </div>

      {/* 4-Step Segmented Progress Bar */}
      <RevealOnShow
        id="tour-setup-stepper"
        role="tablist"
        aria-label="Session setup steps"
        variant="fade-up"
        delayMs={135}
        className="rounded-[14px] bg-[#EFE9FC] p-1 grid grid-cols-4 gap-1"
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
              className={`rounded-[10px] py-1.5 sm:py-2 px-1.5 sm:px-2 flex items-center justify-center gap-1.5 text-[10.5px] sm:text-[12px] transition cursor-pointer ${
                isActive
                  ? "bg-white text-[#6D48DF] font-bold shadow-xs"
                  : isCompleted
                    ? "text-[#15803D] font-bold hover:bg-white/50"
                    : "text-[#766F8E] hover:text-[#231B3B] font-medium"
              }`}
            >
              <span
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full text-[9.5px] sm:text-[10.5px] font-bold flex items-center justify-center flex-shrink-0 ${
                  isActive
                    ? "bg-[#6D48DF] text-white"
                    : isCompleted
                      ? "bg-[#16A34A] text-white"
                      : "bg-[#D5C5F7] text-[#4A4168]"
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
      </RevealOnShow>

      {/* Responsive Split Layout: Stacked on Mobile, 2-Column on Desktop (lg+) */}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
        {/* Left Column: Active Step Content */}
        <RevealOnShow
          id="tour-setup-active-panel"
          key={`step-${currentStep}`}
          variant="fade-up"
          delayMs={185}
          className="wishpix-step-transition lg:col-span-7 space-y-4"
        >
          {/* STEP 1: ACTIVITY SETUP */}
          {currentStep === 1 && (
            <section
              aria-labelledby="activity-setup-heading"
              className="space-y-3.5"
            >
              <div>
                <h2
                  id="activity-setup-heading"
                  className="text-[13px] sm:text-[15px] font-bold text-[#231B3B]"
                >
                  {t("Activity Setup", "Pag-setup ng Aktibidad")}
                </h2>
                <p className="text-[11px] sm:text-[12.5px] text-[#766F8E] mt-0.5">
                  {t(
                    "Choose how children will use the kiosk.",
                    "Piliin kung paano gagamitin ng mga bata ang kiosk."
                  )}
                </p>
              </div>

              {/* Primary Activity Cards */}
              <div className="wishpix-public-card-hover rounded-[18px] bg-white border border-[#F2EEFB] p-3 sm:p-4 space-y-2.5 sm:space-y-3 shadow-[0_4px_20px_rgba(109,72,223,0.04)]">
                {SESSION_ACTIVITIES.map((activity) => {
                  const isSelected = activity.id === selectedActivityId;

                  const iconBoxClasses =
                    activity.accent === "blue"
                      ? "bg-[#EDE7FC] text-[#6D48DF]"
                      : activity.accent === "purple"
                        ? "bg-[#F3E8FF] text-[#9333EA]"
                        : "bg-[#DCFCE7] text-[#15803D]";

                  return (
                    <button
                      key={activity.id}
                      type="button"
                      onClick={() => handleSelectActivity(activity.id)}
                      className={`group w-full rounded-[14px] p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[#FAF8FF] border-[1.75px] border-[#6D48DF] shadow-[0_2px_10px_rgba(109,72,223,0.08)]"
                          : "bg-white border border-[#F2EEFB] hover:bg-[#FAF8FF] hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${iconBoxClasses}`}
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
                          <p className="text-[12.5px] sm:text-[13.5px] font-bold text-[#231B3B]">
                            {activity.title}
                          </p>
                          <p className="text-[10.5px] sm:text-[11.5px] text-[#766F8E] mt-0.5">
                            {activity.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Radio / Check Circle */}
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full border-[1.5px] border-[#6D48DF] text-[#6D48DF] bg-white flex items-center justify-center">
                            <Check
                              className="w-3 h-3 stroke-[2.75]"
                              aria-hidden="true"
                            />
                          </span>
                        ) : (
                          <span
                            className="w-5 h-5 rounded-full border border-[#D5C5F7] block"
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
                  <div className="wishpix-public-card-hover rounded-[18px] bg-white border border-[#F2EEFB] p-3 sm:p-4 space-y-2.5 shadow-[0_4px_20px_rgba(109,72,223,0.04)]">
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
                          className={`w-full rounded-[12px] p-3 sm:p-3.5 text-left flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                            isSubSelected
                              ? "bg-[#FAF8FF] border-[1.5px] border-[#6D48DF]"
                              : "bg-white border border-[#F2EEFB] hover:bg-[#FAF8FF] hover:-translate-y-0.5"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isSubSelected
                                ? "border-[4.5px] border-[#6D48DF] bg-white"
                                : "border border-[#D5C5F7]"
                            }`}
                            aria-hidden="true"
                          />
                          <div className="min-w-0">
                            <p className="text-[12px] sm:text-[13px] font-bold text-[#231B3B]">
                              {sub.title}
                            </p>
                            <p className="text-[10px] sm:text-[11px] text-[#766F8E] mt-0.5">
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
              className="wishpix-public-card-hover rounded-[18px] bg-white border border-[#F2EEFB] p-4 sm:p-5 shadow-[0_4px_20px_rgba(109,72,223,0.04)]"
            >
              <div>
                <h2
                  id="theme-setup-heading"
                  className="text-[14px] sm:text-[16px] font-extrabold text-[#6D48DF]"
                >
                  {t("Theme Setup", "Pag-setup ng Tema")}
                </h2>
                <p className="text-[11px] sm:text-[12px] text-[#766F8E] mt-0.5 leading-relaxed">
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
                      className={`group rounded-[14px] p-3 sm:p-3.5 text-left flex flex-col justify-between gap-2.5 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[#FAF8FF] border-[1.75px] border-[#6D48DF] shadow-[0_2px_10px_rgba(109,72,223,0.08)]"
                          : "bg-white border border-[#F2EEFB] hover:bg-[#FAF8FF] hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ThemeIconBadge
                          icon={theme.icon}
                          accent={theme.accent}
                        />
                        <span className="text-[12px] sm:text-[13px] font-bold text-[#231B3B] leading-tight">
                          {theme.title}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {theme.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-[#F5F1FE] px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-medium text-[#4A4168]"
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
                  className={`rounded-[14px] p-3 sm:p-3.5 flex flex-col justify-between gap-2.5 transition-all duration-200 cursor-pointer ${
                    selectedThemeId === "custom"
                      ? "bg-[#FAF8FF] border-[1.75px] border-dashed border-[#6D48DF]"
                      : "bg-[#FAF8FF] border-[1.5px] border-dashed border-[#D5C5F7] hover:border-[#A78BFA] hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-[7px] bg-[#DCFCE7] text-[#15803D] flex items-center justify-center flex-shrink-0">
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="text-[12px] sm:text-[13px] font-bold text-[#231B3B] leading-tight">
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
                    className="w-full rounded-[8px] bg-white border border-[#E2DCF3] px-2.5 py-1.5 text-[10.5px] sm:text-[11px] font-medium text-[#231B3B] placeholder:text-[#8881A3] focus:outline-none focus:border-[#6D48DF]"
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
                  className="text-[13px] sm:text-[15px] font-bold text-[#231B3B]"
                >
                  {t("Safety Setup", "Pag-setup ng Kaligtasan")}
                </h2>
                <p className="text-[11px] sm:text-[12.5px] text-[#766F8E] mt-0.5">
                  {t(
                    "Child Safe Mode decides what the kiosk will accept.",
                    "Ang Child Safe Mode ang magpapasya kung ano ang tatanggapin ng kiosk."
                  )}
                </p>
              </div>

              <div className="wishpix-public-card-hover rounded-[18px] bg-white border border-[#F2EEFB] p-4 sm:p-5 space-y-3.5 shadow-[0_4px_20px_rgba(109,72,223,0.04)]">
                {/* 3 Safety Mode Cards */}
                <div className="space-y-2.5 sm:space-y-3">
                  {SAFETY_MODES.map((mode) => {
                    const isSelected = safetyMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSafetyMode(mode.id)}
                        className={`w-full rounded-[14px] p-3.5 sm:p-4 text-left transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-[#FAF8FF] border-[1.75px] border-[#6D48DF] shadow-[0_2px_10px_rgba(109,72,223,0.08)]"
                            : "bg-white border border-[#F2EEFB] hover:bg-[#FAF8FF] hover:-translate-y-0.5"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-8 h-8 rounded-[9px] flex items-center justify-center ${
                              isSelected
                                ? "bg-[#6D48DF] text-white"
                                : "bg-[#F5F1FE] text-[#766F8E]"
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
                            <span className="w-5 h-5 rounded-full bg-[#6D48DF] text-white flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[2.75]" />
                            </span>
                          )}
                        </div>

                        <p className="mt-2.5 text-[12.5px] sm:text-[13.5px] font-extrabold text-[#231B3B] tracking-wide">
                          {mode.title}
                        </p>
                        <p
                          className={`text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.12em] mt-0.5 ${
                            mode.id === "STRICT"
                              ? "text-[#8881A3]"
                              : "text-[#6D48DF]"
                          }`}
                        >
                          {mode.subtitle}
                        </p>
                        <p className="text-[10.5px] sm:text-[11.5px] text-[#766F8E] mt-1.5 leading-relaxed">
                          {mode.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Optional Fine-Tuning Rules */}
                <div className="pt-3 border-t border-[#F3EFFC] space-y-3.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[11.5px] sm:text-[12.5px] font-extrabold text-[#6D48DF]">
                      {t("Optional", "Opsyonal")}
                    </span>
                    <span className="text-[10.5px] sm:text-[11.5px] text-[#8881A3]">
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
                      className="block text-[11px] sm:text-[12px] font-bold text-[#231B3B]"
                    >
                      Custom Blocked Words
                    </label>
                    <p className="text-[9.5px] sm:text-[10.5px] text-[#8881A3]">
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
                        className="flex-1 rounded-[10px] border border-[#E2DCF3] bg-[#FBF9FF] px-3 py-2 text-[11px] sm:text-[12px] text-[#231B3B] placeholder:text-[#8881A3] focus:bg-white focus:outline-none focus:border-[#6D48DF]"
                      />
                      <button
                        type="button"
                        onClick={handleAddBlockedWord}
                        aria-label="Add blocked word"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-[#6D48DF] hover:bg-[#5B36CA] text-white flex items-center justify-center flex-shrink-0 transition cursor-pointer"
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
                      className="block text-[11px] sm:text-[12px] font-bold text-[#231B3B]"
                    >
                      Custom Allowed Words
                    </label>
                    <p className="text-[9.5px] sm:text-[10.5px] text-[#8881A3]">
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
                        className="flex-1 rounded-[10px] border border-[#E2DCF3] bg-[#FBF9FF] px-3 py-2 text-[11px] sm:text-[12px] text-[#231B3B] placeholder:text-[#8881A3] focus:bg-white focus:outline-none focus:border-[#6D48DF]"
                      />
                      <button
                        type="button"
                        onClick={handleAddAllowedWord}
                        aria-label="Add allowed word"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-[#6D48DF] hover:bg-[#5B36CA] text-white flex items-center justify-center flex-shrink-0 transition cursor-pointer"
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
                    <p className="text-[11px] sm:text-[12px] font-bold text-[#231B3B]">
                      Language Restrictions
                    </p>
                    <p className="text-[9.5px] sm:text-[10.5px] text-[#8881A3]">
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
                            className={`inline-flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-[10.5px] sm:text-[11.5px] font-bold transition cursor-pointer ${
                              isChecked
                                ? "bg-[#EFE9FC] border border-[#D5C5F7] text-[#6D48DF]"
                                : "bg-[#FAF8FF] border border-[#E2DCF3] text-[#766F8E] hover:text-[#231B3B]"
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
                      className="inline-flex items-center gap-1.5 rounded-[10px] bg-white hover:bg-[#FAF8FF] border border-[#E2DCF3] px-3.5 py-2 text-[11px] sm:text-[12px] font-semibold text-[#766F8E] transition cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{t("Back", "Bumalik")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#6D48DF] hover:bg-[#5B36CA] text-white px-4 py-2 text-[11px] sm:text-[12px] font-bold shadow-xs transition cursor-pointer"
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
                  className="text-[13px] sm:text-[15px] font-bold text-[#231B3B]"
                >
                  {t("Start Session", "Simulan ang Sesyon")}
                </h2>
                <p className="text-[11px] sm:text-[12.5px] text-[#766F8E] mt-0.5">
                  {t(
                    "Review what will be sent to the kiosk.",
                    "Suriin ang ipapadala sa kiosk."
                  )}
                </p>
              </div>

              <div className="wishpix-public-card-hover rounded-[18px] bg-white border border-[#F2EEFB] p-4 sm:p-5 space-y-3.5 shadow-[0_4px_20px_rgba(109,72,223,0.04)]">
                <div>
                  <h3 className="text-[14px] sm:text-[16px] font-extrabold text-[#6D48DF]">
                    {t("Start Session", "Simulan ang Sesyon")}
                  </h3>
                  <p className="text-[10.5px] sm:text-[11.5px] text-[#766F8E] mt-0.5">
                    {t(
                      "Review what will be sent to the kiosk.",
                      "Suriin ang ipapadala sa kiosk."
                    )}
                  </p>
                </div>

                {/* Review Item 1: Activity Type */}
                <div className="rounded-[12px] border border-[#F2EEFB] bg-[#FAF8FF] p-3 sm:p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-[9px] bg-[#EDE7FC] text-[#6D48DF] flex items-center justify-center flex-shrink-0">
                      <Palette className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.1em] text-[#8881A3]">
                        {t("ACTIVITY TYPE", "URI NG AKTIBIDAD")}
                      </p>
                      <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#231B3B] truncate mt-0.5">
                        {activityReviewLabel}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-[10.5px] sm:text-[11.5px] font-bold text-[#6D48DF] hover:underline flex-shrink-0 cursor-pointer"
                  >
                    {t("Edit", "Baguhin")}
                  </button>
                </div>

                {/* Review Item 2: Theme */}
                <div className="rounded-[12px] border border-[#F2EEFB] bg-[#FAF8FF] p-3 sm:p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-[9px] bg-[#EDE7FC] text-[#6D48DF] flex items-center justify-center flex-shrink-0">
                      <PawPrint className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.1em] text-[#8881A3]">
                        {t("THEME", "TEMA")}
                      </p>
                      <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#231B3B] truncate mt-0.5">
                        {themeSummaryLabel}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-[10.5px] sm:text-[11.5px] font-bold text-[#6D48DF] hover:underline flex-shrink-0 cursor-pointer"
                  >
                    {t("Edit", "Baguhin")}
                  </button>
                </div>

                {/* Review Item 3: Safety Rules */}
                <div className="rounded-[12px] border border-[#F2EEFB] bg-[#FAF8FF] p-3 sm:p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-[9px] bg-[#6D48DF] text-white flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.1em] text-[#8881A3]">
                        {t("SAFETY RULES", "PANUNTUNAN SA KALIGTASAN")}
                      </p>
                      <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#231B3B] truncate mt-0.5">
                        {safetyMode}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-[10.5px] sm:text-[11.5px] font-bold text-[#6D48DF] hover:underline flex-shrink-0 cursor-pointer"
                  >
                    {t("Edit", "Baguhin")}
                  </button>
                </div>

                {/* Start Session Action Row */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-white hover:bg-[#FAF8FF] border border-[#E2DCF3] px-4 py-2.5 text-[11.5px] sm:text-[12.5px] font-semibold text-[#766F8E] transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t("Back", "Bumalik")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/live-session?session=active")}
                    className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#6D48DF] hover:bg-[#5B36CA] text-white px-5 py-2.5 text-[11.5px] sm:text-[12.5px] font-bold shadow-[0_4px_14px_rgba(109,72,223,0.3)] transition cursor-pointer"
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
        </RevealOnShow>

        {/* Right Column: Persistent Session Summary Card */}
        <RevealOnShow
          as="section"
          id="tour-setup-summary"
          aria-labelledby="session-summary-heading"
          variant="slide-right"
          delayMs={245}
          className="wishpix-public-card-hover lg:col-span-5 rounded-[18px] bg-white border border-[#F2EEFB] p-4 sm:p-5 shadow-[0_4px_20px_rgba(109,72,223,0.04)]"
        >
          <h2
            id="session-summary-heading"
            className="text-[14px] sm:text-[15.5px] font-extrabold text-[#6D48DF]"
          >
            {t("Session Summary", "Buod ng Sesyon")}
          </h2>
          <p className="text-[10.5px] sm:text-[11.5px] text-[#8881A3] mt-0.5">
            {t("Sent to kiosk on start", "Ipapadala sa kiosk sa pagsisimula")}
          </p>

          <div className="mt-3.5 divide-y divide-[#F3EFFC]">
            {/* Row 1: Activity Type */}
            <div className="py-2.5 flex items-start gap-3">
              <Palette
                className="w-4 h-4 text-[#6D48DF] mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#8881A3]">
                  {t("ACTIVITY TYPE", "URI NG AKTIBIDAD")}
                </p>
                <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#231B3B] mt-0.5">
                  {activitySummaryLabel}
                </p>
              </div>
            </div>

            {/* Row 2: Theme */}
            <div className="py-2.5 flex items-start gap-3">
              <Flower2
                className="w-4 h-4 text-[#6D48DF] mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#8881A3]">
                  {t("THEME", "TEMA")}
                </p>
                <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#231B3B] mt-0.5">
                  {currentStep === 1 && selectedThemeId === "animals"
                    ? t("Not selected", "Hindi pa napili")
                    : themeSummaryLabel}
                </p>
              </div>
            </div>

            {/* Row 3: Safety Rules */}
            <div className="py-2.5 flex items-start gap-3">
              <ShieldCheck
                className="w-4 h-4 text-[#6D48DF] mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#8881A3]">
                  {t("SAFETY RULES", "PANUNTUNAN SA KALIGTASAN")}
                </p>
                <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#231B3B] mt-0.5">
                  {safetyMode}
                </p>
              </div>
            </div>

            {/* Row 4: Languages */}
            <div className="py-2.5 flex items-start gap-3">
              <Globe
                className="w-4 h-4 text-[#6D48DF] mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#8881A3]">
                  {t("LANGUAGES", "MGA WIKA")}
                </p>
                <p className="text-[11.5px] sm:text-[12.5px] font-bold text-[#231B3B] mt-0.5">
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
        </RevealOnShow>
      </div>

      {/* Bottom Back / Continue Footer for Steps 1 & 2 */}
      {(currentStep === 1 || currentStep === 2) && (
        <RevealOnShow
          id="tour-setup-continue"
          variant="fade-up"
          delayMs={310}
          className="pt-2 flex items-center justify-between gap-3"
        >
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 rounded-[12px] bg-white hover:bg-[#FAF8FF] border border-[#E2DCF3] px-4 py-2.5 text-[11.5px] sm:text-[12.5px] font-semibold text-[#766F8E] transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t("Back", "Bumalik")}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 rounded-[12px] bg-[#6D48DF] hover:bg-[#5B36CA] hover:-translate-y-0.5 active:scale-[0.98] text-white px-5 py-2.5 text-[11.5px] sm:text-[12.5px] font-bold shadow-[0_4px_14px_rgba(109,72,223,0.28)] transition-all duration-300 ease-out cursor-pointer"
          >
            <span>{t("Continue", "Magpatuloy")}</span>
            <ArrowRight
              className="w-3.5 h-3.5 stroke-[2.5]"
              aria-hidden="true"
            />
          </button>
        </RevealOnShow>
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
    blue: "bg-[#EDE7FC] text-[#6D48DF]",
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
