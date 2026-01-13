import React, { useState } from 'react';
import { Section } from '../components/ui/Section';
import { useLanguage } from '../context/LanguageContext';
import { CONTACT_INFO } from '../constants';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Seo } from '../components/ui/Seo';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', phone: '', task: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormState({ name: '', phone: '', task: '' });
    }, 1500);
  };

  return (
    <>
      <Seo 
        title={t('contact.page_title_1') + ' ' + t('contact.page_title_2') + ' | Типа агентство'}
        description={t('contact.intro')}
        structuredData={{
          '@type': 'ContactPage',
          mainEntity: {
            '@type': 'Organization',
            name: 'Типа агентство',
            telephone: '+998-88-800-05-49',
            email: 'tipaagentstvo@gmail.com',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Ташкент',
              addressCountry: 'UZ',
              addressRegion: 'Tashkent'
            },
            areaServed: {
              '@type': 'Country',
              name: 'Uzbekistan'
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+998-88-800-05-49',
              contactType: 'customer service',
              availableLanguage: ['ru', 'uz', 'en'],
              areaServed: 'UZ'
            }
          }
        }}
      />
      <Section className="min-h-screen flex items-center pt-32">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 w-full">
             <div>
                 <Breadcrumbs />
                 <div className="mt-8">
                    <span className="text-accent-turquoise font-bold tracking-[0.2em] uppercase text-xs mb-6 block">{t('footer.contacts')}</span>
                    <h1 className="font-display font-bold text-5xl md:text-7xl mb-8 text-white leading-tight">
                        {t('contact.page_title_1')} <br/>
                        <span className="text-outline">{t('contact.page_title_2')}</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-12 max-w-md">
                        {t('contact.intro')}
                    </p>
                    
                    <div className="space-y-10">
                        <div className="group">
                            <h4 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-2">{t('contact.label_phone')}</h4>
                            <a href={`tel:${CONTACT_INFO.phoneClean}`} className="text-2xl md:text-3xl font-display font-bold text-white group-hover:text-primary transition-colors">
                                {CONTACT_INFO.phone}
                            </a>
                        </div>
                        <div className="group">
                            <h4 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-2">{t('contact.label_email')}</h4>
                            <a href={`mailto:${CONTACT_INFO.email}`} className="text-2xl md:text-3xl font-display font-bold text-white group-hover:text-primary transition-colors">
                                {CONTACT_INFO.email}
                            </a>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-2">{t('contact.label_office')}</h4>
                            <p className="text-xl text-gray-300">{CONTACT_INFO.address}</p>
                        </div>
                    </div>
                 </div>
             </div>

             <div className="bg-dark-surface p-8 md:p-12 rounded-3xl border border-white/5 relative mt-12 lg:mt-0">
                 {/* Glow effect */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full"></div>

                 {isSuccess ? (
                     <div className="h-full flex flex-col justify-center items-center text-center py-20">
                         <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                         </div>
                         <h3 className="font-display font-bold text-2xl mb-2 text-white">{t('contact.success_title')}</h3>
                         <p className="text-gray-400">{t('contact.success_text')}</p>
                         <button onClick={() => setIsSuccess(false)} className="mt-8 text-primary font-bold hover:text-white transition-colors">{t('contact.send_more')}</button>
                     </div>
                 ) : (
                     <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                         <h3 className="font-display font-bold text-2xl mb-6 text-white">{t('contact.form_title')}</h3>
                         
                         <div className="group">
                             <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider group-focus-within:text-primary transition-colors">{t('contact.form_name')}</label>
                             <input 
                                type="text" 
                                required
                                className="w-full px-0 py-3 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:border-primary focus:outline-none transition-all text-lg"
                                placeholder={t('contact.form_name')}
                                value={formState.name}
                                onChange={e => setFormState({...formState, name: e.target.value})}
                             />
                         </div>
                         
                         <div className="group">
                             <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider group-focus-within:text-primary transition-colors">{t('contact.form_contact')}</label>
                             <input 
                                type="text" 
                                required
                                className="w-full px-0 py-3 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:border-primary focus:outline-none transition-all text-lg"
                                placeholder={t('contact.form_contact')}
                                value={formState.phone}
                                onChange={e => setFormState({...formState, phone: e.target.value})}
                             />
                         </div>

                         <div className="group">
                             <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider group-focus-within:text-primary transition-colors">{t('contact.form_task')}</label>
                             <textarea 
                                rows={3}
                                className="w-full px-0 py-3 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:border-primary focus:outline-none transition-all text-lg resize-none"
                                placeholder={t('contact.form_task')}
                                value={formState.task}
                                onChange={e => setFormState({...formState, task: e.target.value})}
                             />
                         </div>

                         <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`w-full py-5 rounded-full font-display font-bold text-sm tracking-widest uppercase transition-all ${isSubmitting ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-white text-dark hover:bg-primary hover:text-white'}`}
                         >
                            {isSubmitting ? t('contact.sending') : t('contact.form_btn')}
                         </button>
                     </form>
                 )}
             </div>
         </div>
      </Section>
    </>
  );
};

export default Contact;