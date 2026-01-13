import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem('tipa_cookie_consent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('tipa_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 max-w-sm w-[calc(100%-2rem)]">
      <div className="bg-dark/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
         {/* Shiny effect */}
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
         
         <div className="flex gap-4 items-start">
             <div className="text-3xl animate-bounce">🍪</div>
             <div>
                 <p className="text-sm text-gray-300 leading-relaxed mb-4">
                     {t('cookie.text')}
                 </p>
                 <button 
                    onClick={handleAccept}
                    className="bg-white text-dark hover:bg-primary hover:text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
                 >
                     {t('cookie.btn')}
                 </button>
             </div>
         </div>
      </div>
    </div>
  );
};