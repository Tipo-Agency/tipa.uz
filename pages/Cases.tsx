import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../components/ui/Section';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Seo } from '../components/ui/Seo';
import { useModal } from '../context/ModalContext';
import { getSiteData, CaseItem, Tag } from '../services/siteDataService';
import { trackCTAClick } from '../lib/analytics';
import { useLocalizedLink, getLocalizedLink } from '../lib/useLocalizedLink';

const Cases: React.FC = () => {
  const { t, language } = useLanguage();
  const { openModal } = useModal();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

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
        ) : cases.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">{t('cases.no_cases')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {cases.map((item) => {
              const resolvedTags = item.tags
                ?.map((id) => tagsMap.get(id))
                .filter(Boolean) as Tag[];

              const caseLink = getLocalizedLink(`/cases/${item.id}`, language);
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
                        {resolvedTags.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-gray-200"
                            style={tag.color ? { borderColor: tag.color, color: tag.color } : undefined}
                          >
                            {tag.name}
                          </span>
                        ))}
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