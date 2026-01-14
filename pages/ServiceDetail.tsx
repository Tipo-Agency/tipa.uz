import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { SERVICES_DATA, CASES_DATA, SERVICE_FAQ_DATA, Icons } from '../constants';
import { Section, SectionTitle } from '../components/ui/Section';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { useModal } from '../context/ModalContext';
import { FAQSection } from '../components/ui/FAQ';
import { Seo } from '../components/ui/Seo';
import { getSiteData, CaseItem, Tag } from '../services/siteDataService';
import { trackServiceView, trackCTAClick } from '../lib/analytics';
import { useLocalizedLink, getLocalizedLink, getCaseLink } from '../lib/useLocalizedLink';

// --- Shared Components ---

const PricingCard: React.FC<{
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  accentColor: string;
  openModal: (sourceSection?: string) => void;
  sourceSection: string;
  icon: React.ReactNode;
}> = ({ title, price, features, isPopular, accentColor, openModal, sourceSection, icon }) => {
  const { t } = useLanguage();
  
  return (
    <div className={`relative flex flex-col p-8 rounded-3xl border ${isPopular ? 'bg-white/5 border-primary shadow-[0_0_30px_rgba(51,55,173,0.15)]' : 'bg-dark-surface border-white/5'} hover:border-white/20 transition-all duration-300 group h-full`}>
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full z-20">
          {t('common.popular')}
        </div>
      )}
      <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center bg-white/5 ${accentColor}`}>
          {icon}
      </div>
      <h3 className="font-display font-bold text-2xl text-white mb-2">{title}</h3>
      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-sm text-gray-400">{t('common.from')}</span>
        <span className={`text-3xl font-display font-bold ${accentColor.replace('text-', 'text-')}`}>{price}</span>
        <span className="text-sm text-gray-500">{t('common.currency')}</span>
      </div>
      
      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start text-sm text-gray-300">
            <span className={`mr-3 mt-1 ${accentColor}`}>✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <button 
        onClick={() => {
          trackCTAClick('order_service', sourceSection || 'pricing_card');
          openModal(sourceSection);
        }}
        className={`w-full py-4 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${isPopular ? 'bg-primary text-white hover:bg-white hover:text-dark' : 'bg-white/10 text-white hover:bg-white hover:text-dark'}`}
      >
        {t('common.order')}
      </button>
    </div>
  );
};

// --- 1. WEB SPECIAL VIEW ---
const WebSpecialView: React.FC<{ service: typeof SERVICES_DATA[0] }> = ({ service }) => {
  const { openModal } = useModal();
  const { t, language } = useLanguage();
  const [webCases, setWebCases] = useState<CaseItem[]>([]);
  const [tagsMap, setTagsMap] = useState<Map<string, Tag>>(new Map());
  const casesLink = useLocalizedLink('/cases');
  const [loadingCases, setLoadingCases] = useState(true);
  
  useEffect(() => {
    const loadCases = async () => {
      try {
        const { cases, tags } = await getSiteData();
        const tagsMapInstance = new Map<string, Tag>();
        tags.forEach((tag) => tagsMapInstance.set(tag.id, tag));
        setTagsMap(tagsMapInstance);
        
        // Фильтруем кейсы по тегу "Сайты и сервисы" (tag-1768292301321)
        const websiteTagId = 'tag-1768292301321';
        const filtered = cases
          .filter((c) => c.tags?.includes(websiteTagId))
          .slice(0, 3);
        
        setWebCases(filtered);
      } catch (e) {
        console.error('Failed to load web cases from Firestore', e);
      } finally {
        setLoadingCases(false);
      }
    };
    loadCases();
  }, []);

  const siteTypes = [
      {
          title: "Landing Page",
          desc: t('service.web.landing_desc'),
          target: t('service.web.landing_target'),
          icon: <Icons.Web />
      },
      {
          title: t('service.web.corporate_title'),
          desc: t('service.web.corporate_desc'),
          target: t('service.web.corporate_target'),
          icon: <Icons.Brand />
      },
      {
          title: "E-commerce",
          desc: t('service.web.ecommerce_desc'),
          target: t('service.web.ecommerce_target'),
          icon: <Icons.Chart />
      },
      {
          title: t('service.web.mvp_title'),
          desc: t('service.web.mvp_desc'),
          target: t('service.web.mvp_target'),
          icon: <Icons.Bolt />
      }
  ];

  return (
    <>
      <Seo 
        title="Разработка сайтов и веб-приложений | Типа агентство"
        description="Разработка сайтов, веб-приложений и AI-систем от Типа агентство. Landing Page, интернет-магазины, корпоративные порталы, веб-сервисы. Интеграция с CRM, чат-боты, SEO-оптимизация."
        structuredData={{
          '@type': 'Service',
          serviceType: 'Web Development',
          provider: {
            '@type': 'Organization',
            name: 'Типа агентство'
          },
          areaServed: {
            '@type': 'Country',
            name: 'Uzbekistan'
          },
          offers: {
            '@type': 'Offer',
            name: 'Web Development Services',
            description: service.shortDescription.ru
          }
        }}
      />
       {/* HERO WEB SPECIAL */}
       <section className="relative pt-32 pb-20 bg-dark overflow-hidden min-h-[85vh] flex flex-col justify-center">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-screen"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/90 to-dark"></div>
          <div className="absolute top-1/4 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse-glow"></div>

          <div className="container mx-auto px-4 relative z-10">
              <Breadcrumbs />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-8">
                  <div className="max-w-3xl">
                      <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl mb-8 text-white leading-[0.95] uppercase">
                          {t('service.web.hero_title')} <br/>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-sky to-accent-turquoise">{t('service.web.hero_subtitle')}</span>
                      </h1>
                      
                      <p className="text-xl md:text-2xl text-gray-300 leading-relaxed border-l-4 border-primary pl-6 mb-10">
                          {t('service.web.hero_desc')}
                      </p>
                      
                      <div className="flex flex-wrap gap-4">
                          <button 
                            onClick={() => openModal(`service-${service.id}-pricing`)}
                            className="px-10 py-5 bg-white text-dark font-display font-bold uppercase tracking-wider rounded-full hover:bg-primary hover:text-white transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                          >
                              {t('common.calculate_project')}
                          </button>
                      </div>
                  </div>

                  {/* HERO INFOGRAPHIC */}
                  <div className="hidden lg:block relative h-[500px] w-full">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-primary/20 to-accent-turquoise/20 rounded-full blur-[60px] animate-pulse"></div>
                      
                      {/* Card 1: Traffic Source */}
                      <div className="absolute top-10 left-10 bg-dark-surface/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl w-48 animate-float shadow-xl z-20">
                          <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-full bg-accent-sky/20 text-accent-sky flex items-center justify-center"><Icons.Users /></div>
                              <span className="text-xs font-bold text-gray-400 uppercase">Traffic</span>
                          </div>
                          <div className="h-1 w-full bg-white/10 rounded overflow-hidden">
                              <div className="h-full w-[80%] bg-accent-sky animate-pulse"></div>
                          </div>
                      </div>

                      {/* Card 2: AI Core */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark/90 backdrop-blur-xl border border-primary p-8 rounded-3xl w-64 text-center shadow-[0_0_50px_rgba(51,55,173,0.3)] z-10">
                          <div className="w-16 h-16 mx-auto bg-primary text-white rounded-xl flex items-center justify-center mb-4 text-3xl shadow-lg">
                              <Icons.Bot />
                          </div>
                          <h3 className="font-display font-bold text-white text-lg">AI CORE</h3>
                          <p className="text-xs text-gray-400 mt-2">Processing & Analytics</p>
                      </div>

                      {/* Card 3: Profit */}
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white text-dark p-6 rounded-2xl w-52 animate-float-delayed shadow-2xl border border-white/50 z-20">
                           <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center"><Icons.Chart /></div>
                              <span className="text-xs font-bold text-gray-600 uppercase">Revenue</span>
                          </div>
                          <div className="text-3xl font-display font-bold text-dark">+150%</div>
                      </div>
                  </div>
              </div>
          </div>
       </section>

       {/* AI & BOTS SECTION */}
       <Section>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div>
                   <SectionTitle 
                      title={t('service.web.web3_title')} 
                      subtitle={t('service.web.web3_subtitle')}
                   />
                   <div className="space-y-6 text-lg text-gray-300">
                       <p>
                           {t('service.web.web3_desc')}
                       </p>
                       <ul className="space-y-4 mt-8">
                           <li className="flex items-start gap-4">
                               <div className="w-10 h-10 rounded-xl bg-accent-amethyst/20 text-accent-amethyst flex items-center justify-center shrink-0">
                                   <Icons.Bot />
                               </div>
                               <div>
                                   <h4 className="font-bold text-white text-lg">{t('service.web.smart_bots')}</h4>
                                   <p className="text-sm text-gray-400">{t('service.web.smart_bots_desc')}</p>
                               </div>
                           </li>
                           <li className="flex items-start gap-4">
                               <div className="w-10 h-10 rounded-xl bg-accent-sky/20 text-accent-sky flex items-center justify-center shrink-0">
                                   <Icons.Bolt />
                               </div>
                               <div>
                                   <h4 className="font-bold text-white text-lg">{t('service.web.ai_integration')}</h4>
                                   <p className="text-sm text-gray-400">{t('service.web.ai_integration_desc')}</p>
                               </div>
                           </li>
                       </ul>
                   </div>
               </div>
               
               {/* FLOW DIAGRAM */}
               <div className="relative">
                   <div className="relative bg-dark-surface border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden flex flex-col justify-center gap-6 min-h-[400px]">
                       <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 w-fit">
                           <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">👤</div>
                           <div>
                               <div className="text-sm font-bold text-white">{t('service.web.client')}</div>
                               <div className="text-xs text-gray-500">{t('service.web.client_writes')}</div>
                           </div>
                       </div>
                       <div className="pl-9 text-gray-600">
                           <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                       </div>
                       <div className="flex items-center gap-6 bg-gradient-to-r from-primary/20 to-accent-amethyst/20 p-6 rounded-2xl border border-primary/30 w-full relative overflow-hidden">
                           <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
                           <div className="relative z-10 w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-2xl shadow-lg">🧠</div>
                           <div className="relative z-10">
                               <div className="font-display font-bold text-white text-lg">{t('service.web.ai_analysis')}</div>
                               <div className="text-sm text-gray-300">{t('service.web.ai_analysis_desc')}</div>
                           </div>
                       </div>
                       <div className="pl-9 text-gray-600">
                           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                       </div>
                       <div className="flex justify-between gap-4">
                           <div className="flex-1 bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                               <div className="text-xs font-bold text-green-500 uppercase mb-1">CRM</div>
                               <div className="text-sm text-white">{t('service.web.deal_created')}</div>
                           </div>
                           <div className="flex-1 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                               <div className="text-xs font-bold text-blue-500 uppercase mb-1">Bot</div>
                               <div className="text-sm text-white">{t('service.web.client_recorded')}</div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </Section>

       {/* SITE TYPES SECTION */}
       <Section className="bg-dark">
           <SectionTitle 
              title={t('service.web.what_build')} 
              subtitle={t('service.web.types_subtitle')}
           />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {siteTypes.map((type, idx) => (
                   <div key={idx} className="group bg-dark-surface border border-white/5 hover:border-white/20 p-8 rounded-3xl transition-colors">
                       <div className="flex justify-between items-start mb-6">
                           <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                               {type.icon}
                           </div>
                           <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                               {type.target}
                           </span>
                       </div>
                       <h3 className="font-display font-bold text-2xl text-white mb-4">{type.title}</h3>
                       <p className="text-gray-400 leading-relaxed mb-6">
                           {type.desc}
                       </p>
                       <div className="w-full h-px bg-white/5 group-hover:bg-primary/50 transition-colors"></div>
                   </div>
               ))}
           </div>
       </Section>

       {/* PRICING SECTION */}
       <Section id="pricing" className="bg-dark-surface">
           <SectionTitle title={t('service.web.pricing_title')} subtitle={t('service.web.pricing_subtitle')} centered />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
               <PricingCard 
                  title="Landing Page" price="2 000 000" accentColor="text-accent-coral" icon={<Icons.Web />} openModal={openModal}
                  sourceSection={`service-${service.id}-pricing-landing`}
                  features={t('service.web.landing_features').split('\n')}
               />
               <PricingCard 
                  title={t('service.web.corporate_pricing_title')} price="5 000 000" accentColor="text-primary" isPopular icon={<Icons.Brand />} openModal={openModal}
                  sourceSection={`service-${service.id}-pricing-corporate`}
                  features={t('service.web.corporate_features').split('\n')}
               />
               <PricingCard 
                  title="E-commerce" price="10 000 000" accentColor="text-accent-turquoise" icon={<Icons.Auto />} openModal={openModal}
                  sourceSection={`service-${service.id}-pricing-ecommerce`}
                  features={t('service.web.ecommerce_features').split('\n')}
               />
           </div>
           <div className="mt-12 text-center">
               <p className="text-gray-400 text-sm mb-4">{t('service.web.complex_portal')}</p>
               <button onClick={() => openModal(`service-${service.id}-custom`)} className="text-white border-b border-primary hover:text-primary transition-colors">
                   {t('common.calculate_individual')}
               </button>
           </div>
       </Section>

       {/* CASES SECTION */}
       <Section>
           <div className="flex flex-col md:flex-row justify-between items-end mb-16">
               <SectionTitle title={t('service.web.facts_title')} subtitle={t('service.web.facts_subtitle')} />
               <Link to={casesLink} className="mb-24 hidden md:inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-sm font-bold">
                    {t('common.all_cases')} <span className="text-xl">→</span>
               </Link>
           </div>
           {loadingCases ? (
               <div className="text-center py-20 text-gray-500">{t('service.web.loading_cases')}</div>
           ) : webCases.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {webCases.map((item) => {
                       const caseTags = item.tags?.map((id) => tagsMap.get(id)).filter(Boolean) as Tag[] || [];
                       const descriptionText = item.description?.replace(/<[^>]+>/g, ' ').slice(0, 100).trim() + '…' || '';
                       
                       return (
                           <Link to={getCaseLink(item, language)} key={item.id} className="group block bg-dark-surface rounded-[2rem] overflow-hidden border border-white/5 hover:border-white/20 transition-colors">
                               <div className="relative aspect-[4/3] overflow-hidden">
                                   {item.imageUrl ? (
                                       <img 
                                           src={item.imageUrl} 
                                           alt={`Кейс ${item.title || 'от Типа агентство'}`} 
                                           className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                           loading="lazy"
                                       />
                                   ) : (
                                       <div className="w-full h-full bg-gradient-to-br from-dark via-primary/10 to-dark flex items-center justify-center text-gray-500">
                                           No image
                                       </div>
                                   )}
                               </div>
                               <div className="p-8">
                                   {caseTags.length > 0 && (
                                       <div className="flex gap-2 mb-3 flex-wrap">
                                           {caseTags.map(tag => (
                                               <span
                                                   key={tag.id}
                                                   className="text-xs font-bold uppercase tracking-wider border px-2 py-1 rounded"
                                                   style={tag.color ? { borderColor: tag.color, color: tag.color } : { borderColor: '#ff6c6f', color: '#ff6c6f' }}
                                               >
                                                   {tag.name}
                                               </span>
                                           ))}
                                       </div>
                                   )}
                                   <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                       {item.title || descriptionText}
                                   </h3>
                                   <div className="flex items-center text-accent-turquoise text-xs font-bold uppercase tracking-widest">{t('common.view_case')}</div>
                               </div>
                           </Link>
                       );
                   })}
               </div>
           ) : (
               <div className="text-center py-20 text-gray-500">{t('common.no_cases')}</div>
           )}
       </Section>

       {/* FAQ SECTION */}
       <FAQSection data={SERVICE_FAQ_DATA['web']} />

       {/* FINAL CTA BLOCK */}
       <section className="py-32 relative overflow-hidden bg-gradient-to-b from-dark to-[#0a0a0a] border-t border-white/5">
          <div className="container mx-auto px-4 text-center relative z-10">
              <h2 className="font-display font-bold text-5xl md:text-8xl text-white mb-8 tracking-tighter uppercase">
                  {t('service.web.cta_discuss_title')} <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-primary to-primary-dark drop-shadow-2xl">{t('service.web.cta_discuss_subtitle')}</span>
              </h2>
              <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12">
                  {t('service.web.enough_title')} {t('service.web.enough_desc')}
              </p>
              <button 
                onClick={() => openModal(`service-${service.id}-pricing`)}
                className="inline-block bg-primary hover:bg-white hover:text-dark text-white px-12 py-6 rounded-full font-display font-bold text-lg tracking-wider transition-all duration-300 hover:scale-105 shadow-[0_0_50px_-15px_rgba(51,55,173,0.5)]"
              >
                  {t('common.submit_request')}
              </button>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
       </section>
    </>
  );
};

// --- 2. SMM SPECIAL VIEW ---
const SmmSpecialView: React.FC<{ service: typeof SERVICES_DATA[1] }> = ({ service }) => {
  const { openModal } = useModal();
  const { t } = useLanguage();
    const [selectedImage, setSelectedImage] = useState<{src: string, title: string} | null>(null);
    const [smmCases, setSmmCases] = useState<CaseItem[]>([]);
    const [tagsMap, setTagsMap] = useState<Map<string, Tag>>(new Map());
    const [loadingCases, setLoadingCases] = useState(true);
    
    useEffect(() => {
        const loadCases = async () => {
            try {
                const { cases, tags } = await getSiteData();
                const tagsMapInstance = new Map<string, Tag>();
                tags.forEach((tag) => tagsMapInstance.set(tag.id, tag));
                setTagsMap(tagsMapInstance);
                
                // Фильтруем кейсы по тегу "SMM и контент" (tag-1768292360988)
                const smmTagId = 'tag-1768292360988';
                const filtered = cases
                    .filter((c) => c.tags?.includes(smmTagId))
                    .slice(0, 3);
                
                setSmmCases(filtered);
            } catch (e) {
                console.error('Failed to load SMM cases from Firestore', e);
            } finally {
                setLoadingCases(false);
            }
        };
        loadCases();
    }, []);
    const galleryImages = [
        { src: "/new1.jpg", title: "" },
        { src: "/new2.jpg", title: "" },
        { src: "/new3.jpg", title: "" },
        { src: "/new4.JPG", title: "" },
        { src: "/new5.JPG", title: "" },
        { src: "/new6.JPG", title: "" }
    ];
    const team = [
        { role: t('service.smm.team_pm'), desc: t('service.smm.team_pm_desc'), icon: <Icons.Users /> },
        { role: t('service.smm.team_mobile'), desc: t('service.smm.team_mobile_desc'), icon: <Icons.SMM /> },
        { role: t('service.smm.team_designer'), desc: t('service.smm.team_designer_desc'), icon: <Icons.Brand /> },
        { role: t('service.smm.team_cm'), desc: t('service.smm.team_cm_desc'), icon: <Icons.Bot /> }
    ];
  
    return (
      <>
        <Seo 
          title="SMM и контент-маркетинг | Типа агентство"
          description="SMM и контент-маркетинг от Типа агентство. Стратегия, контент-план, съемка фото/видео, копирайтинг, постинг, модерация, таргет. Развиваем бренд в соцсетях и превращаем подписчиков в клиентов."
          structuredData={{
            '@type': 'Service',
            serviceType: 'Social Media Marketing',
            provider: {
              '@type': 'Organization',
              name: 'Типа агентство'
            }
          }}
        />
         {selectedImage && (
             <div className="fixed inset-0 z-[200] bg-dark/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedImage(null)}>
                 <div className="max-w-4xl w-full max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
                     <img src={selectedImage.src} alt={selectedImage.title} className="w-full h-full object-contain rounded-lg shadow-2xl" />
                 </div>
             </div>
         )}
         <section className="relative pt-24 pb-20 bg-dark overflow-hidden min-h-[75vh] flex flex-col justify-center">
            <div className="absolute inset-0 bg-gradient-to-b from-dark via-[#1a0b2e] to-dark"></div>
            <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-accent-turquoise/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="container mx-auto px-4 relative z-10">
                <Breadcrumbs />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-8">
                    <div className="max-w-3xl">
                        <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl mb-8 text-white leading-[0.95] uppercase">
                            {t('service.smm.activation_title')} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-turquoise via-white to-accent-amethyst">{t('service.smm.activation_subtitle')}</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed border-l-4 border-accent-turquoise pl-6 mb-10">
                            {t('service.smm.activation_desc')}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => openModal(`service-${service.id}-cta`)} className="px-10 py-5 bg-white text-dark font-display font-bold uppercase tracking-wider rounded-full hover:bg-accent-turquoise hover:text-white transition-all hover:scale-105 shadow-[0_0_30px_rgba(78,205,196,0.3)]">
                                {t('common.discuss_strategy')}
                            </button>
                        </div>
                    </div>
                    
                    {/* SMM VISUAL */}
                    <div className="hidden lg:block relative h-[500px] w-full">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-accent-turquoise/20 to-accent-amethyst/20 rounded-full blur-[60px] animate-pulse"></div>
                        
                        {/* Instagram Post Mockup */}
                        <div className="absolute top-10 right-10 bg-dark-surface/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-64 animate-float shadow-xl z-20">
                            <div className="aspect-square bg-gradient-to-br from-accent-turquoise/20 to-accent-amethyst/20 rounded-xl mb-3 flex items-center justify-center">
                                <Icons.SMM className="w-16 h-16 text-accent-turquoise" />
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-accent-turquoise/20"></div>
                                <span className="text-xs font-bold text-white">@yourbrand</span>
                            </div>
                            <div className="h-2 w-3/4 bg-white/10 rounded mb-1"></div>
                            <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                        </div>

                        {/* Reels Mockup */}
                        <div className="absolute bottom-20 left-10 bg-dark/90 backdrop-blur-xl border border-accent-turquoise/30 p-6 rounded-3xl w-56 text-center shadow-[0_0_50px_rgba(78,205,196,0.3)] z-10">
                            <div className="w-20 h-32 mx-auto bg-gradient-to-b from-accent-turquoise/30 to-accent-amethyst/30 rounded-xl mb-4 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                                    <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
                                </div>
                            </div>
                            <h3 className="font-display font-bold text-white text-sm">REELS</h3>
                            <p className="text-xs text-gray-400 mt-1">Viral Content</p>
                        </div>

                        {/* Engagement Stats */}
                        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 bg-white text-dark p-6 rounded-2xl w-48 animate-float-delayed shadow-2xl border border-white/50 z-20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center"><Icons.Chart /></div>
                                <span className="text-xs font-bold text-gray-600 uppercase">Engagement</span>
                            </div>
                            <div className="text-3xl font-display font-bold text-dark">+250%</div>
                        </div>
                    </div>
                </div>
            </div>
         </section>
         <Section className="bg-dark-surface">
             <SectionTitle title={t('service.smm.team_title')} subtitle={t('service.smm.team_subtitle')} />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {team.map((member, idx) => (
                     <div key={idx} className="group bg-dark border border-white/5 p-8 rounded-3xl hover:border-accent-turquoise/50 transition-colors">
                         <div className="text-4xl mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform text-accent-turquoise">
                             {React.cloneElement(member.icon as React.ReactElement, { className: "w-8 h-8" })}
                         </div>
                         <h3 className="font-display font-bold text-xl text-white mb-2">{member.role}</h3>
                         <p className="text-gray-400 text-sm">{member.desc}</p>
                     </div>
                 ))}
             </div>
         </Section>

         {/* PROCESS SECTION */}
         <Section>
             <SectionTitle title={t('common.how_we_work')} subtitle={t('common.process')} />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                     { step: '01', title: t('service.smm.step_01'), desc: t('service.smm.step_01_desc') },
                     { step: '02', title: t('service.smm.step_02'), desc: t('service.smm.step_02_desc') },
                     { step: '03', title: t('service.smm.step_03'), desc: t('service.smm.step_03_desc') }
                 ].map((item, idx) => (
                     <div key={idx} className="relative p-8 border border-white/10 rounded-3xl bg-white/5 overflow-hidden group">
                         <div className="text-8xl font-display font-bold text-accent-turquoise/10 absolute -right-4 -top-4 transition-transform group-hover:scale-110">{item.step}</div>
                         <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{item.title}</h3>
                         <p className="text-gray-400 relative z-10">{item.desc}</p>
                         <div className="w-full h-1 bg-gradient-to-r from-accent-turquoise to-transparent mt-6"></div>
                     </div>
                 ))}
             </div>
         </Section>

         {/* GALLERY SECTION */}
         <Section className="bg-dark-surface">
             <SectionTitle title={t('common.portfolio')} subtitle="Portfolio" />
             <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                 {galleryImages.map((img, idx) => (
                     <div key={idx} className="relative group overflow-hidden rounded-2xl cursor-pointer break-inside-avoid" onClick={() => setSelectedImage(img)}>
                         <div className="absolute inset-0 bg-accent-turquoise/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                         <img src={img.src} alt="" className="w-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                     </div>
                 ))}
             </div>
         </Section>

         {/* WHAT'S INCLUDED SECTION */}
         <Section className="bg-dark-surface">
             <SectionTitle title={t('service.smm.what_included_title')} subtitle={t('service.smm.what_included_subtitle')} centered />
             
             {/* Для кого - компактно в одну строку */}
             <div className="mb-12">
                 <div className="flex items-center gap-4 mb-6 justify-center">
                     <div className="w-12 h-12 rounded-xl bg-accent-turquoise/20 flex items-center justify-center">
                         <Icons.Users className="w-6 h-6 text-accent-turquoise" />
                     </div>
                     <h3 className="text-2xl font-display font-bold text-white">{t('service.audience')}</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                     <div className="p-6 bg-dark border border-white/10 rounded-2xl hover:border-accent-turquoise/30 transition-colors text-center">
                         <div className="w-10 h-10 rounded-full bg-accent-turquoise/20 flex items-center justify-center mx-auto mb-4">
                             <span className="text-accent-turquoise text-xl font-bold">✓</span>
                         </div>
                         <h4 className="font-bold text-white mb-2">{t('service.smm.for_brands')}</h4>
                         <p className="text-gray-400 text-sm">{t('service.smm.for_brands_desc')}</p>
                     </div>
                     <div className="p-6 bg-dark border border-white/10 rounded-2xl hover:border-accent-turquoise/30 transition-colors text-center">
                         <div className="w-10 h-10 rounded-full bg-accent-turquoise/20 flex items-center justify-center mx-auto mb-4">
                             <span className="text-accent-turquoise text-xl font-bold">✓</span>
                         </div>
                         <h4 className="font-bold text-white mb-2">{t('service.smm.for_experts')}</h4>
                         <p className="text-gray-400 text-sm">{t('service.smm.for_experts_desc')}</p>
                     </div>
                     <div className="p-6 bg-dark border border-white/10 rounded-2xl hover:border-accent-turquoise/30 transition-colors text-center">
                         <div className="w-10 h-10 rounded-full bg-accent-turquoise/20 flex items-center justify-center mx-auto mb-4">
                             <span className="text-accent-turquoise text-xl font-bold">✓</span>
                         </div>
                         <h4 className="font-bold text-white mb-2">{t('service.smm.for_startups')}</h4>
                         <p className="text-gray-400 text-sm">{t('service.smm.for_startups_desc')}</p>
                     </div>
                 </div>
             </div>

             {/* Что входит - в сетке 2 колонки */}
             <div className="mb-12">
                 <div className="flex items-center gap-4 mb-8 justify-center">
                     <div className="w-12 h-12 rounded-xl bg-accent-amethyst/20 flex items-center justify-center">
                         <Icons.Bolt className="w-6 h-6 text-accent-amethyst" />
                     </div>
                     <h3 className="text-2xl font-display font-bold text-white">{t('service.smm.what_included_title')}</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                     <div className="p-6 bg-gradient-to-r from-accent-turquoise/10 to-accent-amethyst/10 rounded-2xl border border-accent-turquoise/20 hover:border-accent-turquoise/40 transition-colors">
                         <div className="flex items-center gap-3 mb-3">
                             <Icons.Check className="w-5 h-5 text-accent-turquoise shrink-0" />
                             <h4 className="font-bold text-white">{t('service.smm.content_plan')}</h4>
                         </div>
                         <p className="text-gray-400 text-sm ml-8">{t('service.smm.content_plan_desc')}</p>
                     </div>
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-accent-turquoise/30 transition-colors">
                         <div className="flex items-center gap-3 mb-3">
                             <Icons.SMM className="w-5 h-5 text-accent-turquoise shrink-0" />
                             <h4 className="font-bold text-white">{t('service.smm.shooting')}</h4>
                         </div>
                         <p className="text-gray-400 text-sm ml-8">{t('service.smm.shooting_desc')}</p>
                     </div>
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-accent-turquoise/30 transition-colors">
                         <div className="flex items-center gap-3 mb-3">
                             <Icons.Brand className="w-5 h-5 text-accent-turquoise shrink-0" />
                             <h4 className="font-bold text-white">{t('service.smm.copywriting')}</h4>
                         </div>
                         <p className="text-gray-400 text-sm ml-8">{t('service.smm.copywriting_desc')}</p>
                     </div>
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-accent-turquoise/30 transition-colors">
                         <div className="flex items-center gap-3 mb-3">
                             <Icons.Bot className="w-5 h-5 text-accent-turquoise shrink-0" />
                             <h4 className="font-bold text-white">{t('service.smm.posting')}</h4>
                         </div>
                         <p className="text-gray-400 text-sm ml-8">{t('service.smm.posting_desc')}</p>
                     </div>
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-accent-turquoise/30 transition-colors">
                         <div className="flex items-center gap-3 mb-3">
                             <Icons.Chart className="w-5 h-5 text-accent-turquoise shrink-0" />
                             <h4 className="font-bold text-white">{t('service.smm.targeting')}</h4>
                         </div>
                         <p className="text-gray-400 text-sm ml-8">{t('service.smm.targeting_desc')}</p>
                     </div>
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-accent-turquoise/30 transition-colors">
                         <div className="flex items-center gap-3 mb-3">
                             <Icons.Chart className="w-5 h-5 text-accent-turquoise shrink-0" />
                             <h4 className="font-bold text-white">{t('service.smm.analytics')}</h4>
                         </div>
                         <p className="text-gray-400 text-sm ml-8">{t('service.smm.analytics_desc')}</p>
                     </div>
                 </div>
             </div>
             
             {/* Коллаборации с блогерами */}
             <div className="mt-12 bg-gradient-to-r from-accent-turquoise/10 via-accent-amethyst/10 to-accent-turquoise/10 rounded-3xl p-8 border border-accent-turquoise/20">
                 <div className="flex items-start gap-6">
                     <div className="w-16 h-16 rounded-2xl bg-accent-amethyst/20 flex items-center justify-center shrink-0">
                         <Icons.Users className="w-8 h-8 text-accent-amethyst" />
                     </div>
                     <div className="flex-1">
                        <h3 className="text-2xl font-display font-bold text-white mb-3">{t('service.smm.collaborations')}</h3>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                            {t('service.smm.collaborations_desc')}
                        </p>
                        <p className="text-accent-turquoise font-bold text-lg">
                             {t('common.separate_price')}
                         </p>
                     </div>
                 </div>
             </div>
         </Section>

         {/* CASES SECTION */}
         {loadingCases ? (
             <Section className="bg-dark-surface">
                 <SectionTitle title={t('service.smm.cases_title')} subtitle={t('service.smm.cases_subtitle')} />
                 <div className="text-center py-20 text-gray-500">{t('service.web.loading_cases')}</div>
             </Section>
         ) : smmCases.length > 0 ? (
             <Section className="bg-dark-surface">
                 <SectionTitle title={t('service.smm.cases_title')} subtitle={t('service.smm.cases_subtitle')} />
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {smmCases.map((caseItem) => {
                         const caseTags = caseItem.tags?.map((id) => tagsMap.get(id)).filter(Boolean) as Tag[] || [];
                         const descriptionText = caseItem.description?.replace(/<[^>]+>/g, ' ').slice(0, 100).trim() + '…' || '';
                         
                         return (
                             <Link key={caseItem.id} to={getCaseLink(caseItem, language)} className="group">
                                 <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-4">
                                     {caseItem.imageUrl ? (
                                         <img 
                                             src={caseItem.imageUrl} 
                                             alt={`Кейс ${caseItem.title || 'от Типа агентство'}`} 
                                             className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                             loading="lazy"
                                         />
                                     ) : (
                                         <div className="w-full h-full bg-gradient-to-br from-dark via-accent-turquoise/10 to-dark flex items-center justify-center text-gray-500">
                                             No image
                                         </div>
                                     )}
                                     <div className="absolute inset-0 bg-accent-turquoise/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                 </div>
                                 {caseTags.length > 0 && (
                                     <div className="flex gap-2 mb-3 flex-wrap">
                                         {caseTags.map(tag => (
                                             <span
                                                 key={tag.id}
                                                 className="text-xs font-bold uppercase tracking-wider border px-2 py-1 rounded"
                                                 style={tag.color ? { borderColor: tag.color, color: tag.color } : { borderColor: '#44d0c0', color: '#44d0c0' }}
                                             >
                                                 {tag.name}
                                             </span>
                                         ))}
                                     </div>
                                 )}
                                 <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-accent-turquoise transition-colors">
                                     {caseItem.title || descriptionText}
                                 </h3>
                                 <p className="text-gray-400 text-sm">{descriptionText}</p>
                             </Link>
                         );
                     })}
                 </div>
             </Section>
         ) : null}

         {/* PRICING SECTION */}
         <Section className="bg-dark">
             <SectionTitle title={t('service.smm.pricing_title')} subtitle={t('service.smm.pricing_subtitle')} centered />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <PricingCard 
                     title={t('service.smm.basic_title')} 
                     price="6 000 000" 
                     accentColor="text-gray-400" 
                     icon={<Icons.SMM />} 
                     openModal={openModal}
                     sourceSection={`service-${service.id}-pricing-basic`}
                     features={t('service.smm.basic_features').split('\n')} 
                 />
                 <PricingCard 
                     title={t('service.smm.standard_title')} 
                     price="8 000 000" 
                     accentColor="text-accent-turquoise" 
                     isPopular
                     icon={<Icons.SMM />} 
                     openModal={openModal}
                     sourceSection={`service-${service.id}-pricing-standard`}
                     features={t('service.smm.standard_features').split('\n')} 
                 />
                 <PricingCard 
                     title={t('service.smm.premium_title')} 
                     price="10 000 000" 
                     accentColor="text-white" 
                     icon={<Icons.SMM />} 
                     openModal={openModal}
                     sourceSection={`service-${service.id}-pricing-premium`}
                     features={t('service.smm.premium_features').split('\n')} 
                 />
             </div>
         </Section>
         
         {/* FAQ SECTION */}
         <FAQSection data={SERVICE_FAQ_DATA['smm']} />

         {/* FINAL CTA BLOCK */}
         <section className="py-32 relative overflow-hidden bg-gradient-to-b from-dark to-[#0a0a0a] border-t border-white/5">
            <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="font-display font-bold text-5xl md:text-8xl text-white mb-8 tracking-tighter uppercase">
                    {t('service.smm.hero_cta_discuss')} <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-accent-turquoise to-accent-amethyst drop-shadow-2xl">{t('service.smm.hero_cta_content')}</span>
                </h2>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12">
                    {t('service.branding.create_desc')}
                </p>
                <button 
                  onClick={() => openModal(`service-${service.id}-pricing`)}
                  className="inline-block bg-accent-turquoise hover:bg-white hover:text-dark text-dark px-12 py-6 rounded-full font-display font-bold text-lg tracking-wider transition-all duration-300 hover:scale-105 shadow-[0_0_50px_-15px_rgba(78,205,196,0.5)]"
                >
                    {t('common.submit_request')}
                </button>
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
         </section>
      </>
    );
};

// --- 3. BRANDING SPECIAL VIEW ---
const BrandingSpecialView: React.FC<{ service: typeof SERVICES_DATA[2] }> = ({ service }) => {
    const { openModal } = useModal();
    const { t } = useLanguage();
    const [selectedImage, setSelectedImage] = useState<{src: string, title: string} | null>(null);

    // Corporate Identity Mockups (Real Photos)
    const brandImages = [
        { src: "/kaymak-bag.jpg", title: "" }, // Бумажный пакет Kaymak
        { src: "/avedu-cards.jpeg", title: "" }, // Визитки Avedu Academy
        { src: "/river-club-balloons.jpeg", title: "" }, // Воздушные шары River Club
        { src: "/gift-wrapping.jpeg", title: "" }, // Подарочная упаковка
        { src: "/nexis-conference.jpeg", title: "" }, // Конференц-зал Nexis
        { src: "/modena-box.jpg", title: "" }  // Девушка с коробкой Modena
    ];

    return (
        <>
            <Seo 
                title="Брендинг и айдентика | Типа агентство"
                description="Разработка логотипов, фирменного стиля и брендбуков от Типа агентство. Создаем визуальную ДНК бренда, которая продает без слов. Полная айдентика от визиток до упаковки."
                structuredData={{
                    '@type': 'Service',
                    serviceType: 'Branding & Identity Design',
                    provider: {
                        '@type': 'Organization',
                        name: 'Типа агентство'
                    }
                }}
            />
            {/* LIGHTBOX */}
            {selectedImage && (
                <div className="fixed inset-0 z-[200] bg-dark/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedImage(null)}>
                    <div className="max-w-4xl w-full max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
                        <img src={selectedImage.src} alt={selectedImage.title} className="w-full h-full object-contain rounded-lg shadow-2xl" />
                    </div>
                </div>
            )}

            {/* BRANDING HERO */}
            <section className="relative pt-32 pb-20 bg-dark overflow-hidden min-h-[85vh] flex flex-col justify-center">
                <div className="absolute inset-0 bg-[#0f0518]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
                <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-accent-amethyst/20 rounded-full blur-[120px] animate-pulse-glow"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <Breadcrumbs />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl mb-8 text-white leading-none uppercase">
                                {t('service.branding.hero_visual')} <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-amethyst to-white">{t('service.branding.hero_dna')}</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed border-l-4 border-accent-amethyst pl-6 mb-10">
                                {t('service.branding.hero_desc')}
                            </p>
                            <button onClick={() => openModal(`service-${service.id}-cta`)} className="px-10 py-5 bg-accent-amethyst text-white font-display font-bold uppercase tracking-wider rounded-full hover:bg-white hover:text-dark transition-all hover:scale-105 shadow-[0_0_30px_rgba(155,89,182,0.4)]">
                                {t('service.branding.create_brand')}
                            </button>
                        </div>

                        {/* Visual: Golden Ratio / Construction */}
                        <div className="relative aspect-square flex items-center justify-center">
                            <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
                            <div className="absolute inset-[10%] border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                            <div className="absolute inset-[25%] border border-white/10 rounded-full"></div>
                            
                            {/* Central Logo Construction */}
                            <div className="relative w-64 h-64 border border-accent-amethyst/30 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-all duration-700 shadow-2xl">
                                <span className="text-9xl font-display font-bold text-white">B</span>
                                {/* Grid Lines */}
                                <div className="absolute inset-0 border-t border-b border-accent-amethyst/20 h-1/3 top-1/3"></div>
                                <div className="absolute inset-0 border-l border-r border-accent-amethyst/20 w-1/3 left-1/3"></div>
                                <div className="absolute -top-4 -right-4 bg-accent-amethyst text-white text-xs font-bold px-2 py-1 rounded">x = 24px</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROCESS INFOGRAPHIC */}
            <Section className="bg-[#120a16]">
                <SectionTitle title={t('common.algorithm')} subtitle={t('common.algorithm_subtitle')} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { step: '01', title: t('service.branding.research'), desc: t('service.branding.research_desc') },
                        { step: '02', title: t('service.branding.concept'), desc: t('service.branding.concept_desc') },
                        { step: '03', title: t('service.branding.system'), desc: t('service.branding.system_desc') }
                    ].map((item, idx) => (
                        <div key={idx} className="relative p-8 border border-white/10 rounded-3xl bg-white/5 overflow-hidden group">
                            <div className="text-8xl font-display font-bold text-white/5 absolute -right-4 -top-4 transition-transform group-hover:scale-110">{item.step}</div>
                            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{item.title}</h3>
                            <p className="text-gray-400 relative z-10">{item.desc}</p>
                            <div className="w-full h-1 bg-gradient-to-r from-accent-amethyst to-transparent mt-6"></div>
                        </div>
                    ))}
                </div>
            </Section>

            {/* REAL PHOTOS GALLERY */}
            <Section>
                <SectionTitle title={t('common.live_examples')} subtitle="Portfolio" />
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {brandImages.map((img, idx) => (
                        <div key={idx} className="relative group overflow-hidden rounded-2xl cursor-pointer break-inside-avoid" onClick={() => setSelectedImage(img)}>
                            <div className="absolute inset-0 bg-accent-amethyst/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                            <img src={img.src} alt="" className="w-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    ))}
                </div>
            </Section>

            {/* PRICING */}
            <Section className="bg-dark-surface">
                <SectionTitle title={t('service.branding.pricing_title')} subtitle={t('service.branding.pricing_subtitle')} centered />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PricingCard title={t('service.branding.logo_title')} price="1 500 000" accentColor="text-gray-400" icon={<Icons.Brand />} openModal={openModal} sourceSection={`service-${service.id}-pricing-logo`} features={t('service.branding.logo_features').split('\n')} />
                    <PricingCard title={t('service.branding.identity_title')} price="5 000 000" accentColor="text-accent-amethyst" isPopular icon={<Icons.Shield />} openModal={openModal} sourceSection={`service-${service.id}-pricing-identity`} features={t('service.branding.identity_features').split('\n')} />
                    <PricingCard title={t('service.branding.brandbook_title')} price="10 000 000" accentColor="text-white" icon={<Icons.Web />} openModal={openModal} sourceSection={`service-${service.id}-pricing-brandbook`} features={t('service.branding.brandbook_features').split('\n')} />
                </div>
            </Section>

            {/* FAQ SECTION */}
            <FAQSection data={SERVICE_FAQ_DATA['branding']} />

            {/* FINAL CTA BLOCK */}
            <section className="py-32 relative overflow-hidden bg-gradient-to-b from-dark to-[#0a0a0a] border-t border-white/5">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="font-display font-bold text-5xl md:text-8xl text-white mb-8 tracking-tighter uppercase">
                        {t('service.branding.hero_cta_create')} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-accent-amethyst to-primary-dark drop-shadow-2xl">{t('service.branding.hero_cta_brand')}</span>
                    </h2>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12">
                        {t('service.branding.create_desc')}
                    </p>
                    <button 
                        onClick={() => openModal(`service-${service.id}-pricing`)}
                        className="inline-block bg-accent-amethyst hover:bg-white hover:text-dark text-white px-12 py-6 rounded-full font-display font-bold text-lg tracking-wider transition-all duration-300 hover:scale-105 shadow-[0_0_50px_-15px_rgba(155,89,182,0.5)]"
                    >
                        {t('service.branding.order')}
                    </button>
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </section>
        </>
    );
};

// --- 4. AUTOMATION SPECIAL VIEW ---
const AutomationSpecialView: React.FC<{ service: typeof SERVICES_DATA[3] }> = ({ service }) => {
    const { openModal } = useModal();
    const { t } = useLanguage();
    return (
        <>
            <Seo 
                title="Автоматизация бизнеса и CRM | Типа агентство"
                description="Автоматизация бизнеса и внедрение CRM от Типа агентство. Настройка AmoCRM, Bitrix24, телефонии, сквозной аналитики. Превращаем отдел продаж в эффективную машину."
                structuredData={{
                    '@type': 'Service',
                    serviceType: 'Business Automation & CRM',
                    provider: {
                        '@type': 'Organization',
                        name: 'Типа агентство'
                    }
                }}
            />
            {/* HERO */}
            <section className="relative pt-32 pb-20 bg-dark overflow-hidden min-h-[85vh] flex flex-col justify-center">
                <div className="absolute inset-0 bg-[#050a08]"></div>
                <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-accent-orange/10 to-transparent"></div>
                <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(rgba(255,209,102,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>

                <div className="container mx-auto px-4 relative z-10">
                    <Breadcrumbs />
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2">
                            <h1 className="font-display font-bold text-5xl md:text-7xl mb-8 text-white leading-none uppercase">
                                {t('service.automation.hero_business')} <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-yellow-200">{t('service.automation.hero_autopilot')}</span>
                            </h1>
                            <p className="text-xl text-gray-300 mb-10 leading-relaxed border-l-4 border-accent-orange pl-6">
                                {t('service.automation.exclude_human')}
                            </p>
                            <button onClick={() => openModal(`service-${service.id}-cta`)} className="px-10 py-5 bg-accent-orange text-dark font-display font-bold uppercase tracking-wider rounded-full hover:bg-white transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,209,102,0.4)]">
                                {t('service.automation.digitize')}
                            </button>
                        </div>
                        
                        {/* Visual: System Architecture */}
                        <div className="lg:w-1/2 w-full relative">
                            <div className="bg-dark-surface border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
                                {/* Connection Lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                                    <path d="M100 100 L300 100 L300 200" stroke="#FFD166" strokeWidth="2" fill="none" strokeDasharray="5,5" className="animate-pulse" />
                                    <path d="M300 200 L500 200" stroke="#FFD166" strokeWidth="2" fill="none" />
                                </svg>
                                
                                <div className="grid grid-cols-2 gap-8 relative z-10">
                                    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400"><Icons.Web /></div>
                                        <div><div className="text-xs text-gray-500 uppercase">Source</div><div className="font-bold text-white">Website</div></div>
                                    </div>
                                    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400"><Icons.Auto /></div>
                                        <div><div className="text-xs text-gray-500 uppercase">System</div><div className="font-bold text-white">AmoCRM</div></div>
                                    </div>
                                    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400"><Icons.Bot /></div>
                                        <div><div className="text-xs text-gray-500 uppercase">Alert</div><div className="font-bold text-white">Telegram Bot</div></div>
                                    </div>
                                    <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400"><Icons.Chart /></div>
                                        <div><div className="text-xs text-gray-500 uppercase">Report</div><div className="font-bold text-white">Dashboard</div></div>
                                    </div>
                                </div>
                                <div className="mt-8 bg-green-900/20 border border-green-500/30 p-4 rounded-lg text-center">
                                    <span className="text-green-400 font-mono text-sm">STATUS: SYSTEM ACTIVE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CHAOS VS SYSTEM */}
            <Section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-3xl">
                        <h3 className="text-2xl font-bold text-red-400 mb-6">{t('service.automation.problems_title')}</h3>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex gap-3"><span className="text-red-500">✖</span> {t('service.automation.problems_excel')}</li>
                            <li className="flex gap-3"><span className="text-red-500">✖</span> {t('service.automation.problems_forgot')}</li>
                            <li className="flex gap-3"><span className="text-red-500">✖</span> {t('service.automation.problems_no_understanding')}</li>
                            <li className="flex gap-3"><span className="text-red-500">✖</span> {t('service.automation.problems_manual')}</li>
                        </ul>
                    </div>
                    <div className="p-8 border border-green-500/20 bg-green-500/5 rounded-3xl">
                        <h3 className="text-2xl font-bold text-green-400 mb-6">{t('service.automation.solution_title')}</h3>
                        <ul className="space-y-4 text-white">
                            <li className="flex gap-3"><span className="text-green-500">✓</span> {t('service.automation.solution_leads')}</li>
                            <li className="flex gap-3"><span className="text-green-500">✓</span> {t('service.automation.solution_tasks')}</li>
                            <li className="flex gap-3"><span className="text-green-500">✓</span> {t('service.automation.solution_analytics')}</li>
                            <li className="flex gap-3"><span className="text-green-500">✓</span> {t('service.automation.solution_dashboard')}</li>
                        </ul>
                    </div>
                </div>
            </Section>

            {/* STRATEGIC PARTNER: TASKA.UZ */}
            <Section className="bg-[#0b120d] relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#2C7E20_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="order-2 lg:order-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 text-green-500 flex items-center justify-center">
                               <Icons.Taska />
                            </div>
                            <span className="font-display font-bold text-sm text-green-500 uppercase tracking-widest">{t('service.automation.taska_partner')}</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Taska.uz</h2>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            {t('service.automation.taska_desc')}
                        </p>

                        {/* Interactive/Visual Feature Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                                    <Icons.Chart />
                                </div>
                                <div className="text-sm font-bold text-gray-200">{t('service.automation.taska_accounting')}</div>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                                    <Icons.Shield />
                                </div>
                                <div className="text-sm font-bold text-gray-200">{t('service.automation.taska_cash')}</div>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                                    <Icons.Bolt />
                                </div>
                                <div className="text-sm font-bold text-gray-200">{t('service.automation.taska_processes')}</div>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                                    <Icons.Consult />
                                </div>
                                <div className="text-sm font-bold text-gray-200">{t('service.automation.taska_planning')}</div>
                            </div>
                        </div>

                        <a 
                            href="https://taska.uz" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-green-500 font-bold uppercase tracking-wider hover:text-white transition-colors border-b border-green-500/30 pb-1 hover:border-white"
                        >
                            {t('service.automation.taska_visit')}
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                    </div>
                    
                    {/* Visual Representation (Infographic) */}
                    <div className="order-1 lg:order-2 flex justify-center relative">
                        <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full"></div>
                        <div className="relative w-full max-w-md bg-dark/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                            {/* Header of fake UI */}
                            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                                <div className="w-8 h-8 text-green-500"><Icons.Taska /></div>
                                <div className="flex gap-2">
                                    <div className="w-20 h-2 bg-white/10 rounded"></div>
                                    <div className="w-8 h-8 rounded-full bg-white/10"></div>
                                </div>
                            </div>
                            
                            {/* Chart UI */}
                            <div className="flex items-end justify-between h-32 gap-2 mb-6">
                                <div className="w-full bg-green-500/10 h-[40%] rounded-t-lg relative group">
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">$$$</div>
                                </div>
                                <div className="w-full bg-green-500/20 h-[60%] rounded-t-lg relative group">
                                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">$$$</div>
                                </div>
                                <div className="w-full bg-green-500/30 h-[30%] rounded-t-lg relative group"></div>
                                <div className="w-full bg-green-500/50 h-[80%] rounded-t-lg relative group">
                                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">$$$</div>
                                </div>
                                <div className="w-full bg-green-500 h-[95%] rounded-t-lg relative shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>
                            </div>
                            
                            {/* Stats UI */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl">
                                    <div className="text-xs text-gray-500 mb-1">{t('service.automation.taska_profit')}</div>
                                    <div className="text-xl font-bold text-white">+ 124%</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl">
                                    <div className="text-xs text-gray-500 mb-1">{t('service.automation.taska_expenses')}</div>
                                    <div className="text-xl font-bold text-red-400">- 15%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* INTEGRATIONS BLOCK */}
            <Section>
                <SectionTitle title={t('common.integrations')} subtitle={t('common.integrations_subtitle')} centered />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {['Bitrix24', 'AmoCRM', '1C: Enterprise', 'MoySklad'].map((system, idx) => (
                        <div key={idx} className="bg-dark-surface border border-white/10 rounded-2xl p-8 flex items-center justify-center group hover:border-accent-orange/50 transition-colors">
                            <span className="text-xl font-bold text-gray-400 group-hover:text-white transition-colors">{system}</span>
                        </div>
                    ))}
                </div>
            </Section>

            {/* PRICING */}
            <Section className="bg-dark-surface">
                <SectionTitle title={t('service.automation.pricing_title')} subtitle={t('service.automation.pricing_subtitle')} centered />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PricingCard title={t('service.automation.basic_title')} price="4 000 000" accentColor="text-gray-400" icon={<Icons.Auto />} openModal={openModal} sourceSection={`service-${service.id}-pricing-basic`} features={t('service.automation.basic_features').split('\n')} />
                    <PricingCard title={t('service.automation.pro_title')} price="8 000 000" accentColor="text-accent-orange" isPopular icon={<Icons.Bolt />} openModal={openModal} sourceSection={`service-${service.id}-pricing-pro`} features={t('service.automation.pro_features').split('\n')} />
                    <PricingCard title={t('service.automation.turnkey_title')} price="15 000 000" accentColor="text-white" icon={<Icons.Chart />} openModal={openModal} sourceSection={`service-${service.id}-pricing-turnkey`} features={t('service.automation.turnkey_features').split('\n')} />
                </div>
            </Section>

            {/* FAQ SECTION */}
            <FAQSection data={SERVICE_FAQ_DATA['automation']} />

            {/* FINAL CTA BLOCK */}
            <section className="py-32 relative overflow-hidden bg-gradient-to-b from-dark to-[#0a0a0a] border-t border-white/5">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="font-display font-bold text-5xl md:text-8xl text-white mb-8 tracking-tighter uppercase">
                        {t('service.automation.hero_cta_implement')} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-accent-orange to-primary-dark drop-shadow-2xl">{t('service.automation.hero_cta_system')}</span>
                    </h2>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12">
                        {t('service.automation.hero_stop_losing')}
                    </p>
                    <button 
                        onClick={() => openModal(`service-${service.id}-pricing`)}
                        className="inline-block bg-accent-orange hover:bg-white hover:text-dark text-dark px-12 py-6 rounded-full font-display font-bold text-lg tracking-wider transition-all duration-300 hover:scale-105 shadow-[0_0_50px_-15px_rgba(255,209,102,0.5)]"
                    >
                        {t('service.automation.setup_crm')}
                    </button>
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </section>
        </>
    );
};

// --- 5. ADS SPECIAL VIEW ---
const AdsSpecialView: React.FC<{ service: typeof SERVICES_DATA[6] }> = ({ service }) => {
    const { openModal } = useModal();
    const { t } = useLanguage();
    return (
        <>
            <Seo 
                title="Таргетированная и Контекстная Реклама | Типа агентство" 
                description="Настройка таргетированной рекламы в Instagram/Facebook и контекстной рекламы в Google/Yandex. Приводим целевых клиентов." 
            />
            {/* HERO */}
            <section className="relative pt-32 pb-20 bg-dark overflow-hidden min-h-[85vh] flex flex-col justify-center">
                <div className="absolute inset-0 bg-[#080b14]"></div>
                <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-accent-sky/10 rounded-full blur-[150px] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <Breadcrumbs />
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2">
                            <h1 className="font-display font-bold text-5xl md:text-7xl mb-8 text-white leading-none uppercase">
                                {t('service.ads.hero_traffic')} <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-sky to-blue-500">{t('service.ads.hero_money')}</span>
                            </h1>
                            <p className="text-xl text-gray-300 mb-10 leading-relaxed border-l-4 border-accent-sky pl-6">
                                {t('service.ads.hero_desc')}
                            </p>
                            <button onClick={() => openModal(`service-${service.id}-cta`)} className="px-10 py-5 bg-accent-sky text-dark font-display font-bold uppercase tracking-wider rounded-full hover:bg-white transition-all hover:scale-105 shadow-[0_0_30px_rgba(69,183,209,0.4)]">
                                {t('service.ads.launch_ads')}
                            </button>
                        </div>
                        
                        {/* Visual: Funnel */}
                        <div className="lg:w-1/2 w-full flex justify-center">
                            <div className="relative w-full max-w-md">
                                <div className="absolute inset-0 bg-accent-sky/20 blur-[60px] rounded-full"></div>
                                <div className="relative z-10 flex flex-col gap-2">
                                    {/* Funnel Steps */}
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center w-full">
                                        <div className="text-xs text-gray-400 uppercase">Impressions</div>
                                        <div className="font-bold text-white text-xl">150,000</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center w-[85%] mx-auto">
                                        <div className="text-xs text-gray-400 uppercase">Clicks (CTR 2.5%)</div>
                                        <div className="font-bold text-white text-xl">3,750</div>
                                    </div>
                                    <div className="bg-accent-sky/20 backdrop-blur-md p-4 rounded-xl border border-accent-sky/50 text-center w-[60%] mx-auto shadow-[0_0_20px_rgba(69,183,209,0.2)]">
                                        <div className="text-xs text-accent-sky uppercase font-bold">Leads</div>
                                        <div className="font-bold text-white text-2xl">450</div>
                                    </div>
                                    <div className="bg-green-500/20 backdrop-blur-md p-4 rounded-xl border border-green-500/50 text-center w-[40%] mx-auto shadow-[0_0_20px_rgba(34,197,94,0.3)] mt-2 flex items-center justify-center gap-2">
                                        <div className="text-green-400"><Icons.Wallet /></div>
                                        <div>
                                            <div className="text-xs text-green-400 uppercase font-bold">Sales</div>
                                            <div className="font-bold text-white text-2xl">85</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TARGETING SIMULATION */}
            <Section className="bg-[#0b101b]">
                <SectionTitle title={t('service.ads.target_title')} subtitle={t('service.ads.target_subtitle')} />
                <div className="bg-dark-surface border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto">
                    <div className="flex flex-wrap gap-4 mb-8">
                        <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5 text-gray-300 text-sm flex items-center gap-2">
                            <span className="text-accent-sky"><Icons.Location /></span> Tashkent + 20km
                        </div>
                        <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5 text-gray-300 text-sm flex items-center gap-2">
                            <span className="text-accent-sky"><Icons.Users /></span> 24 - 45 лет
                        </div>
                        <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5 text-gray-300 text-sm flex items-center gap-2">
                            <span className="text-accent-sky"><Icons.Briefcase /></span> {t('service.ads.entrepreneurs')}
                        </div>
                        <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5 text-gray-300 text-sm flex items-center gap-2">
                            <span className="text-accent-sky"><Icons.Mobile /></span> iPhone Owners
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-dark-surface border border-white/5 rounded-xl p-6 text-white relative overflow-hidden group hover:border-accent-amethyst/50 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-amethyst/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-accent-amethyst/20 transition-colors"></div>
                            <div className="absolute top-4 left-4 text-accent-amethyst"><Icons.Instagram /></div>
                            <div className="mt-8 font-bold text-lg mb-2">{t('service.ads.instagram_title')}</div>
                            <p className="text-sm text-gray-400">{t('service.ads.instagram_desc')}</p>
                        </div>
                        <div className="bg-dark-surface border border-white/5 rounded-xl p-6 text-white relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-colors"></div>
                            <div className="absolute top-4 left-4 text-blue-500"><Icons.Web /></div>
                            <div className="mt-8 font-bold text-lg mb-2">{t('service.ads.google_title')}</div>
                            <p className="text-sm text-gray-400">{t('service.ads.google_desc')}</p>
                        </div>
                    </div>
                </div>
            </Section>

            {/* SOCIAL ADS DETAILED SECTION */}
            <Section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h3 className="font-display font-bold text-4xl text-white mb-6">
                            {t('service.ads.social_title')} <br/>
                            <span className="text-accent-amethyst">{t('service.ads.social_subtitle')}</span>
                        </h3>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            {t('service.ads.social_desc')}
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="mt-1"><Icons.Check /></span>
                                <div>
                                    <strong className="text-white block">{t('service.ads.sniper_targeting')}</strong>
                                    <span className="text-sm text-gray-400">{t('service.ads.sniper_desc')}</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1"><Icons.Check /></span>
                                <div>
                                    <strong className="text-white block">{t('service.ads.selling_creative')}</strong>
                                    <span className="text-sm text-gray-400">{t('service.ads.creative_desc')}</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1"><Icons.Check /></span>
                                <div>
                                    <strong className="text-white block">{t('service.ads.retargeting')}</strong>
                                    <span className="text-sm text-gray-400">{t('service.ads.retargeting_desc')}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="relative">
                        <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#2a0a36] to-dark border border-white/5 p-8 flex items-center justify-center">
                            <div className="relative w-full max-w-sm">
                                {/* Abstract Mobile UI */}
                                <div className="bg-dark-surface border border-white/10 rounded-2xl p-4 shadow-2xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                                        <div className="h-2 w-24 bg-gray-700 rounded"></div>
                                        <div className="ml-auto text-accent-amethyst text-xs">Sponsored</div>
                                    </div>
                                    <div className="aspect-video bg-white/5 rounded-lg mb-4 flex items-center justify-center text-gray-600">
                                        [Video Content]
                                    </div>
                                    <div className="h-10 bg-accent-amethyst rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                        Learn More
                                    </div>
                                </div>
                                {/* Floating stats */}
                                <div className="absolute -right-6 top-10 bg-white text-dark p-3 rounded-xl shadow-lg">
                                    <div className="text-xs font-bold uppercase">CTR</div>
                                    <div className="font-bold text-lg">2.8%</div>
                                </div>
                                <div className="absolute -left-6 bottom-10 bg-white text-dark p-3 rounded-xl shadow-lg">
                                    <div className="text-xs font-bold uppercase">Leads</div>
                                    <div className="font-bold text-lg">+145</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* CONTEXT ADS DETAILED SECTION */}
            <Section className="bg-[#0D1117]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
                    <div className="order-2 lg:order-1 relative">
                        <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#0a1836] to-dark border border-white/5 p-8 flex items-center justify-center">
                             <div className="w-full space-y-4">
                                 {/* Search Result 1 (Ad) */}
                                 <div className="bg-dark-surface p-4 rounded-xl border-l-4 border-blue-500">
                                     <div className="flex items-center gap-2 mb-1">
                                         <span className="text-[10px] font-bold text-dark bg-yellow-500 px-1 rounded">Ad</span>
                                         <span className="text-xs text-gray-400">example.com</span>
                                     </div>
                                     <div className="text-blue-400 font-bold text-lg mb-1">Купить пластиковые окна</div>
                                     <div className="text-xs text-gray-400">Лучшие цены в Ташкенте. Замер бесплатно...</div>
                                 </div>
                                 {/* Search Result 2 */}
                                 <div className="bg-dark-surface p-4 rounded-xl border border-white/5 opacity-50">
                                     <div className="h-3 w-1/3 bg-gray-700 rounded mb-2"></div>
                                     <div className="h-2 w-full bg-gray-800 rounded mb-1"></div>
                                     <div className="h-2 w-2/3 bg-gray-800 rounded"></div>
                                 </div>
                                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 p-4 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                                     <Icons.Search />
                                 </div>
                             </div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <h3 className="font-display font-bold text-4xl text-white mb-6">
                            {t('service.ads.context_title')} <br/>
                            <span className="text-blue-500">{t('service.ads.context_subtitle')}</span>
                        </h3>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            {t('service.ads.context_desc')}
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="mt-1 text-blue-500"><Icons.Check /></span>
                                <div>
                                    <strong className="text-white block">{t('service.ads.hot_demand')}</strong>
                                    <span className="text-sm text-gray-400">{t('service.ads.smart_filters_desc')}</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 text-blue-500"><Icons.Check /></span>
                                <div>
                                    <strong className="text-white block">{t('service.ads.minus_words')}</strong>
                                    <span className="text-sm text-gray-400">{t('service.ads.waste_desc')}</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 text-blue-500"><Icons.Check /></span>
                                <div>
                                    <strong className="text-white block">{t('service.ads.instant_result')}</strong>
                                    <span className="text-sm text-gray-400">{t('service.ads.immediate_desc')}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </Section>

            {/* PRICING */}
            <Section className="bg-dark-surface">
                <SectionTitle title={t('service.ads.pricing_title')} subtitle={t('service.ads.pricing_subtitle')} centered />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PricingCard title={t('service.ads.testdrive_title')} price="3 000 000" accentColor="text-gray-400" icon={<Icons.Ads />} openModal={openModal} sourceSection={`service-${service.id}-pricing-testdrive`} features={t('service.ads.testdrive_features').split('\n')} />
                    <PricingCard title={t('service.ads.complex_title')} price="6 000 000" accentColor="text-accent-sky" isPopular icon={<Icons.Chart />} openModal={openModal} sourceSection={`service-${service.id}-pricing-complex`} features={t('service.ads.complex_features').split('\n')} />
                    <PricingCard title={t('service.ads.scale_title')} price="10 000 000" accentColor="text-white" icon={<Icons.Bolt />} openModal={openModal} sourceSection={`service-${service.id}-pricing-scale`} features={t('service.ads.scale_features').split('\n')} />
                </div>
            </Section>

            {/* FAQ SECTION */}
            <FAQSection data={SERVICE_FAQ_DATA['ads']} />

            {/* FINAL CTA BLOCK */}
            <section className="py-32 relative overflow-hidden bg-gradient-to-b from-dark to-[#0a0a0a] border-t border-white/5">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="font-display font-bold text-5xl md:text-8xl text-white mb-8 tracking-tighter uppercase">
                        {t('service.ads.hero_cta_need')} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-accent-sky to-primary-dark drop-shadow-2xl">{t('service.ads.hero_cta_clients')}</span>
                    </h2>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12">
                        {t('service.ads.hero_stop_wasting')}
                    </p>
                    <button 
                        onClick={() => openModal(`service-${service.id}-pricing`)}
                        className="inline-block bg-accent-sky hover:bg-white hover:text-dark text-dark px-12 py-6 rounded-full font-display font-bold text-lg tracking-wider transition-all duration-300 hover:scale-105 shadow-[0_0_50px_-15px_rgba(69,183,209,0.5)]"
                    >
                        {t('service.ads.get_forecast')}
                    </button>
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </section>
        </>
    );
};

// --- 6. SERM SPECIAL VIEW ---
const SermSpecialView: React.FC<{ service: typeof SERVICES_DATA[5] }> = ({ service }) => {
    const { openModal } = useModal();
    const { t } = useLanguage();
    return (
        <>
            <Seo 
                title="SERM и управление репутацией | Типа агентство"
                description="Управление репутацией в интернете (SERM) от Типа агентство. Удаление негатива, работа с отзывами, защита бренда. Поднимаем рейтинг и вытесняем негатив из поисковой выдачи."
                structuredData={{
                    '@type': 'Service',
                    serviceType: 'Reputation Management',
                    provider: {
                        '@type': 'Organization',
                        name: 'Типа агентство'
                    }
                }}
            />
            {/* HERO */}
            <section className="relative pt-32 pb-20 bg-dark overflow-hidden min-h-[80vh] flex flex-col justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-accent-lavender/10 via-dark to-dark"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <Breadcrumbs />
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2">
                            <h1 className="font-display font-bold text-5xl md:text-7xl mb-8 text-white leading-none uppercase">
                                {t('service.serm.hero_digital')} <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-lavender to-purple-400">{t('service.serm.hero_shield')}</span>
                            </h1>
                            <p className="text-xl text-gray-300 mb-10 leading-relaxed border-l-4 border-accent-lavender pl-6">
                                {t('service.serm.hero_desc')}
                            </p>
                            <button onClick={() => openModal(`service-${service.id}-cta`)} className="px-10 py-5 bg-accent-lavender text-dark font-display font-bold uppercase tracking-wider rounded-full hover:bg-white transition-all hover:scale-105 shadow-[0_0_30px_rgba(212,165,233,0.4)]">
                                {t('service.serm.clear_reputation')}
                            </button>
                        </div>
                        
                        {/* Visual: Shield & Stars */}
                        <div className="lg:w-1/2 w-full flex justify-center">
                            <div className="relative">
                                {/* Shield */}
                                <div className="absolute inset-0 bg-accent-lavender/20 blur-2xl rounded-full"></div>
                                <div className="relative z-10 bg-dark-surface border border-white/10 p-8 rounded-3xl w-80 text-center shadow-2xl">
                                    <div className="flex justify-center mb-4 text-4xl space-x-1">
                                        <span className="text-yellow-400">★</span><span className="text-yellow-400">★</span><span className="text-yellow-400">★</span><span className="text-yellow-400">★</span><span className="text-yellow-400">★</span>
                                    </div>
                                    <div className="text-5xl font-bold text-white mb-2">4.9</div>
                                    <div className="text-gray-400 text-sm mb-6">Trust Score</div>
                                    
                                    <div className="space-y-3 text-left">
                                        <div className="bg-green-500/10 p-3 rounded-lg flex items-center gap-3">
                                            <Icons.Check />
                                            <span className="text-green-400 text-xs font-bold">Negative Removed</span>
                                        </div>
                                        <div className="bg-green-500/10 p-3 rounded-lg flex items-center gap-3">
                                            <Icons.Check />
                                            <span className="text-green-400 text-xs font-bold">Reviews Boosted</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-6 -right-6 text-accent-lavender animate-float">
                                    <Icons.Shield />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BEFORE / AFTER */}
            <Section className="bg-[#15101a]">
                <SectionTitle title={t('service.serm.results_title')} subtitle={t('service.serm.results_subtitle')} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <h3 className="text-xl font-bold text-gray-500 mb-4">{t('service.serm.before')}</h3>
                        <div className="bg-dark border border-red-500/30 p-6 rounded-xl">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-red-500 font-bold">{t('service.serm.rating_low')}</div>
                                <div className="text-xs text-gray-500">Google Maps</div>
                            </div>
                            <p className="text-gray-400 text-sm italic">{t('service.serm.bad_review')}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">{t('service.serm.after')}</h3>
                        <div className="bg-dark border border-green-500/50 p-6 rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-green-400 font-bold">{t('service.serm.rating_high')}</div>
                                <div className="text-xs text-gray-500">Google Maps</div>
                            </div>
                            <p className="text-gray-300 text-sm italic">{t('service.serm.good_review')}</p>
                        </div>
                    </div>
                </div>
            </Section>

            {/* NEW SECTION: ANATOMY OF SERM (How it works) */}
            <Section>
                <SectionTitle title={t('service.serm.anatomy_title')} subtitle={t('service.serm.anatomy_subtitle')} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-12">
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-full border border-accent-lavender/30 text-accent-lavender flex items-center justify-center shrink-0 text-xl font-bold">1</div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">{t('service.serm.scanning')}</h3>
                                <p className="text-gray-400">{t('service.serm.scanning_desc')}</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-full border border-accent-lavender/30 text-accent-lavender flex items-center justify-center shrink-0 text-xl font-bold">2</div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">{t('service.serm.filtering')}</h3>
                                <p className="text-gray-400">{t('service.serm.filtering_desc')}</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-full border border-accent-lavender/30 text-accent-lavender flex items-center justify-center shrink-0 text-xl font-bold">3</div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">{t('service.serm.displacement')}</h3>
                                <p className="text-gray-400">{t('service.serm.displacement_desc')}</p>
                            </div>
                        </div>
                    </div>

                    {/* ABSTRACT RADAR VISUAL - Fixed to be round */}
                    <div className="relative flex items-center justify-center h-[450px]">
                        <div className="relative w-full max-w-[400px] h-[400px] mx-auto">
                            <div className="absolute inset-0 border border-white/5 rounded-full"></div>
                            <div className="absolute inset-[15%] border border-white/5 rounded-full"></div>
                            <div className="absolute inset-[30%] border border-white/5 rounded-full"></div>
                            
                            {/* Scanning Line */}
                            <div className="absolute w-1/2 h-1/2 top-0 right-0 bg-gradient-to-t from-accent-lavender/20 to-transparent origin-bottom-left animate-spin-slow rounded-tr-full z-10" style={{animationDuration: '4s'}}></div>
                            
                            {/* Center */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-accent-lavender rounded-full flex items-center justify-center relative z-20 shadow-[0_0_30px_rgba(212,165,233,0.5)]">
                                <Icons.Shield />
                            </div>

                            {/* Dots */}
                            <div className="absolute top-[20%] right-[20%] w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                            <div className="absolute bottom-[30%] left-[20%] w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_lime]"></div>
                            <div className="absolute top-[10%] left-[40%] w-2 h-2 bg-white/50 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* PRICING */}
            <Section className="bg-dark-surface">
                <SectionTitle title={t('service.serm.protection_title')} subtitle={t('service.serm.protection_subtitle')} centered />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PricingCard title={t('service.serm.monitoring_title')} price="2 000 000" accentColor="text-gray-400" icon={<Icons.Shield />} openModal={openModal} sourceSection={`service-${service.id}-pricing-monitoring`} features={t('service.serm.monitoring_features').split('\n')} />
                    <PricingCard title={t('service.serm.reputation_title')} price="4 000 000" accentColor="text-accent-lavender" isPopular icon={<Icons.Brand />} openModal={openModal} sourceSection={`service-${service.id}-pricing-reputation`} features={t('service.serm.reputation_features').split('\n')} />
                    <PricingCard title={t('service.serm.cleanup_title')} price="6 000 000" accentColor="text-white" icon={<Icons.Bolt />} openModal={openModal} sourceSection={`service-${service.id}-pricing-cleanup`} features={t('service.serm.cleanup_features').split('\n')} />
                </div>
            </Section>

            {/* FAQ SECTION */}
            <FAQSection data={SERVICE_FAQ_DATA['serm']} />

            {/* FINAL CTA BLOCK */}
            <section className="py-32 relative overflow-hidden bg-gradient-to-b from-dark to-[#0a0a0a] border-t border-white/5">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="font-display font-bold text-5xl md:text-8xl text-white mb-8 tracking-tighter uppercase">
                        {t('service.serm.hero_cta_return')} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-accent-lavender to-primary-dark drop-shadow-2xl">{t('service.serm.hero_cta_trust')}</span>
                    </h2>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12">
                        {t('service.serm.hero_reputation_text')}
                    </p>
                    <button 
                        onClick={() => openModal(`service-${service.id}-pricing`)}
                        className="inline-block bg-accent-lavender hover:bg-white hover:text-dark text-dark px-12 py-6 rounded-full font-display font-bold text-lg tracking-wider transition-all duration-300 hover:scale-105 shadow-[0_0_50px_-15px_rgba(212,165,233,0.5)]"
                    >
                        {t('service.serm.protect_brand')}
                    </button>
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </section>
        </>
    );
};

// --- 7. SEO SPECIAL VIEW ---
const SeoSpecialView: React.FC<{ service: typeof SERVICES_DATA[4] }> = ({ service }) => {
    const { openModal } = useModal();
    const { t } = useLanguage();
    return (
        <>
            <Seo 
                title="SEO и GEO-продвижение | Типа агентство"
                description="SEO-оптимизация и GEO-продвижение от Типа агентство. Продвижение в Google/Yandex Maps, оптимизация сайта, AI-продвижение (GEO). Выводим бизнес в ТОП локальной выдачи."
                structuredData={{
                    '@type': 'Service',
                    serviceType: 'SEO & Local SEO',
                    provider: {
                        '@type': 'Organization',
                        name: 'Типа агентство'
                    }
                }}
            />
            {/* HERO */}
            <section className="relative pt-32 pb-20 bg-dark overflow-hidden min-h-[85vh] flex flex-col justify-center">
                <div className="absolute inset-0 bg-[#05110e]"></div>
                <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-accent-mint/10 rounded-full blur-[150px] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <Breadcrumbs />
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2">
                            <h1 className="font-display font-bold text-5xl md:text-7xl mb-8 text-white leading-none uppercase">
                                {t('service.seo.hero_be')} <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-mint to-green-400">{t('service.seo.hero_top')}</span>
                            </h1>
                            <p className="text-xl text-gray-300 mb-10 leading-relaxed border-l-4 border-accent-mint pl-6">
                                {t('service.seo.hero_desc')}
                            </p>
                            <button onClick={() => openModal(`service-${service.id}-cta`)} className="px-10 py-5 bg-accent-mint text-dark font-display font-bold uppercase tracking-wider rounded-full hover:bg-white transition-all hover:scale-105 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                                {t('service.seo.raise_search')}
                            </button>
                        </div>
                        
                        {/* Visual: Search Rank */}
                        <div className="lg:w-1/2 w-full flex justify-center">
                            <div className="relative bg-dark-surface border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl mb-6 border border-white/5">
                                    <Icons.Web />
                                    <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className={`p-4 rounded-xl flex items-center gap-4 ${i === 1 ? 'bg-accent-mint/10 border border-accent-mint/30' : 'bg-transparent border border-transparent opacity-50'}`}>
                                            <div className={`font-bold text-xl ${i === 1 ? 'text-accent-mint' : 'text-gray-600'}`}>#{i}</div>
                                            <div className="flex-1">
                                                <div className={`h-3 w-1/2 rounded mb-2 ${i === 1 ? 'bg-accent-mint/50' : 'bg-gray-700'}`}></div>
                                                <div className="h-2 w-3/4 bg-gray-800 rounded"></div>
                                            </div>
                                            {i === 1 && <div className="text-accent-mint"><Icons.Check /></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* EVOLUTION OF SEARCH: SEO + AI */}
            <Section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-accent-mint/20 text-accent-mint flex items-center justify-center">
                                <Icons.Web />
                            </div>
                            <span className="font-display font-bold text-sm text-accent-mint uppercase tracking-widest">{t('service.seo.evolution')}</span>
                        </div>
                        <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">
                            {t('service.seo.optimize_for')} <span className="text-blue-400">Google</span>, <span className="text-yellow-400">Яндекс</span> {t('common.and')} <span className="text-purple-400">AI</span>.
                        </h2>
                        <p className="text-xl text-gray-300 leading-relaxed mb-8">
                            {t('service.seo.optimize_desc')}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300">ChatGPT</div>
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300">Gemini</div>
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300">Perplexity</div>
                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300">YandexGPT</div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Card 1: Classic Search */}
                            <div className="bg-dark-surface border border-white/10 p-6 rounded-2xl relative group hover:border-blue-500/30 transition-colors">
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <h3 className="font-bold text-white text-xl mt-4 mb-2">{t('service.seo.classic_title')}</h3>
                                <p className="text-sm text-gray-400 mb-4">{t('service.seo.classic_desc')}</p>
                                <div className="h-2 w-full bg-white/10 rounded mb-2"></div>
                                <div className="h-2 w-2/3 bg-white/10 rounded"></div>
                            </div>

                            {/* Card 2: AI Search (GEO) */}
                            <div className="bg-dark-surface border border-white/10 p-6 rounded-2xl relative group hover:border-purple-500/30 transition-colors mt-8">
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                                    <Icons.Bot />
                                </div>
                                <h3 className="font-bold text-white text-xl mt-4 mb-2">{t('service.seo.ai_title')}</h3>
                                <p className="text-sm text-gray-400 mb-4">{t('service.seo.ai_desc')}</p>
                                <div className="flex gap-2">
                                    <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
                                    <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse delay-75"></div>
                                    <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse delay-150"></div>
                                </div>
                            </div>
                        </div>
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10 rotate-45"></div>
                    </div>
                </div>
            </Section>

            {/* GEO SERVICES */}
            <Section className="bg-[#0b1612]">
                <SectionTitle title={t('service.seo.local_title')} subtitle={t('service.seo.local_subtitle')} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-dark-surface p-8 rounded-3xl border border-white/5">
                        <div className="text-accent-mint mb-4"><Icons.Map /></div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('service.seo.google_maps_title')}</h3>
                        <p className="text-gray-400">{t('service.seo.google_maps_desc')}</p>
                    </div>
                    <div className="bg-dark-surface p-8 rounded-3xl border border-white/5">
                        <div className="text-yellow-400 mb-4"><Icons.Map /></div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('service.seo.yandex_maps_title')}</h3>
                        <p className="text-gray-400">{t('service.seo.yandex_maps_desc')}</p>
                    </div>
                    <div className="bg-dark-surface p-8 rounded-3xl border border-white/5">
                        <div className="text-blue-400 mb-4"><Icons.Shield /></div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('service.seo.2gis_title')}</h3>
                        <p className="text-gray-400">{t('service.seo.2gis_desc')}</p>
                    </div>
                </div>
            </Section>

            {/* PRICING */}
            <Section className="bg-dark-surface">
                <SectionTitle title={t('service.seo.pricing_title')} subtitle={t('service.seo.pricing_subtitle')} centered />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PricingCard title={t('service.seo.geo_title')} price="2 000 000" accentColor="text-gray-400" icon={<Icons.Map />} openModal={openModal} sourceSection={`service-${service.id}-pricing-geo`} features={t('service.seo.geo_features').split('\n')} />
                    <PricingCard title={t('service.seo.start_title')} price="3 000 000" accentColor="text-accent-mint" isPopular icon={<Icons.Web />} openModal={openModal} sourceSection={`service-${service.id}-pricing-seo-start`} features={t('service.seo.start_features').split('\n')} />
                    <PricingCard title={t('service.seo.leader_title')} price="5 000 000" accentColor="text-white" icon={<Icons.Chart />} openModal={openModal} sourceSection={`service-${service.id}-pricing-seo-leader`} features={t('service.seo.leader_features').split('\n')} />
                </div>
            </Section>

            {/* FAQ SECTION */}
            <FAQSection data={SERVICE_FAQ_DATA['seo_geo']} />

            {/* FINAL CTA BLOCK */}
            <section className="py-32 relative overflow-hidden bg-gradient-to-b from-dark to-[#0a0a0a] border-t border-white/5">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="font-display font-bold text-5xl md:text-8xl text-white mb-8 tracking-tighter uppercase">
                        {t('service.seo.hero_cta_capture')} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-accent-mint to-primary-dark drop-shadow-2xl">{t('service.seo.hero_cta_results')}</span>
                    </h2>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12">
                        {t('service.seo.hero_audit_text')}
                    </p>
                    <button 
                        onClick={() => openModal(`service-${service.id}-pricing`)}
                        className="inline-block bg-accent-mint hover:bg-white hover:text-dark text-dark px-12 py-6 rounded-full font-display font-bold text-lg tracking-wider transition-all duration-300 hover:scale-105 shadow-[0_0_50px_-15px_rgba(165,221,155,0.5)]"
                    >
                        {t('service.seo.order_audit')}
                    </button>
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </section>
        </>
    );
};

// --- GENERIC FALLBACK VIEW ---
const GenericServiceView: React.FC<{ service: any }> = ({ service }) => {
  const { getLocalized } = useLanguage();
  const { openModal } = useModal();
  
  return (
    <>
      <Seo 
        title={`${getLocalized(service.title)} | Типа агентство`}
        description={getLocalized(service.shortDescription) || `Услуга ${getLocalized(service.title)} от Типа агентство. Системный digital-партнер в Узбекистане.`}
        structuredData={{
          '@type': 'Service',
          serviceType: getLocalized(service.title),
          provider: {
            '@type': 'Organization',
            name: 'Типа агентство'
          }
        }}
      />
      <section className="relative pt-32 pb-20 bg-dark overflow-hidden min-h-[60vh] flex flex-col justify-center">
        <div className="container mx-auto px-4 relative z-10">
           <Breadcrumbs />
           <div className="mt-8 max-w-4xl">
               <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-8 uppercase leading-tight">
                   {getLocalized(service.title)}
               </h1>
               <p className="text-xl md:text-2xl text-gray-300 leading-relaxed border-l-4 border-white/20 pl-6 mb-10">
                   {getLocalized(service.shortDescription)}
               </p>
               <button onClick={openModal} className="px-10 py-5 bg-white text-dark font-display font-bold uppercase tracking-wider rounded-full hover:bg-gray-200 transition-all">
                   {getLocalized(service.ctaText)}
               </button>
           </div>
        </div>
      </section>

      <Section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Для кого</h3>
                  <ul className="space-y-4">
                      {service.audience?.map((item: any, idx: number) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-400">
                              <span className="w-2 h-2 rounded-full bg-white/20"></span>
                              {getLocalized(item)}
                          </li>
                      ))}
                  </ul>
              </div>
               <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Что входит</h3>
                  <ul className="space-y-4">
                      {service.included?.map((item: any, idx: number) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-400">
                              <Icons.Check />
                              {getLocalized(item)}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      </Section>

      {/* FINAL CTA BLOCK (Generic) */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-dark to-[#0a0a0a] border-t border-white/5">
          <div className="container mx-auto px-4 text-center relative z-10">
              <h2 className="font-display font-bold text-5xl md:text-8xl text-white mb-8 tracking-tighter uppercase">
                  {t('service.web.cta_discuss_title')} <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-primary to-primary-dark drop-shadow-2xl">{t('service.web.cta_discuss_subtitle')}</span>
              </h2>
              <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12">
                  {t('service.web.cta_discuss_desc')}
              </p>
              <button 
                onClick={() => openModal(`service-${service.id}-pricing`)}
                className="inline-block bg-primary hover:bg-white hover:text-dark text-white px-12 py-6 rounded-full font-display font-bold text-lg tracking-wider transition-all duration-300 hover:scale-105 shadow-[0_0_50px_-15px_rgba(51,55,173,0.5)]"
              >
                  {t('common.submit_request')}
              </button>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </section>
    </>
  );
};

// --- MAIN WRAPPER ---
const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const service = SERVICES_DATA.find((s) => s.id === id);
  const { getLocalized } = useLanguage();

  // Track service view
  React.useEffect(() => {
    if (service) {
      trackServiceView(service.id, getLocalized(service.title));
    }
  }, [service, getLocalized]);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  switch (service.id) {
      case 'web': return <WebSpecialView service={service} />;
      case 'smm': return <SmmSpecialView service={service} />;
      case 'branding': return <BrandingSpecialView service={service} />;
      case 'automation': return <AutomationSpecialView service={service} />;
      case 'seo_geo': return <SeoSpecialView service={service} />;
      case 'ads': return <AdsSpecialView service={service} />;
      case 'serm': return <SermSpecialView service={service} />;
      default: return <GenericServiceView service={service} />;
  }
};

export default ServiceDetail;