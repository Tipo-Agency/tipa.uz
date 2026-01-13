import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '../components/ui/Section';
import { Seo } from '../components/ui/Seo';
import { useLanguage } from '../context/LanguageContext';
import { Icons } from '../constants';

const NotFound: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Seo 
        title="404 - Страница не найдена | Типа агентство"
        description="Страница, которую вы ищете, не существует или была перемещена."
        noindex={true}
      />
      
      <Section className="py-32 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 text-center">
          {/* 404 Number */}
          <div className="relative mb-8">
            <h1 className="font-display font-bold text-[120px] md:text-[200px] text-white/10 leading-none select-none">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-primary/20 blur-3xl"></div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-4xl md:text-6xl text-white mb-6">
              {t('404.title')}
            </h2>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              {t('404.description')}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/"
                className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-primary to-[#4B4FA8] text-white font-display font-bold uppercase tracking-wider text-sm overflow-hidden shadow-[0_0_40px_-10px_rgba(51,55,173,0.5)] hover:shadow-[0_0_60px_-10px_rgba(51,55,173,0.8)] transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {t('404.back_home')}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              
              <Link
                to="/services"
                className="px-10 py-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white font-display font-bold uppercase tracking-wider text-sm overflow-hidden hover:bg-white/10 transition-all duration-300"
              >
                {t('404.view_services')}
              </Link>
            </div>

            {/* Decorative Elements */}
            <div className="mt-16 flex justify-center gap-8 opacity-20">
              <Icons.Web />
              <Icons.Brand />
              <Icons.Chart />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default NotFound;
