import { createContext, useContext, useMemo, useState } from 'react';
import en from '../i18n/en.json';
import mnk from '../i18n/mnk.json';
import wo from '../i18n/wo.json';
import { readJson, writeJson } from '../utils/storage.js';

const dictionaries = { en, mnk, wo };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => readJson('language', 'en'));

  const setLanguage = (next) => {
    const value = dictionaries[next] ? next : 'en';
    setLanguageState(value);
    writeJson('language', value);
  };

  const value = useMemo(() => {
    const dict = dictionaries[language] || en;
    const t = (key) => dict[key] || en[key] || key;
    return { language, setLanguage, t, languages: [
      { code: 'en', label: 'English' },
      { code: 'mnk', label: 'Mandinka' },
      { code: 'wo', label: 'Wolof' },
    ] };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
