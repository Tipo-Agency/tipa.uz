/**
 * Analytics utility for tracking events across multiple platforms:
 * - Yandex.Metrika
 * - Google Tag Manager (dataLayer)
 * - Meta Pixel (fbq)
 */

// Типы событий
export type AnalyticsEvent = 
  | 'page_view'
  | 'cta_click'
  | 'form_submit'
  | 'social_click'
  | 'scroll_50'
  | 'scroll_90'
  | 'view_case'
  | 'view_news'
  | 'view_service'
  | 'conversion_lead'
  | 'conversion_contact'
  | 'conversion_signup';

export interface AnalyticsEventParams {
  event_name: string;
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Проверяет наличие Yandex.Metrika
 */
function isYandexMetrikaAvailable(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).ym === 'function';
}

/**
 * Проверяет наличие Google Tag Manager dataLayer
 */
function isGTMAvailable(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).dataLayer !== 'undefined';
}

/**
 * Проверяет наличие Meta Pixel
 */
function isMetaPixelAvailable(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).fbq === 'function';
}

/**
 * Отправляет событие в Yandex.Metrika
 * Для JS-событий (целей) вызывается без параметров: ym(COUNTER_ID, 'reachGoal', 'goal_name')
 */
function trackYandexMetrika(eventName: string, params?: Record<string, any>) {
  if (!isYandexMetrikaAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Yandex.Metrika not available');
    }
    return;
  }
  
  try {
    const metrikaId = 106244564;
    // Для JS-событий (целей) вызываем без параметров, как в документации
    // ym(COUNTER_ID, 'reachGoal', 'goal_name')
    (window as any).ym(metrikaId, 'reachGoal', eventName);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Yandex.Metrika goal sent:', eventName);
    }
  } catch (error) {
    console.error('❌ Yandex.Metrika tracking error:', error);
  }
}

/**
 * Отправляет виртуальный переход в Yandex.Metrika
 * Используется для SPA, чтобы Метрика видела переход на виртуальную страницу
 * Это позволяет использовать цели типа "Посещение страниц" с условием "url: содержит"
 */
export function trackYandexMetrikaPageView(url: string, title?: string) {
  if (!isYandexMetrikaAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Yandex.Metrika not available');
    }
    return;
  }
  
  try {
    const metrikaId = 106244564;
    const options: any = {};
    
    if (title) {
      options.title = title;
    }
    
    // Виртуальный переход: ym(COUNTER_ID, 'hit', url, options)
    (window as any).ym(metrikaId, 'hit', url, options);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Yandex.Metrika virtual page view:', url, title ? `(title: ${title})` : '');
    }
  } catch (error) {
    console.error('❌ Yandex.Metrika page view tracking error:', error);
  }
}

/**
 * Отправляет событие в Google Tag Manager
 */
function trackGTM(eventName: string, params?: Record<string, any>) {
  if (!isGTMAvailable()) return;
  
  try {
    (window as any).dataLayer.push({
      event: eventName,
      ...params
    });
  } catch (error) {
    console.error('GTM tracking error:', error);
  }
}

/**
 * Отправляет событие в Meta Pixel
 */
function trackMetaPixel(eventName: string, params?: Record<string, any>) {
  if (!isMetaPixelAvailable()) return;
  
  try {
    // Meta Pixel использует стандартные события или кастомные
    const metaEventMap: Record<string, string> = {
      'page_view': 'PageView',
      'cta_click': 'Lead',
      'form_submit': 'Lead',
      'social_click': 'Contact',
      'view_case': 'ViewContent',
      'view_news': 'ViewContent',
      'view_service': 'ViewContent',
      'scroll_50': 'ViewContent',
      'scroll_90': 'ViewContent',
    };
    
    const metaEvent = metaEventMap[eventName];
    
    // Если событие есть в мапе, используем стандартное событие
    if (metaEvent) {
      (window as any).fbq('track', metaEvent, params || {});
    } else {
      // Для кастомных событий используем trackCustom с обязательным параметром event
      (window as any).fbq('trackCustom', eventName, {
        event: eventName,
        ...(params || {})
      });
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Meta Pixel tracking error:', error);
    }
  }
}

/**
 * Универсальная функция для отправки событий во все системы аналитики
 */
export function trackEvent(
  eventName: AnalyticsEvent,
  params?: AnalyticsEventParams
): void {
  if (typeof window === 'undefined') return;
  
  const eventParams = {
    event_name: eventName,
    ...params,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    path: window.location.pathname,
  };
  
  // Отправляем во все системы
  trackYandexMetrika(eventName, eventParams);
  trackGTM(eventName, eventParams);
  trackMetaPixel(eventName, eventParams);
  
  // Логируем в консоль для отладки (только в dev режиме)
  if (process.env.NODE_ENV === 'development') {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', eventName, eventParams);
    }
  }
}

/**
 * Отслеживание PageView
 */
export function trackPageView(pageName?: string, additionalParams?: Record<string, any>) {
  trackEvent('page_view', {
    event_category: 'navigation',
    page_name: pageName || document.title,
    ...additionalParams
  });
}

/**
 * Отслеживание клика на CTA
 */
export function trackCTAClick(ctaName: string, location?: string, additionalParams?: Record<string, any>) {
  trackEvent('cta_click', {
    event_category: 'engagement',
    event_label: ctaName,
    cta_location: location || 'unknown',
    ...additionalParams
  });
}

/**
 * Отслеживание отправки формы
 */
export function trackFormSubmit(formName: string, sourceSection?: string, additionalParams?: Record<string, any>) {
  const baseParams = {
    event_category: 'conversion',
    event_label: formName,
    source_section: sourceSection || 'unknown',
    value: 1, // Конверсия
    ...additionalParams
  };

  // Универсальное событие отправки формы во все системы аналитики
  trackEvent('form_submit', baseParams);

  // Отдельная JS-цель в Яндекс.Метрике по имени формы
  // В Метрике нужно создать цель типа "JavaScript-событие" с именем formName (например, "lead_form")
  trackYandexMetrika(formName, {
    ...baseParams,
  });
  
  // Также отправляем как конверсию лида
  trackConversion('lead', {
    form_name: formName,
    source_section: sourceSection || 'unknown',
    ...additionalParams
  });
}

/**
 * Отслеживание конверсий для рекламных кампаний
 */
export function trackConversion(
  conversionType: 'lead' | 'contact' | 'signup',
  params?: Record<string, any>
): void {
  if (typeof window === 'undefined') return;
  
  const conversionParams = {
    conversion_type: conversionType,
    value: conversionType === 'lead' ? 1000 : conversionType === 'contact' ? 500 : 100, // Примерные значения в условных единицах
    currency: 'UZS',
    timestamp: new Date().toISOString(),
    url: window.location.href,
    ...params
  };
  
  // Yandex.Metrika - конверсия
  if (isYandexMetrikaAvailable()) {
    try {
      const metrikaId = 106244564;
      (window as any).ym(metrikaId, 'reachGoal', `conversion_${conversionType}`, conversionParams);
    } catch (error) {
      console.error('Yandex.Metrika conversion tracking error:', error);
    }
  }
  
  // Google Tag Manager - конверсия
  if (isGTMAvailable()) {
    try {
      (window as any).dataLayer.push({
        event: 'conversion',
        conversion_type: conversionType,
        ...conversionParams
      });
    } catch (error) {
      console.error('GTM conversion tracking error:', error);
    }
  }
  
  // Meta Pixel - конверсия (Lead, Contact, CompleteRegistration)
  if (isMetaPixelAvailable()) {
    try {
      const metaEventMap: Record<string, string> = {
        'lead': 'Lead',
        'contact': 'Contact',
        'signup': 'CompleteRegistration'
      };
      
      const metaEvent = metaEventMap[conversionType] || 'Lead';
      (window as any).fbq('track', metaEvent, {
        content_name: conversionParams.form_name || conversionType,
        value: conversionParams.value,
        currency: conversionParams.currency
      });
    } catch (error) {
      console.error('Meta Pixel conversion tracking error:', error);
    }
  }
  
  // Логируем в консоль для отладки
  if (process.env.NODE_ENV === 'development') {
    if (process.env.NODE_ENV === 'development') {
      console.log('💰 Conversion Event:', conversionType, conversionParams);
    }
  }
}

/**
 * Отслеживание клика по социальным сетям
 */
export function trackSocialClick(platform: string, additionalParams?: Record<string, any>) {
  trackEvent('social_click', {
    event_category: 'engagement',
    event_label: platform,
    social_platform: platform,
    ...additionalParams
  });
}

/**
 * Отслеживание просмотра кейса
 */
export function trackCaseView(caseId: string, caseTitle?: string, additionalParams?: Record<string, any>) {
  trackEvent('view_case', {
    event_category: 'content',
    event_label: caseTitle || caseId,
    case_id: caseId,
    ...additionalParams
  });
}

/**
 * Отслеживание просмотра новости
 */
export function trackNewsView(newsId: string, newsTitle?: string, additionalParams?: Record<string, any>) {
  trackEvent('view_news', {
    event_category: 'content',
    event_label: newsTitle || newsId,
    news_id: newsId,
    ...additionalParams
  });
}

/**
 * Отслеживание просмотра услуги
 */
export function trackServiceView(serviceId: string, serviceName?: string, additionalParams?: Record<string, any>) {
  trackEvent('view_service', {
    event_category: 'content',
    event_label: serviceName || serviceId,
    service_id: serviceId,
    ...additionalParams
  });
}

/**
 * Инициализация отслеживания скролла
 * Вызывается один раз при загрузке приложения
 */
export function initScrollTracking() {
  if (typeof window === 'undefined') return;
  
  let scroll50Tracked = false;
  let scroll90Tracked = false;
  
  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    
    if (scrollPercent >= 50 && !scroll50Tracked) {
      scroll50Tracked = true;
      trackEvent('scroll_50', {
        event_category: 'engagement',
        scroll_percent: 50
      });
    }
    
    if (scrollPercent >= 90 && !scroll90Tracked) {
      scroll90Tracked = true;
      trackEvent('scroll_90', {
        event_category: 'engagement',
        scroll_percent: 90
      });
    }
  };
  
  // Throttle для производительности
  let ticking = false;
  const throttledScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', throttledScroll, { passive: true });
  
  // Очистка при размонтировании (если нужно)
  return () => {
    window.removeEventListener('scroll', throttledScroll);
  };
}
