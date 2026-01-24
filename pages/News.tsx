import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Section } from '../components/ui/Section';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { NewsCard, NewsCardItem } from '../components/ui/NewsCard';
import { useModal } from '../context/ModalContext';
import { getSiteData, News as FirebaseNews, Tag } from '../services/siteDataService';
import { Seo } from '../components/ui/Seo';
import { trackCTAClick } from '../lib/analytics';

// Функция для создания slug из имени тега (для URL)
const createTagSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<NewsCardItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  // Получаем фильтр из URL
  const tagFilter = searchParams.get('tag') || null;

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
        setTags(tags);
      } catch (e) {
        console.error('Failed to load news from Firestore', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Создаем обратную карту: slug -> tag
  const tagsBySlug = useMemo(() => {
    const map = new Map<string, Tag>();
    tags.forEach((tag) => {
      const slug = createTagSlug(tag.name);
      map.set(slug, tag);
    });
    return map;
  }, [tags]);

  // Фильтруем новости по выбранному тегу
  const filteredItems = useMemo(() => {
    if (!tagFilter) {
      return items;
    }

    const selectedTag = tagsBySlug.get(tagFilter);
    if (!selectedTag) {
      return items; // Если тег не найден, показываем все
    }

    return items.filter((item) => {
      return item.tags?.some((tag) => tag.id === selectedTag.id);
    });
  }, [items, tagFilter, tagsBySlug]);

  // Функция для установки фильтра
  const handleTagFilter = (tagSlug: string | null) => {
    if (tagSlug) {
      setSearchParams({ tag: tagSlug });
    } else {
      setSearchParams({});
    }
  };

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
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        
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
        ) : (
          <>
            {/* Фильтр по тегам */}
            {tags.length > 0 && (
              <div className="mb-12">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    {t('news.filter_by_tag') || 'Фильтр по тегам:'}
                  </span>
                  <button
                    onClick={() => handleTagFilter(null)}
                    className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                      !tagFilter
                        ? 'bg-primary text-white'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:border-primary/40 hover:text-white'
                    }`}
                  >
                    {t('news.all_news') || 'Все новости'}
                  </button>
                  {tags.map((tag) => {
                    const tagSlug = createTagSlug(tag.name);
                    const isActive = tagFilter === tagSlug;
                    return (
                      <button
                        key={tag.id}
                        onClick={() => handleTagFilter(tagSlug)}
                        className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:border-primary/40 hover:text-white'
                        }`}
                        style={
                          isActive && tag.color
                            ? { backgroundColor: tag.color, color: '#fff' }
                            : tag.color && !isActive
                            ? { borderColor: tag.color + '40', color: tag.color }
                            : undefined
                        }
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
                {tagFilter && (
                  <div className="text-sm text-gray-400 mb-6">
                    {filteredItems.length === 0 ? (
                      <span>{t('news.no_news_for_tag') || 'Новости с этим тегом не найдены'}</span>
                    ) : (
                      <span>
                        {t('news.showing') || 'Показано'} {filteredItems.length}{' '}
                        {filteredItems.length === 1
                          ? t('news.news_item') || 'новость'
                          : filteredItems.length < 5
                          ? t('news.news_items_2_4') || 'новости'
                          : t('news.news_items') || 'новостей'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {filteredItems.length === 0 && !loading ? (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-4">
                  {tagFilter
                    ? t('news.no_news_for_tag') || 'Новости с этим тегом не найдены'
                    : t('news.no_news') || 'Новости не найдены'}
                </p>
                {tagFilter && (
                  <button
                    onClick={() => handleTagFilter(null)}
                    className="text-primary hover:text-white transition-colors underline"
                  >
                    {t('news.show_all') || 'Показать все новости'}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
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