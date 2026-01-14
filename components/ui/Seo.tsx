import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  structuredData?: object;
  noindex?: boolean;
}

const baseUrl = 'https://tipa.uz';
const defaultImage = `${baseUrl}/og-image.jpg`;
const defaultDescription = 'Типа агентство — системный digital-партнер в Узбекистане. Разработка сайтов, SMM, брендинг, автоматизация бизнеса, CRM, SEO и реклама.';

export const Seo: React.FC<SeoProps> = ({ 
  title, 
  description = defaultDescription,
  image = defaultImage,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Типа агентство',
  structuredData,
  noindex = false
}) => {
  const location = useLocation();
  const fullTitle = `${title} | Типа агентство`;
  const url = `${baseUrl}${location.pathname}`;

  useEffect(() => {
    // Update Title
    document.title = fullTitle;

    // Helper function to update or create meta tag
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic Meta Tags
    updateMetaTag('description', description);
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Hreflang tags for multilingual SEO
    const languages = ['ru', 'uz', 'en'];
    const currentPath = location.pathname.replace(/^\/(ru|uz|en)/, '') || '/';
    languages.forEach((lang) => {
      const langUrl = `${baseUrl}/${lang}${currentPath === '/' ? '' : currentPath}`;
      let hreflang = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`);
      if (!hreflang) {
        hreflang = document.createElement('link');
        hreflang.setAttribute('rel', 'alternate');
        hreflang.setAttribute('hreflang', lang);
        document.head.appendChild(hreflang);
      }
      hreflang.setAttribute('href', langUrl);
    });
    // x-default hreflang
    const defaultUrl = `${baseUrl}/ru${currentPath === '/' ? '' : currentPath}`;
    let xDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
    if (!xDefault) {
      xDefault = document.createElement('link');
      xDefault.setAttribute('rel', 'alternate');
      xDefault.setAttribute('hreflang', 'x-default');
      document.head.appendChild(xDefault);
    }
    xDefault.setAttribute('href', defaultUrl);

    // Open Graph Tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'Типа агентство', true);
    updateMetaTag('og:locale', 'ru_RU', true);
    
    if (type === 'article' && publishedTime) {
      updateMetaTag('article:published_time', publishedTime, true);
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
      if (author) {
        updateMetaTag('article:author', author, true);
      }
    }

    // Twitter Card Tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:url', url);

    // JSON-LD Structured Data
    let jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLd);
    }

    const defaultStructuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : 'WebPage',
      name: fullTitle,
      description: description,
      url: url,
      image: image,
      publisher: {
        '@type': 'Organization',
        name: 'Типа агентство',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/favicon.svg`
        }
      },
      ...(type === 'article' && {
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        author: {
          '@type': 'Organization',
          name: author
        }
      }),
      ...structuredData
    };

    jsonLd.textContent = JSON.stringify(defaultStructuredData);

  }, [title, description, image, type, url, fullTitle, publishedTime, modifiedTime, author, structuredData, noindex, location]);

  return null;
};