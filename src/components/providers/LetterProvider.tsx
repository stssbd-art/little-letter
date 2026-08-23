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
import type { GeneratedLetter, LetterFormData } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";
import { isCardDesignId } from "@/lib/card-designs";
import { isLetterStationeryId } from "@/lib/letter-stationery";

const defaultForm: LetterFormData = {
  recipientName: "",
  recipientEmail: "",
  senderName: "",
  senderEmail: "",
  relationship: "friend",
  occasion: "friendship",
  style: "cute",
  customNote: "",
  writeMode: "ai",
  ownSubject: "",
  ownMessage: "",
  cardDesign: undefined,
  stationery: "classic-honey",
};

interface LetterContextValue {
  form: LetterFormData;
  letter: GeneratedLetter | null;
  setForm: (patch: Partial<LetterFormData>) => void;
  resetForm: () => void;
  setLetter: (letter: GeneratedLetter | null) => void;
}

const LetterContext = createContext<LetterContextValue | null>(null);

export function LetterProvider({ children }: { children: ReactNode }) {
  const [form, setFormState] = useState<LetterFormData>(defaultForm);
  const [letter, setLetter] = useState<GeneratedLetter | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.letterDraft);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          form?: LetterFormData;
          letter?: GeneratedLetter | null;
        };
        if (parsed.form)
          setFormState({
            ...defaultForm,
            ...parsed.form,
            senderEmail: parsed.form.senderEmail ?? "",
            writeMode: parsed.form.writeMode === "own" ? "own" : "ai",
            ownSubject: parsed.form.ownSubject ?? "",
            ownMessage: parsed.form.ownMessage ?? "",
            cardDesign:
              parsed.form.cardDesign && isCardDesignId(parsed.form.cardDesign)
                ? parsed.form.cardDesign
                : undefined,
            stationery:
              parsed.form.stationery &&
              isLetterStationeryId(parsed.form.stationery)
                ? parsed.form.stationery
                : "classic-honey",
          });
        if (parsed.letter) setLetter(parsed.letter);
      }
    } catch {
      // ignore corrupt draft
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(
      STORAGE_KEYS.letterDraft,
      JSON.stringify({ form, letter })
    );
  }, [form, letter, hydrated]);

  const setForm = useCallback((patch: Partial<LetterFormData>) => {
    setFormState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState(defaultForm);
    setLetter(null);
    sessionStorage.removeItem(STORAGE_KEYS.letterDraft);
  }, []);

  const value = useMemo(
    () => ({ form, letter, setForm, resetForm, setLetter }),
    [form, letter, setForm, resetForm]
  );

  return (
    <LetterContext.Provider value={value}>{children}</LetterContext.Provider>
  );
}

export function useLetter() {
  const ctx = useContext(LetterContext);
  if (!ctx) throw new Error("useLetter must be used within LetterProvider");
  return ctx;
}
