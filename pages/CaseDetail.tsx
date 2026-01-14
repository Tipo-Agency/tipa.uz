import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Section } from '../components/ui/Section';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Seo } from '../components/ui/Seo';
import { getSiteData, CaseItem, Tag } from '../services/siteDataService';
import { useLanguage } from '../context/LanguageContext';
import { trackCaseView } from '../lib/analytics';
import { useLocalizedLink } from '../lib/useLocalizedLink';

const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [caseItem, setCaseItem] = useState<CaseItem | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const { cases, tags } = await getSiteData();
        const foundCase = cases.find((c) => c.id === id) || null;
        setCaseItem(foundCase);
        setTags(tags);
        
        // Track case view
        if (foundCase) {
          trackCaseView(id, foundCase.title);
        }
      } catch (e) {
        console.error('Failed to load case detail from Firestore', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white">Loading…</div>;
  }

  if (!caseItem) {
    return <Navigate to="/cases" replace />;
  }

  const tagsMap = new Map<string, Tag>();
  tags.forEach((t) => tagsMap.set(t.id, t));
  const resolvedTags = caseItem.tags?.map((tid) => tagsMap.get(tid)).filter(Boolean) as Tag[];
  
  // Создаем excerpt из description (убираем HTML, обрезаем до 200 символов)
  const caseExcerpt = caseItem.description
    ? caseItem.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200) + (caseItem.description.replace(/<[^>]+>/g, ' ').length > 200 ? '...' : '')
    : '';

  return (
    <>
      <Seo
        title={`Кейс: ${caseItem.title} | ${caseItem.clientName || 'Типа агентство'}`}
        description={caseItem.description?.replace(/<[^>]+>/g, ' ').slice(0, 200).trim() || `Кейс проекта ${caseItem.title} от Типа агентство. ${caseItem.clientName ? `Клиент: ${caseItem.clientName}` : ''}`}
        image={caseItem.imageUrl}
        structuredData={{
          '@type': 'CreativeWork',
          name: caseItem.title,
          description: caseItem.description?.replace(/<[^>]+>/g, ' ').slice(0, 300),
          image: caseItem.imageUrl,
          creator: {
            '@type': 'Organization',
            name: 'Типа агентство'
          },
          ...(caseItem.clientName && {
            client: {
              '@type': 'Organization',
              name: caseItem.clientName
            }
          })
        }}
      />

      <section className="relative pt-32 pb-16 bg-dark">
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumbs customTitle={caseItem.title} />

          {/* Layout: Фото и заголовок рядом */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 items-start">
            {/* Левая колонка: Фото или Заголовок (чередуется) */}
            {caseItem.imageUrl ? (
              <div className="order-2 lg:order-1">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black">
                  <img
                    src={caseItem.imageUrl}
                    alt={`Кейс ${caseItem.title} от Типа агентство`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : (
              <div className="order-2 lg:order-1"></div>
            )}

            {/* Правая колонка: Заголовок или Фото */}
            <div className="order-1 lg:order-2 flex flex-col justify-center">
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                {caseItem.title}
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
              {caseExcerpt && (
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {caseExcerpt}
                </p>
              )}

              {(caseItem.websiteUrl || caseItem.instagramUrl) && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {caseItem.websiteUrl && (
                    <a
                      href={caseItem.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-full text-sm font-medium border border-primary/50 text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      {t('common.project_website')}
                    </a>
                  )}
                  {caseItem.instagramUrl && (
                    <a
                      href={caseItem.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-full text-sm font-medium border border-accent-turquoise/50 text-accent-turquoise hover:bg-accent-turquoise hover:text-white transition-all"
                    >
                      {t('common.instagram')}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Описание проекта */}
      {caseItem.description && (
        <Section className="bg-dark-surface py-16">
          <div className="max-w-4xl mx-auto">
            <div
              className="prose prose-invert max-w-none prose-headings:font-display prose-a:text-primary prose-p:text-gray-300 prose-li:text-gray-300"
              dangerouslySetInnerHTML={{ __html: caseItem.description }}
            />
          </div>
        </Section>
      )}

      <section className="py-24 text-center">
        <Link
          to={useLocalizedLink('/cases')}
          className="inline-flex flex-col items-center group"
        >
          <span className="text-gray-500 uppercase tracking-widest text-sm mb-4">
            {t('common.back_to_list')}
          </span>
          <h2 className="font-display font-bold text-4xl md:text-6xl text-white group-hover:text-primary transition-colors">
            {t('common.all_cases')}
          </h2>
        </Link>
      </section>
    </>
  );
};

export default CaseDetail;