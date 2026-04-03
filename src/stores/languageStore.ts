/**
 * Language Store
 * 
 * Manages the current UI language (ES/EN).
 * Persists selection to localStorage so it survives page reloads.
 */
import { create } from 'zustand';

export type Language = 'es' | 'en';

export interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggle: () => void;
}

const stored = (typeof window !== 'undefined' && localStorage.getItem('app-lang')) as Language | null;

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: stored || 'es',

  setLanguage: (language) => {
    localStorage.setItem('app-lang', language);
    set({ language });
  },

  toggle: () => {
    const next = get().language === 'es' ? 'en' : 'es';
    localStorage.setItem('app-lang', next);
    set({ language: next });
  },
}));
