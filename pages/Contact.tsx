import React, { useState, useEffect } from 'react';
import { Section } from '../components/ui/Section';
import { useLanguage } from '../context/LanguageContext';
import { CONTACT_INFO, Icons } from '../constants';
import { trackSocialClick } from '../lib/analytics';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Seo } from '../components/ui/Seo';
import { useModal } from '../context/ModalContext';
import { createLead } from '../services/leadService';
import { trackFormSubmit, trackLeadSubmit, trackOpenForm } from '../lib/analytics';

// Список стран с кодами
const getCountries = (t: (key: string) => string) => [
  { code: 'UZ', name: t('lead.country_uz'), dialCode: '+998', flag: '🇺🇿' },
  { code: 'RU', name: t('lead.country_ru'), dialCode: '+7', flag: '🇷🇺' },
  { code: 'KZ', name: t('lead.country_kz'), dialCode: '+7', flag: '🇰🇿' },
  { code: 'TJ', name: t('lead.country_tj'), dialCode: '+992', flag: '🇹🇯' },
  { code: 'KG', name: t('lead.country_kg'), dialCode: '+996', flag: '🇰🇬' },
  { code: 'US', name: t('lead.country_us'), dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: t('lead.country_gb'), dialCode: '+44', flag: '🇬🇧' },
];

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const { openThankYou } = useModal();
  const countries = getCountries(t);
  const [formState, setFormState] = useState({ 
    fullName: '', 
    phone: '', 
    phoneCountryCode: '+998',
    phoneCountry: 'UZ'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [showCountrySelect, setShowCountrySelect] = useState(false);

  const selectedCountry = countries.find(c => c.code === formState.phoneCountry) || countries[0];

  // Отслеживаем открытие формы на странице контактов (форма всегда видна)
  useEffect(() => {
    trackOpenForm('contact_page');
  }, []);

  const formatPhone = (value: string, dialCode: string) => {
    let digits = value.replace(/\D/g, '');
    const dialCodeDigits = dialCode.replace(/\D/g, '');
    if (digits.startsWith(dialCodeDigits)) {
      digits = digits.slice(dialCodeDigits.length);
    }
    
    if (dialCode === '+998') {
      if (digits.length <= 2) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
      if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
      return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
    } else if (dialCode === '+7') {
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      if (digits.length <= 8) return `${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(6)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
    } else if (dialCode === '+1') {
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (dialCode === '+44') {
      if (digits.length <= 4) return digits;
      return `${digits.slice(0, 4)} ${digits.slice(4, 10)}`;
    } else if (dialCode === '+992' || dialCode === '+996') {
      if (digits.length <= 3) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3, 5)}-${digits.slice(5)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 5)}-${digits.slice(5, 7)}-${digits.slice(7, 9)}`;
    }
    return digits.slice(0, 15);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let digits = value.replace(/\D/g, '');
    const dialCodeDigits = formState.phoneCountryCode.replace(/\D/g, '');
    if (digits.startsWith(dialCodeDigits)) {
      digits = digits.slice(dialCodeDigits.length);
    }
    const formatted = formatPhone(digits, formState.phoneCountryCode);
    setFormState({ ...formState, phone: formatted });
  };

  const handleCountrySelect = (country: typeof countries[0]) => {
    let phoneDigits = formState.phone.replace(/\D/g, '');
    const oldDialCodeDigits = formState.phoneCountryCode.replace(/\D/g, '');
    if (phoneDigits.startsWith(oldDialCodeDigits)) {
      phoneDigits = phoneDigits.slice(oldDialCodeDigits.length);
    }
    const formatted = formatPhone(phoneDigits, country.dialCode);
    setFormState(prev => ({ 
      ...prev, 
      phoneCountryCode: country.dialCode,
      phoneCountry: country.code,
      phone: formatted 
    }));
    setShowCountrySelect(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formState.fullName.trim()) {
      setError(t('lead.error_name') || 'Введите имя');
      return;
    }

    if (!formState.phone.trim()) {
      setError(t('lead.error_phone') || 'Введите телефон');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const nameParts = formState.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const leadId = await createLead({
        firstName: firstName,
        lastName: lastName,
        phone: formState.phone.trim(),
        phoneCountryCode: formState.phoneCountryCode,
        sourceSection: 'contact_page',
      });

      try {
        trackFormSubmit('contact_form', 'contact_page', {
          phone_country_code: formState.phoneCountryCode,
          lead_id: leadId
        });
        
        // Отправляем макроцель успешной отправки заявки в Яндекс.Метрике
        trackLeadSubmit();
      } catch (analyticsError) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Analytics tracking failed:', analyticsError);
        }
      }

      setIsSubmitting(false);
      setFormState({ 
        fullName: '', 
        phone: '', 
        phoneCountryCode: '+998',
        phoneCountry: 'UZ'
      });
      
      // Открываем попап "Спасибо" через небольшую задержку для плавности
      setTimeout(() => {
        openThankYou();
      }, 300);
    } catch (error: any) {
      console.error('❌ Error submitting contact form:', error);
      setIsSubmitting(false);
      setError(t('lead.error_submit') || 'Ошибка отправки. Попробуйте позже.');
    }
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

                 <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                     <h3 className="font-display font-bold text-2xl mb-6 text-white">{t('contact.form_title')}</h3>
                     
                     {error && (
                         <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                             {error}
                         </div>
                     )}
                     
                     <div className="group">
                         <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider group-focus-within:text-primary transition-colors">{t('contact.form_name')}</label>
                         <input 
                            type="text" 
                            required
                            className="w-full px-0 py-3 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:border-primary focus:outline-none transition-all text-lg"
                            placeholder={t('contact.form_name')}
                            value={formState.fullName}
                            onChange={e => setFormState({...formState, fullName: e.target.value})}
                         />
                     </div>
                     
                     <div className="group">
                         <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider group-focus-within:text-primary transition-colors">{t('contact.form_contact')}</label>
                         <div className="flex gap-2">
                             <div className="relative">
                                 <button
                                     type="button"
                                     onClick={() => setShowCountrySelect(!showCountrySelect)}
                                     className="px-4 py-3 bg-gray-800/50 border-b border-gray-700 text-white hover:border-primary transition-all flex items-center gap-2 min-w-[100px]"
                                 >
                                     <span>{selectedCountry.flag}</span>
                                     <span className="text-sm">{selectedCountry.dialCode}</span>
                                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                     </svg>
                                 </button>
                                 
                                 {showCountrySelect && (
                                     <>
                                         <div 
                                             className="fixed inset-0 z-10" 
                                             onClick={() => setShowCountrySelect(false)}
                                         ></div>
                                         <div className="absolute top-full left-0 mt-1 bg-dark-surface border border-white/10 rounded-lg shadow-xl z-20 max-h-64 overflow-y-auto min-w-[200px]">
                                             {countries.map((country) => (
                                                 <button
                                                     key={country.code}
                                                     type="button"
                                                     onClick={() => handleCountrySelect(country)}
                                                     className={`w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-colors flex items-center gap-3 ${
                                                         formState.phoneCountry === country.code ? 'bg-primary/20' : ''
                                                     }`}
                                                 >
                                                     <span className="text-xl">{country.flag}</span>
                                                     <span className="text-white flex-1">{country.name}</span>
                                                     <span className="text-gray-400 text-sm">{country.dialCode}</span>
                                                 </button>
                                             ))}
                                         </div>
                                     </>
                                 )}
                             </div>
                             <input 
                                type="tel" 
                                required
                                className="flex-1 px-0 py-3 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:border-primary focus:outline-none transition-all text-lg"
                                placeholder={t('contact.form_contact')}
                                value={formState.phone}
                                onChange={handlePhoneChange}
                             />
                         </div>
                     </div>

                     <a
                         href={CONTACT_INFO.socials.telegram}
                         target="_blank"
                         rel="noopener noreferrer"
                         onClick={() => trackSocialClick('telegram', { location: 'contact_page' })}
                         className="flex items-center justify-center gap-3 w-full py-4 rounded-full border-2 border-[#2AABEE]/50 text-[#2AABEE] hover:bg-[#2AABEE]/10 hover:border-[#2AABEE] transition-all font-display font-bold text-sm tracking-widest uppercase mb-6"
                     >
                         <Icons.Telegram />
                         {t('contact.write_telegram')}
                     </a>

                     <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full py-5 rounded-full font-display font-bold text-sm tracking-widest uppercase transition-all ${isSubmitting ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-white text-dark hover:bg-primary hover:text-white'}`}
                     >
                        {isSubmitting ? t('contact.sending') : t('contact.form_btn')}
                     </button>
                 </form>
             </div>
         </div>
      </Section>
    </>
  );
};

export default Contact;