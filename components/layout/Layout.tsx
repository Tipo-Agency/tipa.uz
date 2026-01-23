import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { RoutePath, Language } from '../../types';
import { Logo } from '../ui/Logo';
import { useLanguage } from '../../context/LanguageContext';
import { CONTACT_INFO, Icons } from '../../constants';
import { CookieConsent } from '../ui/CookieConsent';
import { LeadPopup } from '../ui/LeadPopup';
import { ThankYouPopup } from '../ui/ThankYouPopup';
import { useModal } from '../../context/ModalContext';
import { trackSocialClick, trackCTAClick } from '../../lib/analytics';
import { useLocalizedLink } from '../../lib/useLocalizedLink';

const NavLink: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void }> = ({ to, children, onClick }) => {
  const location = useLocation();
  const localizedTo = useLocalizedLink(to);
  const isActive = location.pathname === localizedTo || (localizedTo !== '/' && location.pathname.startsWith(localizedTo));
  
  return (
    <Link 
      to={localizedTo} 
      onClick={onClick}
      className={`text-sm font-medium tracking-wide transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
    >
      {children}
    </Link>
  );
};

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  const languages: Language[] = ['ru', 'uz', 'en'];
  
  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`text-xs font-bold uppercase px-2 py-1 rounded-full transition-all ${
            language === lang 
              ? 'bg-primary text-white shadow-lg shadow-primary/25' 
              : 'text-gray-500 hover:text-white'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();
  const { openModal } = useModal();
  const homeLink = useLocalizedLink('/');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-dark/80 backdrop-blur-lg border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto flex items-center justify-between">
          <Link to={homeLink} className="flex items-center gap-2 group relative z-50">
            <Logo className="h-8 md:h-10 w-auto transition-transform group-hover:scale-105" white={true} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-8 bg-white/5 px-8 py-3 rounded-full border border-white/5 backdrop-blur-sm">
              <NavLink to={RoutePath.SERVICES}>{t('nav.services')}</NavLink>
              <NavLink to={RoutePath.CASES}>{t('nav.cases')}</NavLink>
              <NavLink to={RoutePath.NEWS}>{t('nav.news')}</NavLink>
              <NavLink to={RoutePath.ABOUT}>{t('nav.about')}</NavLink>
              <div className="w-px h-4 bg-white/10 mx-2"></div>
              <button 
                onClick={() => {
                  trackCTAClick('start_project', 'header_nav');
                  openModal();
                }}
                className="text-sm font-bold text-accent-turquoise hover:text-white transition-colors uppercase tracking-widest text-xs"
              >
                {t('nav.start')}
              </button>
            </nav>
            
            <LanguageSwitcher />
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4 relative z-[160]">
            <LanguageSwitcher />
            <button 
              className="p-2 text-white relative z-[160]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - вынесено за пределы header */}
      <div className={`fixed inset-0 bg-dark z-[150] flex flex-col items-center justify-center gap-8 transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {/* Кнопка закрытия */}
          <button 
            className="absolute top-6 right-6 p-2 text-white z-[160]"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <NavLink to={RoutePath.SERVICES} onClick={() => setIsMenuOpen(false)}>{t('nav.services')}</NavLink>
          <NavLink to={RoutePath.CASES} onClick={() => setIsMenuOpen(false)}>{t('nav.cases')}</NavLink>
          <NavLink to={RoutePath.NEWS} onClick={() => setIsMenuOpen(false)}>{t('nav.news')}</NavLink>
          <NavLink to={RoutePath.ABOUT} onClick={() => setIsMenuOpen(false)}>{t('nav.about')}</NavLink>
          <button onClick={() => { 
            trackCTAClick('start_project', 'mobile_menu');
            setIsMenuOpen(false); 
            openModal(); 
          }} className="text-xl font-bold text-white">{t('nav.start')}</button>
      </div>
    </>
  );
};

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const homeLink = useLocalizedLink('/');
  const servicesLink = useLocalizedLink('/services');
  const casesLink = useLocalizedLink('/cases');
  const newsLink = useLocalizedLink('/news');
  const aboutLink = useLocalizedLink('/about');
  const privacyLink = useLocalizedLink('/privacy');
  
  return (
    <footer className="bg-dark-surface border-t border-white/5 pt-12 pb-8 relative overflow-hidden">
      {/* Footer background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">
          <div className="md:col-span-5">
            <Link to={homeLink} className="mb-6 block">
              <Logo className="h-10 w-auto" white />
            </Link>
            <h3 className="font-display font-bold text-xl md:text-2xl leading-tight mb-4 max-w-md">
              {t('footer.slogan')}
            </h3>
          </div>
          
          <div className="md:col-span-2 md:col-start-7">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gray-500 mb-4">{t('footer.nav')}</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to={servicesLink} className="hover:text-primary transition-colors">{t('nav.services')}</Link></li>
              <li><Link to={casesLink} className="hover:text-primary transition-colors">{t('nav.cases')}</Link></li>
              <li><Link to={newsLink} className="hover:text-primary transition-colors">{t('nav.news')}</Link></li>
              <li><Link to={aboutLink} className="hover:text-primary transition-colors">{t('nav.about')}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 md:col-start-10">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gray-500 mb-4">{t('footer.contacts')}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href={`tel:${CONTACT_INFO.phoneClean}`} className="hover:text-primary transition-colors font-display text-base">{CONTACT_INFO.phone}</a></li>
              <li><a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-primary transition-colors text-gray-300">{CONTACT_INFO.email}</a></li>
              <li className="text-gray-500 text-xs">{CONTACT_INFO.address}</li>
            </ul>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a 
                href={CONTACT_INFO.socials.telegram} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackSocialClick('telegram', { location: 'footer' })}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#2AABEE] hover:shadow-[0_0_20px_#2AABEE] transition-all duration-300 group"
              >
                <div className="text-gray-400 group-hover:text-[#2AABEE] transition-all duration-300 scale-[0.55] group-hover:scale-[0.7]">
                  <Icons.Telegram />
                </div>
              </a>
              <a 
                href={CONTACT_INFO.socials.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => trackSocialClick('instagram', { location: 'footer' })}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#FC01D8] hover:shadow-[0_0_20px_#FC01D8] transition-all duration-300 group"
              >
                <div className="text-gray-400 group-hover:text-[#FC01D8] transition-all duration-300 scale-[0.55] group-hover:scale-[0.7]">
                  <Icons.Instagram />
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-6">
          {/* Юридическая информация для рекламы в Яндексе */}
          <div className="mb-4">
            <p className="font-semibold text-gray-400 mb-3 text-xs">Юридическая информация:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
              {/* Левая колонка */}
              <div className="space-y-1">
                <p>Индивидуальный предприниматель: DONSKIX ALEKSANDR SERGEYEVICH</p>
                <p>ПИНФЛ: 30503966530024</p>
                <p>Регистрационный номер: 6952622 (от 11.06.2025)</p>
              </div>
              
              {/* Правая колонка */}
              <div className="space-y-1">
                <p>Адрес: г. Ташкент, Юнусабадский район, Кашкар махалла, Ц4 квартал, дом 15, квартира 25</p>
                <p>Телефон: {CONTACT_INFO.phone}</p>
                <p>Email: {CONTACT_INFO.email}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 gap-4">
            <p>&copy; {new Date().getFullYear()} Типа агентство. Все права защищены.</p>
            <div className="flex gap-6">
              <Link to={privacyLink} className="hover:text-gray-400 cursor-pointer transition-colors">
                  {t('footer.legal_privacy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-body bg-dark text-white selection:bg-primary selection:text-white overflow-x-hidden">
      <Header />
      <main className="flex-grow overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
      <LeadPopup />
      <ThankYouPopup />
    </div>
  );
};

export default Layout;