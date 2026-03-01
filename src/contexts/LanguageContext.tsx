import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, Translation } from '../utils/i18n';
import { getTranslation } from '../utils/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const supportedLanguages: Language[] = ['en', 'es'];
const isSupportedLanguage = (lang: string | null): lang is Language => {
  return !!lang && supportedLanguages.includes(lang as Language);
};

const getLanguageFromURL = (): Language | null => {
  const params = new URLSearchParams(window.location.search);
  const langParam = params.get('lang');
  return isSupportedLanguage(langParam) ? langParam : null;
};

const updateURLLanguage = (lang: Language) => {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url.toString());
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const urlLang = getLanguageFromURL();
    if (urlLang) {
      return urlLang;
    }
    
    const saved = localStorage.getItem('mermaid-language');
    return isSupportedLanguage(saved) ? saved : 'en';
  });

  useEffect(() => {
    const handlePopState = () => {
      const urlLang = getLanguageFromURL();
      if (urlLang && urlLang !== language) {
        setLanguageState(urlLang);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [language]);

  useEffect(() => {
    const langMap: Record<Language, string> = {
      'en': 'en',
      'es': 'es',
    };
    
    document.documentElement.lang = langMap[language] || 'en';
  }, [language]);

  const setLanguage = (lang: Language) => {
    const nextLanguage = supportedLanguages.includes(lang) ? lang : 'en';
    setLanguageState(nextLanguage);
    localStorage.setItem('mermaid-language', nextLanguage);
    updateURLLanguage(nextLanguage);
  };

  const t = getTranslation(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
