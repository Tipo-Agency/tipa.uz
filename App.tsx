import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Cases from './pages/Cases';
import CaseDetail from './pages/CaseDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import Sitemap from './pages/Sitemap';
import { trackPageView, initScrollTracking } from './lib/analytics';
import { initUTMTracking } from './lib/utmTracking';

// Redirect root to /ru
const RootRedirect = () => {
  return <Navigate to="/ru" replace />;
};

// Scroll to top on route change and track page views
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Track page view on route change
    trackPageView(document.title, { path: pathname });
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  // Initialize scroll tracking and UTM tracking once on app mount
  useEffect(() => {
    initScrollTracking();
    initUTMTracking();
    // Track initial page view
    trackPageView(document.title);
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Redirect root to /ru */}
        <Route path="/" element={<RootRedirect />} />
        {/* Language routes */}
        <Route path=":lang" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="cases" element={<Cases />} />
          <Route path="cases/:slug" element={<CaseDetail />} />
          <Route path="news" element={<News />} />
          <Route path="news/:slug" element={<NewsDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="sitemap.xml" element={<Sitemap />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* Legacy routes without language (redirect to /ru) */}
        <Route path="services" element={<Navigate to="/ru/services" replace />} />
        <Route path="services/:id" element={<NavigateWithLang to="/ru/services/:id" />} />
        <Route path="cases" element={<Navigate to="/ru/cases" replace />} />
        <Route path="cases/:slug" element={<NavigateWithLang to="/ru/cases/:slug" />} />
        <Route path="news" element={<Navigate to="/ru/news" replace />} />
        <Route path="news/:slug" element={<NavigateWithLang to="/ru/news/:slug" />} />
        <Route path="about" element={<Navigate to="/ru/about" replace />} />
        <Route path="contact" element={<Navigate to="/ru/contact" replace />} />
        <Route path="privacy" element={<Navigate to="/ru/privacy" replace />} />
      </Routes>
    </>
  );
};

// Helper component to redirect with params
const NavigateWithLang: React.FC<{ to: string }> = ({ to }) => {
  const params = useParams();
  const path = Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replace(`:${key}`, value || '');
  }, to);
  return <Navigate to={path} replace />;
};

export default App;