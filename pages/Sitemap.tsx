import React, { useEffect, useState } from 'react';
import { getSiteData } from '../services/siteDataService';
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

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        const { cases, news } = await getSiteData();
        
        // Filter only published items
        const publishedCases = cases.filter(c => c.published !== false);
        const publishedNews = news.filter(n => n.published !== false);
        
        console.log('Sitemap generation:', {
          totalCases: cases.length,
          publishedCases: publishedCases.length,
          totalNews: news.length,
          publishedNews: publishedNews.length
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
            const lastmod = caseItem.createdAt 
              ? new Date(caseItem.createdAt).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0];
            
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
            const lastmod = newsItem.publishedAt || newsItem.createdAt
              ? new Date(newsItem.publishedAt || newsItem.createdAt || '').toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0];
            
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
      // Set content type header
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Type';
      meta.content = 'application/xml; charset=utf-8';
      document.head.appendChild(meta);
      
      // Replace body content with XML
      document.body.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace;">${xml}</pre>`;
    }
  }, [xml]);

  // Return XML as text
  if (xml) {
    return (
      <div dangerouslySetInnerHTML={{ __html: `<pre style="white-space: pre-wrap; font-family: monospace;">${xml}</pre>` }} />
    );
  }

  return <div>Loading sitemap...</div>;
};

export default Sitemap;
