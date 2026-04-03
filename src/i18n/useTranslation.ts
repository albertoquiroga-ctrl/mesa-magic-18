/**
 * useTranslation hook
 * 
 * Returns a `t()` function that resolves translation keys with optional
 * interpolation: t('menu.search.results', { count: 3, plural: 's', query: 'tacos' })
 */
import { useLanguageStore } from '@/stores/languageStore';
import { translations, type TranslationKey } from './translations';

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const dict = translations[language];

  function t(key: TranslationKey, vars?: Record<string, string | number>): string {
    let text = dict[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  }

  return { t, language };
}
