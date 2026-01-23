import React, { useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import { useLanguage } from '../../context/LanguageContext';
import { useLocalizedLink } from '../../lib/useLocalizedLink';
import { trackYandexMetrikaPageView } from '../../lib/analytics';
import { useLocation } from 'react-router-dom';

export const ThankYouPopup: React.FC = () => {
  const { isThankYouOpen, closeThankYou } = useModal();
  const { t } = useLanguage();
  const homeLink = useLocalizedLink('/');
  const location = useLocation();

  // Блокируем скролл body когда модальное окно открыто
  // И отправляем виртуальный переход в Яндекс.Метрике для цели "url: содержит"
  useEffect(() => {
    if (isThankYouOpen) {
      document.body.style.overflow = 'hidden';
      
      // Отправляем виртуальный переход с URL, содержащим "thank-you"
      // Это позволит цели в Метрике с условием "url: содержит thank-you" сработать
      const virtualUrl = `${location.pathname}?thank-you=1`;
      trackYandexMetrikaPageView(virtualUrl, t('submitted.page_title') || 'Thank You');
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isThankYouOpen, location.pathname, t]);

  if (!isThankYouOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-dark/90 backdrop-blur-sm z-[200]" 
        onClick={closeThankYou}
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 overflow-y-auto pointer-events-none">
        {/* Modal Content */}
        <div className="relative bg-dark-surface border border-white/10 rounded-3xl p-8 md:p-12 w-full max-w-lg shadow-2xl transform transition-all pointer-events-auto my-auto">
          <button 
            onClick={closeThankYou}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-2xl mb-2 text-white">{t('submitted.title')}</h3>
            <p className="text-gray-400 mb-8">{t('submitted.text')}</p>
            <a
              href={homeLink}
              onClick={closeThankYou}
              className="inline-block px-8 py-4 rounded-full font-display font-bold uppercase tracking-wider bg-primary text-white hover:bg-primary-dark hover:scale-[1.02] transition-all"
            >
              {t('submitted.back_home')}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
