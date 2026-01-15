/**
 * Script to generate static sitemap.xml from Firebase data
 * Run this script periodically (e.g., every 12 hours) to update sitemap
 * 
 * Usage: npm run generate-sitemap
 * or: tsx scripts/generate-sitemap.ts
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { generateSlug } from '../lib/slugify';

// Firebase config - matches lib/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyBgDuPin7aSOBfkmA0ENpiiQZAbbj_Fl4g",
  authDomain: "tipa-task-manager.firebaseapp.com",
  projectId: "tipa-task-manager",
  storageBucket: "tipa-task-manager.firebasestorage.app",
  messagingSenderId: "529094386000",
  appId: "1:529094386000:web:223840a2126ab0b1a88c55",
} as const;

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

interface CaseItem {
  id: string;
  title?: string;
  description: string;
  published: boolean;
  createdAt?: string;
}

interface NewsItem {
  id: string;
  title: string;
  published: boolean;
  publishedAt?: string;
  createdAt?: string;
}

const baseUrl = 'https://tipa.uz';
const languages = ['ru', 'uz', 'en'];

// Safe date parsing
function formatDate(dateValue?: string): string {
  if (!dateValue) return new Date().toISOString().split('T')[0];
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
  return date.toISOString().split('T')[0];
}

async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...');

  try {
    // Load cases
    const casesSnapshot = await getDocs(collection(db, 'cases'));
    const allCases = casesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<CaseItem, 'id'>),
    }));
    
    const publishedCases = allCases
      .filter((c) => {
        const published = c.published === true || c.published === 'true' || c.published === 1;
        return published;
      })
      .sort((a, b) => a.id.localeCompare(b.id)); // Детерминированная сортировка по ID

    console.log(`📦 Loaded ${publishedCases.length} published cases (out of ${allCases.length} total)`);

    // Load news
    const newsSnapshot = await getDocs(collection(db, 'news'));
    const allNews = newsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<NewsItem, 'id'>),
    }));
    
    const publishedNews = allNews
      .filter((n) => n.published === true)
      .sort((a, b) => a.id.localeCompare(b.id)); // Детерминированная сортировка по ID

    console.log(`📰 Loaded ${publishedNews.length} published news (out of ${allNews.length} total)`);

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

    // Фиксированная дата для статических страниц (чтобы не менялась каждый запуск)
    const staticLastmod = '2024-01-01'; // Используем фиксированную дату для статики
    
    // Add static pages for each language
    staticPages.forEach((page) => {
      languages.forEach((lang) => {
        const url = `${baseUrl}/${lang}${page.path ? '/' + page.path : ''}`;
        const lastmod = staticLastmod;
        
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
      const lastmod = formatDate(caseItem.createdAt);
      
      languages.forEach((lang) => {
        const url = `${baseUrl}/${lang}/cases/${caseSlug}`;
        
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
      const lastmod = formatDate(newsItem.publishedAt || newsItem.createdAt);
      
      languages.forEach((lang) => {
        const url = `${baseUrl}/${lang}/news/${newsSlug}`;
        
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

    // Save to public/sitemap.xml
    const outputPath = join(process.cwd(), 'public', 'sitemap.xml');
    writeFileSync(outputPath, sitemap, 'utf-8');

    const totalUrls = 
      staticPages.length * languages.length + 
      publishedCases.length * languages.length + 
      publishedNews.length * languages.length;

    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   📊 Total URLs: ${totalUrls}`);
    console.log(`   📦 Cases: ${publishedCases.length * languages.length} URLs`);
    console.log(`   📰 News: ${publishedNews.length * languages.length} URLs`);
    console.log(`   💾 Saved to: ${outputPath}`);

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run if called directly
generateSitemap().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
