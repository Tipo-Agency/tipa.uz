import { useLanguage } from '../context/LanguageContext';
import { useMemo } from 'react';
import { Language } from '../types';

/**
 * Helper function to generate localized link (can be used in map functions)
 * Usage: const link = getLocalizedLink('/cases', 'ru');
 * Returns: '/ru/cases'
 */
export const getLocalizedLink = (path: string, language: Language): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Remove language prefix if present
  const pathWithoutLang = cleanPath.replace(/^(ru|uz|en)\//, '');
  // Return path with current language
  return `/${language}${pathWithoutLang === '' ? '' : '/' + pathWithoutLang}`;
};

/**
 * Hook to generate localized links
 * Usage: const to = useLocalizedLink('/cases');
 * Returns: '/ru/cases' (or current language)
 */
export const useLocalizedLink = (path: string): string => {
  const { language } = useLanguage();
  
  return useMemo(() => {
    return getLocalizedLink(path, language);
  }, [path, language]);
};
