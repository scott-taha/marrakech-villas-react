import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type LanguageCode } from '../locales';

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (typeof translations)[LanguageCode];
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = 'preferredLanguage';

function resolveInitialLang(): LanguageCode {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && Object.keys(translations).includes(saved)) {
    return saved as LanguageCode;
  }
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(resolveInitialLang);

  const setLang = (newLang: LanguageCode) => {
    localStorage.setItem(STORAGE_KEY, newLang);
    setLangState(newLang);
  };

  const isRtl = lang === 'ar';

  // Sync <html> attributes whenever language changes
  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}
