import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Section } from '../components/ui/Section';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Seo } from '../components/ui/Seo';
import { getSiteData, CaseItem, Tag } from '../services/siteDataService';
import { useLanguage } from '../context/LanguageContext';
import { trackCaseView } from '../lib/analytics';
import { useLocalizedLink } from '../lib/useLocalizedLink';
import { generateSlug } from '../lib/slugify';

const CaseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const [caseItem, setCaseItem] = useState<CaseItem | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const casesLink = useLocalizedLink('/cases');

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      try {
        const { cases, tags } = await getSiteData();
        // Find by matching slug (without ID)
        const foundCase = cases.find((c) => {
          const caseTitle = c.title || c.description?.replace(/<[^>]+>/g, ' ').slice(0, 50) || 'case';
          const caseSlug = generateSlug(caseTitle);
          return caseSlug === slug;
        }) || null;
        
        setCaseItem(foundCase);
        setTags(tags);
        
        // Track case view
        if (foundCase) {
          trackCaseView(foundCase.id, foundCase.title || 'Case');
        }
      } catch (e) {
        console.error('Failed to load case detail from Firestore', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white">Loading…</div>;
  }

  if (!caseItem) {
    return <Navigate to={`/${language}/cases`} replace />;
  }

  const tagsMap = new Map<string, Tag>();
  tags.forEach((t) => tagsMap.set(t.id, t));
  const resolvedTags = caseItem.tags?.map((tid) => tagsMap.get(tid)).filter(Boolean) as Tag[];
  
  // Создаем excerpt из description (убираем HTML, обрезаем до 200 символов)
  const caseExcerpt = caseItem.description
    ? caseItem.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200) + (caseItem.description.replace(/<[^>]+>/g, ' ').length > 200 ? '...' : '')
    : '';

  const caseTitle = caseItem.title || caseItem.description?.replace(/<[^>]+>/g, ' ').slice(0, 50) || 'Кейс';
  
  // Формируем description для SEO (гарантируем, что он не пустой)
  const caseDescription = caseItem.description?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || '';
  const seoDescription = caseDescription.length > 0 
    ? caseDescription.slice(0, 160) + (caseDescription.length > 160 ? '...' : '')
    : `Кейс проекта ${caseTitle} от Типа агентство. ${caseItem.clientName ? `Клиент: ${caseItem.clientName}. ` : ''}Digital-решения для бизнеса в Узбекистане.`;

  return (
    <>
      <Seo
        title={`${caseTitle} | Кейс от Типа агентство`}
        description={seoDescription}
        image={caseItem.imageUrl ? `https://tipa.uz${caseItem.imageUrl}` : undefined}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: caseTitle,
          description: seoDescription,
          image: caseItem.imageUrl ? `https://tipa.uz${caseItem.imageUrl}` : undefined,
          creator: {
            '@type': 'Organization',
            name: 'Типа агентство',
            url: 'https://tipa.uz'
          },
          datePublished: caseItem.createdAt,
          ...(caseItem.clientName && {
            client: {
              '@type': 'Organization',
              name: caseItem.clientName
            }
          }),
          ...(caseItem.websiteUrl && {
            url: caseItem.websiteUrl
          })
        }}
      />

      <section className="relative pt-32 pb-16 bg-dark">
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumbs customTitle={caseTitle} />

          {/* Layout: Фото и заголовок рядом */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 items-start">
            {/* Левая колонка: Галерея изображений */}
            {(caseItem.imageUrl || (caseItem.galleryImages && caseItem.galleryImages.length > 0)) ? (
              <div className="order-2 lg:order-1">
                {/* Главное изображение */}
                {caseItem.imageUrl && (
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black mb-4">
                    <img
                      src={caseItem.imageUrl}
                      alt={`Кейс ${caseTitle} от Типа агентство`}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                )}
                {/* Галерея дополнительных изображений */}
                {caseItem.galleryImages && caseItem.galleryImages.length > 0 && (
                  <div className={`grid gap-4 ${caseItem.galleryImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {caseItem.galleryImages.map((img, idx) => (
                      <div key={idx} className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black">
                        <img
                          src={img}
                          alt={`${caseTitle} - изображение ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="order-2 lg:order-1"></div>
            )}

            {/* Правая колонка: Заголовок или Фото */}
            <div className="order-1 lg:order-2 flex flex-col justify-center">
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                {caseTitle}
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
          <div className="max-w-5xl mx-auto">
            <style dangerouslySetInnerHTML={{__html: `
              .case-content { }
              .case-hero-section { margin-bottom: 4rem; }
              .case-hero-section .lead { font-size: 1.25rem; line-height: 1.8; color: #d1d5db; margin-top: 1.5rem; }
              .case-section { margin-bottom: 4rem; }
              .case-section h3 { font-size: 2rem; font-weight: bold; color: white; margin-bottom: 2rem; font-family: var(--font-display); }
              .case-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 2rem; }
              .info-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 2rem; transition: all 0.3s; }
              .info-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(78,205,196,0.3); transform: translateY(-4px); }
              .info-icon { font-size: 3rem; margin-bottom: 1rem; }
              .info-card h3 { font-size: 1.5rem; font-weight: bold; color: white; margin-bottom: 1rem; font-family: var(--font-display); }
              .info-card p { color: #9ca3af; line-height: 1.7; }
              .problem-solution { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem; }
              .problem-box, .solution-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 2rem; }
              .problem-box { border-left: 4px solid #ef4444; }
              .solution-box { border-left: 4px solid #4ECDC4; }
              .problem-box h4, .solution-box h4 { font-size: 1.25rem; font-weight: bold; color: white; margin-bottom: 1rem; font-family: var(--font-display); }
              .problem-box ul, .solution-box ul { list-style: none; padding: 0; }
              .problem-box li, .solution-box li { color: #d1d5db; line-height: 1.8; margin-bottom: 0.75rem; padding-left: 1.5rem; position: relative; }
              .problem-box li:before { content: "✗"; position: absolute; left: 0; color: #ef4444; font-weight: bold; }
              .solution-box li:before { content: "✓"; position: absolute; left: 0; color: #4ECDC4; font-weight: bold; }
              .process-steps { display: flex; flex-direction: column; gap: 2rem; }
              .step { display: flex; gap: 2rem; align-items: flex-start; }
              .step-number { font-size: 4rem; font-weight: 900; color: #4ECDC4; line-height: 1; font-family: var(--font-display); opacity: 0.3; min-width: 80px; }
              .step-content h4 { font-size: 1.5rem; font-weight: bold; color: white; margin-bottom: 0.75rem; font-family: var(--font-display); }
              .step-content p { color: #d1d5db; line-height: 1.8; }
              .case-section.highlight { background: linear-gradient(135deg, rgba(78,205,196,0.1) 0%, rgba(51,55,173,0.1) 100%); border-left: 4px solid #4ECDC4; padding: 2rem; border-radius: 1rem; }
              .result-text { font-size: 1.25rem; line-height: 1.8; color: #e5e7eb; font-weight: 500; }
              @media (max-width: 768px) {
                .case-info-grid { grid-template-columns: 1fr; }
                .problem-solution { grid-template-columns: 1fr; }
                .step { flex-direction: column; gap: 1rem; }
                .step-number { font-size: 3rem; }
              }
            `}} />
            <div
              className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-white prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4 prose-li:text-gray-300 prose-ul:list-disc prose-ol:list-decimal prose-strong:text-white prose-strong:font-bold"
              dangerouslySetInnerHTML={{ __html: caseItem.description }}
            />
          </div>
        </Section>
      )}

      <section className="py-24 text-center">
        <Link
          to={casesLink}
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