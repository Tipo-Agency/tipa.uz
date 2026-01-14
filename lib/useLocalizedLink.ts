import { useLanguage } from '../context/LanguageContext';
import { useMemo } from 'react';
import { Language } from '../types';
import { generateSlug } from './slugify';

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
 * Generate localized link for case with slug
 * Usage: const link = getCaseLink(caseItem, 'ru');
 * Returns: '/ru/cases/nazvanie-keysa-id123'
 */
export const getCaseLink = (caseItem: { id: string; title?: string; description?: string }, language: Language): string => {
  const title = caseItem.title || caseItem.description?.replace(/<[^>]+>/g, ' ').slice(0, 50) || 'case';
  const slug = generateSlug(title, caseItem.id);
  return getLocalizedLink(`/cases/${slug}`, language);
};

/**
 * Generate localized link for news with slug
 * Usage: const link = getNewsLink(newsItem, 'ru');
 * Returns: '/ru/news/nazvanie-novosti-id123'
 */
export const getNewsLink = (newsItem: { id: string; title: string }, language: Language): string => {
  const slug = generateSlug(newsItem.title, newsItem.id);
  return getLocalizedLink(`/news/${slug}`, language);
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
