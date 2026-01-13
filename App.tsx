import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import { trackPageView, initScrollTracking } from './lib/analytics';
import { initUTMTracking } from './lib/utmTracking';

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
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="cases" element={<Cases />} />
          <Route path="cases/:id" element={<CaseDetail />} />
          <Route path="news" element={<News />} />
          <Route path="news/:id" element={<NewsDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;