import React, { useEffect, useState } from 'react';
import { Section } from '../components/ui/Section';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { NewsCard, NewsCardItem } from '../components/ui/NewsCard';
import { useModal } from '../context/ModalContext';
import { getSiteData, News as FirebaseNews, Tag } from '../services/siteDataService';
import { Seo } from '../components/ui/Seo';
import { trackCTAClick } from '../lib/analytics';

const formatDate = (iso?: string) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const buildExcerpt = (item: FirebaseNews): string => {
  if (item.excerpt) return item.excerpt;
  if (!item.content) return '';
  const text = item.content.replace(/<[^>]+>/g, ' ');
  return text.slice(0, 150).trim() + (text.length > 150 ? '…' : '');
};

const News: React.FC = () => {
  const { t } = useLanguage();
  const { openModal } = useModal();
  const [items, setItems] = useState<NewsCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { news, tags } = await getSiteData();
        const tagsMap = new Map<string, Tag>();
        tags.forEach((tag) => tagsMap.set(tag.id, tag));

        const mapped: NewsCardItem[] = news.map((n) => ({
          id: n.id,
          title: n.title,
          excerpt: buildExcerpt(n),
          imageUrl: n.imageUrl,
          date: formatDate(n.publishedAt || n.createdAt),
          tags: n.tags?.map((id) => tagsMap.get(id)).filter(Boolean) as Tag[],
        }));
        setItems(mapped);
      } catch (e) {
        console.error('Failed to load news from Firestore', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <Seo 
        title="Новости и Блог | Digital-инсайты от Типа агентство"
        description="Актуальные новости digital-индустрии, кейсы, тренды маркетинга и разработки. Экспертные статьи от команды Типа агентство о SMM, веб-разработке, автоматизации и digital-стратегиях."
        structuredData={{
          '@type': 'Blog',
          name: 'Типа агентство Blog',
          description: 'Новости и статьи о digital-маркетинге, разработке и автоматизации',
          publisher: {
            '@type': 'Organization',
            name: 'Типа агентство'
          },
          blogPost: items.slice(0, 10).map(item => ({
            '@type': 'BlogPosting',
            headline: item.title,
            description: item.excerpt,
            image: item.imageUrl,
            datePublished: item.date
          }))
        }}
      />
      <section className="relative pt-40 pb-20 overflow-hidden bg-dark">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
             <Breadcrumbs />
             
             <h1 className="font-display font-bold text-5xl md:text-8xl mb-8 text-white leading-none uppercase">
                {t('news.title')}
             </h1>
             <p className="text-xl text-gray-400 max-w-2xl border-l-4 border-primary pl-6">
                {t('news.intro')}
             </p>
        </div>
      </section>

      <Section className="py-20">
        {loading ? (
          <div className="text-center py-20 text-gray-500">{t('news.loading')}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-500">{t('news.no_news')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </Section>

      {/* CTA SECTION */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-dark to-[#0a0a0a]">
          <div className="container mx-auto px-4 text-center relative z-10">
              <h2 className="font-display font-bold text-5xl md:text-8xl text-white mb-8 tracking-tighter uppercase">
                  {t('home.cta_title')} <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-primary to-primary-dark drop-shadow-2xl">{t('home.cta_title_2')}</span>
              </h2>
              <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12">
                  {t('home.cta_text')}
              </p>
              <button 
                onClick={() => {
                  trackCTAClick('start_project', 'news_page');
                  openModal('news-page');
                }}
                className="inline-block bg-primary hover:bg-white hover:text-dark text-white px-12 py-6 rounded-full font-display font-bold text-lg tracking-wider transition-all duration-300 hover:scale-105 shadow-[0_0_50px_-15px_rgba(51,55,173,0.5)]"
              >
                  {t('home.cta_button')}
              </button>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </section>
    </>
  );
};

export default News;