/**
 * LanguageToggle
 * 
 * Compact button that switches between ES ↔ EN.
 * Shows the language it will switch TO (so if current is ES, shows "EN").
 */
import { useLanguageStore } from '@/stores/languageStore';

export const LanguageToggle = ({ className = '' }: { className?: string }) => {
  const { language, toggle } = useLanguageStore();

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1 px-2.5 py-1 rounded-chip text-xs font-medium bg-muted text-muted-foreground hover:bg-accent transition-colors min-h-touch ${className}`}
      aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a español'}
    >
      🌐 {language === 'es' ? 'EN' : 'ES'}
    </button>
  );
};
