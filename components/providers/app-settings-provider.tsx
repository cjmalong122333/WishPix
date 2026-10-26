"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

export type DisplayLanguage = "English" | "Filipino";
export type DisplayThemeId = "deep-blue" | "ocean" | "midnight" | "slate";

interface AppSettingsState {
  displayLanguage: DisplayLanguage;
  themeId: DisplayThemeId;
  volume: number;
  autoSleepEnabled: boolean;
  autoSleepDuration: string;
  autoLogoutEnabled: boolean;
  autoLogoutDuration: string;
}

interface AppSettingsContextValue extends AppSettingsState {
  setDisplayLanguage: (lang: DisplayLanguage) => void;
  setThemeId: (theme: DisplayThemeId) => void;
  setVolume: (vol: number) => void;
  setAutoSleepEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setAutoSleepDuration: (duration: string) => void;
  setAutoLogoutEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setAutoLogoutDuration: (duration: string) => void;
  t: (englishText: string, filipinoText: string) => string;
}

const STORAGE_KEY = "wishpix_admin_settings_v1";

const DEFAULT_SETTINGS: AppSettingsState = {
  displayLanguage: "English",
  themeId: "deep-blue",
  volume: 70,
  autoSleepEnabled: true,
  autoSleepDuration: "15 minutes",
  autoLogoutEnabled: true,
  autoLogoutDuration: "30 minutes",
};

let currentSettings: AppSettingsState = DEFAULT_SETTINGS;
let isInitialized = false;
const listeners = new Set<() => void>();

function readStoredSettings(): AppSettingsState {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettingsState>;
    return {
      displayLanguage:
        parsed.displayLanguage === "English" ||
        parsed.displayLanguage === "Filipino"
          ? parsed.displayLanguage
          : DEFAULT_SETTINGS.displayLanguage,
      themeId:
        parsed.themeId === "deep-blue" ||
        parsed.themeId === "ocean" ||
        parsed.themeId === "midnight" ||
        parsed.themeId === "slate"
          ? parsed.themeId
          : DEFAULT_SETTINGS.themeId,
      volume:
        typeof parsed.volume === "number"
          ? parsed.volume
          : DEFAULT_SETTINGS.volume,
      autoSleepEnabled:
        typeof parsed.autoSleepEnabled === "boolean"
          ? parsed.autoSleepEnabled
          : DEFAULT_SETTINGS.autoSleepEnabled,
      autoSleepDuration:
        typeof parsed.autoSleepDuration === "string"
          ? parsed.autoSleepDuration
          : DEFAULT_SETTINGS.autoSleepDuration,
      autoLogoutEnabled:
        typeof parsed.autoLogoutEnabled === "boolean"
          ? parsed.autoLogoutEnabled
          : DEFAULT_SETTINGS.autoLogoutEnabled,
      autoLogoutDuration:
        typeof parsed.autoLogoutDuration === "string"
          ? parsed.autoLogoutDuration
          : DEFAULT_SETTINGS.autoLogoutDuration,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function getSnapshot(): AppSettingsState {
  if (!isInitialized && typeof window !== "undefined") {
    currentSettings = readStoredSettings();
    isInitialized = true;
  }
  return currentSettings;
}

function getServerSnapshot(): AppSettingsState {
  return DEFAULT_SETTINGS;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function updateSettings(
  updater: (prev: AppSettingsState) => AppSettingsState
) {
  const next = updater(getSnapshot());
  currentSettings = next;
  isInitialized = true;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
  }
  listeners.forEach((l) => l());
}

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // Sync theme & lang attributes to document root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.themeId);
    document.documentElement.lang =
      settings.displayLanguage === "Filipino" ? "fil" : "en";
  }, [settings.themeId, settings.displayLanguage]);

  const setDisplayLanguage = useCallback((displayLanguage: DisplayLanguage) => {
    updateSettings((prev) => ({ ...prev, displayLanguage }));
  }, []);

  const setThemeId = useCallback((themeId: DisplayThemeId) => {
    updateSettings((prev) => ({ ...prev, themeId }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    updateSettings((prev) => ({ ...prev, volume }));
  }, []);

  const setAutoSleepEnabled: React.Dispatch<React.SetStateAction<boolean>> =
    useCallback((action) => {
      updateSettings((prev) => ({
        ...prev,
        autoSleepEnabled:
          typeof action === "function" ? action(prev.autoSleepEnabled) : action,
      }));
    }, []);

  const setAutoSleepDuration = useCallback((autoSleepDuration: string) => {
    updateSettings((prev) => ({ ...prev, autoSleepDuration }));
  }, []);

  const setAutoLogoutEnabled: React.Dispatch<React.SetStateAction<boolean>> =
    useCallback((action) => {
      updateSettings((prev) => ({
        ...prev,
        autoLogoutEnabled:
          typeof action === "function"
            ? action(prev.autoLogoutEnabled)
            : action,
      }));
    }, []);

  const setAutoLogoutDuration = useCallback((autoLogoutDuration: string) => {
    updateSettings((prev) => ({ ...prev, autoLogoutDuration }));
  }, []);

  const t = useCallback(
    (englishText: string, filipinoText: string) =>
      settings.displayLanguage === "Filipino" ? filipinoText : englishText,
    [settings.displayLanguage]
  );

  return (
    <AppSettingsContext.Provider
      value={{
        ...settings,
        setDisplayLanguage,
        setThemeId,
        setVolume,
        setAutoSleepEnabled,
        setAutoSleepDuration,
        setAutoLogoutEnabled,
        setAutoLogoutDuration,
        t,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error(
      "useAppSettings must be used within an AppSettingsProvider"
    );
  }
  return ctx;
}
