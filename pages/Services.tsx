import React from 'react';
import { Link } from 'react-router-dom';
import { useLocalizedLink } from '../lib/useLocalizedLink';
import { SERVICES_DATA, Icons } from '../constants';
import { Section } from '../components/ui/Section';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { useModal } from '../context/ModalContext';
import { Seo } from '../components/ui/Seo';
import { trackCTAClick } from '../lib/analytics';

// --- Abstract Visual Components for each service ---

const WebVisual = () => (
  <div className="relative w-full h-full min-h-[300px] flex items-center justify-center p-8">
    {/* Abstract Browser Window */}
    <div className="w-full max-w-sm bg-dark border border-white/10 rounded-xl overflow-hidden shadow-2xl relative z-10 transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
      <div className="bg-white/5 p-3 border-b border-white/5 flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex gap-4">
           <div className="w-1/3 h-24 bg-white/5 rounded-lg animate-pulse"></div>
           <div className="w-2/3 space-y-2">
              <div className="h-4 w-3/4 bg-primary/40 rounded"></div>
              <div className="h-2 w-full bg-white/10 rounded"></div>
              <div className="h-2 w-5/6 bg-white/10 rounded"></div>
           </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
            <div className="h-16 bg-white/5 rounded-lg"></div>
            <div className="h-16 bg-white/5 rounded-lg"></div>
            <div className="h-16 bg-white/5 rounded-lg"></div>
        </div>
        <div className="h-10 w-full bg-accent-coral/20 rounded-lg flex items-center justify-center text-accent-coral text-xs font-bold uppercase tracking-widest">
            Conversion +150%
        </div>
      </div>
    </div>
    {/* Floating Code Snippet */}
    <div className="absolute -bottom-4 -right-4 bg-black/80 border border-white/10 p-4 rounded-lg font-mono text-xs text-accent-turquoise backdrop-blur-md z-20">
       {'<Component type="Sales" />'}
    </div>
  </div>
);

const SmmVisual = () => (
  <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
      <div className="relative z-10 grid grid-cols-2 gap-4 transform rotate-[6deg] hover:rotate-0 transition-transform duration-500">
          <div className="w-32 h-40 bg-gradient-to-br from-purple-900/40 to-dark border border-white/10 rounded-2xl flex flex-col justify-end p-4">
             <div className="w-8 h-8 rounded-full bg-white/10 mb-auto"></div>
             <div className="w-full h-2 bg-white/20 rounded mb-2"></div>
             <div className="w-2/3 h-2 bg-white/20 rounded"></div>
          </div>
          <div className="w-32 h-40 bg-gradient-to-br from-blue-900/40 to-dark border border-white/10 rounded-2xl flex flex-col justify-end p-4 mt-8">
              <div className="w-full h-24 bg-accent-turquoise/20 rounded-lg mb-2 relative overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-1"></div>
                    </div>
                 </div>
              </div>
          </div>
      </div>
      {/* Floating Likes */}
      <div className="absolute top-1/4 left-1/4 p-3 bg-dark rounded-full border border-white/10 shadow-xl animate-float">
          <Icons.Check />
      </div>
  </div>
);

const BrandingVisual = () => (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
        <div className="relative w-64 h-64 border border-white/5 rounded-full flex items-center justify-center">
            <div className="absolute inset-0 border border-white/5 rounded-full scale-75"></div>
            <div className="absolute inset-0 border border-white/5 rounded-full scale-50"></div>
            
            {/* Logo Construction Lines */}
            <div className="absolute h-full w-px bg-accent-amethyst/30"></div>
            <div className="absolute w-full h-px bg-accent-amethyst/30"></div>
            <div className="absolute h-full w-px bg-accent-amethyst/30 rotate-45"></div>
            <div className="absolute h-full w-px bg-accent-amethyst/30 -rotate-45"></div>

            <div className="w-20 h-20 bg-accent-amethyst rounded-xl transform rotate-12 flex items-center justify-center text-4xl font-display font-bold text-white shadow-[0_0_30px_rgba(155,89,182,0.5)] z-10">
                T
            </div>
        </div>
    </div>
);

const AutoVisual = () => (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
        <div className="flex gap-8 items-center">
            <div className="flex flex-col gap-4">
                 <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                    1
                 </div>
                 <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                    2
                 </div>
            </div>
            
            {/* Connector */}
            <div className="w-16 h-1 bg-gradient-to-r from-gray-700 to-accent-orange relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent-orange rounded-full shadow-[0_0_10px_#FFD166]"></div>
            </div>

            <div className="w-40 bg-dark border border-accent-orange/30 rounded-xl p-4 shadow-[0_0_20px_rgba(255,209,102,0.1)]">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-gray-400 uppercase">Status</span>
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">Paid</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded mb-2"></div>
                <div className="h-2 w-2/3 bg-white/10 rounded"></div>
            </div>
        </div>
    </div>
);

const SeoVisual = () => (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
        <div className="w-full max-w-sm bg-dark border border-white/10 rounded-xl p-4 relative z-10">
             <div className="flex gap-2 items-center bg-white/5 p-3 rounded-lg mb-4 border border-white/5">
                 <div className="text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 </div>
                 <div className="text-sm text-gray-300">best agency tashkent</div>
             </div>
             
             <div className="space-y-3">
                 <div className="p-3 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-accent-mint/30">
                     <div className="text-xs text-accent-mint mb-1">tipa.uz</div>
                     <div className="h-3 w-3/4 bg-primary/40 rounded mb-2"></div>
                     <div className="h-2 w-full bg-white/10 rounded"></div>
                 </div>
                 <div className="p-3 rounded-lg opacity-50">
                     <div className="h-3 w-1/2 bg-white/10 rounded mb-2"></div>
                     <div className="h-2 w-full bg-white/5 rounded"></div>
                 </div>
             </div>
             
             <div className="absolute -right-4 top-1/2 bg-accent-mint text-dark font-bold text-xs px-3 py-1 rounded-full shadow-lg transform rotate-12">
                 TOP #1
             </div>
        </div>
    </div>
);

const SermVisual = () => (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
        <div className="relative">
             <div className="w-32 h-40 bg-white/5 border border-white/10 rounded-2xl transform -rotate-6 scale-90 opacity-50 absolute top-0 left-0"></div>
             <div className="w-32 h-40 bg-white/5 border border-white/10 rounded-2xl transform rotate-6 scale-95 opacity-70 absolute top-0 left-0"></div>
             
             <div className="w-64 bg-dark border border-white/10 rounded-2xl p-6 relative z-10 shadow-2xl">
                 <div className="flex justify-center mb-4 text-accent-yellow space-x-1">
                     <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                 </div>
                 <div className="text-center text-white font-bold text-lg mb-2">Trusted Partner</div>
                 <div className="h-2 w-full bg-white/10 rounded mb-2"></div>
                 <div className="h-2 w-2/3 bg-white/10 rounded mx-auto"></div>
                 
                 <div className="mt-4 flex justify-center">
                    <div className="w-8 h-8 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                        <Icons.Check />
                    </div>
                 </div>
             </div>
        </div>
    </div>
);

const AdsVisual = () => (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
        {/* Abstract Search Result Card */}
        <div className="bg-dark border border-white/10 p-6 rounded-xl w-64 relative z-10 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            {/* Ad Label */}
            <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#F4B400] text-black text-[10px] font-bold px-1.5 py-0.5 rounded">Ad</span>
                <div className="h-2 w-32 bg-white/20 rounded-full"></div>
            </div>
            {/* Title */}
            <div className="h-4 w-3/4 bg-accent-sky/40 rounded mb-3"></div>
            {/* Description lines */}
            <div className="h-2 w-full bg-white/10 rounded mb-2"></div>
            <div className="h-2 w-2/3 bg-white/10 rounded"></div>

            {/* Mouse Cursor clicking the ad */}
            <div className="absolute -bottom-6 -right-6 drop-shadow-[0_0_15px_rgba(69,183,209,0.5)] animate-pulse">
                <svg className="w-12 h-12 text-white fill-white" viewBox="0 0 24 24">
                    <path stroke="black" strokeWidth="1" d="M5.5 3.5l10 9.5-4.5 1 4.5 5.5-2.5 1.5-4.5-5.5-2 3v-15z"/>
                </svg>
            </div>
        </div>
        
        {/* Background decorative Chart (Growth) */}
        <div className="absolute right-10 bottom-16 flex items-end gap-2 opacity-20 pointer-events-none">
            <div className="w-4 h-12 bg-white rounded-t"></div>
            <div className="w-4 h-20 bg-white rounded-t"></div>
            <div className="w-4 h-32 bg-accent-sky rounded-t"></div>
        </div>
    </div>
);

// Map ID to Visual
const getServiceVisual = (id: string) => {
    switch (id) {
        case 'web': return <WebVisual />;
        case 'smm': return <SmmVisual />;
        case 'branding': return <BrandingVisual />;
        case 'automation': return <AutoVisual />;
        case 'seo_geo': return <SeoVisual />;
        case 'serm': return <SermVisual />;
        case 'ads': return <AdsVisual />;
        default: return <WebVisual />;
    }
};

const Services: React.FC = () => {
  const { t, getLocalized } = useLanguage();
  const { openModal } = useModal();

  return (
    <>
      <Seo 
        title="Услуги Digital-агентства | Разработка, маркетинг, автоматизация"
        description="Полный спектр digital-услуг: разработка сайтов и веб-приложений, SMM и контент-маркетинг, брендинг и айдентика, автоматизация бизнеса и CRM, SEO и контекстная реклама, управление репутацией. Типа агентство — ваш системный партнер."
        structuredData={{
          '@type': 'Service',
          serviceType: 'Digital Marketing Agency',
          provider: {
            '@type': 'Organization',
            name: 'Типа агентство'
          },
          areaServed: {
            '@type': 'Country',
            name: 'Uzbekistan'
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Digital Services',
            itemListElement: SERVICES_DATA.map((service, index) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: service.title.ru,
                description: service.shortDescription.ru
              },
              position: index + 1
            }))
          }
        }}
      />
      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
            <Breadcrumbs />
            
            <div className="max-w-5xl mt-8">
                <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl mb-8 text-white leading-[1.1]">
                    {t('services.title')} <span className="text-primary">{t('services.title_highlight')}</span>
                </h1>
                
                <div className="flex flex-col md:flex-row gap-8 md:items-end">
                    <div className="max-w-2xl">
                        <p className="text-xl md:text-2xl text-gray-400 leading-relaxed border-l-4 border-primary pl-8">
                           {t('services.intro_1')}
                        </p>
                        <p className="mt-6 text-lg text-gray-500">
                           {t('services.intro_2')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* SERVICES ZIG-ZAG LIST */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
            <div className="space-y-32">
                {SERVICES_DATA.map((service, index) => (
                    <div 
                        key={service.id} 
                        id={service.id}
                        className={`flex flex-col lg:flex-row gap-16 lg:gap-24 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                    >
                        {/* TEXT CONTENT SIDE */}
                        <div className="w-full lg:w-1/2 relative z-10">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-white/5 border border-white/10 ${service.accentColor}`}>
                                {React.cloneElement(service.icon as React.ReactElement, { className: "w-8 h-8" })}
                            </div>
                            
                            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 text-white">
                                {getLocalized(service.title)}
                            </h2>
                            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                                {getLocalized(service.shortDescription)}
                            </p>
                            
                            <div className="mb-10">
                                <h4 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-4 border-b border-white/10 pb-2 inline-block">
                                    {t('services.what_we_do')}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                                    {service.types.map((type, idx) => (
                                        <div key={idx} className="flex items-center text-gray-300">
                                            <span className={`w-1.5 h-1.5 rounded-full mr-3 ${service.accentColor.replace('text-', 'bg-')}`}></span>
                                            {getLocalized(type)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <Link 
                                to={useLocalizedLink(`/services/${service.id}`)}
                                className={`inline-flex items-center gap-3 font-display font-bold uppercase tracking-wider text-sm border-b-2 border-white/20 pb-1 hover:border-primary hover:text-primary transition-all ${service.accentColor}`}
                            >
                                {t('common.read_more')}
                                <span className="text-xl">→</span>
                            </Link>
                        </div>

                        {/* VISUAL SIDE */}
                        <div className="w-full lg:w-1/2">
                            <div className="relative aspect-square md:aspect-[4/3] rounded-[3rem] bg-dark-surface border border-white/5 overflow-hidden group">
                                {/* Ambient Background Glow based on service color */}
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 rounded-full opacity-10 blur-[80px] group-hover:opacity-20 transition-opacity duration-700 ${service.accentColor.replace('text-', 'bg-')}`}></div>
                                
                                {/* The Graphic */}
                                <div className="relative z-10 h-full w-full">
                                    {getServiceVisual(service.id)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

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
                  trackCTAClick('start_project', 'services_page');
                  openModal();
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

export default Services;