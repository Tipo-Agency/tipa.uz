import React from 'react';
import { Section, SectionTitle } from '../components/ui/Section';
import { Icons } from '../constants';
import { useModal } from '../context/ModalContext';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Seo } from '../components/ui/Seo';
import { trackCTAClick } from '../lib/analytics';

const About: React.FC = () => {
  const { openModal } = useModal();
  const { t } = useLanguage();

  return (
    <>
      <Seo 
        title="О нас | Типа агентство — системный digital-партнер"
        description="Типа агентство — системный digital-партнер в Узбекистане. Команда экспертов по разработке сайтов, SMM, брендингу, автоматизации бизнеса и digital-маркетингу. Превращаем бизнес в цифровую экосистему."
        structuredData={{
          '@type': 'AboutPage',
          mainEntity: {
            '@type': 'Organization',
            name: 'Типа агентство',
            url: 'https://tipa.uz',
            logo: 'https://tipa.uz/favicon.svg',
            description: 'Системный digital-партнер в Узбекистане',
            foundingDate: '2020',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Ташкент',
              addressCountry: 'UZ'
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+998-88-800-05-49',
              contactType: 'customer service',
              email: 'tipaagentstvo@gmail.com'
            },
            sameAs: [
              'https://t.me/tipa_agency',
              'https://www.instagram.com/tipa_agency/'
            ]
          }
        }}
      />
      {/* HERO */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
             <Breadcrumbs />

             <div className="flex items-center gap-3 mb-6 mt-8">
                <span className="h-px w-12 bg-accent-turquoise"></span>
                <span className="text-accent-turquoise font-bold uppercase tracking-widest text-sm">{t('about.who_we_are')}</span>
             </div>
             
             <h1 className="font-display font-bold text-5xl md:text-8xl mb-10 text-white leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{t('about.agency_name')}</span><br/>
                <span className="text-primary">{t('about.approach')}</span>
             </h1>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
                 <p className="text-xl text-gray-300 leading-relaxed border-l-2 border-primary/50 pl-6">
                    {t('about.intro_p1')}
                 </p>
                 <div className="text-lg text-gray-400 font-light">
                    {t('about.intro_p2')}
                 </div>
             </div>
        </div>
      </section>

      {/* STATS REWORKED (DARK & BOLD) */}
      <Section className="py-0">
         <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
             <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
                 
                 {/* Item 1 */}
                 <div className="p-10 md:p-16 relative group hover:bg-white/5 transition-colors duration-500">
                     <div className="absolute top-10 right-10 opacity-20 group-hover:opacity-100 transition-opacity">
                        <svg className="w-8 h-8 text-accent-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                     </div>
                     <div className="text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600 mb-6 group-hover:text-white transition-colors">
                        0%
                     </div>
                     <h3 className="text-accent-coral font-bold text-xl uppercase tracking-widest mb-4">{t('about.stats_water')}</h3>
                     <p className="text-gray-400 leading-relaxed">
                        {t('about.stats_water_desc')}
                     </p>
                 </div>

                 {/* Item 2 */}
                 <div className="p-10 md:p-16 relative group hover:bg-white/5 transition-colors duration-500">
                     <div className="absolute top-10 right-10 opacity-20 group-hover:opacity-100 transition-opacity">
                        <svg className="w-8 h-8 text-accent-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                     </div>
                     <div className="text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600 mb-6 group-hover:text-white transition-colors">
                        100%
                     </div>
                     <h3 className="text-accent-turquoise font-bold text-xl uppercase tracking-widest mb-4">{t('about.stats_immersion')}</h3>
                     <p className="text-gray-400 leading-relaxed">
                        {t('about.stats_immersion_desc')}
                     </p>
                 </div>

                 {/* Item 3 */}
                 <div className="p-10 md:p-16 relative group hover:bg-white/5 transition-colors duration-500">
                     <div className="absolute top-10 right-10 opacity-20 group-hover:opacity-100 transition-opacity">
                        <svg className="w-8 h-8 text-accent-amethyst" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                     </div>
                     <div className="text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600 mb-6 group-hover:text-white transition-colors">
                        360°
                     </div>
                     <h3 className="text-accent-amethyst font-bold text-xl uppercase tracking-widest mb-4">{t('about.stats_approach')}</h3>
                     <p className="text-gray-400 leading-relaxed">
                        {t('about.stats_approach_desc')}
                     </p>
                 </div>

             </div>
         </div>
      </Section>
      
      {/* PHILOSOPHY REWORKED */}
      <Section className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
              <div className="lg:col-span-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-px w-12 bg-primary"></span>
                    <span className="text-gray-500 font-display font-bold uppercase tracking-widest text-xs">{t('about.how_we_think')}</span>
                  </div>
                  <h2 className="font-display font-bold text-5xl md:text-7xl text-white mb-8 uppercase leading-none tracking-tight">
                    {t('about.philosophy_title')}
                  </h2>
                  
                  <div className="space-y-6 text-lg md:text-xl leading-relaxed text-gray-300">
                      <p className="font-medium text-white border-l-4 border-primary pl-6 py-1">
                        {t('about.philo_bold')}
                      </p>
                      <p>
                        {t('about.philo_p1')}
                      </p>
                      <p>
                        {t('about.philo_p2')}
                      </p>
                  </div>
              </div>
              
              <div className="lg:col-span-6 relative">
                  {/* Decorative background for the card */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent-turquoise rounded-[2.5rem] opacity-20 blur-xl transform rotate-3"></div>
                  
                  <div className="relative bg-[#0F0F0F] border border-white/10 rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
                      
                      <h3 className="relative z-10 font-display font-bold text-3xl text-white mb-10">{t('about.manifesto')}</h3>
                      
                      <ul className="relative z-10 space-y-8">
                          {[
                            t('about.man_1'),
                            t('about.man_2'),
                            t('about.man_3'),
                            t('about.man_4')
                          ].map((item, i) => (
                            <li key={i} className="flex items-center gap-5 group">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_20px_rgba(51,55,173,0.4)] group-hover:scale-110 group-hover:bg-accent-turquoise group-hover:shadow-[0_0_20px_rgba(78,205,196,0.4)] transition-all duration-300">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-xl font-medium text-gray-200 group-hover:text-white transition-colors">{item}</span>
                            </li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>
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
                  trackCTAClick('start_project', 'about_page');
                  openModal('about-page');
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

export default About;