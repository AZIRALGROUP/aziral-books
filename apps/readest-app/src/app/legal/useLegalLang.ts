'use client';

import { useEffect, useState } from 'react';

export type LegalLang = 'en' | 'ru';

const STORAGE_KEY = 'aziralLegalLang';
const CHANGE_EVENT = 'aziral-legal-lang-change';

/**
 * Picks the language for the legal pages. Order of precedence:
 *   1. An explicit choice the user made via the in-page toggle
 *      (persisted under `aziralLegalLang`).
 *   2. The app's i18next language (`i18nextLng`, set by the rest of the UI).
 *   3. The browser's `navigator.language`.
 * Anything that starts with `ru` resolves to Russian; everything else
 * falls back to English. Only `en` and `ru` are supported here — the legal
 * text is hand-written per language, not machine-keyed, so we don't pretend
 * to cover the full UI locale set.
 *
 * Returns `null` on the very first server/SSR render so callers can avoid a
 * hydration mismatch, then settles to the resolved language on the client.
 */
export function useLegalLang(): {
  lang: LegalLang;
  ready: boolean;
  setLang: (lang: LegalLang) => void;
} {
  const [lang, setLangState] = useState<LegalLang>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const resolve = (): LegalLang => {
      try {
        const explicit = localStorage.getItem(STORAGE_KEY);
        if (explicit === 'ru' || explicit === 'en') return explicit;
        const app = localStorage.getItem('i18nextLng') ?? '';
        if (app.toLowerCase().startsWith('ru')) return 'ru';
        if (app) return 'en';
      } catch {
        // localStorage unavailable (private mode / SSR) — fall through.
      }
      const nav = typeof navigator !== 'undefined' ? navigator.language : '';
      return nav.toLowerCase().startsWith('ru') ? 'ru' : 'en';
    };
    setLangState(resolve());
    setReady(true);

    // Keep every consumer (page body + layout toggle) in sync when one of
    // them changes the language, without prop-drilling through the server
    // layout boundary.
    const onChange = (e: Event) => {
      const next = (e as CustomEvent<LegalLang>).detail;
      if (next === 'en' || next === 'ru') setLangState(next);
    };
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
  }, []);

  const setLang = (next: LegalLang) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore persistence failures
    }
    setLangState(next);
    window.dispatchEvent(new CustomEvent<LegalLang>(CHANGE_EVENT, { detail: next }));
  };

  return { lang, ready, setLang };
}
