import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Section } from '../components/ui/Section';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { getSiteData, News as FirebaseNews, Tag } from '../services/siteDataService';
import { Seo } from '../components/ui/Seo';
import { useLanguage } from '../context/LanguageContext';
import { trackNewsView } from '../lib/analytics';
import { useLocalizedLink } from '../lib/useLocalizedLink';
import { generateSlug } from '../lib/slugify';

const formatDate = (iso?: string) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
};

const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const [item, setItem] = useState<FirebaseNews | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const newsLink = useLocalizedLink('/news');

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      try {
        const { news, tags } = await getSiteData();
        // Find by matching slug (without ID)
        const foundNews = news.find((n) => {
          const newsSlug = generateSlug(n.title);
          return newsSlug === slug;
        }) || null;
        
        setItem(foundNews);
        setTags(tags);
        
        // Track news view
        if (foundNews) {
          trackNewsView(foundNews.id, foundNews.title);
        }
      } catch (e) {
        console.error('Failed to load news detail', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white">Loading…</div>;
  }

  if (!item) {
    return <Navigate to={`/${language}/news`} replace />;
  }

  const date = formatDate(item.publishedAt || item.createdAt);
  const tagsMap = new Map<string, Tag>();
  tags.forEach((t) => tagsMap.set(t.id, t));
  const resolvedTags = item.tags?.map((tid) => tagsMap.get(tid)).filter(Boolean) as Tag[];

  const excerpt = item.excerpt || item.content?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || '';
  const publishedDate = item.publishedAt || item.createdAt || '';
  
  // Формируем description для SEO (гарантируем, что он не пустой и оптимальной длины)
  const seoDescription = excerpt.length > 0 
    ? excerpt.slice(0, 160) + (excerpt.length > 160 ? '...' : '')
    : `${item.title}. Новости и статьи о digital-маркетинге, разработке и автоматизации от Типа агентство.`;

  return (
    <>
      <Seo 
        title={`${item.title} | Типа агентство`}
        description={seoDescription}
        type="article"
        publishedTime={publishedDate}
        modifiedTime={item.createdAt}
        image={item.imageUrl ? `https://tipa.uz${item.imageUrl}` : undefined}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: item.title,
          description: seoDescription,
          image: item.imageUrl ? [`https://tipa.uz${item.imageUrl}`] : undefined,
          datePublished: publishedDate,
          dateModified: item.createdAt || publishedDate,
          author: {
            '@type': 'Organization',
            name: 'Типа агентство',
            url: 'https://tipa.uz'
          },
          publisher: {
            '@type': 'Organization',
            name: 'Типа агентство',
            logo: {
              '@type': 'ImageObject',
              url: 'https://tipa.uz/favicon.svg'
            }
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://tipa.uz/${language}/news/${slug}`
          }
        }}
      />
      <section className="relative pt-32 pb-16 overflow-hidden bg-dark">
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumbs customTitle={item.title} />

          {/* Layout: Фото и заголовок рядом */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 items-start">
            {/* Левая колонка: Заголовок */}
            <div className="order-1 lg:order-1 flex flex-col justify-center">
              <p className="text-gray-500 text-sm mb-4">{date}</p>
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                {item.title}
              </h1>
              
              {resolvedTags && resolvedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {resolvedTags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-gray-200"
                      style={tag.color ? { borderColor: tag.color, color: tag.color } : undefined}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Превью (excerpt) */}
              {excerpt && (
                <p className="text-gray-300 text-lg leading-relaxed">
                  {excerpt}
                </p>
              )}
            </div>

            {/* Правая колонка: Фото */}
            {item.imageUrl && (
              <div className="order-2 lg:order-2">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black">
                  <img
                    src={item.imageUrl}
                    alt={`${item.title} - новость от Типа агентство`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Содержание статьи */}
      {item.content && (
        <Section className="py-16">
          <article className="prose prose-invert max-w-4xl mx-auto prose-headings:font-display prose-headings:text-white prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:font-bold prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4 prose-li:text-gray-300 prose-ul:list-disc prose-ol:list-decimal prose-strong:text-white prose-strong:font-bold prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-400">
            <style dangerouslySetInnerHTML={{__html: `
              .news-content { }
              .news-hero-section { margin-bottom: 4rem; }
              .news-hero-section .lead { font-size: 1.25rem; line-height: 1.8; color: #d1d5db; margin-top: 1.5rem; }
              .news-section { margin-bottom: 4rem; }
              .news-section h3 { font-size: 2rem; font-weight: bold; color: white; margin-bottom: 2rem; font-family: var(--font-display); }
              .checklist-section { display: flex; flex-direction: column; gap: 3rem; }
              .checklist-item { display: flex; gap: 2rem; align-items: flex-start; }
              .checklist-number { font-size: 4rem; font-weight: 900; color: #4ECDC4; line-height: 1; font-family: var(--font-display); opacity: 0.3; min-width: 80px; flex-shrink: 0; }
              .checklist-content { flex: 1; }
              .checklist-content h3 { font-size: 1.75rem; font-weight: bold; color: white; margin-bottom: 1.5rem; font-family: var(--font-display); }
              .problem-box, .solution-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 2rem; margin-bottom: 1.5rem; }
              .problem-box { border-left: 4px solid #ef4444; }
              .solution-box { border-left: 4px solid #4ECDC4; }
              .problem-box h4, .solution-box h4 { font-size: 1.25rem; font-weight: bold; color: white; margin-bottom: 1rem; font-family: var(--font-display); }
              .problem-box ul, .solution-box ul { list-style: none; padding: 0; }
              .problem-box li, .solution-box li { color: #d1d5db; line-height: 1.8; margin-bottom: 0.75rem; padding-left: 1.5rem; position: relative; }
              .problem-box li:before { content: "✗"; position: absolute; left: 0; color: #ef4444; font-weight: bold; }
              .solution-box li:before { content: "✓"; position: absolute; left: 0; color: #4ECDC4; font-weight: bold; }
              .quote-box { background: rgba(78,205,196,0.1); border-left: 4px solid #4ECDC4; padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0; font-style: italic; }
              .quote-box p { margin: 0.5rem 0; color: #e5e7eb; }
              .alert-box { padding: 1.5rem; border-radius: 0.5rem; margin: 1.5rem 0; }
              .alert-box.alert-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); }
              .alert-box p { margin: 0.5rem 0; color: #e5e7eb; }
              .alert-text { color: #fca5a5; font-weight: 500; margin-top: 1rem; }
              .case-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 2rem; }
              .info-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 2rem; transition: all 0.3s; }
              .info-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(78,205,196,0.3); transform: translateY(-4px); }
              .info-icon { font-size: 3rem; margin-bottom: 1rem; }
              .info-card h3, .info-card h4 { font-size: 1.5rem; font-weight: bold; color: white; margin-bottom: 1rem; font-family: var(--font-display); }
              .info-card h4 { font-size: 1.25rem; }
              .info-card p { color: #9ca3af; line-height: 1.7; }
              .process-steps { display: flex; flex-direction: column; gap: 2rem; }
              .step { display: flex; gap: 2rem; align-items: flex-start; }
              .step-number { font-size: 2.5rem; font-weight: 900; color: #4ECDC4; line-height: 1; font-family: var(--font-display); opacity: 0.8; min-width: 60px; flex-shrink: 0; }
              .step-content h4 { font-size: 1.5rem; font-weight: bold; color: white; margin-bottom: 0.75rem; font-family: var(--font-display); }
              .step-content p { color: #d1d5db; line-height: 1.8; }
              .news-section.highlight { background: linear-gradient(135deg, rgba(78,205,196,0.1) 0%, rgba(51,55,173,0.1) 100%); border-left: 4px solid #4ECDC4; padding: 2rem; border-radius: 1rem; }
              .news-section.highlight-final { background: linear-gradient(135deg, rgba(78,205,196,0.15) 0%, rgba(51,55,173,0.15) 100%); border: 2px solid rgba(78,205,196,0.3); padding: 2rem; border-radius: 1rem; }
              .result-text { font-size: 1.25rem; line-height: 1.8; color: #e5e7eb; font-weight: 500; }
              .result-text.final { font-size: 1.5rem; font-weight: bold; color: white; margin-top: 1rem; }
              .price-box { text-align: center; }
              .price-box h3 { font-size: 2.5rem; font-weight: bold; color: #4ECDC4; margin-bottom: 1rem; font-family: var(--font-display); }
              .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
              @media (max-width: 768px) {
                .checklist-item { flex-direction: column; gap: 1rem; }
                .checklist-number { font-size: 3rem; }
                .case-info-grid, .info-grid { grid-template-columns: 1fr; }
                .step { flex-direction: column; gap: 1rem; }
                .step-number { font-size: 2rem; }
              }
            `}} />
            <div
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </article>
        </Section>
      )}

      {/* Секция "Все новости" */}
      <section className="py-24 text-center">
        <Link
          to={newsLink}
          className="inline-flex flex-col items-center group"
        >
          <span className="text-gray-500 uppercase tracking-widest text-sm mb-4">
            {t('common.back_to_list')}
          </span>
          <h2 className="font-display font-bold text-4xl md:text-6xl text-white group-hover:text-primary transition-colors">
            {t('common.all_news')}
          </h2>
        </Link>
      </section>
    </>
  );
};

export default NewsDetail;

