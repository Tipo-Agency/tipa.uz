import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { SERVICES_DATA, CASES_DATA } from '../../constants';
import { getLocalizedLink } from '../../lib/useLocalizedLink';

interface BreadcrumbsProps {
  customTitle?: string; // Для динамических страниц (кейсы, новости)
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ customTitle }) => {
  const location = useLocation();
  const { t, getLocalized, language } = useLanguage();
  
  // Don't show on home page
  if (location.pathname === '/' || location.pathname.match(/^\/(ru|uz|en)$/)) return null;

  // Remove language prefix from pathnames
  const pathnames = location.pathname.split('/').filter((x) => x && x !== 'ru' && x !== 'uz' && x !== 'en');

  // Функция для обрезки длинного текста
  const truncateText = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const getBreadcrumbName = (path: string, index: number) => {
    // 1. Check strict static translations
    if (path === 'services') return t('nav.services');
    if (path === 'cases') return t('nav.cases');
    if (path === 'news') return t('nav.news');
    if (path === 'about') return t('nav.about');
    if (path === 'contact') return t('nav.contact');

    // 2. Check Dynamic Service ID
    if (pathnames[index - 1] === 'services') {
        const service = SERVICES_DATA.find(s => s.id === path);
        if (service) return getLocalized(service.title);
    }

    // 3. Check Dynamic Case ID - используем customTitle если передан
    if (pathnames[index - 1] === 'cases') {
        if (customTitle) {
          return truncateText(customTitle, 40);
        }
        const caseItem = CASES_DATA.find(c => c.slug === path || c.id === path);
        if (caseItem) return truncateText(getLocalized(caseItem.title), 40);
    }

    // 4. Check Dynamic News ID - используем customTitle если передан
    if (pathnames[index - 1] === 'news') {
        if (customTitle) {
          return truncateText(customTitle, 40);
        }
    }

    // Fallback title case
    return truncateText(path.charAt(0).toUpperCase() + path.slice(1), 40);
  };

  return (
    <nav className="text-sm font-medium text-gray-500 mb-8" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex">
        <li className="flex items-center">
          <Link to={getLocalizedLink('/', language)} className="hover:text-primary transition-colors">{t('breadcrumbs.home')}</Link>
        </li>
        {pathnames.map((value, index) => {
          const path = `/${pathnames.slice(0, index + 1).join('/')}`;
          const to = getLocalizedLink(path, language);
          const isLast = index === pathnames.length - 1;
          const name = getBreadcrumbName(value, index);

          return (
            <li key={to} className="flex items-center">
              <span className="mx-2 text-gray-700">/</span>
              {isLast ? (
                <span className="text-white">{name}</span>
              ) : (
                <Link to={to} className="hover:text-primary transition-colors">
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      
      {/* Schema.org markup for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": pathnames.map((value, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": getBreadcrumbName(value, index),
            "item": `https://tipa.uz/${pathnames.slice(0, index + 1).join('/')}`
          }))
        })}
      </script>
    </nav>
  );
};