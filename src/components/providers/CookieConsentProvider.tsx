"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { STORAGE_KEYS } from "@/lib/constants";

export type CookieConsent = "all" | "necessary";

type CookieConsentContextValue = {
  ready: boolean;
  consent: CookieConsent | null;
  marketingAllowed: boolean;
  acceptAll: () => void;
  acceptNecessary: () => void;
  resetConsent: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

function readStoredConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.cookieConsent);
    if (raw === "all" || raw === "necessary") return raw;
  } catch {
    /* ignore */
  }
  return null;
}

function writeStoredConsent(value: CookieConsent | null) {
  try {
    if (value) localStorage.setItem(STORAGE_KEYS.cookieConsent, value);
    else localStorage.removeItem(STORAGE_KEYS.cookieConsent);
  } catch {
    /* ignore */
  }
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    setConsent(readStoredConsent());
    setReady(true);
  }, []);

  const acceptAll = useCallback(() => {
    writeStoredConsent("all");
    setConsent("all");
  }, []);

  const acceptNecessary = useCallback(() => {
    writeStoredConsent("necessary");
    setConsent("necessary");
  }, []);

  const resetConsent = useCallback(() => {
    writeStoredConsent(null);
    setConsent(null);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      consent,
      marketingAllowed: consent === "all",
      acceptAll,
      acceptNecessary,
      resetConsent,
    }),
    [ready, consent, acceptAll, acceptNecessary, resetConsent]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}
