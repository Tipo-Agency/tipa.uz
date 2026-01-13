import React from 'react';
import { Service, CaseStudy, NewsItem, LocalizedString } from './types';

// Icons as SVG components
export const Icons = {
  Web: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  SMM: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>,
  Ads: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
  Brand: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
  Auto: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Bot: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  Consult: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>,
  Bolt: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Chart: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Map: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Shield: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Minus: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>,
  Wallet: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  Location: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Briefcase: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Mobile: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Taska: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,

  Telegram: () => (
    <svg width="24" height="24" viewBox="0 0 131 109" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M8.92914 46.6C43.9291 31.4 67.2291 21.3 78.9291 16.4C112.229 2.5 119.229 0.1 123.729 0C124.729 0 126.929 0.200001 128.429 1.4C129.629 2.4 129.929 3.7 130.129 4.7C130.329 5.7 130.529 7.8 130.329 9.4C128.529 28.4 120.729 74.5 116.729 95.7C115.029 104.7 111.729 107.7 108.529 108C101.529 108.6 96.2291 103.4 89.5291 99C78.9291 92.1 73.0291 87.8 62.7291 81C50.8291 73.2 58.5291 68.9 65.3291 61.9C67.1291 60.1 97.8291 32.1 98.4291 29.6C98.5291 29.3 98.5291 28.1 97.8291 27.5C97.1291 26.9 96.1291 27.1 95.3291 27.3C94.2291 27.5 77.4291 38.7 44.7291 60.8C39.9291 64.1 35.6291 65.7 31.7291 65.6C27.4291 65.5 19.2291 63.2 13.0291 61.2C5.52914 58.8 -0.470863 57.5 0.0291371 53.3C0.329137 51.1 3.32914 48.9 8.92914 46.6Z" fill="currentColor"/>
    </svg>
  ),
  Instagram: () => (
    <svg width="24" height="24" viewBox="0 0 744 744" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M371.838 0C270.862 0 258.189 0.441066 218.53 2.24466C178.948 4.05581 151.93 10.3177 128.289 19.5058C103.835 28.995 83.091 41.689 62.4249 62.3475C41.7434 82.9988 29.0396 103.727 19.5122 128.155C10.2943 151.786 4.01991 178.792 2.23862 218.329C0.464884 257.959 0 270.63 0 371.531C0 472.433 0.449383 485.057 2.24617 524.687C4.06677 564.24 10.3332 591.238 19.5198 614.861C29.0241 639.297 41.7275 660.025 62.4015 680.676C83.0604 701.343 103.804 714.068 128.242 723.557C151.898 732.745 178.925 739.007 218.499 740.819C258.158 742.621 270.823 743.063 371.792 743.063C472.776 743.063 485.41 742.622 525.069 740.818C564.652 739.007 591.701 732.745 615.357 723.557C639.803 714.068 660.516 701.343 681.175 680.676C701.856 660.025 714.56 639.297 724.087 614.869C733.227 591.238 739.502 564.232 741.361 524.695C743.142 485.065 743.607 472.433 743.607 371.531C743.607 270.629 743.142 257.967 741.361 218.337C739.502 178.784 733.227 151.786 724.087 128.163C714.56 103.727 701.856 82.9984 681.175 62.3475C660.493 41.681 639.811 28.9871 615.334 19.5054C591.631 10.3177 564.597 4.05581 525.015 2.24466C485.356 0.441066 472.73 0 371.722 0H371.838ZM338.484 66.9532C348.384 66.9377 359.429 66.9532 371.838 66.9532C471.111 66.9532 482.877 67.3092 522.079 69.0894C558.331 70.746 578.006 76.7985 591.112 81.8839C608.463 88.6178 620.833 96.6679 633.839 109.671C646.852 122.675 654.908 135.06 661.662 152.397C666.751 165.478 672.816 185.139 674.466 221.363C676.248 260.529 676.635 272.294 676.635 371.446C676.635 470.598 676.248 482.364 674.466 521.53C672.809 557.754 666.751 577.414 661.662 590.495C654.923 607.833 646.852 620.179 633.839 633.175C620.826 646.178 608.47 654.228 591.112 660.962C578.021 666.071 558.331 672.108 522.079 673.764C482.885 675.545 471.111 675.932 371.838 675.932C272.558 675.932 260.792 675.545 221.597 673.764C185.346 672.093 165.671 666.04 152.557 660.954C135.206 654.22 122.812 646.17 109.799 633.167C96.7861 620.163 88.7305 607.81 81.9757 590.464C76.8866 577.383 70.8216 557.723 69.1718 521.499C67.3901 482.333 67.0337 470.568 67.0337 371.353C67.0337 272.139 67.3901 260.436 69.1718 221.27C70.8295 185.046 76.8866 165.386 81.9757 152.289C88.7146 134.951 96.7861 122.567 109.799 109.563C122.812 96.5594 135.206 88.5097 152.557 81.7603C165.664 76.6515 185.346 70.6144 221.597 68.9499C255.896 67.4018 269.189 66.9377 338.484 66.8598L338.484 66.9532ZM570.306 128.643C545.674 128.643 525.689 148.589 525.689 173.211C525.689 197.825 545.674 217.795 570.306 217.795C594.938 217.795 614.923 197.825 614.923 173.211C614.923 148.597 594.938 128.628 570.306 128.628L570.306 128.643ZM371.838 180.734C266.392 180.734 180.9 266.163 180.9 371.531C180.9 476.899 266.392 562.289 371.838 562.289C477.284 562.289 562.746 476.899 562.746 371.531C562.746 266.163 477.277 180.734 371.831 180.734H371.838ZM371.838 247.688C440.282 247.688 495.774 303.131 495.774 371.531C495.774 439.924 440.282 495.375 371.838 495.375C303.387 495.375 247.903 439.924 247.903 371.531C247.903 303.131 303.387 247.688 371.838 247.688Z" fill="currentColor"/>
    </svg>
  )
};

export const CONTACT_INFO = {
  phone: '+998 88 800 05 49',
  phoneClean: '+998888000549',
  email: 'tipaagentstvo@gmail.com',
  address: 'Tashkent, Uzbekistan',
  socials: {
    telegram: 'https://t.me/tipa_agency',
    instagram: 'https://www.instagram.com/tipa_agency/?igsh=MTVldGNjamJkd2R5dw%3D%3D#'
  }
};

export const PARTNERS_LOGOS = [
  'Payme', 'Click', 'Uzum', 'Beeline', 'Korzinka', 'Golden House', 'Murad Buildings', 'Akfa', 'Imzo', 'Texnomart'
];

export const NEWS_DATA: NewsItem[] = [
    {
        id: '1',
        date: '24.02.2025',
        title: { ru: 'Искусственный интеллект в маркетинге 2025', uz: 'Marketingda sun\'iy intellekt 2025', en: 'AI in Marketing 2025' },
        excerpt: { ru: 'Как нейросети меняют подход к контенту и аналитике. Разбираем тренды.', uz: 'Neyron tarmoqlar kontent va tahlilga yondashuvni qanday o\'zgartirmoqda.', en: 'How neural networks are changing content and analytics.' },
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop',
        tag: 'Tech'
    },
    {
        id: '2',
        date: '10.02.2025',
        title: { ru: 'Кейс: Как мы подняли продажи на 300% для e-commerce', uz: 'Keys: E-commerce uchun savdoni 300% ga qanday oshirdik', en: 'Case: How we boosted e-commerce sales by 300%' },
        excerpt: { ru: 'Пошаговый разбор стратегии, настройки рекламы и внедрения CRM.', uz: 'Strategiya, reklama sozlamalari va CRM joriy etishning bosqichma-bosqich tahlili.', en: 'Step-by-step breakdown of strategy, ads and CRM.' },
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=1000&auto=format&fit=crop',
        tag: 'Case'
    },
    {
        id: '3',
        date: '01.02.2025',
        title: { ru: 'Типа агентство — партнер года по версии Google', uz: 'Tipa agentlik — Google talqini bo\'yicha yil hamkori', en: 'Tipa agency — Partner of the Year by Google' },
        excerpt: { ru: 'Мы получили официальный статус и доступ к бета-тестам новых инструментов.', uz: 'Biz rasmiy maqom va yangi vositalarning beta-sinovlariga kirish huquqini oldik.', en: 'We received official status and access to beta tools.' },
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop',
        tag: 'Agency'
    }
];

export const SERVICE_FAQ_DATA: Record<string, { q: LocalizedString, a: LocalizedString }[]> = {
    web: [
        { q: { ru: 'Сколько стоит разработка сайта?', uz: 'Sayt yaratish qancha turadi?', en: 'How much does a website cost?' }, a: { ru: 'От 2 млн сум за лендинг до сложных систем за 50+ млн. Все зависит от функционала.', uz: 'Landing uchun 2 mln so\'mdan boshlab, murakkab tizimlar uchun 50+ mln gacha.', en: 'From 2M UZS for a landing page to 50M+ for complex systems.' } },
        { q: { ru: 'Какие сроки?', uz: 'Muddatlar qanday?', en: 'What are the timelines?' }, a: { ru: 'Лендинг — 5-7 дней. Корпоративный сайт — 2-3 недели. Магазин — от месяца.', uz: 'Landing — 5-7 kun. Korporativ sayt — 2-3 hafta. Do\'kon — bir oydan boshlab.', en: 'Landing - 5-7 days. Corporate - 2-3 weeks. Shop - from 1 month.' } },
        { q: { ru: 'Вы делаете SEO?', uz: 'Siz SEO qilasizmi?', en: 'Do you do SEO?' }, a: { ru: 'Да, базовая SEO-оптимизация включена во все тарифы.', uz: 'Ha, asosiy SEO-optimizatsiya barcha tariflarga kiritilgan.', en: 'Yes, basic SEO is included in all plans.' } }
    ],
    smm: [
        { q: { ru: 'Что входит в SMM?', uz: 'SMM nimalarni o\'z ichiga oladi?', en: 'What is included in SMM?' }, a: { ru: 'Стратегия, контент-план на месяц, съемка фото/видео, монтаж Reels, копирайтинг, постинг по расписанию, модерация комментариев, ответы на сообщения, настройка таргета и детальная аналитика.', uz: 'Strategiya, kontent-reja, tasvirga olish, montaj, kopirayting, joylashtirish, moderatsiya, javoblar, target sozlash va analitika.', en: 'Strategy, monthly content plan, photo/video shooting, Reels editing, copywriting, scheduled posting, comment moderation, message replies, targeting setup, and detailed analytics.' } },
        { q: { ru: 'Нужен ли бюджет на рекламу?', uz: 'Reklama uchun byudjet kerakmi?', en: 'Do I need ad budget?' }, a: { ru: 'Да, рекламный бюджет оплачивается отдельно напрямую в Facebook/Instagram. Мы настраиваем таргет и управляем кампаниями, но средства списываются с вашей карты, привязанной к рекламному кабинету.', uz: 'Ha, reklama byudjeti alohida to\'g\'ridan-to\'g\'ri Facebook/Instagramga to\'lanadi. Biz target sozlaymiz va kampaniyalarni boshqaramiz.', en: 'Yes, ad budget is paid separately directly to Facebook/Instagram. We set up targeting and manage campaigns, but funds are debited from your card linked to the ad account.' } },
        { q: { ru: 'Сколько постов и Reels входит в тариф?', uz: 'Tarifga nechta post va Reels kiradi?', en: 'How many posts and Reels are included?' }, a: { ru: 'Базовый: 8 постов и 4 Reels. Стандарт: 12 постов и 8 Reels. Премиум: 16 постов и 12 Reels. Все тарифы включают контент-план на месяц.', uz: 'Asosiy: 8 post va 4 Reels. Standart: 12 post va 8 Reels. Premium: 16 post va 12 Reels.', en: 'Basic: 8 posts and 4 Reels. Standard: 12 posts and 8 Reels. Premium: 16 posts and 12 Reels. All plans include a monthly content plan.' } },
        { q: { ru: 'Организуете ли вы коллаборации с блогерами?', uz: 'Blogerlar bilan hamkorlik tashkil qilasizmi?', en: 'Do you organize collaborations with bloggers?' }, a: { ru: 'Да, мы организуем партнерства с блогерами и инфлюенсерами для расширения охвата и повышения доверия к бренду. Подбираем релевантных партнеров, ведем переговоры, координируем съемки и публикации. Это отдельная услуга с индивидуальным прайсом.', uz: 'Ha, biz blogerlar va influencerlar bilan hamkorlik tashkil qilamiz. Bu alohida xizmat.', en: 'Yes, we organize partnerships with bloggers and influencers to expand reach and build brand trust. We select relevant partners, negotiate, and coordinate shoots and publications. This is a separate service with individual pricing.' } },
        { q: { ru: 'Как быстро появятся первые результаты?', uz: 'Birinchi natijalar qanchalik tez paydo bo\'ladi?', en: 'How quickly will we see first results?' }, a: { ru: 'Первые изменения в метриках (охваты, вовлеченность) видны уже через 2-3 недели. Рост подписчиков и конверсий в клиентов обычно начинается через 1-2 месяца регулярной работы. Важно понимать, что SMM — это долгосрочная стратегия, а не быстрый результат.', uz: 'Birinchi o\'zgarishlar 2-3 haftadan keyin ko\'rinadi. Obunachilar o\'sishi 1-2 oydan keyin boshlanadi.', en: 'First changes in metrics (reach, engagement) are visible after 2-3 weeks. Subscriber growth and client conversions usually start after 1-2 months of regular work. SMM is a long-term strategy, not a quick result.' } }
    ],
    branding: [
        { q: { ru: 'Что я получу в итоге?', uz: 'Natijada nima olaman?', en: 'What do I get?' }, a: { ru: 'Логотип в векторных форматах (AI, EPS, SVG) для печати, растровые (PNG, JPG) для веба, и PDF-гайдлайн по использованию.', uz: 'Vektor formatdagi logotip (AI, EPS, SVG), web uchun (PNG, JPG) va foydalanish bo\'yicha PDF qo\'llanma.', en: 'Vector logo files (AI, EPS, SVG), raster (PNG, JPG), and PDF usage guidelines.' } },
        { q: { ru: 'Сколько вариантов логотипа?', uz: 'Logotip variantlari nechta?', en: 'How many logo variants?' }, a: { ru: 'Мы разрабатываем 3 разноплановых концепции. Вы выбираете одну, и мы дорабатываем её до идеала.', uz: 'Biz 3 xil konsepsiyani ishlab chiqamiz. Siz bittasini tanlaysiz va biz uni mukammallashtiramiz.', en: 'We develop 3 different concepts. You choose one, and we refine it to perfection.' } },
        { q: { ru: 'Сколько времени занимает работа?', uz: 'Ish qancha vaqt oladi?', en: 'How long does it take?' }, a: { ru: 'Разработка логотипа — 5-7 дней. Полный фирменный стиль — 14-20 дней. Брендбук — от 25 дней.', uz: 'Logotip yaratish — 5-7 kun. To\'liq firma stili — 14-20 kun. Brendbuk — 25 kundan boshlab.', en: 'Logo design — 5-7 days. Full identity — 14-20 days. Brandbook — from 25 days.' } },
        { q: { ru: 'Смогу ли я зарегистрировать товарный знак?', uz: 'Tovar belgisini ro\'yxatdan o\'tkaza olamanmi?', en: 'Can I register the trademark?' }, a: { ru: 'Да, мы проверяем названия и графику на уникальность перед презентацией, чтобы у вас не было проблем с патентом.', uz: 'Ha, patent bilan muammo bo\'lmasligi uchun biz nom va grafikani tekshiramiz.', en: 'Yes, we check names and graphics for uniqueness so you have no patent issues.' } },
        { q: { ru: 'Что если мне не понравится?', uz: 'Agar menga yoqmasa-chi?', en: 'What if I don\'t like it?' }, a: { ru: 'Перед стартом мы заполняем подробный бриф и собираем мудборд (примеры). Это исключает ситуацию «не то».', uz: 'Boshlashdan oldin biz batafsil brif to\'ldiramiz va mudbord yig\'amiz. Bu "noto\'g\'ri" holatni istisno qiladi.', en: 'We fill out a detailed brief and moodboard before starting. This eliminates the "wrong direction" risk.' } }
    ],
    automation: [
        { q: { ru: 'Сколько времени занимает внедрение?', uz: 'Joriy etish qancha vaqt oladi?', en: 'How long does implementation take?' }, a: { ru: 'Базовая настройка — от 1 недели. Полная автоматизация сложных процессов — 3-5 недель.', uz: 'Asosiy sozlash — 1 haftadan boshlab. Murakkab jarayonlarni to\'liq avtomatlashtirish — 3-5 hafta.', en: 'Basic setup — from 1 week. Full automation of complex processes — 3-5 weeks.' } },
        { q: { ru: 'Какую CRM выбрать?', uz: 'Qaysi CRM ni tanlash kerak?', en: 'Which CRM to choose?' }, a: { ru: 'Для услуг и B2B продаж лучше AmoCRM. Для товарного бизнеса и сложной структуры — Bitrix24. Мы поможем с выбором.', uz: 'Xizmatlar va B2B savdosi uchun AmoCRM yaxshiroq. Tovar biznesi va murakkab tuzilma uchun — Bitrix24.', en: 'AmoCRM is better for services and B2B. Bitrix24 for retail and complex structures.' } },
        { q: { ru: 'Сложно ли обучить сотрудников?', uz: 'Xodimlarni o\'qitish qiyinmi?', en: 'Is it hard to train staff?' }, a: { ru: 'Мы берем это на себя. Проводим онлайн/офлайн обучение и записываем видеоинструкции. Адаптация занимает 2-3 дня.', uz: 'Biz buni o\'z zimmamizga olamiz. Onlayn/oflayn trening o\'tkazamiz va video yo\'riqnomalar yozamiz.', en: 'We handle it. We conduct training and record video manuals. Adaptation takes 2-3 days.' } },
        { q: { ru: 'Интегрируете с 1С?', uz: '1C bilan integratsiya qilasizmi?', en: 'Do you integrate with 1C?' }, a: { ru: 'Да, настраиваем двусторонний обмен данными между CRM и 1С: остатки, счета, контрагенты.', uz: 'Ha, CRM va 1C o\'rtasida ikki tomonlama ma\'lumot almashinuvini sozlaymiz.', en: 'Yes, we set up two-way data exchange between CRM and 1C.' } },
        { q: { ru: 'Насколько это безопасно?', uz: 'Bu qanchalik xavfsiz?', en: 'Is it safe?' }, a: { ru: 'Мы подписываем NDA. Права доступа настраиваются так, что менеджер видит только своих клиентов и не может скачать базу.', uz: 'Biz NDA imzolaymiz. Kirish huquqlari shunday sozlangan-ki, menejer faqat o\'z mijozlarini ko\'radi va bazani yuklab ololmaydi.', en: 'We sign NDA. Access rights are configured so managers only see their clients and cannot download the database.' } }
    ],
    seo_geo: [
        { 
            q: { ru: 'В чем отличие от рекламы (PPC)?', uz: 'Reklamadan (PPC) farqi nimada?', en: 'Difference from Ads (PPC)?' }, 
            a: { ru: 'Реклама работает, пока вы платите (аренда). SEO — это актив (покупка дома). После оптимизации сайт приносит бесплатный трафик годами.', uz: 'Reklama siz to\'layotganingizda ishlaydi (ijara). SEO — bu aktiv (uy sotib olish). Optimizatsiyadan so\'ng sayt yillar davomida bepul trafik olib keladi.', en: 'Ads work while you pay (rent). SEO is an asset (buying a house). Once optimized, it brings free traffic for years.' } 
        },
        { 
            q: { ru: 'Когда ждать первых результатов?', uz: 'Birinchi natijalarni qachon kutish kerak?', en: 'When to expect results?' }, 
            a: { ru: 'Первый рост трафика — через 2-3 месяца. Ощутимый результат и окупаемость — 4-6 месяцев. SEO — это игра в долгую.', uz: 'Trafikning birinchi o\'sishi — 2-3 oydan keyin. Sezilarli natija va qoplash — 4-6 oy. SEO — bu uzoq muddatli o\'yin.', en: 'First traffic growth — 2-3 months. Tangible results and ROI — 4-6 months.' } 
        },
        { 
            q: { ru: 'Что такое AI-продвижение (GEO)?', uz: 'AI-targ\'ibot (GEO) nima?', en: 'What is AI promotion (GEO)?' }, 
            a: { ru: 'Это оптимизация бренда, чтобы ChatGPT, Gemini и Perplexity рекомендовали вас в ответах. Люди всё чаще спрашивают ИИ, а не гуглят ссылки.', uz: 'Bu brendni optimallashtirish, shunda ChatGPT, Gemini va Perplexity sizni javoblarda tavsiya qiladi. Odamlar endi havolalarni emas, AIdan so\'rashmoqda.', en: 'It is optimizing the brand so ChatGPT, Gemini, and Perplexity recommend you. People are asking AI, not just searching links.' } 
        },
        { 
            q: { ru: 'Какие гарантии?', uz: 'Qanday kafolatlar bor?', en: 'What are the guarantees?' }, 
            a: { ru: 'Ни одно честное агентство не гарантирует ТОП-1, так как алгоритмы меняются. Мы гарантируем рост целевого трафика и прозрачные отчеты каждый месяц.', uz: 'Hech qaysi halol agentlik TOP-1 ni kafolatlay olmaydi. Biz maqsadli trafik o\'sishini va har oy shaffof hisobotlarni kafolatlaymiz.', en: 'No honest agency guarantees TOP-1 as algorithms change. We guarantee traffic growth and transparent monthly reports.' } 
        },
        { 
            q: { ru: 'Что нужно от нас?', uz: 'Bizdan nima talab qilinadi?', en: 'What is needed from us?' }, 
            a: { ru: 'Доступы к сайту/метрике и согласование контента. Мы берем на себя всю техническую часть и копирайтинг.', uz: 'Sayt/metrikaga kirish va kontentni tasdiqlash. Biz barcha texnik qism va kopiraytingni o\'z zimmamizga olamiz.', en: 'Access to site/metrics and content approval. We handle all tech and copywriting.' } 
        }
    ],
    ads: [
        { 
            q: { ru: 'Какой минимальный рекламный бюджет?', uz: 'Minimal reklama byudjeti qancha?', en: 'Minimum ad budget?' }, 
            a: { ru: 'Рекомендуем начинать от $300-500 в месяц на саму рекламу (оплата площадке), чтобы алгоритмы могли обучиться и дать результат.', uz: 'Platformaga to\'lash uchun oyiga $300-500 dan boshlashni tavsiya qilamiz, shunda algoritmlar o\'rganib, natija berishi mumkin.', en: 'We recommend starting from $300-500/mo for ads to let algorithms learn.' } 
        },
        { 
            q: { ru: 'В чем разница между Таргетом и Контекстом?', uz: 'Target va Kontekst o\'rtasidagi farq nima?', en: 'Difference between Target and Context?' }, 
            a: { ru: 'Таргет (Instagram/FB) работает с холодным спросом — мы сами находим тех, кому может быть интересен продукт. Контекст (Google) работает с горячим спросом — показываем рекламу тем, кто уже ищет "купить..."', uz: 'Target (Instagram) sovuq talab bilan ishlaydi. Kontekst (Google) issiq talab bilan ishlaydi — kimdir qidirayotganda ko\'rsatamiz.', en: 'Target (social) is for cold audiences. Context (search) is for hot leads searching for you.' } 
        },
        { 
            q: { ru: 'Могут ли заблокировать рекламный кабинет?', uz: 'Reklama kabinetini bloklashlari mumkinmi?', en: 'Can ad account be banned?' }, 
            a: { ru: 'Риск есть всегда, но мы знаем правила площадок наизусть. Мы проходим модерацию корректно и имеем резервные аккаунты для бесперебойной работы.', uz: 'Xavf har doim bor, lekin biz qoidalarni bilamiz. Biz moderatsiyadan to\'g\'ri o\'tamiz va zaxira akkauntlarimiz bor.', en: 'Risk exists, but we know the rules. We have backup accounts for uninterrupted work.' } 
        },
        { 
            q: { ru: 'Нужен ли сайт для запуска?', uz: 'Ishga tushirish uchun sayt kerakmi?', en: 'Do I need a website?' }, 
            a: { ru: 'Для Google Ads — обязательно. Для Instagram можно вести трафик на профиль или лид-форму (сбор заявок внутри соцсети) без сайта.', uz: 'Google Ads uchun — shart. Instagram uchun trafikni profilga yoki lid-shaklga yo\'naltirish mumkin.', en: 'For Google — yes. For Instagram, we can use profile or lead forms without a site.' } 
        },
        { 
            q: { ru: 'Когда пойдут первые заявки?', uz: 'Birinchi arizalar qachon tushadi?', en: 'When will first leads come?' }, 
            a: { ru: 'Технически — в день запуска. Но для стабильного потока по выгодной цене требуется 3-7 дней на тесты и оптимизацию.', uz: 'Texnik jihatdan — ishga tushirilgan kuni. Lekin barqaror oqim uchun 3-7 kun test kerak.', en: 'Technically same day. Stable flow takes 3-7 days of testing.' } 
        }
    ],
    serm: [
        { 
            q: { ru: 'Можно ли полностью удалить негатив?', uz: 'Negativni to\'liq o\'chirib tashlash mumkinmi?', en: 'Can negative be fully removed?' }, 
            a: { ru: 'Если отзыв нарушает правила площадки (клевета, мат) — мы удаляем его юридически. Если отзыв реальный — мы смещаем его вниз (вытесняем) позитивом.', uz: 'Agar sharh qoidalarni buzsa — biz uni qonuniy ravishda o\'chirib tashlaymiz. Agar sharh haqiqiy bo\'lsa — biz uni ijobiy sharhlar bilan pastga tushiramiz.', en: 'If it violates rules — we remove it legally. If real — we push it down with positive content.' } 
        },
        { 
            q: { ru: 'Как быстро изменится рейтинг?', uz: 'Reyting qanchalik tez o\'zgaradi?', en: 'How fast rating changes?' }, 
            a: { ru: 'Первые изменения видны через 2 недели. Для поднятия рейтинга с 3.0 до 4.5 обычно требуется 2-3 месяца планомерной работы.', uz: 'Birinchi o\'zgarishlar 2 haftadan keyin ko\'rinadi. Reytingni 3.0 dan 4.5 gacha ko\'tarish uchun odatda 2-3 oy kerak.', en: 'First changes in 2 weeks. Raising from 3.0 to 4.5 usually takes 2-3 months.' } 
        },
        { 
            q: { ru: 'Откуда берутся положительные отзывы?', uz: 'Ijobiy sharhlar qayerdan olinadi?', en: 'Where do positive reviews come from?' }, 
            a: { ru: 'Мы мотивируем ваших реальных клиентов оставлять отзывы (QR-коды, рассылки). Также наши копирайтеры создают нативные упоминания на форумах.', uz: 'Biz haqiqiy mijozlaringizni sharh qoldirishga undaymiz. Shuningdek, bizning kopirayterlarimiz forumlarda tabiiy eslatmalar yaratadilar.', en: 'We motivate real clients. Also, our copywriters create native mentions on forums.' } 
        },
        { 
            q: { ru: 'Это конфиденциально?', uz: 'Bu maxfiymi?', en: 'Is it confidential?' }, 
            a: { ru: 'Строго. Мы подписываем NDA. Никто не узнает, что вы работали с агентством по управлению репутацией.', uz: 'Qat\'iy. Biz NDA imzolaymiz. Hech kim sizning reputatsiya agentligi bilan ishlaganingizni bilmaydi.', en: 'Strictly. We sign NDA. No one will know you worked with a reputation agency.' } 
        },
        { 
            q: { ru: 'Чем SERM отличается от PR?', uz: 'SERM PR dan nimasi bilan farq qiladi?', en: 'SERM vs PR?' }, 
            a: { ru: 'PR создает имидж в СМИ. SERM работает с поисковой выдачей (Google/Yandex). Мы делаем так, чтобы при поиске вашего бренда люди видели 5 звезд.', uz: 'PR OAVda imij yaratadi. SERM qidiruv natijalari bilan ishlaydi. Biz brendingizni qidirganda odamlar 5 yulduzni ko\'rishini ta\'minlaymiz.', en: 'PR builds image in media. SERM works with search results. We ensure people see 5 stars when searching you.' } 
        }
    ]
};

export const SERVICES_DATA: Service[] = [
  {
    id: 'web',
    title: { ru: 'Сайты и сервисы', uz: 'Saytlar va servislar', en: 'Sites & Services' },
    shortDescription: { 
      ru: 'Превращаем посетителей в клиентов через продуманный UX и технологии.', 
      uz: 'O\'ylangan UX va texnologiyalar orqali tashrif buyuruvchilarni mijozga aylantiramiz.', 
      en: 'Converting visitors into customers through thoughtful UX and technology.' 
    },
    icon: <Icons.Web />,
    accentColor: 'text-accent-coral',
    audience: [
        { ru: 'Стартапы (MVP)', uz: 'Startaplar (MVP)', en: 'Startups (MVP)' },
        { ru: 'E-commerce', uz: 'Elektron tijorat', en: 'E-commerce' },
        { ru: 'Корпорации', uz: 'Korporatsiyalar', en: 'Corporations' }
    ],
    businessProblems: [
        { ru: 'Сайт не продает', uz: 'Sayt sotmayapti', en: 'Website doesn\'t sell' },
        { ru: 'Сложно масштабировать', uz: 'Masshtablash qiyin', en: 'Hard to scale' },
        { ru: 'Устаревший дизайн', uz: 'Eskirgan dizayn', en: 'Outdated design' }
    ],
    types: [
        { ru: 'Landing Page', uz: 'Landing Page', en: 'Landing Page' },
        { ru: 'Интернет-магазин', uz: 'Internet do\'kon', en: 'E-shop' },
        { ru: 'Корпоративный портал', uz: 'Korporativ portal', en: 'Corporate Portal' },
        { ru: 'Веб-сервис / SAAS', uz: 'Veb-servis / SAAS', en: 'Web Service / SAAS' }
    ],
    included: [
        { ru: 'UX/UI Проектирование', uz: 'UX/UI Loyihalash', en: 'UX/UI Design' },
        { ru: 'Frontend & Backend', uz: 'Frontend & Backend', en: 'Frontend & Backend' },
        { ru: 'SEO-оптимизация', uz: 'SEO-optimizatsiya', en: 'SEO Optimization' },
        { ru: 'Интеграция с CRM', uz: 'CRM integratsiyasi', en: 'CRM Integration' }
    ],
    process: [
        { step: { ru: 'Аналитика', uz: 'Tahlil', en: 'Analysis' }, description: { ru: 'Изучаем рынок и конкурентов', uz: 'Bozor va raqobatchilarni o\'rganamiz', en: 'Market & competitor research' } },
        { step: { ru: 'Прототип', uz: 'Prototip', en: 'Prototype' }, description: { ru: 'Строим каркас сайта', uz: 'Sayt karkasini quramiz', en: 'Building structure' } },
        { step: { ru: 'Разработка', uz: 'Dasturlash', en: 'Development' }, description: { ru: 'Пишем чистый код', uz: 'Toza kod yozamiz', en: 'Writing clean code' } },
        { step: { ru: 'Запуск', uz: 'Ishga tushirish', en: 'Launch' }, description: { ru: 'Тестируем и публикуем', uz: 'Sinovdan o\'tkazamiz va e\'lon qilamiz', en: 'Testing & Deploy' } }
    ],
    result: { ru: 'Рост конверсии на 30-150%', uz: 'Konversiyaning 30-150% ga o\'sishi', en: 'Conversion growth 30-150%' },
    ctaText: { ru: 'Рассчитать проект', uz: 'Loyihani hisoblash', en: 'Estimate Project' }
  },
  {
    id: 'smm',
    title: { ru: 'SMM и Контент', uz: 'SMM va Kontent', en: 'SMM & Content' },
    shortDescription: { 
      ru: 'Создаем контент, который продает. Развиваем бренд и коммуникацию в соцсетях.', 
      uz: 'Sotadigan kontent yaratamiz. Ijtimoiy tarmoqlarda brend va kommunikatsiyani rivojlantiramiz.', 
      en: 'Creating content that sells. Developing brand and communication in social media.' 
    },
    icon: <Icons.SMM />,
    accentColor: 'text-accent-turquoise',
    audience: [{ ru: 'Бренды', uz: 'Brendlar', en: 'Brands' }, { ru: 'Эксперты', uz: 'Ekspertlar', en: 'Experts' }],
    businessProblems: [{ ru: 'Нет охватов', uz: 'Qamrov yo\'q', en: 'No reach' }, { ru: 'Низкая лояльность', uz: 'Past sodiqlik', en: 'Low loyalty' }],
    types: [{ ru: 'Стратегия', uz: 'Strategiya', en: 'Strategy' }, { ru: 'Reels / TikTok', uz: 'Reels / TikTok', en: 'Reels / TikTok' }, { ru: 'Таргет', uz: 'Target', en: 'Targeting' }],
    included: [{ ru: 'Контент-план', uz: 'Kontent-reja', en: 'Content Plan' }, { ru: 'Съемка и монтаж', uz: 'Tasvirga olish va montaj', en: 'Shooting & Editing' }],
    process: [
        { step: { ru: 'Стратегия', uz: 'Strategiya', en: 'Strategy' }, description: { ru: 'Определяем tone of voice', uz: 'Tone of voice aniqlaymiz', en: 'Defining tone of voice' } },
        { step: { ru: 'Продакшн', uz: 'Prodakshn', en: 'Production' }, description: { ru: 'Создаем контент', uz: 'Kontent yaratamiz', en: 'Creating content' } }
    ],
    result: { ru: 'Рост охватов и лояльной аудитории', uz: 'Qamrov va sodiq auditoriya o\'sishi', en: 'Reach & Loyalty Growth' },
    ctaText: { ru: 'Заказать аудит', uz: 'Audit buyurtma qilish', en: 'Order Audit' }
  },
  {
    id: 'branding',
    title: { ru: 'Брендинг', uz: 'Brending', en: 'Branding' },
    shortDescription: { 
      ru: 'Упаковка смыслов в визуал. Логотипы, айдентика и позиционирование.', 
      uz: 'Ma\'nolarni vizualga o\'rash. Logotiplar, aydentika va joylashuv.', 
      en: 'Packaging meanings into visuals. Logos, identity, and positioning.' 
    },
    icon: <Icons.Brand />,
    accentColor: 'text-accent-amethyst',
    audience: [{ ru: 'Новые бренды', uz: 'Yangi brendlar', en: 'New brands' }, { ru: 'Ребрендинг', uz: 'Rebrending', en: 'Rebranding' }],
    businessProblems: [{ ru: 'Нет узнаваемости', uz: 'Tanimaslik', en: 'No recognition' }, { ru: 'Устаревший стиль', uz: 'Eskirgan uslub', en: 'Outdated style' }],
    types: [{ ru: 'Логотип', uz: 'Logotip', en: 'Logo' }, { ru: 'Брендбук', uz: 'Brendbuk', en: 'Brandbook' }, { ru: 'Айдентика', uz: 'Aydentika', en: 'Identity' }],
    included: [{ ru: 'Анализ рынка', uz: 'Bozor tahlili', en: 'Market analysis' }, { ru: 'Дизайн-концепции', uz: 'Dizayn konsepsiyalari', en: 'Design concepts' }],
    process: [{ step: { ru: 'Смыслы', uz: 'Ma\'nolar', en: 'Meanings' }, description: { ru: 'Распаковка бренда', uz: 'Brendni ochish', en: 'Brand unpacking' } }],
    result: { ru: 'Узнаваемый образ компании', uz: 'Kompaniyaning taniladigan qiyofasi', en: 'Recognizable company image' },
    ctaText: { ru: 'Разработать бренд', uz: 'Brend yaratish', en: 'Develop Brand' }
  },
  {
    id: 'automation',
    title: { ru: 'Автоматизация', uz: 'Avtomatlashtirish', en: 'Automation' },
    shortDescription: { 
      ru: 'Системы для отделов продаж. CRM, телефония и сквозная аналитика.', 
      uz: 'Sotuv bo\'limlari uchun tizimlar. CRM, telefoniya va to\'liq tahlil.', 
      en: 'Systems for sales departments. CRM, telephony, and end-to-end analytics.' 
    },
    icon: <Icons.Auto />,
    accentColor: 'text-accent-orange',
    audience: [{ ru: 'Отделы продаж', uz: 'Sotuv bo\'limlari', en: 'Sales Depts' }, { ru: 'Колл-центры', uz: 'Call-markazlar', en: 'Call Centers' }],
    businessProblems: [{ ru: 'Потеря лидов', uz: 'Lidlar yo\'qolishi', en: 'Lost leads' }, { ru: 'Нет контроля', uz: 'Nazorat yo\'q', en: 'No control' }],
    types: [{ ru: 'AmoCRM / Bitrix24', uz: 'AmoCRM / Bitrix24', en: 'AmoCRM / Bitrix24' }, { ru: 'Телефония', uz: 'Telefoniya', en: 'Telephony' }],
    included: [{ ru: 'Настройка воронок', uz: 'Voronkalarni sozlash', en: 'Pipeline setup' }, { ru: 'Обучение персонала', uz: 'Xodimlarni o\'qitish', en: 'Staff training' }],
    process: [{ step: { ru: 'Внедрение', uz: 'Joriy etish', en: 'Implementation' }, description: { ru: 'Техническая настройка', uz: 'Texnik sozlash', en: 'Technical setup' } }],
    result: { ru: 'Рост эффективности продаж', uz: 'Sotuv samaradorligi o\'sishi', en: 'Sales efficiency growth' },
    ctaText: { ru: 'Автоматизировать', uz: 'Avtomatlashtirish', en: 'Automate' }
  },
  {
    id: 'seo_geo',
    title: { ru: 'SEO / GEO', uz: 'SEO / GEO', en: 'SEO / GEO' },
    shortDescription: { 
      ru: 'Продвижение в картах (Google/Yandex) и поиске (SEO). Вывод в ТОП локальной выдачи.', 
      uz: 'Xaritalarda (Google/Yandex) va qidiruvda (SEO) ilgari surish. Mahalliy qidiruvda TOPga chiqarish.', 
      en: 'Promotion in maps (Google/Yandex) and search (SEO). Top of local search results.' 
    },
    icon: <Icons.Map />,
    accentColor: 'text-accent-mint',
    audience: [{ ru: 'Локальный бизнес', uz: 'Mahalliy biznes', en: 'Local business' }, { ru: 'Магазины', uz: 'Do\'konlar', en: 'Stores' }],
    businessProblems: [{ ru: 'Не находят на карте', uz: 'Xaritada topilmaydi', en: 'Not found on map' }, { ru: 'Мало органики', uz: 'Organika kam', en: 'Low organic' }],
    types: [{ ru: 'Google/Yandex Maps', uz: 'Google/Yandex Maps', en: 'Google/Yandex Maps' }, { ru: 'SEO сайта', uz: 'Sayt SEOsi', en: 'Website SEO' }],
    included: [{ ru: 'Оптимизация карточек', uz: 'Kartochkalarni optimallashtirish', en: 'Card optimization' }, { ru: 'Техническое SEO', uz: 'Texnik SEO', en: 'Technical SEO' }],
    process: [{ step: { ru: 'Анализ', uz: 'Tahlil', en: 'Analysis' }, description: { ru: 'Аудит присутствия', uz: 'Mavjudlik auditi', en: 'Presence audit' } }],
    result: { ru: 'Рост органического трафика', uz: 'Organik trafik o\'sishi', en: 'Organic traffic growth' },
    ctaText: { ru: 'Поднять рейтинг', uz: 'Reytingni oshirish', en: 'Boost Rating' }
  },
  {
    id: 'serm',
    title: { ru: 'SERM / Репутация', uz: 'SERM / Reputatsiya', en: 'SERM / Reputation' },
    shortDescription: { 
      ru: 'Управление репутацией. Удаление негатива, работа с отзывами и защита бренда.', 
      uz: 'Reputatsiyani boshqarish. Negativni o\'chirish, sharhlar bilan ishlash va brend himoyasi.', 
      en: 'Reputation management. Removing negatives, working with reviews, and brand protection.' 
    },
    icon: <Icons.Shield />,
    accentColor: 'text-accent-lavender',
    audience: [{ ru: 'Крупный бизнес', uz: 'Yirik biznes', en: 'Enterprises' }, { ru: 'Персоны', uz: 'Shaxslar', en: 'Public figures' }],
    businessProblems: [{ ru: 'Негатив в поиске', uz: 'Qidiruvda negativ', en: 'Negative in search' }, { ru: 'Низкий рейтинг', uz: 'Past reyting', en: 'Low rating' }],
    types: [{ ru: 'Работа с отзывами', uz: 'Sharhlar bilan ishlash', en: 'Review management' }, { ru: 'Чистка SERP', uz: 'SERP tozalash', en: 'SERP cleaning' }],
    included: [{ ru: 'Мониторинг упоминаний', uz: 'Eslatmalarni monitoring qilish', en: 'Mention monitoring' }, { ru: 'Официальные ответы', uz: 'Rasmiy javoblar', en: 'Official replies' }],
    process: [{ step: { ru: 'Мониторинг', uz: 'Monitoring', en: 'Monitoring' }, description: { ru: 'Поиск упоминаний', uz: 'Eslatmalarni qidirish', en: 'Scanning mentions' } }],
    result: { ru: 'Чистая репутация и доверие', uz: 'Toza reputatsiya va ishonch', en: 'Clean reputation & trust' },
    ctaText: { ru: 'Исправить репутацию', uz: 'Reputatsiyani to\'g\'irlash', en: 'Fix Reputation' }
  },
  {
    id: 'ads',
    title: { ru: 'Реклама', uz: 'Reklama', en: 'Ads' },
    shortDescription: { 
      ru: 'Приводим целевых клиентов из Instagram, Facebook, Google, Yandex и Telegram.', 
      uz: 'Instagram, Facebook, Google, Yandex va Telegramdan maqsadli mijozlarni olib kelamiz.', 
      en: 'Driving targeted clients from Instagram, Facebook, Google, Yandex and Telegram.' 
    },
    icon: <Icons.Ads />,
    accentColor: 'text-accent-sky',
    audience: [{ ru: 'B2B', uz: 'B2B', en: 'B2B' }, { ru: 'B2C', uz: 'B2C', en: 'B2C' }],
    businessProblems: [{ ru: 'Дорогие лиды', uz: 'Qimmat lidlar', en: 'Expensive leads' }, { ru: 'Мало заявок', uz: 'Arizalar kam', en: 'Few leads' }],
    types: [{ ru: 'Контекст', uz: 'Kontekst', en: 'PPC' }, { ru: 'Таргет', uz: 'Target', en: 'Target' }],
    included: [{ ru: 'Настройка кампаний', uz: 'Kampaniyalarni sozlash', en: 'Campaign setup' }, { ru: 'Аналитика', uz: 'Tahlil', en: 'Analytics' }],
    process: [{ step: { ru: 'Тест', uz: 'Test', en: 'Test' }, description: { ru: 'Проверка гипотез', uz: 'Gipotezalarni tekshirish', en: 'Hypothesis testing' } }],
    result: { ru: 'Снижение стоимости лида', uz: 'Lid narxining pasayishi', en: 'Lower CPA' },
    ctaText: { ru: 'Настроить рекламу', uz: 'Reklamani sozlash', en: 'Setup Ads' }
  }
];

export const CASES_DATA: CaseStudy[] = [
    {
        id: '1',
        slug: 'texnomart-redesign',
        client: 'Texnomart',
        title: { ru: 'Редизайн e-commerce платформы', uz: 'E-commerce platformasi re-dizayni', en: 'E-commerce platform redesign' },
        shortDescription: { ru: 'Полное обновление UX/UI для одного из лидеров рынка бытовой техники.', uz: 'Maishiy texnika bozori yetakchilaridan biri uchun to\'liq UX/UI yangilanishi.', en: 'Complete UX/UI update for a market leader in electronics.' },
        tags: [{ ru: 'Web', uz: 'Web', en: 'Web' }, { ru: 'UX/UI', uz: 'UX/UI', en: 'UX/UI' }],
        heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
        challenge: { ru: 'Устаревший интерфейс снижал конверсию на мобильных устройствах.', uz: 'Eskirgan interfeys mobil qurilmalarda konversiyani pasaytirar edi.', en: 'Outdated interface reduced mobile conversion.' },
        solution: { ru: 'Разработали Mobile-First дизайн систему и упростили чекаут.', uz: 'Mobile-First dizayn tizimini ishlab chiqdik va to\'lov jarayonini soddalashtirdik.', en: 'Developed Mobile-First design system and simplified checkout.' },
        results: [
            { value: '+24%', label: { ru: 'Конверсия', uz: 'Konversiya', en: 'Conversion' } },
            { value: 'x2', label: { ru: 'Скорость', uz: 'Tezlik', en: 'Speed' } }
        ],
        technologies: ['Figma', 'React', 'Next.js'],
        year: '2023'
    },
    {
        id: '2',
        slug: 'akfa-university',
        client: 'Akfa University',
        title: { ru: 'Приемная кампания 360°', uz: 'Qabul kampaniyasi 360°', en: 'Admission campaign 360°' },
        shortDescription: { ru: 'Комплексный маркетинг: от таргета до CRM.', uz: 'Kompleks marketing: targetdan CRM gacha.', en: 'Comprehensive marketing: from targeting to CRM.' },
        tags: [{ ru: 'SMM', uz: 'SMM', en: 'SMM' }, { ru: 'Ads', uz: 'Ads', en: 'Ads' }],
        heroImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
        challenge: { ru: 'Набрать 2000 студентов за 2 месяца.', uz: '2 oy ichida 2000 talaba qabul qilish.', en: 'Recruit 2000 students in 2 months.' },
        solution: { ru: 'Запустили воронку через Instagram + Telegram Bot с автоматической квалификацией.', uz: 'Instagram + Telegram Bot orqali avtomatik saralash bilan voronka ishga tushirdik.', en: 'Launched a funnel via Instagram + Telegram Bot with auto-qualification.' },
        results: [
            { value: '5000+', label: { ru: 'Заявок', uz: 'Arizalar', en: 'Leads' } },
            { value: '$4', label: { ru: 'CPL', uz: 'CPL', en: 'CPL' } }
        ],
        technologies: ['Facebook Ads', 'AmoCRM', 'ManyChat'],
        year: '2024'
    },
    {
        id: '3',
        slug: 'murad-buildings',
        client: 'Murad Buildings',
        title: { ru: 'Имиджевый сайт девелопера', uz: 'Developer imij sayti', en: 'Developer Image Website' },
        shortDescription: { ru: 'Разработка премиального сайта для презентации новых ЖК.', uz: 'Yangi TJM taqdimoti uchun premium sayt ishlab chiqish.', en: 'Premium website development for new residential complex.' },
        tags: [{ ru: 'Web', uz: 'Web', en: 'Web' }, { ru: '3D', uz: '3D', en: '3D' }],
        heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
        challenge: { ru: 'Передать атмосферу премиум-жизни через экран.', uz: 'Premium hayot muhitini ekran orqali yetkazish.', en: 'Convey premium lifestyle atmosphere through screen.' },
        solution: { ru: 'Использовали WebGL и 3D-туры по квартирам.', uz: 'WebGL va kvartiralar bo\'ylab 3D-turlardan foydalandik.', en: 'Used WebGL and 3D apartment tours.' },
        results: [
            { value: '40k', label: { ru: 'Посетителей', uz: 'Tashrif', en: 'Visitors' } }
        ],
        technologies: ['Three.js', 'Vue.js', 'Blender'],
        year: '2023'
    },
    {
        id: '4',
        slug: 'golden-house-serm',
        client: 'Golden House',
        title: { ru: 'Управление репутацией (SERM)', uz: 'Reputatsiyani boshqarish (SERM)', en: 'Reputation Management (SERM)' },
        shortDescription: { ru: 'Очистка поисковой выдачи от негатива и работа с отзывами.', uz: 'Qidiruv natijalarini negativdan tozalash va sharhlar bilan ishlash.', en: 'Cleaning search results from negative and working with reviews.' },
        tags: [{ ru: 'SERM', uz: 'SERM', en: 'SERM' }, { ru: 'PR', uz: 'PR', en: 'PR' }],
        heroImage: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2073&auto=format&fit=crop',
        challenge: { ru: 'Негативные отзывы на картах снижали доверие покупателей.', uz: 'Xaritalardagi salbiy sharhlar xaridorlar ishonchini pasaytirar edi.', en: 'Negative reviews on maps reduced buyer trust.' },
        solution: { ru: 'Стратегия вытеснения негатива, работа с лояльными клиентами и официальные ответы.', uz: 'Negativni siqib chiqarish strategiyasi, sodiq mijozlar bilan ishlash va rasmiy javoblar.', en: 'Negative displacement strategy, working with loyal clients and official responses.' },
        results: [
            { value: '4.9', label: { ru: 'Рейтинг', uz: 'Reyting', en: 'Rating' } },
            { value: '-85%', label: { ru: 'Негатива', uz: 'Negativ', en: 'Negative' } }
        ],
        technologies: ['Google My Business', 'Yandex Maps', 'Brand Analytics'],
        year: '2023'
    }
];