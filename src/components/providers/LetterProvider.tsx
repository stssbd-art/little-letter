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

const defaultForm: LetterFormData = {
  recipientName: "",
  recipientEmail: "",
  senderName: "",
  senderEmail: "",
  relationship: "friend",
  occasion: "friendship",
  style: "cute",
  customNote: "",
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

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.letterDraft);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        form?: LetterFormData;
        letter?: GeneratedLetter | null;
      };
      if (parsed.form)
        setFormState({
          ...defaultForm,
          ...parsed.form,
          senderEmail: parsed.form.senderEmail ?? "",
        });
      if (parsed.letter) setLetter(parsed.letter);
    } catch {
      // ignore corrupt draft
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEYS.letterDraft,
      JSON.stringify({ form, letter })
    );
  }, [form, letter]);

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
