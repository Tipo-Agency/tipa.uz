import React from 'react';
import { Section } from '../components/ui/Section';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { CONTACT_INFO, Icons } from '../constants';
import { Link } from 'react-router-dom';
import { Seo } from '../components/ui/Seo';
import { useLanguage } from '../context/LanguageContext';

const PrivacyPolicy: React.FC = () => {
  const { t } = useLanguage();
  const sections = [
    {
      id: 'terms',
      number: '01',
      title: t('privacy.section_01_title'),
      content: (
        <ul className="space-y-4 text-gray-400">
            <li className="bg-white/5 p-4 rounded-lg border border-white/5">
                <strong className="text-white block mb-1">«{t('privacy.term_admin')}»</strong> 
                {t('privacy.term_admin_desc')}
            </li>
            <li className="bg-white/5 p-4 rounded-lg border border-white/5">
                <strong className="text-white block mb-1">«{t('privacy.term_personal')}»</strong>
                {t('privacy.term_personal_desc')}
            </li>
            <li className="bg-white/5 p-4 rounded-lg border border-white/5">
                <strong className="text-white block mb-1">«{t('privacy.term_processing')}»</strong>
                {t('privacy.term_processing_desc')}
            </li>
            <li className="bg-white/5 p-4 rounded-lg border border-white/5">
                <strong className="text-white block mb-1">«{t('privacy.term_confidentiality')}»</strong>
                {t('privacy.term_confidentiality_desc')}
            </li>
        </ul>
      )
    },
    {
      id: 'subject',
      number: '02',
      title: t('privacy.section_02_title'),
      content: (
        <div className="space-y-4 text-gray-400">
            <p>
                2.1. {t('privacy.subject_2_1')}
            </p>
            <p>
                2.2. {t('privacy.subject_2_2')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {[t('privacy.subject_name'), t('privacy.subject_phone'), t('privacy.subject_email'), t('privacy.subject_project')].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-white font-medium">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        {item}
                    </div>
                ))}
            </div>
        </div>
      )
    },
    {
      id: 'purpose',
      number: '03',
      title: t('privacy.section_03_title'),
      content: (
        <div className="space-y-4 text-gray-400">
            <p>{t('privacy.purpose_intro')}</p>
            <ul className="list-disc list-outside ml-5 space-y-2 marker:text-primary">
                <li>{t('privacy.purpose_1')}</li>
                <li>{t('privacy.purpose_2')}</li>
                <li>{t('privacy.purpose_3')}</li>
                <li>{t('privacy.purpose_4')}</li>
            </ul>
        </div>
      )
    },
    {
      id: 'terms-processing',
      number: '04',
      title: t('privacy.section_04_title'),
      content: (
        <div className="space-y-4 text-gray-400">
            <p>
                4.1. {t('privacy.terms_4_1')} <span className="text-white font-bold">{t('privacy.terms_unlimited')}</span> {t('privacy.terms_4_1_rest')}
            </p>
            <p>
                4.2. {t('privacy.terms_4_2')}
            </p>
        </div>
      )
    },
    {
      id: 'protection',
      number: '05',
      title: t('privacy.section_05_title'),
      content: (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 to-transparent p-6 border border-primary/20">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                <Icons.Shield />
            </div>
            <p className="text-gray-300 relative z-10">
                {t('privacy.protection_text')}
            </p>
        </div>
      )
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Height of header + padding
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <Seo 
        title="Политика конфиденциальности | Типа агентство"
        description="Политика конфиденциальности Типа агентство. Условия обработки персональных данных, права пользователей, контактная информация."
        noindex={true}
      />
      {/* HEADER SECTION */}
      <section className="relative pt-40 pb-20 bg-dark overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-accent-turquoise/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
           <Breadcrumbs />
           
           <div className="flex flex-col md:flex-row items-start justify-between gap-12 mt-8">
               <div className="max-w-3xl">
                   
                   <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight uppercase tracking-tight mb-8">
                       {t('privacy.title')} <br/>
                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-turquoise">{t('privacy.subtitle')}</span>
                   </h1>
                   
                   <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed border-l-2 border-primary pl-6">
                       {t('privacy.intro')}
                   </p>
               </div>
               
               {/* Decorative Shield Icon */}
               <div className="hidden md:block relative mt-8">
                    <div className="w-32 h-32 rounded-full border border-white/10 flex items-center justify-center relative bg-white/5 backdrop-blur-md">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                        <div className="text-white scale-125">
                            <Icons.Shield />
                        </div>
                    </div>
               </div>
           </div>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <Section className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
              
              {/* STICKY NAVIGATION (Desktop) */}
              <div className="hidden lg:block lg:col-span-4 relative">
                  <div className="sticky top-32 space-y-2">
                      <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gray-500 mb-6 px-4">{t('privacy.table_of_contents')}</h4>
                      {sections.map((section) => (
                          <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className="block w-full text-left px-4 py-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
                          >
                              <span className="text-primary mr-3 font-mono opacity-50 group-hover:opacity-100 transition-opacity">{section.number}</span>
                              {section.title}
                          </button>
                      ))}
                      
                      <div className="pt-8 px-4">
                          <Link to="/contact" className="inline-flex items-center gap-2 text-white font-bold text-sm border-b border-primary pb-1 hover:opacity-80 transition-opacity">
                              {t('privacy.have_questions')}
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </Link>
                      </div>
                  </div>
              </div>

              {/* CONTENT BLOCKS */}
              <div className="lg:col-span-8 space-y-8">
                  {sections.map((section) => (
                      <div 
                        key={section.id} 
                        id={section.id}
                        className="group relative bg-dark-surface border border-white/5 rounded-3xl p-8 md:p-12 hover:border-white/10 transition-colors"
                      >
                          {/* Giant Background Number */}
                          <div className="absolute top-4 right-8 text-[80px] font-display font-bold text-white/5 select-none pointer-events-none leading-none group-hover:text-primary/10 transition-colors">
                              {section.number}
                          </div>
                          
                          <div className="relative z-10">
                              <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-8 flex items-center gap-4">
                                  <span className="text-primary text-sm font-mono px-2 py-1 bg-primary/10 rounded">{section.number}</span>
                                  {section.title}
                              </h2>
                              <div className="leading-relaxed">
                                  {section.content}
                              </div>
                          </div>
                      </div>
                  ))}

                  {/* Contact Block */}
                  <div className="mt-12 p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <h3 className="font-display font-bold text-xl text-white mb-2">{t('privacy.still_questions')}</h3>
                      <p className="text-gray-400 mb-6 text-sm">{t('privacy.still_questions_desc')}</p>
                      <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary font-bold text-lg hover:text-white transition-colors">
                          {CONTACT_INFO.email}
                      </a>
                  </div>
              </div>

          </div>
      </Section>
    </>
  );
};

export default PrivacyPolicy;