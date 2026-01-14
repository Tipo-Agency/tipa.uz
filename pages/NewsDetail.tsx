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
  const { t } = useLanguage();
  const [item, setItem] = useState<FirebaseNews | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

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
    return <Navigate to="/news" replace />;
  }

  const date = formatDate(item.publishedAt || item.createdAt);
  const tagsMap = new Map<string, Tag>();
  tags.forEach((t) => tagsMap.set(t.id, t));
  const resolvedTags = item.tags?.map((tid) => tagsMap.get(tid)).filter(Boolean) as Tag[];

  const excerpt = item.excerpt || item.content?.replace(/<[^>]+>/g, ' ').slice(0, 200).trim() || '';
  const publishedDate = item.publishedAt || item.createdAt || '';

  return (
    <>
      <Seo 
        title={item.title}
        description={excerpt}
        type="article"
        publishedTime={publishedDate}
        modifiedTime={item.createdAt}
        image={item.imageUrl}
        structuredData={{
          '@type': 'BlogPosting',
          headline: item.title,
          description: excerpt,
          image: item.imageUrl ? [item.imageUrl] : undefined,
          datePublished: publishedDate,
          dateModified: item.createdAt || publishedDate,
          author: {
            '@type': 'Organization',
            name: 'Типа агентство'
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
            '@id': `https://tipa.uz/news/${slug}`
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
          <article className="prose prose-invert max-w-4xl mx-auto prose-headings:font-display prose-a:text-primary prose-p:text-gray-300 prose-li:text-gray-300">
            <div
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </article>
        </Section>
      )}

      {/* Секция "Все новости" */}
      <section className="py-24 text-center">
        <Link
          to={useLocalizedLink('/news')}
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

