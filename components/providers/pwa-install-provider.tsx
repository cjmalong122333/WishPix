"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import {
  InstallGuideModal,
  type DetectedPlatform,
} from "@/components/auth/install-guide-modal";

export type AccessModeChoice = "unset" | "browser" | "app";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PwaInstallContextValue {
  /** True when running inside the installed standalone PWA window */
  isStandalone: boolean;
  /** True when the browser has fired beforeinstallprompt and can open the native dialog immediately */
  canPromptNative: boolean;
  /** True when the user just completed installation in this session or is in standalone mode */
  isInstalled: boolean;
  /** Detected user platform for tailored install guidance */
  platform: DetectedPlatform;
  /** User's current choice between App and Browser */
  accessChoice: AccessModeChoice;
  /** Whether the choice is persisted in localStorage */
  isChoiceRemembered: boolean;
  /** Set the user's choice ("browser" | "app" | "unset") and optionally remember in localStorage */
  setAccessChoice: (choice: AccessModeChoice, remember?: boolean) => void;
  /** Clear saved choice so the entry choice card appears again on Login */
  resetAccessChoice: () => void;
  /** Trigger native PWA install prompt if available, otherwise open the step-by-step Install Guide Modal */
  triggerInstall: (options?: {
    onFallbackContinue?: () => void;
  }) => Promise<"accepted" | "dismissed" | "guide">;
  /** Open the install guide modal directly */
  openInstallGuide: () => void;
}

const CHOICE_STORAGE_KEY = "wishpix_access_mode_choice_v1";

interface StoredChoiceState {
  choice: AccessModeChoice;
  remembered: boolean;
}

const DEFAULT_CHOICE_STATE: StoredChoiceState = {
  choice: "unset",
  remembered: false,
};

let currentChoiceState: StoredChoiceState = DEFAULT_CHOICE_STATE;
let isChoiceInitialized = false;
const choiceListeners = new Set<() => void>();

function readStoredChoice(): StoredChoiceState {
  if (typeof window === "undefined") {
    return DEFAULT_CHOICE_STATE;
  }
  try {
    const raw = window.localStorage.getItem(CHOICE_STORAGE_KEY);
    if (raw === "browser" || raw === "app") {
      return { choice: raw, remembered: true };
    }
    return DEFAULT_CHOICE_STATE;
  } catch {
    return DEFAULT_CHOICE_STATE;
  }
}

function getChoiceSnapshot(): StoredChoiceState {
  if (!isChoiceInitialized && typeof window !== "undefined") {
    currentChoiceState = readStoredChoice();
    isChoiceInitialized = true;
  }
  return currentChoiceState;
}

function getServerChoiceSnapshot(): StoredChoiceState {
  return DEFAULT_CHOICE_STATE;
}

function subscribeChoice(listener: () => void): () => void {
  choiceListeners.add(listener);
  return () => {
    choiceListeners.delete(listener);
  };
}

function updateChoiceState(choice: AccessModeChoice, remember = true) {
  const next: StoredChoiceState = {
    choice,
    remembered: choice !== "unset" && remember,
  };
  currentChoiceState = next;
  isChoiceInitialized = true;

  if (typeof window !== "undefined") {
    try {
      if (choice === "unset" || !remember) {
        window.localStorage.removeItem(CHOICE_STORAGE_KEY);
      } else {
        window.localStorage.setItem(CHOICE_STORAGE_KEY, choice);
      }
    } catch {
      // Ignore storage errors
    }
  }
  choiceListeners.forEach((l) => l());
}

function subscribeStandalone(listener: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const mediaQuery = window.matchMedia("(display-mode: standalone)");
  mediaQuery.addEventListener("change", listener);
  return () => {
    mediaQuery.removeEventListener("change", listener);
  };
}

function getStandaloneSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  const mediaMatch = window.matchMedia("(display-mode: standalone)").matches;
  const navStandalone = Boolean(
    (window.navigator as Navigator & { standalone?: boolean }).standalone
  );
  return mediaMatch || navStandalone;
}

function getServerStandaloneSnapshot(): boolean {
  return false;
}

function subscribeNoop(): () => void {
  return () => {};
}

function getPlatformSnapshot(): DetectedPlatform {
  if (typeof window === "undefined") return "desktop";
  const ua = window.navigator.userAgent || "";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

function getServerPlatformSnapshot(): DetectedPlatform {
  return "desktop";
}

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

export function PwaInstallProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const choiceState = useSyncExternalStore(
    subscribeChoice,
    getChoiceSnapshot,
    getServerChoiceSnapshot
  );

  const isStandalone = useSyncExternalStore(
    subscribeStandalone,
    getStandaloneSnapshot,
    getServerStandaloneSnapshot
  );

  const platform = useSyncExternalStore(
    subscribeNoop,
    getPlatformSnapshot,
    getServerPlatformSnapshot
  );

  const [justInstalled, setJustInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [fallbackContinueCallback, setFallbackContinueCallback] = useState<
    (() => void) | undefined
  >(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Register Service Worker for PWA installability & force update if stale
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .then((reg) => {
          reg.update().catch(() => {});
        })
        .catch(() => {
          // Non-blocking in development or insecure LAN origins
        });
    }

    // 2. Listen for beforeinstallprompt & appinstalled
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setJustInstalled(true);
      updateChoiceState("app", true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const setAccessChoice = useCallback(
    (choice: AccessModeChoice, remember = true) => {
      updateChoiceState(choice, remember);
    },
    []
  );

  const resetAccessChoice = useCallback(() => {
    updateChoiceState("unset", false);
  }, []);

  const openInstallGuide = useCallback(() => {
    setFallbackContinueCallback(undefined);
    setIsGuideOpen(true);
  }, []);

  const triggerInstall = useCallback(
    async (options?: {
      onFallbackContinue?: () => void;
    }): Promise<"accepted" | "dismissed" | "guide"> => {
      if (deferredPrompt) {
        try {
          await deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === "accepted") {
            setDeferredPrompt(null);
            setJustInstalled(true);
            updateChoiceState("app", true);
            return "accepted";
          }
          return "dismissed";
        } catch {
          // Fall through to guide modal
        }
      }

      setFallbackContinueCallback(() => options?.onFallbackContinue);
      setIsGuideOpen(true);
      return "guide";
    },
    [deferredPrompt]
  );

  return (
    <PwaInstallContext.Provider
      value={{
        isStandalone,
        canPromptNative: Boolean(deferredPrompt),
        isInstalled: isStandalone || justInstalled,
        platform,
        accessChoice: choiceState.choice,
        isChoiceRemembered: choiceState.remembered,
        setAccessChoice,
        resetAccessChoice,
        triggerInstall,
        openInstallGuide,
      }}
    >
      {children}
      <InstallGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onContinueInBrowser={fallbackContinueCallback}
        platform={platform}
        isStandalone={isStandalone}
        justInstalled={justInstalled}
      />
    </PwaInstallContext.Provider>
  );
}

export function usePwaInstall() {
  const ctx = useContext(PwaInstallContext);
  if (!ctx) {
    throw new Error("usePwaInstall must be used within a PwaInstallProvider");
  }
  return ctx;
}
