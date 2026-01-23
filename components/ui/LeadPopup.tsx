import React, { useState, useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import { useLanguage } from '../../context/LanguageContext';
import { createLead } from '../../services/leadService';
import { trackFormSubmit } from '../../lib/analytics';
import { Link } from 'react-router-dom';

// Список стран с кодами - будет переведен внутри компонента
const getCountries = (t: (key: string) => string) => [
  { code: 'UZ', name: t('lead.country_uz'), dialCode: '+998', flag: '🇺🇿' },
  { code: 'RU', name: t('lead.country_ru'), dialCode: '+7', flag: '🇷🇺' },
  { code: 'KZ', name: t('lead.country_kz'), dialCode: '+7', flag: '🇰🇿' },
  { code: 'TJ', name: t('lead.country_tj'), dialCode: '+992', flag: '🇹🇯' },
  { code: 'KG', name: t('lead.country_kg'), dialCode: '+996', flag: '🇰🇬' },
  { code: 'US', name: t('lead.country_us'), dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: t('lead.country_gb'), dialCode: '+44', flag: '🇬🇧' },
];

export const LeadPopup: React.FC = () => {
  const { isOpen, closeModal, sourceSection, openThankYou } = useModal();
  const { t } = useLanguage();
  const countries = getCountries(t);
  const [formState, setFormState] = useState({ 
    fullName: '', 
    phone: '', 
    phoneCountryCode: '+998',
    phoneCountry: 'UZ', // Сохраняем код страны для различения стран с одинаковым dialCode
    task: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCountrySelect, setShowCountrySelect] = useState(false);
  const [error, setError] = useState<string>('');

  // Блокируем скролл body когда модальное окно открыто
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Debug log
      if (process.env.NODE_ENV === 'development') {
        console.log('🔓 Modal opened, sourceSection:', sourceSection);
      }
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, sourceSection]);

  if (!isOpen) {
    return null;
  }

  const selectedCountry = countries.find(c => c.code === formState.phoneCountry) || countries[0];

  const formatPhone = (value: string, dialCode: string) => {
    // Убираем все кроме цифр
    let digits = value.replace(/\D/g, '');
    
    // Убираем код страны если он есть в начале
    const dialCodeDigits = dialCode.replace(/\D/g, '');
    if (digits.startsWith(dialCodeDigits)) {
      digits = digits.slice(dialCodeDigits.length);
    }
    
    // Форматируем в зависимости от страны
    if (dialCode === '+998') {
      // Узбекистан: XX XXX XX XX (9 цифр)
      if (digits.length <= 2) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
      if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
      return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
    } else if (dialCode === '+7') {
      // Россия/Казахстан: XXX XXX-XX-XX (10 цифр)
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      if (digits.length <= 8) return `${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(6)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
    } else if (dialCode === '+1') {
      // США/Канада: (XXX) XXX-XXXX (10 цифр)
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (dialCode === '+44') {
      // Великобритания: XXXX XXXXXX (10-11 цифр)
      if (digits.length <= 4) return digits;
      return `${digits.slice(0, 4)} ${digits.slice(4, 10)}`;
    } else if (dialCode === '+992' || dialCode === '+996') {
      // Таджикистан/Кыргызстан: XXX XX-XX-XX (9 цифр)
      if (digits.length <= 3) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3, 5)}-${digits.slice(5)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 5)}-${digits.slice(5, 7)}-${digits.slice(7, 9)}`;
    }
    
    // Для остальных стран просто ограничиваем длину
    return digits.slice(0, 15);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Извлекаем только цифры
    let digits = value.replace(/\D/g, '');
    
    // Убираем код страны если он есть в начале
    const dialCodeDigits = formState.phoneCountryCode.replace(/\D/g, '');
    if (digits.startsWith(dialCodeDigits)) {
      digits = digits.slice(dialCodeDigits.length);
    }
    
    // Применяем маску
    const formatted = formatPhone(digits, formState.phoneCountryCode);
    setFormState({ ...formState, phone: formatted });
  };

  const handleCountrySelect = (country: typeof countries[0]) => {
    // При смене страны извлекаем только цифры из текущего номера
    let phoneDigits = formState.phone.replace(/\D/g, '');
    
    // Убираем старый код страны если он есть в начале
    const oldDialCodeDigits = formState.phoneCountryCode.replace(/\D/g, '');
    if (phoneDigits.startsWith(oldDialCodeDigits)) {
      phoneDigits = phoneDigits.slice(oldDialCodeDigits.length);
    }
    
    // Применяем новую маску к номеру без кода страны
    const formatted = formatPhone(phoneDigits, country.dialCode);
    
    // Обновляем состояние (сохраняем и dialCode и code страны)
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

    // Автоматическое согласие с политикой при отправке формы
    setIsSubmitting(true);
    
    try {
      // Разделяем полное имя на имя и фамилию
      const nameParts = formState.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const leadId = await createLead({
        firstName: firstName,
        lastName: lastName,
        phone: formState.phone.trim(),
        phoneCountryCode: formState.phoneCountryCode,
        task: formState.task.trim() || undefined,
        sourceSection: sourceSection || 'unknown',
      });

      // Track form submission (не блокируем успех формы, если аналитика упадет)
      try {
        trackFormSubmit('lead_form', sourceSection || 'unknown', {
          phone_country_code: formState.phoneCountryCode,
          has_task: !!formState.task.trim(),
          lead_id: leadId
        });
      } catch (analyticsError) {
        // Логируем ошибку аналитики, но не блокируем успех формы
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Analytics tracking failed:', analyticsError);
        }
      }

      setIsSubmitting(false);
      setFormState({ 
        fullName: '', 
        phone: '', 
        phoneCountryCode: '+998',
        phoneCountry: 'UZ',
        task: ''
      });
      
      // Закрываем модалку формы и открываем попап "Спасибо"
      closeModal();
      setTimeout(() => {
        openThankYou();
      }, 300);
    } catch (err: any) {
      console.error('❌ Error submitting lead:', err);
      
      // Более детальное сообщение об ошибке для пользователя
      let errorMessage = t('contact.error_generic');
      
      if (err?.code === 'permission-denied') {
        errorMessage = t('contact.error_permission') || 'Ошибка доступа. Проверьте настройки безопасности.';
      } else if (err?.code === 'unavailable') {
        errorMessage = t('contact.error_network') || 'Проблема с сетью. Проверьте подключение к интернету.';
      } else if (err?.message) {
        // В dev режиме показываем детальную ошибку
        if (process.env.NODE_ENV === 'development') {
          errorMessage = `Ошибка: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-dark/90 backdrop-blur-sm z-[200]" 
        onClick={(e) => {
          if (e.target === e.currentTarget && !showCountrySelect) {
            closeModal();
          }
        }}
      ></div>
      
      {/* Закрыть при клике вне модального окна (но не когда открыт селектор стран) */}
      {showCountrySelect && (
        <div 
          className="fixed inset-0 z-[199]" 
          onClick={(e) => {
            // Закрываем селектор только если клик не на самом селекторе
            const target = e.target as HTMLElement;
            if (!target.closest('.country-select-dropdown')) {
              setShowCountrySelect(false);
            }
          }}
        />
      )}

      {/* Modal Container */}
      <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 overflow-y-auto pointer-events-none">
        {/* Modal Content */}
        <div className="relative bg-dark-surface border border-white/10 rounded-3xl p-8 md:p-12 w-full max-w-lg shadow-2xl transform transition-all pointer-events-auto my-auto">
        <button 
          onClick={closeModal}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">{t('home.cta_title')}</h2>
              <p className="text-gray-400 text-sm">{t('contact.intro')}</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Имя и Фамилия */}
              <div>
                <input 
                  type="text" 
                  required
                  placeholder={t('lead.name_placeholder')}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:bg-white/10 transition-all"
                  value={formState.fullName}
                  onChange={e => setFormState({...formState, fullName: e.target.value})}
                />
              </div>

              {/* Телефон с выбором страны */}
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountrySelect(!showCountrySelect)}
                      className="px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all flex items-center gap-2 min-w-[120px]"
                    >
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="text-sm">{selectedCountry.dialCode}</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showCountrySelect && (
                      <div 
                        className="country-select-dropdown absolute top-full left-0 mt-2 bg-dark-surface border border-white/10 rounded-xl shadow-2xl z-[250] max-h-60 w-64 overflow-y-auto"
                        style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <style>{`
                          .country-select-dropdown::-webkit-scrollbar {
                            width: 6px;
                          }
                          .country-select-dropdown::-webkit-scrollbar-track {
                            background: transparent;
                          }
                          .country-select-dropdown::-webkit-scrollbar-thumb {
                            background: rgba(255, 255, 255, 0.2);
                            border-radius: 3px;
                          }
                          .country-select-dropdown::-webkit-scrollbar-thumb:hover {
                            background: rgba(255, 255, 255, 0.3);
                          }
                        `}</style>
                        {countries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCountrySelect(country);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 ${
                              country.code === formState.phoneCountry ? 'bg-primary/20' : ''
                            }`}
                          >
                            <span className="text-lg flex-shrink-0">{country.flag}</span>
                            <span className="text-white flex-1">{country.name}</span>
                            <span className="text-gray-400 flex-shrink-0">{country.dialCode}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <input 
                    type="tel" 
                    required
                    placeholder={
                      formState.phoneCountryCode === '+998' ? t('lead.phone_placeholder_uz') :
                      formState.phoneCountryCode === '+7' ? t('lead.phone_placeholder_ru') :
                      formState.phoneCountryCode === '+1' ? t('lead.phone_placeholder_us') :
                      formState.phoneCountryCode === '+44' ? t('lead.phone_placeholder_gb') :
                      (formState.phoneCountryCode === '+992' || formState.phoneCountryCode === '+996') ? t('lead.phone_placeholder_tj') :
                      t('lead.phone_placeholder_default')
                    }
                    className="flex-1 px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:bg-white/10 transition-all"
                    value={formState.phone}
                    onChange={handlePhoneChange}
                  />
                </div>
              </div>

              {/* Задача (необязательное) */}
              <div>
                <textarea 
                  rows={3}
                  placeholder={t('lead.task_placeholder')}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:bg-white/10 transition-all resize-none"
                  value={formState.task}
                  onChange={e => setFormState({...formState, task: e.target.value})}
                />
              </div>

            </div>

            {/* Текст о согласии с политикой */}
            <p className="text-xs text-gray-500 text-center">
              {t('lead.privacy_text')}{' '}
              <Link 
                to="/privacy" 
                target="_blank" 
                className="text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {t('lead.privacy_link')}
              </Link>
            </p>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-4 rounded-full font-display font-bold uppercase tracking-wider transition-all ${
                isSubmitting
                  ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                  : 'bg-primary text-white hover:bg-primary-dark hover:scale-[1.02]'
              }`}
            >
              {isSubmitting ? t('contact.sending') : t('contact.form_btn')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};