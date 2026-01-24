import React, { useEffect, useState } from 'react';
import { STATIC_CASES } from '../data/cases';
import { STATIC_NEWS } from '../data/news';
import { generateSlug } from '../lib/slugify';

/**
 * Dynamic Sitemap generator for SEO
 * This page generates XML sitemap on-the-fly from Firebase data
 * Configure your server to serve this as /sitemap.xml
 */
const Sitemap: React.FC = () => {
  const [xml, setXml] = useState<string>('');
  const baseUrl = 'https://tipa.uz';
  const languages = ['ru', 'uz', 'en'];

  console.log('🔵 Sitemap component rendered');

  console.log('Sitemap component rendered');

  useEffect(() => {
    console.log('Sitemap useEffect triggered');
    const generateSitemap = () => {
      try {
        console.log('Starting sitemap generation...');
        // Используем статичные данные
        const cases = STATIC_CASES;
        const news = STATIC_NEWS;
        console.log('Static data loaded:', { cases: cases.length, news: news.length });
        
        // Фильтруем только опубликованные
        const publishedCases = cases.filter((item) => item.published === true);
        const publishedNews = news.filter((item) => item.published === true);
        
        console.log('Sitemap generation:', {
          totalCases: cases.length,
          publishedCases: publishedCases.length,
          publishedCasesIds: publishedCases.map(c => c.id),
          totalNews: news.length,
          publishedNews: publishedNews.length,
          publishedNewsIds: publishedNews.map(n => n.id)
        });
        
        const staticPages = [
          { path: '', priority: '1.0', changefreq: 'weekly' },
          { path: 'services', priority: '0.9', changefreq: 'monthly' },
          { path: 'cases', priority: '0.9', changefreq: 'weekly' },
          { path: 'news', priority: '0.8', changefreq: 'weekly' },
          { path: 'about', priority: '0.7', changefreq: 'monthly' },
          { path: 'contact', priority: '0.7', changefreq: 'monthly' },
          { path: 'privacy', priority: '0.5', changefreq: 'yearly' },
        ];

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

        // Add static pages for each language
        staticPages.forEach((page) => {
          languages.forEach((lang) => {
            const url = `${baseUrl}/${lang}${page.path ? '/' + page.path : ''}`;
            const lastmod = new Date().toISOString().split('T')[0];
            
            sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;
            
            // Add hreflang alternatives
            languages.forEach((altLang) => {
              const altUrl = `${baseUrl}/${altLang}${page.path ? '/' + page.path : ''}`;
              sitemap += `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}" />`;
            });
            sitemap += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/ru${page.path ? '/' + page.path : ''}" />
  </url>
`;
          });
        });

        // Add dynamic cases for each language
        publishedCases.forEach((caseItem) => {
          const caseTitle = caseItem.title || caseItem.description?.replace(/<[^>]+>/g, ' ').slice(0, 50) || 'case';
          const caseSlug = generateSlug(caseTitle);
          languages.forEach((lang) => {
            const url = `${baseUrl}/${lang}/cases/${caseSlug}`;
            // Safe date parsing
            let lastmod = new Date().toISOString().split('T')[0];
            if (caseItem.createdAt) {
              const date = new Date(caseItem.createdAt);
              if (!isNaN(date.getTime())) {
                lastmod = date.toISOString().split('T')[0];
              }
            }
            
            sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>`;
            
            languages.forEach((altLang) => {
              const altUrl = `${baseUrl}/${altLang}/cases/${caseSlug}`;
              sitemap += `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}" />`;
            });
            sitemap += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/ru/cases/${caseSlug}" />
  </url>
`;
          });
        });

        // Add dynamic news for each language
        publishedNews.forEach((newsItem) => {
          const newsSlug = generateSlug(newsItem.title);
          languages.forEach((lang) => {
            const url = `${baseUrl}/${lang}/news/${newsSlug}`;
            // Safe date parsing
            let lastmod = new Date().toISOString().split('T')[0];
            const dateValue = newsItem.publishedAt || newsItem.createdAt;
            if (dateValue) {
              const date = new Date(dateValue);
              if (!isNaN(date.getTime())) {
                lastmod = date.toISOString().split('T')[0];
              }
            }
            
            sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>`;
            
            languages.forEach((altLang) => {
              const altUrl = `${baseUrl}/${altLang}/news/${newsSlug}`;
              sitemap += `
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}" />`;
            });
            sitemap += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/ru/news/${newsSlug}" />
  </url>
`;
          });
        });

        sitemap += `</urlset>`;
        
        console.log('Sitemap generated successfully:', {
          totalUrls: staticPages.length * languages.length + publishedCases.length * languages.length + publishedNews.length * languages.length,
          casesUrls: publishedCases.length * languages.length,
          newsUrls: publishedNews.length * languages.length
        });
        
        setXml(sitemap);
      } catch (error) {
        console.error('Error generating sitemap:', error);
        setXml('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
      }
    };

    generateSitemap();
  }, []);

  // Set content type and return XML
  useEffect(() => {
    if (xml) {
      // Try to set content type (works in some cases)
      const meta = document.querySelector('meta[http-equiv="Content-Type"]');
      if (meta) {
        meta.setAttribute('content', 'application/xml; charset=utf-8');
      } else {
        const newMeta = document.createElement('meta');
        newMeta.httpEquiv = 'Content-Type';
        newMeta.content = 'application/xml; charset=utf-8';
        document.head.appendChild(newMeta);
      }
      
      // Clear body and show XML
      document.body.innerHTML = '';
      const pre = document.createElement('pre');
      pre.style.whiteSpace = 'pre-wrap';
      pre.style.fontFamily = 'monospace';
      pre.style.padding = '20px';
      pre.style.backgroundColor = '#1a1a1a';
      pre.style.color = '#fff';
      pre.textContent = xml;
      document.body.appendChild(pre);
    }
  }, [xml]);

  // Return XML as text
  if (xml) {
    return null; // Content is set via useEffect
  }

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      Loading sitemap...
    </div>
  );
};

export default Sitemap;
