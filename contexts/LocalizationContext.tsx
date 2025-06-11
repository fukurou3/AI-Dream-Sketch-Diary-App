import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { translations, SupportedLanguage, TranslationKey } from '@/constants/translations';

interface LocalizationContextValue {
  language: SupportedLanguage;
  setLanguage: (lng: SupportedLanguage) => void;
  t: (key: TranslationKey) => string;
}

const LocalizationContext = createContext<LocalizationContextValue | undefined>(undefined);

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const deviceLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  const initial = deviceLocale.startsWith('ja') ? 'ja' : 'en';
  const [language, setLanguage] = useState<SupportedLanguage>(initial);

  const t = useCallback((key: TranslationKey) => translations[language][key] || key, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, t]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return context;
}
