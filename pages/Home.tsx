import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES_DATA, Icons } from '../constants';
import { Section, SectionTitle } from '../components/ui/Section';
import { useLanguage } from '../context/LanguageContext';
import { Partners } from '../components/ui/Partners';
import { ServiceMarquee } from '../components/ui/ServiceMarquee';
import { HeroBackground } from '../components/ui/HeroBackground';
import { useModal } from '../context/ModalContext';
import { NewsCard, NewsCardItem } from '../components/ui/NewsCard';
import { getSiteData, News as FirebaseNews, Tag, CaseItem } from '../services/siteDataService';
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

const Home: React.FC = () => {
  const { t, getLocalized } = useLanguage();
  const { openModal } = useModal();
  const [latestNews, setLatestNews] = useState<NewsCardItem[]>([]);
  const [latestCases, setLatestCases] = useState<CaseItem[]>([]);
  const [tagsMap, setTagsMap] = useState<Map<string, Tag>>(new Map());

  useEffect(() => {
    const load = async () => {
      try {
        const { news, cases, tags } = await getSiteData();
        const tagsMapInstance = new Map<string, Tag>();
        tags.forEach((tag) => tagsMapInstance.set(tag.id, tag));
        setTagsMap(tagsMapInstance);

        const mapped: NewsCardItem[] = news.slice(0, 3).map((n) => ({
          id: n.id,
          title: n.title,
          excerpt: buildExcerpt(n),
          imageUrl: n.imageUrl,
          date: formatDate(n.publishedAt || n.createdAt),
          tags: n.tags?.map((id) => tagsMapInstance.get(id)).filter(Boolean) as Tag[],
        }));
        setLatestNews(mapped);

        // Load first 2 cases
        setLatestCases(cases.slice(0, 2));
      } catch (e) {
        console.error('Failed to load data from Firestore', e);
      }
    };
    load();
  }, []);

  return (
    <>
      <Seo 
        title={t('home.seo_title')}
        description={t('home.seo_desc')}
        structuredData={{
          '@type': 'Organization',
          name: 'Типа агентство',
          url: 'https://tipa.uz',
          logo: 'https://tipa.uz/favicon.svg',
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+998-88-800-05-49',
            contactType: 'customer service',
            areaServed: 'UZ',
            availableLanguage: ['ru', 'uz', 'en']
          },
          sameAs: [
            'https://t.me/tipa_agency',
            'https://www.instagram.com/tipa_agency/'
          ],
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Ташкент',
            addressCountry: 'UZ'
          }
        }}
      />
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 overflow-hidden bg-dark">
        <HeroBackground />

        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl">
            <div className="flex items-center gap-4 mb-8">
                <span className="flex h-2 w-2 rounded-full bg-accent-turquoise animate-ping"></span>
                <span className="font-display text-sm tracking-widest uppercase text-gray-400">{t('home.subtitle')}</span>
            </div>
            
            <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-9xl text-white leading-[0.9] tracking-tighter mb-10 uppercase">
              {t('hero.title_1')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-primary to-primary-dark drop-shadow-2xl">
                {t('hero.title_2')}
              </span>
            </h1>
            
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
                <div className="max-w-xl border-l border-white/10 pl-6">
                    <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-6">
                        {t('home.hero_text')}
                    </p>
                </div>
                
                {/* HERO BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
                   <button 
                     onClick={() => {
                       trackCTAClick('start_project', 'home_hero');
                       openModal('home-hero');
                     }}
                     className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-primary to-[#4B4FA8] text-white font-display font-bold uppercase tracking-wider text-sm overflow-hidden shadow-[0_0_40px_-10px_rgba(51,55,173,0.5)] hover:shadow-[0_0_60px_-10px_rgba(51,55,173,0.8)] transition-all duration-300 transform hover:-translate-y-1 whitespace-nowrap text-center"
                   >
                     <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                     <span className="relative z-10 flex items-center justify-center gap-3">
                        {t('home.cta_primary')}
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                     </span>
                   </button>
                   
                   <Link 
                     to="/cases" 
                     className="group relative px-10 py-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white font-display font-bold uppercase tracking-wider text-sm overflow-hidden hover:bg-white/10 transition-all duration-300 whitespace-nowrap text-center"
                   >
                     <span className="relative z-10">{t('home.cta_secondary')}</span>
                   </Link>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLUE STRIP MARQUEE */}
      <ServiceMarquee />

      {/* SERVICES BENTO GRID */}
      <Section id="services">
        <SectionTitle 
          subtitle={t('home.services_sub')}
          title={t('home.services_title')}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {SERVICES_DATA.slice(0, 7).map((service, index) => (
                <Link 
                    to={`/services/${service.id}`}
                    key={service.id} 
                    className={`group bg-dark-surface border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden hover:border-primary/50 transition-colors ${index === 0 || index === 3 ? 'md:col-span-2' : ''}`}
                >
                    <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full opacity-20 group-hover:opacity-30 transition-all bg-primary`}></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="mb-8">
                            <div className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-6 ${service.accentColor}`}>
                                {service.icon}
                            </div>
                            <h3 className="font-display font-bold text-2xl md:text-3xl mb-4">{getLocalized(service.title)}</h3>
                            <p className="text-gray-400 max-w-md">{getLocalized(service.shortDescription)}</p>
                        </div>
                        {index === 0 && (
                            <div className="flex gap-2 flex-wrap">
                                {['React', 'Python', 'UX/UI', 'Highload'].map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full border border-white/10 text-xs text-gray-500">{tag}</span>
                                ))}
                            </div>
                        )}
                        
                        {/* Always show Read More link/arrow now */}
                        <div className="inline-flex items-center font-bold uppercase tracking-wider text-sm mt-8 group-hover:text-white text-gray-500 transition-colors">
                            {t('common.read_more')} <span className={`ml-2 text-xl transition-transform group-hover:translate-x-2 ${service.accentColor}`}>→</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
        
        <div className="mt-12 text-center">
            <Link to="/services" className="inline-block px-8 py-4 border border-white/10 rounded-full hover:bg-white hover:text-dark transition-all font-display font-medium text-sm tracking-widest uppercase">
                {t('home.all_services')}
            </Link>
        </div>
      </Section>

      {/* WHY US (NEW BENTO GRID) */}
      <Section className="relative">
         <SectionTitle title={t('home.why_title')} />
         
         <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
             {/* Card 1: KPI */}
             <div className="md:col-span-7 bg-gradient-to-br from-[#1a1a1a] to-dark-surface border border-white/5 rounded-3xl p-10 relative group overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Icons.Chart />
                 </div>
                 <h3 className="text-3xl font-display font-bold mb-4 text-white">{t('home.why_1_head')}</h3>
                 <p className="text-gray-400 text-lg">{t('home.why_1_desc')}</p>
             </div>

             {/* Card 2: Speed */}
             <div className="md:col-span-5 bg-gradient-to-br from-[#1a1a1a] to-dark-surface border border-white/5 rounded-3xl p-10 relative group overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-accent-turquoise">
                     <Icons.Bolt />
                 </div>
                 <h3 className="text-3xl font-display font-bold mb-4 text-accent-turquoise">{t('home.why_2_head')}</h3>
                 <p className="text-gray-400 text-lg">{t('home.why_2_desc')}</p>
             </div>

             {/* Card 3: System */}
             <div className="md:col-span-5 bg-primary/10 border border-primary/20 rounded-3xl p-10 relative group overflow-hidden">
                 <h3 className="text-3xl font-display font-bold mb-4 text-primary">{t('home.why_3_head')}</h3>
                 <p className="text-gray-300 text-lg">{t('home.why_3_desc')}</p>
             </div>

             {/* Card 4: Transparency */}
             <div className="md:col-span-7 bg-gradient-to-br from-[#1a1a1a] to-dark-surface border border-white/5 rounded-3xl p-10 relative group overflow-hidden flex flex-col justify-between">
                 <div>
                    <h3 className="text-3xl font-display font-bold mb-4 text-white">{t('home.why_4_head')}</h3>
                    <p className="text-gray-400 text-lg">{t('home.why_4_desc')}</p>
                 </div>
                 <div className="mt-8 flex gap-8 border-t border-white/5 pt-8">
                     <div>
                         <div className="text-2xl font-bold text-white mb-1">24/7</div>
                         <div className="text-xs text-gray-500 uppercase">Support</div>
                     </div>
                     <div>
                         <div className="text-2xl font-bold text-white mb-1">100%</div>
                         <div className="text-xs text-gray-500 uppercase">Access</div>
                     </div>
                 </div>
             </div>
         </div>
      </Section>

      {/* PARTNERS MARQUEE */}
      <Partners />

      {/* CASES PREVIEW */}
      <Section>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <SectionTitle title={t('home.cases_title')} />
            <Link to="/cases" className="mb-24 hidden md:inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold">
                {t('home.cases_link')} <span className="text-xl">→</span>
            </Link>
        </div>

        <div className="space-y-24">
            {latestCases.length > 0 ? (
                latestCases.map((item, index) => {
                    const caseTags = item.tags?.map((id) => tagsMap.get(id)).filter(Boolean) as Tag[] || [];
                    const descriptionText = item.description?.replace(/<[^>]+>/g, ' ').slice(0, 200).trim() + '…' || '';
                    
                    return (
                        <Link 
                            key={item.id} 
                            to={`/cases/${item.id}`}
                            className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-24 items-center group block`}
                        >
                            <div className="w-full md:w-3/5">
                                <div className="aspect-[16/10] overflow-hidden rounded-lg bg-gray-800 relative">
                                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    {item.imageUrl ? (
                                        <img 
                                            src={item.imageUrl} 
                                            alt={`Кейс ${item.title} от Типа агентство`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0" 
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500">
                                            No image
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full md:w-2/5">
                                <div className="flex gap-2 mb-6 flex-wrap">
                                    {caseTags.map(tag => (
                                        <span 
                                            key={tag.id} 
                                            className="text-accent-turquoise text-xs font-bold uppercase tracking-wider border border-accent-turquoise/20 px-2 py-1 rounded"
                                            style={tag.color ? { borderColor: tag.color, color: tag.color } : {}}
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="font-display font-bold text-3xl md:text-4xl mb-6 leading-tight group-hover:text-primary transition-colors">
                                    {item.title || item.description?.replace(/<[^>]+>/g, ' ').slice(0, 60).trim() || t('home.no_title')}
                                </h3>
                                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                    {descriptionText}
                                </p>
                            </div>
                        </Link>
                    );
                })
            ) : (
                <div className="text-center py-12 text-gray-500">
                    {t('home.loading_cases')}
                </div>
            )}
        </div>
      </Section>

      {/* NEWS PREVIEW */}
      <Section className="bg-[#0A0A0A]">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <SectionTitle title={t('home.news_title')} />
              <Link to="/news" className="mb-24 hidden md:inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold">
                  {t('home.news_link')} <span className="text-xl">→</span>
              </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
      </Section>

      {/* CTA FOOTER */}
      <section className="py-32 relative overflow-hidden">
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
                  trackCTAClick('start_project', 'home_cta_section');
                  openModal('home-cta');
                }}
                className="inline-block bg-primary hover:bg-white hover:text-dark text-white px-12 py-6 rounded-full font-display font-bold text-lg tracking-wider transition-all duration-300 hover:scale-105 shadow-[0_0_50px_-15px_rgba(51,55,173,0.5)]"
              >
                  {t('home.cta_button')}
              </button>
          </div>
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </section>
    </>
  );
};

export default Home;