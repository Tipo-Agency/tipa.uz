import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Section } from '../components/ui/Section';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Seo } from '../components/ui/Seo';
import { useModal } from '../context/ModalContext';
import { getSiteData, CaseItem, Tag } from '../services/siteDataService';
import { trackCTAClick } from '../lib/analytics';
import { useLocalizedLink, getLocalizedLink, getCaseLink } from '../lib/useLocalizedLink';

// Функция для создания slug из имени тега (для URL)
const createTagSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const Cases: React.FC = () => {
  const { t, language } = useLanguage();
  const { openModal } = useModal();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  // Получаем фильтр из URL
  const tagFilter = searchParams.get('tag') || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { cases, tags } = await getSiteData();
        setCases(cases);
        setTags(tags);
      } catch (e) {
        console.error('Failed to load cases from Firestore', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tagsMap = new Map<string, Tag>();
  tags.forEach((tag) => tagsMap.set(tag.id, tag));

  // Создаем обратную карту: slug -> tag
  const tagsBySlug = useMemo(() => {
    const map = new Map<string, Tag>();
    tags.forEach((tag) => {
      const slug = createTagSlug(tag.name);
      map.set(slug, tag);
    });
    return map;
  }, [tags]);

  // Фильтруем кейсы по выбранному тегу
  const filteredCases = useMemo(() => {
    if (!tagFilter) {
      return cases;
    }

    const selectedTag = tagsBySlug.get(tagFilter);
    if (!selectedTag) {
      return cases; // Если тег не найден, показываем все
    }

    return cases.filter((item) => {
      return item.tags?.includes(selectedTag.id);
    });
  }, [cases, tagFilter, tagsBySlug]);

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
        title="Кейсы и Портфолио | Примеры работ Типа агентство"
        description="Реальные кейсы Типа агентство: разработка сайтов, SMM-кампании, брендинг, автоматизация бизнеса. Успешные проекты для клиентов из разных отраслей. Портфолио digital-агентства в Узбекистане."
        structuredData={{
          '@type': 'CollectionPage',
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: cases.slice(0, 10).map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'CreativeWork',
                name: item.title,
                description: item.description?.replace(/<[^>]+>/g, ' ').slice(0, 200),
                image: item.imageUrl
              }
            }))
          }
        }}
      />

      <section className="relative min-h-[40vh] flex flex-col justify-end pb-12 pt-40 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumbs />

          <div className="pt-8">
            <h1 className="font-display font-black text-5xl md:text-7xl text-white uppercase tracking-tighter mb-6 leading-[0.95]">
              {t('cases.page_title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed">
              {t('cases.intro')}
            </p>
          </div>
        </div>
      </section>

      <Section className="pb-24">
        {loading ? (
          <div className="text-center py-20 text-gray-500">{t('cases.loading')}</div>
        ) : (
          <>
            {/* Фильтр по тегам */}
            {tags.length > 0 && (
              <div className="mb-12">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    {t('cases.filter_by_tag') || 'Фильтр по тегам:'}
                  </span>
                  <button
                    onClick={() => handleTagFilter(null)}
                    className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                      !tagFilter
                        ? 'bg-primary text-white'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:border-primary/40 hover:text-white'
                    }`}
                  >
                    {t('cases.all_cases') || 'Все кейсы'}
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
                    {filteredCases.length === 0 ? (
                      <span>{t('cases.no_cases_for_tag') || 'Кейсы с этим тегом не найдены'}</span>
                    ) : (
                      <span>
                        {t('cases.showing') || 'Показано'} {filteredCases.length}{' '}
                        {filteredCases.length === 1
                          ? t('cases.case') || 'кейс'
                          : filteredCases.length < 5
                          ? t('cases.cases_2_4') || 'кейса'
                          : t('cases.cases') || 'кейсов'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {filteredCases.length === 0 && !loading ? (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-4">
                  {tagFilter
                    ? t('cases.no_cases_for_tag') || 'Кейсы с этим тегом не найдены'
                    : t('cases.no_cases') || 'Кейсы не найдены'}
                </p>
                {tagFilter && (
                  <button
                    onClick={() => handleTagFilter(null)}
                    className="text-primary hover:text-white transition-colors underline"
                  >
                    {t('cases.show_all') || 'Показать все кейсы'}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredCases.map((item) => {
                  const resolvedTags = item.tags
                    ?.map((id) => tagsMap.get(id))
                    .filter(Boolean) as Tag[];

                  const caseLink = getCaseLink(item, language);
                  return (
                    <Link
                      to={caseLink}
                      key={item.id}
                      className="group bg-dark-surface border border-white/5 rounded-2xl overflow-hidden hover:border-primary/40 transition-all flex flex-col"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={`Кейс ${item.title}${item.clientName ? ` для ${item.clientName}` : ''} от Типа агентство`}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-dark via-primary/15 to-dark" />
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        {resolvedTags && resolvedTags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {resolvedTags.slice(0, 3).map((tag) => {
                              const tagSlug = createTagSlug(tag.name);
                              return (
                                <button
                                  key={tag.id}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleTagFilter(tagSlug);
                                    // Прокручиваем к началу списка кейсов
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 transition-all cursor-pointer"
                                  style={tag.color ? { borderColor: tag.color, color: tag.color } : undefined}
                                >
                                  {tag.name}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        <h2 className="font-display font-bold text-2xl text-white mb-2 group-hover:text-primary transition-colors">
                          {item.title || item.description?.slice(0, 50) || 'Без названия'}
                        </h2>
                        {item.clientName && (
                          <p className="text-gray-400 text-sm mb-4">
                            Клиент: <span className="text-white">{item.clientName}</span>
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10 text-xs text-gray-500">
                          <span className="uppercase tracking-widest font-bold">
                            Смотреть кейс →
                          </span>
                          <div className="flex gap-3">
                            {item.websiteUrl && (
                              <span className="text-primary">Сайт</span>
                            )}
                            {item.instagramUrl && (
                              <span className="text-accent-turquoise">Instagram</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </Section>

      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-dark to-[#0a0a0a]">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-display font-bold text-5xl md:text-8xl text-white mb-8 tracking-tighter uppercase">
            {t('home.cta_title')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-primary to-primary-dark drop-shadow-2xl">
              {t('home.cta_title_2')}
            </span>
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12">
            {t('home.cta_text')}
          </p>
          <button
            onClick={() => {
              trackCTAClick('start_project', 'cases_page');
              openModal();
            }}
            className="inline-block bg-primary hover:bg-white hover:text-dark text-white px-12 py-6 rounded-full font-display font-bold text-lg tracking-wider transition-all duration-300 hover:scale-105 shadow-[0_0_50px_-15px_rgba(51,55,173,0.5)]"
          >
            {t('home.cta_button')}
          </button>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </section>
    </>
  );
};

export default Cases;