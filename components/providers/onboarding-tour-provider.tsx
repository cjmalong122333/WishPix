"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { driver, type Driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { useAppSettings } from "@/components/providers/app-settings-provider";

const PAGE_TOURS_STORAGE_KEY = "wishpix_page_tours_completed_v1";

export const ALL_TOUR_ROUTES = [
  "/dashboard",
  "/session-setup",
  "/live-session",
  "/moderation",
  "/print-management",
  "/kiosk-management",
  "/activity-logs",
  "/analytics",
  "/reports",
  "/settings",
] as const;

interface InteractiveStepConfig extends DriveStep {
  /** Selector (within document or highlighted element) that triggers auto-advance when interacted with */
  advanceOnSelector?: string;
  /** DOM event type that triggers hands-on progression */
  advanceOnEvent?: keyof HTMLElementEventMap;
  /** Optional interactive prompt badge displayed inside the popover */
  interactionHint?: string;
  /** Fallback selector if primary element is hidden on current breakpoint (e.g., desktop sidebar vs mobile menu button) */
  fallbackElement?: string;
}

interface OnboardingTourContextValue {
  /** Whether the user has completed the tour for the currently active route */
  hasCompletedTour: boolean;
  /** Number of pages (out of 10) where the user has completed the guided tour */
  completedPagesCount: number;
  /** Total number of guided pages in the system */
  totalTourPages: number;
  /** Start the onboarding walkthrough for the current page (pass true to replay even if completed) */
  startTour: (forceReplay?: boolean) => void;
  /** Replay the guided tour for the currently active page immediately */
  resetAndReplayTour: () => void;
  /** Reset all 10 page tour states so every page shows its walkthrough again, and launch the Dashboard tour */
  resetAllPageTours: () => void;
}

type CompletedMap = Record<string, boolean>;

let cachedMap: CompletedMap = {};
let isStoreInitialized = false;
const tourStoreListeners = new Set<() => void>();

function readCompletedMapFromStorage(): CompletedMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PAGE_TOURS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as CompletedMap;
    }
    return {};
  } catch {
    return {};
  }
}

function getCompletedMapSnapshot(): CompletedMap {
  if (!isStoreInitialized && typeof window !== "undefined") {
    cachedMap = readCompletedMapFromStorage();
    isStoreInitialized = true;
  }
  return cachedMap;
}

const SERVER_EMPTY_MAP: CompletedMap = {};
function getServerCompletedMapSnapshot(): CompletedMap {
  return SERVER_EMPTY_MAP;
}

function subscribeCompletedMap(listener: () => void): () => void {
  tourStoreListeners.add(listener);
  return () => {
    tourStoreListeners.delete(listener);
  };
}

function markRouteCompleted(route: string, completed: boolean) {
  const prev = getCompletedMapSnapshot();
  const next: CompletedMap = { ...prev };
  if (completed) {
    next[route] = true;
  } else {
    delete next[route];
  }
  cachedMap = next;
  isStoreInitialized = true;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(PAGE_TOURS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota/privacy errors
    }
  }
  tourStoreListeners.forEach((listener) => listener());
}

function clearAllRoutesCompleted() {
  cachedMap = {};
  isStoreInitialized = true;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(PAGE_TOURS_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
  tourStoreListeners.forEach((listener) => listener());
}

function isElementVisible(selector: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);
  if (
    rect.width === 0 ||
    rect.height === 0 ||
    style.display === "none" ||
    style.visibility === "hidden"
  ) {
    return null;
  }
  return el;
}

const OnboardingTourContext = createContext<OnboardingTourContextValue | null>(
  null
);

export function OnboardingTourProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useAppSettings();

  const completedMap = useSyncExternalStore(
    subscribeCompletedMap,
    getCompletedMapSnapshot,
    getServerCompletedMapSnapshot
  );

  const normalizedPath = pathname || "/dashboard";
  const hasCompletedTour = Boolean(completedMap[normalizedPath]);
  const completedPagesCount = ALL_TOUR_ROUTES.filter((r) =>
    Boolean(completedMap[r])
  ).length;

  const driverRef = useRef<Driver | null>(null);
  const cleanupListenersRef = useRef<(() => void) | null>(null);
  const activeTourRouteRef = useRef<string>(normalizedPath);

  const clearStepListeners = useCallback(() => {
    if (cleanupListenersRef.current) {
      cleanupListenersRef.current();
      cleanupListenersRef.current = null;
    }
  }, []);

  const destroyActiveTour = useCallback(() => {
    clearStepListeners();
    if (driverRef.current) {
      const instance = driverRef.current;
      driverRef.current = null;
      if (instance.isActive()) {
        instance.destroy();
      }
    }
  }, [clearStepListeners]);

  const buildStepsForRoute = useCallback(
    (route: string): InteractiveStepConfig[] => {
      let rawSteps: InteractiveStepConfig[] = [];

      switch (route) {
        case "/dashboard":
          rawSteps = [
            {
              element: "#tour-kiosk-status",
              advanceOnSelector: "#tour-hardware-pills button",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Click any hardware pill (Camera, Mic, Printer, Speaker) to test!",
                "Subukan: Pindutin ang alinmang hardware pill (Camera, Mic, Printer, Speaker)!"
              ),
              popover: {
                title: t(
                  "Live Kiosk & Hardware Status",
                  "Live na Status ng Kiosk at Kagamitan"
                ),
                description: t(
                  "Monitor your connected classroom kiosk in real time. Click any hardware pill below to inspect its live status.",
                  "Bantayan ang konektadong kiosk sa silid-aralan. Pindutin ang alinmang hardware pill sa ibaba upang suriin ang status nito."
                ),
                side: "bottom",
                align: "start",
              },
            },
            {
              element: "#tour-todays-summary",
              advanceOnSelector: "#tour-summary-refresh",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Click 'Refresh' to sync today's classroom metrics!",
                "Subukan: Pindutin ang 'I-refresh' upang i-sync ang buod ngayong araw!"
              ),
              popover: {
                title: t(
                  "Today's Classroom Summary",
                  "Buod ng Silid-Aralan Ngayong Araw"
                ),
                description: t(
                  "Track total voice sessions, thermal stickers printed, active kids, and completion rates at a glance.",
                  "Subaybayan ang bilang ng mga sesyon, na-print na sticker, at aktibidad ng mga bata sa isang tingin."
                ),
                side: "top",
                align: "center",
              },
            },
            {
              element: "#tour-quick-actions",
              advanceOnSelector:
                "#tour-quick-actions button[data-tour-action='true']",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Click Pause, Stop, or Restart Kiosk to preview live feedback!",
                "Subukan: Pindutin ang Pause, Stop, o Restart Kiosk upang subukan!"
              ),
              popover: {
                title: t(
                  "Instant Session Controls",
                  "Mabilisang Kontrol ng Sesyon"
                ),
                description: t(
                  "Launch a new AI voice-activated sticker activity or pause, stop, and restart the kiosk hardware directly from here.",
                  "Magbukas ng bagong aktibidad o i-pause, ihinto, at i-restart ang kiosk nang direkta mula rito."
                ),
                side: "top",
                align: "start",
              },
            },
            {
              element: "#tour-sidebar-nav",
              fallbackElement: "#tour-nav-trigger",
              popover: {
                title: t(
                  "Educator Navigation & Modules",
                  "Nabigasyon at mga Module ng Guro"
                ),
                description: t(
                  "Switch between Session Setup, Live Session monitoring, Content Moderation, Print Queue, Analytics, and System Settings.",
                  "Lumipat sa Pag-setup ng Sesyon, Live na Sesyon, Moderasyon, Pamamahala ng Print, Analytics, at Mga Setting."
                ),
                side: "right",
                align: "start",
              },
            },
            {
              element: "#tour-replay-button",
              popover: {
                title: t(
                  "Page Guide Available Everywhere",
                  "Gabay sa Bawat Pahina"
                ),
                description: t(
                  "Every page in WishPix has its own interactive walkthrough! Click this Tour button anytime to replay the guide for the page you are viewing.",
                  "Ang bawat pahina sa WishPix ay may sariling gabay! Pindutin ang Gabay button na ito anumang oras upang ulitin ang paliwanag sa pahina."
                ),
                side: "bottom",
                align: "end",
              },
            },
          ];
          break;

        case "/session-setup":
          rawSteps = [
            {
              element: "#tour-setup-stepper",
              advanceOnSelector: "#tour-setup-stepper button",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Click any step tab (1–4) or press Next to explore!",
                "Subukan: Pindutin ang alinmang hakbang (1–4) o pindutin ang Susunod!"
              ),
              popover: {
                title: t(
                  "4-Step Session Setup Wizard",
                  "4-Hakbang sa Pag-setup ng Sesyon"
                ),
                description: t(
                  "Prepare a classroom activity in four structured steps: 1. Activity Mode, 2. Learning Theme, 3. Child Safety Rules, and 4. Review & Start.",
                  "Ihanda ang aktibidad sa apat na hakbang: 1. Aktibidad, 2. Tema, 3. Kaligtasan, at 4. Pagsisimula."
                ),
                side: "bottom",
                align: "center",
              },
            },
            {
              element: "#tour-setup-active-panel",
              advanceOnSelector: "#tour-setup-active-panel button",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Click an activity or option card to select it!",
                "Subukan: Pumili ng isa sa mga opsyon sa ibaba!"
              ),
              popover: {
                title: t(
                  "Configure Activity, Theme & Safety",
                  "Piliin ang Aktibidad, Tema at Kaligtasan"
                ),
                description: t(
                  "Choose how children will interact with the kiosk (Color & Create, Trace & Learn, or Free Play) and tailor sub-options or safety filters.",
                  "Piliin kung paano gagamitin ng mga bata ang kiosk at i-customize ang mga opsyon."
                ),
                side: "right",
                align: "start",
              },
            },
            {
              element: "#tour-setup-summary",
              popover: {
                title: t(
                  "Live Kiosk Configuration Summary",
                  "Live na Buod ng Sesyon"
                ),
                description: t(
                  "As you make selections, this summary updates immediately to show exactly what will be pushed to your classroom kiosk.",
                  "Habang pumipili ka, agad na nag-a-update ang buod na ito upang ipakita ang ipapadala sa kiosk."
                ),
                side: "left",
                align: "start",
              },
            },
            {
              element: "#tour-setup-continue",
              fallbackElement: "#tour-setup-active-panel",
              popover: {
                title: t(
                  "Advance or Launch Session",
                  "Magpatuloy o Simulan ang Sesyon"
                ),
                description: t(
                  "Use Continue to move through the 4 steps, then click Start Session on Step 4 to activate the kiosk for your students.",
                  "Gamitin ang Magpatuloy upang lumipat sa susunod na hakbang at simulan ang sesyon."
                ),
                side: "top",
                align: "end",
              },
            },
          ];
          break;

        case "/live-session":
          rawSteps = [
            {
              element: "#tour-live-banner",
              popover: {
                title: t(
                  "Live Classroom Session Monitor",
                  "Monitor ng Live na Sesyon"
                ),
                description: t(
                  "Check whether a classroom session is currently active in your room, and start or pause kiosk listening with one tap.",
                  "Tingnan kung may aktibong sesyon sa silid-aralan at simulan o i-pause ang kiosk anumang oras."
                ),
                side: "bottom",
                align: "start",
              },
            },
            {
              element: "#tour-live-pipeline",
              advanceOnSelector: "#tour-live-pipeline button",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Click any stage number (1–5) to preview that pipeline state!",
                "Subukan: Pindutin ang numero (1–5) upang makita ang bawat yugto!"
              ),
              popover: {
                title: t(
                  "5-Stage Voice-to-Sticker Pipeline",
                  "5-Yugto ng Proseso sa Kiosk"
                ),
                description: t(
                  "See exactly where the kiosk is in the workflow: 1. Waiting, 2. Listening, 3. Creating AI Art, 4. Thermal Printing, and 5. Done.",
                  "Subaybayan ang kasalukuyang hakbang ng kiosk: Waiting, Listening, Creating, Printing, at Done."
                ),
                side: "bottom",
                align: "start",
              },
            },
            {
              element: "#tour-live-queue",
              popover: {
                title: t(
                  "Privacy-First Student Queue",
                  "Pila ng mga Bata (Ligtas ang Privacy)"
                ),
                description: t(
                  "Tracks waiting participants by queue position number only—no personal child names are ever recorded or stored.",
                  "Binibilang ang mga bata ayon sa posisyon sa pila lamang—walang pangalan ng bata na iniimbak."
                ),
                side: "top",
                align: "start",
              },
            },
            {
              element: "#tour-live-feed",
              popover: {
                title: t(
                  "Real-Time Generation & Safety Feed",
                  "Live na Talaan ng mga Nalikha"
                ),
                description: t(
                  "Watch voice prompts turn into printed stickers live. If a prompt is blocked by the safety filter, click Review to inspect or override it.",
                  "Panoorin ang mga voice prompt ng mga bata nang real-time at suriin kung may hinarang ng safety filter."
                ),
                side: "left",
                align: "start",
              },
            },
          ];
          break;

        case "/moderation":
          rawSteps = [
            {
              element: "#tour-moderation-stats",
              advanceOnSelector: "#tour-safety-level-btn",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Click 'Change' on the Safety Level card to cycle STRICT / STANDARD / CUSTOM!",
                "Subukan: Pindutin ang 'Palitan' sa Safety Level card!"
              ),
              popover: {
                title: t(
                  "Moderation Overview & Safety Level",
                  "Buod ng Moderasyon at Antas ng Kaligtasan"
                ),
                description: t(
                  "See how many blocked voice prompts await your decision today and switch the active Child Safety Mode.",
                  "Tingnan ang bilang ng mga hinarang na prompt na naghihintay ng iyong pasya at baguhin ang Safety Level."
                ),
                side: "bottom",
                align: "center",
              },
            },
            {
              element: "#tour-moderation-tabs",
              advanceOnSelector: "#tour-moderation-tabs button",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Click 'Pending' or 'Resolved' to filter the queue!",
                "Subukan: Pindutin ang 'Nakabinbin' o 'Nalutas' upang salain ang listahan!"
              ),
              popover: {
                title: t(
                  "Filter Moderation Queue",
                  "Salain ang Listahan ng Moderasyon"
                ),
                description: t(
                  "Quickly switch between All flagged prompts, Pending items needing teacher action, and Resolved decisions.",
                  "Lumipat sa Lahat, Nakabinbin na kailangan ng desisyon ng guro, o Nalutas na."
                ),
                side: "bottom",
                align: "start",
              },
            },
            {
              element: "#tour-moderation-queue",
              advanceOnSelector: "#tour-moderation-queue button",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Click Keep Blocked, Override, or the Eye icon on any card!",
                "Subukan: Pindutin ang Panatilihing Hinarang, Payagan, o ang Eye icon!"
              ),
              popover: {
                title: t(
                  "Compare Speech & Decide",
                  "Suriin ang Sinabi at Magpasya"
                ),
                description: t(
                  "Compare the child's Original Speech with the AI's Recognized Text. Choose Keep Blocked to reject, Override to approve & print, or click the Eye button for full log details.",
                  "Ihambing ang Original Speech sa Recognized Text. Piliin kung Panatilihing Hinarang o Payagan at i-print."
                ),
                side: "top",
                align: "center",
              },
            },
          ];
          break;

        case "/print-management":
          rawSteps = [
            {
              element: "#tour-print-counters",
              popover: {
                title: t(
                  "Classroom Print Volume",
                  "Bilang ng mga Na-print"
                ),
                description: t(
                  "Track how many thermal sticker sheets have been printed today, over the past 7 days, and across the current month.",
                  "Subaybayan ang bilang ng mga na-print ngayong araw, ngayong linggo, at ngayong buwan."
                ),
                side: "bottom",
                align: "center",
              },
            },
            {
              element: "#tour-printer-status",
              advanceOnSelector: "#tour-printer-status-pills button",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Click Ready, Printing, Error, or No Paper to preview printer alerts!",
                "Subukan: Pindutin ang Ready, Printing, Error, o No Paper!"
              ),
              popover: {
                title: t(
                  "USB Printer Status & Paper Roll Level",
                  "Status ng Printer at Dami ng Papel"
                ),
                description: t(
                  "Check live USB thermal printer connectivity and monitor the paper tray percentage so you know when to load a fresh thermal roll.",
                  "Bantayan ang koneksyon ng USB printer at ang natitirang thermal paper bago magsimula ng sesyon."
                ),
                side: "right",
                align: "start",
              },
            },
            {
              element: "#tour-print-queue",
              popover: {
                title: t(
                  "Live Print Spooler Queue",
                  "Pila ng Kasalukuyang Print"
                ),
                description: t(
                  "Displays any sticker activity sheet currently being transmitted to the thermal printer.",
                  "Ipinapakita ang activity sheet na kasalukuyang ipinapadala sa printer."
                ),
                side: "top",
                align: "start",
              },
            },
            {
              element: "#tour-reprint-list",
              advanceOnSelector: "#tour-reprint-list button",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Click any 'Reprint' button to send that sheet to the printer!",
                "Subukan: Pindutin ang 'I-reprint' upang mag-print muli ng kopya!"
              ),
              popover: {
                title: t(
                  "One-Click Activity Reprint",
                  "Mabilisang Pag-reprint ng Output"
                ),
                description: t(
                  "Need an extra sticker copy for a student or classroom board? Click Reprint on any earlier item to print it again immediately.",
                  "Kailangan ng karagdagang kopya? Pindutin ang I-reprint sa alinmang naunang aktibidad."
                ),
                side: "left",
                align: "start",
              },
            },
          ];
          break;

        case "/kiosk-management":
          rawSteps = [
            {
              element: "#tour-kiosk-registered",
              popover: {
                title: t(
                  "Registered Kiosk & Firmware Info",
                  "Rehistradong Kiosk at Impormasyon"
                ),
                description: t(
                  "Verify your connected classroom unit, firmware version, local network IP address, and current power state.",
                  "Tingnan ang konektadong silid-aralan, bersyon ng firmware, local IP address, at status ng kuryente."
                ),
                side: "bottom",
                align: "start",
              },
            },
            {
              element: "#tour-kiosk-diagnostics",
              advanceOnSelector: "#tour-run-diagnostics-btn",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Click 'Live Diagnostics' to run a full hardware sensor check!",
                "Subukan: Pindutin ang 'Live na Diyagnostiko' upang suriin ang lahat ng sensor!"
              ),
              popover: {
                title: t(
                  "Hardware Health & Live Diagnostics",
                  "Kalagayan ng Hardware at Diyagnostiko"
                ),
                description: t(
                  "Inspect real-time health for the USB Printer, Internal Temperature sensor, Paper Tray level, Microphone/Speaker output, and Wi-Fi latency.",
                  "Suriin ang kondisyon ng Printer, Temperatura, Papel, Audio, at Network sa isang tingin."
                ),
                side: "top",
                align: "center",
              },
            },
            {
              element: "#tour-kiosk-controls",
              advanceOnSelector: "#tour-kiosk-controls button",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Click Restart, Sleep, or Wake Up to test remote commands!",
                "Subukan: Pindutin ang Restart, Sleep, o Wake Up upang subukan ang remote control!"
              ),
              popover: {
                title: t(
                  "Remote Power & Sleep Controls",
                  "Remote Control sa Kuryente ng Kiosk"
                ),
                description: t(
                  "Remotely Restart, Shut Down, put the kiosk to Sleep during quiet time, or Wake it up before class starts.",
                  "Kontrolin ang kiosk mula sa iyong device: i-restart, patayin, patulugin (Sleep), o gisingin (Wake Up)."
                ),
                side: "top",
                align: "center",
              },
            },
          ];
          break;

        case "/activity-logs":
          rawSteps = [
            {
              element: "#tour-logs-filter-bar",
              advanceOnSelector: "#tour-logs-filter-bar select",
              advanceOnEvent: "change",
              interactionHint: t(
                "Hands-on: Change the Activity or Theme dropdown filter to narrow records!",
                "Subukan: Pumili sa Activity o Theme filter upang salain ang mga rekord!"
              ),
              popover: {
                title: t(
                  "Filter Historical Classroom Logs",
                  "Salain ang Talaan ng Aktibidad"
                ),
                description: t(
                  "Filter anonymized session records by Activity mode (Color & Create, Trace & Learn, Free Play) or by Learning Theme.",
                  "Salain ang mga nakaraang rekord ayon sa Uri ng Aktibidad o Tema ng pag-aaral."
                ),
                side: "bottom",
                align: "center",
              },
            },
            {
              element: "#tour-logs-export-btn",
              popover: {
                title: t(
                  "Export Anonymized CSV",
                  "I-export ang CSV"
                ),
                description: t(
                  "Download the filtered activity history as a CSV file for school documentation or research—completely free of child names.",
                  "I-download ang mga rekord bilang CSV file para sa dokumentasyon nang walang pangalan ng mga bata."
                ),
                side: "bottom",
                align: "end",
              },
            },
            {
              element: "#tour-logs-grid",
              popover: {
                title: t(
                  "Session & Safety Outcome Cards",
                  "Mga Rekord ng Sesyon at Kaligtasan"
                ),
                description: t(
                  "Each record shows the date, time, theme, activity type, whether it passed the safety filter, and its print status.",
                  "Makikita sa bawat card ang petsa, oras, tema, uri ng aktibidad, safety status, at print status."
                ),
                side: "top",
                align: "center",
              },
            },
            {
              element: "#tour-logs-pagination",
              popover: {
                title: t(
                  "Browse Historical Pages",
                  "Lumipat ng Pahina sa Talaan"
                ),
                description: t(
                  "Use Previous and Next to page through earlier classroom sessions.",
                  "Gamitin ang Nakaraan at Susunod upang tingnan ang iba pang mga rekord."
                ),
                side: "top",
                align: "center",
              },
            },
          ];
          break;

        case "/analytics":
          rawSteps = [
            {
              element: "#tour-analytics-kpis",
              popover: {
                title: t(
                  "Key Classroom Performance Metrics",
                  "Mahahalagang Sukatan sa Silid-Aralan"
                ),
                description: t(
                  "Review your most popular theme, top activity mode, total prints, total AI generations, blocked requests, and overall safety pass rate.",
                  "Tingnan ang pinakaginagamit na tema, aktibidad, kabuuang print, at antas ng tagumpay sa kaligtasan."
                ),
                side: "bottom",
                align: "center",
              },
            },
            {
              element: "#tour-analytics-chart",
              advanceOnSelector: "#tour-analytics-range-tabs button",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Click 'Weekly' or 'Monthly' to switch the chart timeline!",
                "Subukan: Pindutin ang 'Weekly' o 'Monthly' upang baguhin ang chart!"
              ),
              popover: {
                title: t(
                  "Usage Over Time (Generations vs. Prints)",
                  "Paggamit sa Paglipas ng Panahon"
                ),
                description: t(
                  "Compare AI pictures generated against physical stickers printed across Daily, Weekly, and Monthly views.",
                  "Ihambing ang bilang ng mga larawang nalikha at na-print sa araw-araw, lingguhan, o buwanang tala."
                ),
                side: "top",
                align: "center",
              },
            },
            {
              element: "#tour-analytics-themes",
              popover: {
                title: t(
                  "Theme Distribution Breakdown",
                  "Distribusyon ng mga Tema"
                ),
                description: t(
                  "Visualize which classroom themes (Animals, Transportation, Fruits, Nature) spark the most student engagement.",
                  "Tingnan kung aling mga tema ang pinakapaborito ng mga bata sa klase."
                ),
                side: "top",
                align: "start",
              },
            },
            {
              element: "#tour-analytics-mix",
              popover: {
                title: t(
                  "Activity Mode Mix",
                  "Kombinasyon ng mga Aktibidad"
                ),
                description: t(
                  "See the proportion of classroom sessions spent in Color & Create, Trace & Learn, and Free Play.",
                  "Alamin ang bahagdan ng paggamit sa Color & Create, Trace & Learn, at Free Play."
                ),
                side: "top",
                align: "end",
              },
            },
          ];
          break;

        case "/reports":
          rawSteps = [
            {
              element: "#tour-reports-selector",
              advanceOnSelector: "#tour-reports-generate-btn",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Select a report type and click 'Generate Report'!",
                "Subukan: Pumili ng uri ng ulat at pindutin ang 'Gumawa ng Ulat'!"
              ),
              popover: {
                title: t(
                  "Select & Generate Classroom Reports",
                  "Pumili at Gumawa ng Ulat"
                ),
                description: t(
                  "Choose between a daily Session Summary Report or a comprehensive Research Evaluation Report, then click Generate Report.",
                  "Pumili kung Session Summary Report o Research Evaluation Report, pagkatapos ay pindutin ang Gumawa ng Ulat."
                ),
                side: "right",
                align: "start",
              },
            },
            {
              element: "#tour-reports-recent",
              popover: {
                title: t(
                  "Download & Manage Generated Reports",
                  "I-download ang mga Ginawang Ulat"
                ),
                description: t(
                  "Every report you generate appears here immediately with an Export button to download a ready-to-share text summary.",
                  "Makikita rito ang lahat ng ginawang ulat at maaari itong i-download anumang oras."
                ),
                side: "left",
                align: "start",
              },
            },
          ];
          break;

        case "/settings":
          rawSteps = [
            {
              element: "#tour-settings-language",
              advanceOnSelector: "#tour-settings-language button",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Click 'English' or 'Filipino' to switch language live!",
                "Subukan: Pindutin ang 'English' o 'Filipino' upang palitan ang wika!"
              ),
              popover: {
                title: t(
                  "Bilingual Display Language",
                  "Wika ng Interface (English / Filipino)"
                ),
                description: t(
                  "Switch the entire teacher application—including navigation, controls, and guided tours—between English and Filipino immediately.",
                  "Agad na palitan ang wika ng buong aplikasyon sa pagitan ng English at Filipino."
                ),
                side: "bottom",
                align: "start",
              },
            },
            {
              element: "#tour-settings-audio",
              popover: {
                title: t(
                  "Kiosk Speaker Volume",
                  "Lakas ng Tunog sa Speaker ng Kiosk"
                ),
                description: t(
                  "Slide to adjust the voice prompt and sound effect volume on the classroom kiosk speaker.",
                  "I-adjust ang lakas ng tunog ng speaker sa kiosk."
                ),
                side: "bottom",
                align: "end",
              },
            },
            {
              element: "#tour-settings-display",
              advanceOnSelector: "#tour-settings-display button",
              advanceOnEvent: "click",
              interactionHint: t(
                "Hands-on: Click any color swatch (Deep Blue, Ocean, Midnight, Slate)!",
                "Subukan: Pumili ng kulay ng tema (Deep Blue, Ocean, Midnight, Slate)!"
              ),
              popover: {
                title: t(
                  "Application Color Themes",
                  "Mga Kulay ng Tema sa Display"
                ),
                description: t(
                  "Personalize your workspace with Deep Blue, Ocean, Midnight, or Slate color themes.",
                  "Pumili ng paborito mong tema ng kulay para sa Teacher App."
                ),
                side: "top",
                align: "start",
              },
            },
            {
              element: "#tour-settings-system",
              popover: {
                title: t(
                  "Auto Sleep & Auto Logout",
                  "Auto Sleep at Auto Logout"
                ),
                description: t(
                  "Configure automatic kiosk sleep timers during idle classroom periods and automatic teacher sign-out for security.",
                  "I-set ang oras para sa awtomatikong pagtulog ng kiosk at awtomatikong pag-logout."
                ),
                side: "top",
                align: "end",
              },
            },
            {
              element: "#tour-settings-onboarding",
              popover: {
                title: t(
                  "Manage Page Walkthroughs",
                  "Pamahalaan ang mga Gabay sa Pahina"
                ),
                description: t(
                  "Replay the walkthrough for this page or reset all 10 page guides whenever a new teacher joins your classroom.",
                  "Ulitin ang gabay sa pahinang ito o i-reset ang lahat ng 10 gabay para sa bagong guro."
                ),
                side: "top",
                align: "center",
              },
            },
          ];
          break;

        default:
          rawSteps = [
            {
              element: "#tour-kiosk-status",
              fallbackElement: "#tour-replay-button",
              popover: {
                title: t("Section Overview", "Pangkalahatang Ideya"),
                description: t(
                  "Use the sidebar menu or top bar to navigate across classroom tools, or click Tour anytime for guidance.",
                  "Gamitin ang menu sa gilid o sa itaas upang lumipat sa iba't ibang bahagi ng WishPix."
                ),
                side: "bottom",
                align: "start",
              },
            },
          ];
          break;
      }

      // Resolve responsive elements and filter out any missing DOM targets
      const resolvedSteps: InteractiveStepConfig[] = [];
      for (const step of rawSteps) {
        if (typeof step.element === "string") {
          const primaryEl = isElementVisible(step.element);
          if (primaryEl) {
            resolvedSteps.push(step);
          } else if (
            step.fallbackElement &&
            isElementVisible(step.fallbackElement)
          ) {
            resolvedSteps.push({
              ...step,
              element: step.fallbackElement,
              popover: {
                ...step.popover,
                side: "bottom",
                align: "start",
              },
            });
          }
        } else {
          resolvedSteps.push(step);
        }
      }

      return resolvedSteps;
    },
    [t]
  );

  const launchDriverForCurrentRoute = useCallback(
    (route: string) => {
      if (typeof window === "undefined") return;

      destroyActiveTour();

      const validSteps = buildStepsForRoute(route);
      if (validSteps.length === 0) return;

      activeTourRouteRef.current = route;

      const instance = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        overlayColor: "rgba(9, 25, 44, 0.62)",
        stagePadding: 8,
        stageRadius: 16,
        popoverClass: "wishpix-tour-popover",
        progressText: t(
          "Step {{current}} of {{total}}",
          "Hakbang {{current}} sa {{total}}"
        ),
        nextBtnText: t("Next →", "Susunod →"),
        prevBtnText: t("← Back", "← Bumalik"),
        doneBtnText: t("Got it!", "Nakuha ko!"),
        steps: validSteps,

        onPopoverRender: (popover, { state }) => {
          // Mandatory accessibility attributes for non-modal / overlay tour dialogs
          popover.wrapper.setAttribute("role", "dialog");
          popover.wrapper.setAttribute("aria-modal", "false");
          const titleId = "wishpix-tour-active-title";
          popover.title.id = titleId;
          popover.wrapper.setAttribute("aria-labelledby", titleId);

          const activeIndex = state.activeIndex ?? 0;
          const currentStep = validSteps[activeIndex];

          // Inject hands-on interactive hint badge when step has an interactive trigger
          const existingHint = popover.wrapper.querySelector(
            ".wishpix-tour-hint-badge"
          );
          if (existingHint) {
            existingHint.remove();
          }
          if (currentStep?.interactionHint) {
            const hintEl = document.createElement("div");
            hintEl.className = "wishpix-tour-hint-badge";
            hintEl.textContent = currentStep.interactionHint;
            popover.description.insertAdjacentElement("afterend", hintEl);
          }

          // Add explicit "Skip tour" button before navigation buttons (except on final step)
          const isLastStep = activeIndex >= validSteps.length - 1;
          const existingSkip =
            popover.footer.querySelector(".wishpix-tour-skip");
          if (existingSkip) {
            existingSkip.remove();
          }

          if (!isLastStep) {
            const skipBtn = document.createElement("button");
            skipBtn.type = "button";
            skipBtn.className = "wishpix-tour-skip";
            skipBtn.textContent = t("Skip guide", "Laktawan");
            skipBtn.addEventListener("click", () => {
              markRouteCompleted(activeTourRouteRef.current, true);
              destroyActiveTour();
            });
            popover.footer.insertBefore(skipBtn, popover.footerButtons);
          }

          // Programmatically route focus into the popover so keyboard & screen reader users perceive context
          requestAnimationFrame(() => {
            popover.nextButton?.focus();
          });
        },

        onHighlightStarted: (element, step) => {
          clearStepListeners();
          const interactiveStep = step as InteractiveStepConfig;

          // Gracefully skip if the target element was unmounted or hidden mid-tour
          if (
            typeof interactiveStep.element === "string" &&
            !isElementVisible(interactiveStep.element)
          ) {
            requestAnimationFrame(() => {
              if (driverRef.current?.hasNextStep()) {
                driverRef.current.moveNext();
              } else {
                markRouteCompleted(activeTourRouteRef.current, true);
                destroyActiveTour();
              }
            });
            return;
          }

          // Attach hands-on interaction listeners so interacting with the highlighted feature advances the tour
          const eventName = interactiveStep.advanceOnEvent;
          if (eventName) {
            const targets: HTMLElement[] = interactiveStep.advanceOnSelector
              ? Array.from(
                  document.querySelectorAll<HTMLElement>(
                    interactiveStep.advanceOnSelector
                  )
                )
              : element instanceof HTMLElement
                ? [element]
                : [];

            if (targets.length > 0) {
              const handleInteraction = () => {
                clearStepListeners();
                window.setTimeout(() => {
                  if (!driverRef.current?.isActive()) return;
                  if (driverRef.current.hasNextStep()) {
                    driverRef.current.moveNext();
                  } else {
                    markRouteCompleted(activeTourRouteRef.current, true);
                    destroyActiveTour();
                  }
                }, 420);
              };

              targets.forEach((target) =>
                target.addEventListener(eventName, handleInteraction, {
                  once: true,
                })
              );

              cleanupListenersRef.current = () => {
                targets.forEach((target) =>
                  target.removeEventListener(eventName, handleInteraction)
                );
              };
            }
          }
        },

        onNextClick: () => {
          clearStepListeners();
          const currentIndex = driverRef.current?.getActiveIndex() ?? 0;
          const nextIndex = currentIndex + 1;

          // Validate upcoming DOM targets and prune any that became unavailable
          while (nextIndex < validSteps.length) {
            const stepCandidate = validSteps[nextIndex];
            if (typeof stepCandidate.element === "string") {
              if (isElementVisible(stepCandidate.element)) {
                break;
              }
              if (
                stepCandidate.fallbackElement &&
                isElementVisible(stepCandidate.fallbackElement)
              ) {
                stepCandidate.element = stepCandidate.fallbackElement;
                break;
              }
              validSteps.splice(nextIndex, 1);
            } else {
              break;
            }
          }

          if (driverRef.current?.hasNextStep()) {
            driverRef.current.moveNext();
          } else {
            markRouteCompleted(activeTourRouteRef.current, true);
            destroyActiveTour();
          }
        },

        onPrevClick: () => {
          clearStepListeners();
          driverRef.current?.movePrevious();
        },

        onDestroyStarted: () => {
          clearStepListeners();
          markRouteCompleted(activeTourRouteRef.current, true);
          destroyActiveTour();
        },
      });

      driverRef.current = instance;
      instance.drive();
    },
    [buildStepsForRoute, clearStepListeners, destroyActiveTour, t]
  );

  const startTour = useCallback(
    (forceReplay = false) => {
      if (typeof window === "undefined") return;
      const map = getCompletedMapSnapshot();
      if (!forceReplay && map[normalizedPath]) return;
      launchDriverForCurrentRoute(normalizedPath);
    },
    [launchDriverForCurrentRoute, normalizedPath]
  );

  const resetAndReplayTour = useCallback(() => {
    markRouteCompleted(normalizedPath, false);
    launchDriverForCurrentRoute(normalizedPath);
  }, [launchDriverForCurrentRoute, normalizedPath]);

  const resetAllPageTours = useCallback(() => {
    clearAllRoutesCompleted();
    if (normalizedPath !== "/dashboard") {
      router.push("/dashboard");
    } else {
      launchDriverForCurrentRoute("/dashboard");
    }
  }, [launchDriverForCurrentRoute, normalizedPath, router]);

  // Auto-trigger walkthrough when the user visits ANY dashboard page for the first time
  useEffect(() => {
    // Clean up any previous page's tour immediately on route change
    destroyActiveTour();

    const map = getCompletedMapSnapshot();
    if (map[normalizedPath]) return;

    const timer = window.setTimeout(() => {
      // Double-check completion in case user triggered manually
      if (!getCompletedMapSnapshot()[normalizedPath]) {
        launchDriverForCurrentRoute(normalizedPath);
      }
    }, 480);

    return () => window.clearTimeout(timer);
  }, [normalizedPath, launchDriverForCurrentRoute, destroyActiveTour]);

  // Handle screen resizing gracefully while the tour is active
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const instance = driverRef.current;
      if (!instance || !instance.isActive()) return;

      const activeStep = instance.getActiveStep() as
        | InteractiveStepConfig
        | undefined;
      if (activeStep && typeof activeStep.element === "string") {
        if (!isElementVisible(activeStep.element)) {
          if (
            activeStep.fallbackElement &&
            isElementVisible(activeStep.fallbackElement)
          ) {
            activeStep.element = activeStep.fallbackElement;
          } else if (instance.hasNextStep()) {
            instance.moveNext();
            return;
          }
        }
      }
      instance.refresh();
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <OnboardingTourContext.Provider
      value={{
        hasCompletedTour,
        completedPagesCount,
        totalTourPages: ALL_TOUR_ROUTES.length,
        startTour,
        resetAndReplayTour,
        resetAllPageTours,
      }}
    >
      {children}
    </OnboardingTourContext.Provider>
  );
}

export function useOnboardingTour() {
  const ctx = useContext(OnboardingTourContext);
  if (!ctx) {
    throw new Error(
      "useOnboardingTour must be used within an OnboardingTourProvider"
    );
  }
  return ctx;
}
