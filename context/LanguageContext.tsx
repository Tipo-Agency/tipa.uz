import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Language, LocalizedString } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getLocalized: (obj: LocalizedString | string) => string;
}

const translations: Record<string, LocalizedString> = {
  // Navigation
  'nav.services': { ru: 'Услуги', uz: 'Xizmatlar', en: 'Services' },
  'nav.cases': { ru: 'Кейсы', uz: 'Keyslar', en: 'Work' },
  'nav.news': { ru: 'Новости', uz: 'Yangiliklar', en: 'News' },
  'nav.about': { ru: 'О нас', uz: 'Biz haqimizda', en: 'About' },
  'nav.contact': { ru: 'Связаться', uz: "Bog'lanish", en: 'Contact' },
  'nav.start': { ru: 'Начать проект', uz: 'Loyihani boshlash', en: 'Start Project' },
  
  // Home - Hero
  'home.subtitle': { ru: 'Системный цифровой партнер', uz: 'Tizimli raqamli hamkor', en: 'Systemic Digital Partner' },
  'hero.title_1': { ru: 'DIGITAL', uz: 'DIGITAL', en: 'DIGITAL' },
  'hero.title_2': { ru: 'ECOSYSTEMS', uz: 'ECOSYSTEMS', en: 'ECOSYSTEMS' },
  'home.hero_text': { 
    ru: 'Строим цифровые экосистемы. Маркетинг, разработка и CRM в единой связке для кратного роста прибыли.', 
    uz: 'Raqamli ekotizimlarni quramiz. Foydani oshirish uchun marketing, dasturlash va CRM yagona bog\'lamada.', 
    en: 'Building digital ecosystems. Marketing, development, and CRM integrated for exponential profit growth.' 
  },
  'home.cta_primary': { ru: 'Начать проект', uz: 'Boshlash', en: 'Start Project' },
  'home.cta_secondary': { ru: 'Кейсы', uz: 'Keyslar', en: 'Our Work' },
  
  // Home - Services
  'home.services_sub': { ru: 'Компетенции', uz: 'Kompetensiyalar', en: 'Competencies' },
  'home.services_title': { ru: 'Инструменты роста', uz: 'O\'sish vositalari', en: 'Growth Tools' },
  'home.all_services': { ru: 'Все услуги', uz: 'Barcha xizmatlar', en: 'All Services' },
  
  // Home - Why Us (Bento Grid)
  'home.why_title': { ru: 'Почему мы?', uz: 'Nega biz?', en: 'Why us?' },
  'home.why_1_head': { ru: 'KPI & ROI', uz: 'KPI & ROI', en: 'KPI & ROI' },
  'home.why_1_desc': { ru: 'Мы говорим на языке цифр. Если инструмент не приносит прибыль — мы его не предлагаем.', uz: 'Biz raqamlar tilida gaplashamiz. Agar vosita foyda keltirmasa, biz uni taklif qilmaymiz.', en: 'We speak the language of numbers. If a tool doesn\'t bring profit, we don\'t offer it.' },
  
  'home.why_2_head': { ru: 'Скорость', uz: 'Tezlik', en: 'Speed' },
  'home.why_2_desc': { ru: 'Запускаем MVP за 2-3 недели. Быстрые тесты гипотез вместо месяцев разработки.', uz: 'MVPni 2-3 haftada ishga tushiramiz. Oylab rivojlanish o\'rniga tezkor gipoteza testlari.', en: 'MVP launch in 2-3 weeks. Fast hypothesis testing instead of months of development.' },
  
  'home.why_3_head': { ru: 'Система', uz: 'Tizim', en: 'System' },
  'home.why_3_desc': { ru: 'Не лечим симптомы, а устраняем причину. Выстраиваем процессы, которые работают без вас.', uz: 'Semptomlarni davolamaymiz, sababni bartaraf etamiz. Sizsiz ishlaydigan jarayonlarni quramiz.', en: 'We don\'t treat symptoms, we fix the cause. Building processes that work without you.' },

  'home.why_4_head': { ru: 'Прозрачность', uz: 'Shaffoflik', en: 'Transparency' },
  'home.why_4_desc': { ru: 'Полный доступ к задачам и метрикам 24/7. Вы всегда знаете, куда уходит бюджет.', uz: 'Vazifalar va metrikalarga 24/7 kirish. Byudjet qayerga ketayotganini har doim bilasiz.', en: 'Full access to tasks and metrics 24/7. You always know where the budget goes.' },
  
  // Home - News
  'home.news_title': { ru: 'Последние инсайты', uz: 'So\'nggi yangiliklar', en: 'Latest Insights' },
  'home.news_link': { ru: 'Все новости', uz: 'Barcha yangiliklar', en: 'All News' },

  // Home - Cases & CTA
  'home.cases_title': { ru: 'Кейсы', uz: 'Keyslar', en: 'Selected Work' },
  'home.cases_link': { ru: 'Все работы', uz: 'Barcha ishlar', en: 'All Works' },
  'home.cta_title': { ru: 'ОБСУДИМ', uz: 'LOYIHANI', en: 'LET\'S TALK' },
  'home.cta_title_2': { ru: 'ПРОЕКТ', uz: 'MUHOKAMA', en: 'PROJECT' },
  'home.cta_text': { ru: 'Есть задача? Давайте обсудим её решение. Бесплатно и по делу.', uz: 'Vazifa bormi? Keling, uning yechimini muhokama qilaylik. Bepul va aniq.', en: 'Have a task? Let\'s discuss the solution. Free and to the point.' },
  'home.cta_button': { ru: 'Оставить заявку', uz: 'Ariza qoldirish', en: 'Submit Request' },
  
  // Footer
  'footer.slogan': { ru: 'Превращаем хаос в систему.', uz: 'Xaosni tizimga aylantiramiz.', en: 'Turning chaos into system.' },
  'footer.nav': { ru: 'Меню', uz: 'Menyu', en: 'Menu' },
  'footer.contacts': { ru: 'Контакты', uz: 'Aloqa', en: 'Contacts' },
  'footer.rights': { ru: 'Все права защищены.', uz: 'Barcha huquqlar himoyalangan.', en: 'All rights reserved.' },
  'footer.legal_privacy': { ru: 'Политика конфиденциальности', uz: 'Maxfiylik siyosati', en: 'Privacy Policy' },
  'footer.legal_terms': { ru: 'Условия использования', uz: 'Foydalanish shartlari', en: 'Terms of Service' },
  'footer.bg_text': { ru: 'ТИПА АГЕНТСТВО', uz: 'TIPA AGENTLIGI', en: 'TIPA AGENCY' },

  // Contact Page
  'contact.title': { ru: 'Готовы начать?', uz: 'Boshlashga tayyormisiz?', en: 'Ready to start?' },
  'contact.subtitle': { ru: 'Заполните форму или свяжитесь с нами напрямую.', uz: 'Formani to\'ldiring yoki biz bilan bog\'laning.', en: 'Fill out the form or contact us directly.' },
  'contact.name': { ru: 'Ваше имя', uz: 'Ismingiz', en: 'Your Name' },
  'contact.phone': { ru: 'Телефон / Telegram', uz: 'Telefon / Telegram', en: 'Phone / Telegram' },
  'contact.task': { ru: 'Задача', uz: 'Vazifa', en: 'Task' },
  'contact.submit': { ru: 'Отправить', uz: 'Yuborish', en: 'Send' },
  'contact.success': { ru: 'Принято!', uz: 'Qabul qilindi!', en: 'Received!' },
  
  // About Page Philosophy
  'about.philosophy_title': { ru: 'Философия', uz: 'Falsafa', en: 'Philosophy' },
  'about.how_we_think': { ru: 'Как мы думаем', uz: 'Biz qanday fikrlaymiz', en: 'How we think' },
  'about.philo_bold': { 
    ru: 'Мы — системные инженеры роста.', 
    uz: 'Biz — tizimli o\'sish muhandislarimiz.', 
    en: 'We are systemic growth engineers.' 
  },
  'about.philo_p1': { 
    ru: 'Бизнес — это не набор случайных действий, а точный механизм. Мы не «креативим», мы проектируем решения. Если сайт не продает — это ошибка в архитектуре, а не «видение художника».', 
    uz: 'Biznes — bu tasodifiy harakatlar to\'plami emas, balki aniq mexanizm. Biz "ijod qilmaymiz", biz yechimlarni loyihalashtiramiz. Agar sayt sotmasa — bu "rassomning qarashi" emas, balki arxitekturadagi xato.', 
    en: 'Business is not a set of random actions, but a precise mechanism. We don\'t just "create", we architect solutions. If a site doesn\'t sell, it\'s an architecture error, not an "artist\'s vision".' 
  },
  'about.philo_p2': { 
    ru: 'Мы устраняем разрыв между IT-технологиями и банковским счетом собственника.', 
    uz: 'Biz IT-texnologiyalar va egasining bank hisobi o\'rtasidagi bo\'shliqni yo\'q qilamiz.', 
    en: 'We bridge the gap between IT technologies and the owner\'s bank account.' 
  },
  'about.manifesto': { ru: 'Наш манифест', uz: 'Bizning manifest', en: 'Our Manifesto' },
  'about.man_1': { ru: 'Сначала смыслы, потом дизайн', uz: 'Avval ma\'nolar, keyin dizayn', en: 'Meanings first, then design' },
  'about.man_2': { ru: 'Автоматизация рутины — приоритет', uz: 'Rutina avtomatizatsiyasi — ustuvor', en: 'Automation is priority' },
  'about.man_3': { ru: 'Данные важнее мнений', uz: 'Ma\'lumotlar fikrlardan muhimroq', en: 'Data over opinions' },
  'about.man_4': { ru: 'Честность в сроках и бюджетах', uz: 'Muddat va byudjetda halollik', en: 'Honesty in deadlines & budget' },

  // News Page
  'news.title': { ru: 'Новости', uz: 'Yangiliklar', en: 'News' },
  'news.intro': { ru: 'Делимся экспертизой, кейсами и новостями digital-мира.', uz: 'Ekspertiza, keyslar va digital-olam yangiliklari bilan bo\'lishamiz.', en: 'Sharing expertise, cases and digital world news.' },
  'news.read': { ru: 'Читать', uz: 'O\'qish', en: 'Read' },

  // FAQ
  'faq.title': { ru: 'FAQ', uz: 'FAQ', en: 'FAQ' },
  'faq.subtitle': { ru: 'Ответы на вопросы', uz: 'Savollarga javoblar', en: 'Questions & Answers' },

  // Common
  'common.read_more': { ru: 'Подробнее', uz: 'Batafsil', en: 'Read More' },
  'common.all_services': { ru: 'Все услуги', uz: 'Barcha xizmatlar', en: 'All Services' },
  'common.back': { ru: 'Назад', uz: 'Orqaga', en: 'Back' },
  'common.result': { ru: 'Результат', uz: 'Natija', en: 'Result' },
  'common.what_we_do': { ru: 'Что делаем', uz: 'Nima qilamiz', en: 'What we do' },

  // Cookies
  'cookie.text': { 
    ru: 'Мы используем куки. Не те, что с шоколадом, а цифровые. Без паники, мы просто хотим, чтобы сайт летал. Договорились?', 
    uz: 'Biz cookie-fayllardan foydalanamiz. Shokoladli emas, raqamli. Vahima qilmang, shunchaki sayt uchishini xohlaymiz. Kelishdikmi?', 
    en: 'We use cookies. Not the chocolate chip kind. No panic, we just want the site to run smooth. Cool?' 
  },
  'cookie.btn': { ru: 'Ок, погнали', uz: 'Ok, ketdik', en: 'Ok, let\'s go' },

  // 404 Page
  '404.title': { ru: 'Страница не найдена', uz: 'Sahifa topilmadi', en: 'Page Not Found' },
  '404.description': { ru: 'Страница, которую вы ищете, не существует или была перемещена. Возможно, вы ввели неправильный адрес.', uz: 'Qidirayotgan sahifangiz mavjud emas yoki ko\'chirilgan. Ehtimol, noto\'g\'ri manzil kiritdingiz.', en: 'The page you are looking for does not exist or has been moved. You may have entered the wrong address.' },
  '404.back_home': { ru: 'Вернуться на главную', uz: 'Bosh sahifaga qaytish', en: 'Back to Home' },
  '404.view_services': { ru: 'Посмотреть услуги', uz: 'Xizmatlarni ko\'rish', en: 'View Services' },

  // Service Detail
  'services.title': { ru: 'Наши', uz: 'Bizning', en: 'Our' },
  'services.title_highlight': { ru: 'Услуги', uz: 'Xizmatlar', en: 'Services' },
  'services.intro_1': { ru: 'Мы превращаем хаос в систему и помогаем бизнесу расти кратно.', uz: 'Biz tartibsizlikni tizimga aylantiramiz va biznesning ko\'p marta o\'sishiga yordam beramiz.', en: 'We turn chaos into a system and help businesses grow exponentially.' },
  'services.intro_2': { ru: 'Мы строим цифровые машины продаж, где каждый винтик — от CRM до рекламы — работает на вашу прибыль.', uz: 'Biz raqamli sotish mashinalarini quramiz, bu yerda har bir detal — CRM dan reklamagacha — sizning foydangiz uchun ishlaydi.', en: 'We build digital sales machines, where every cog — from CRM to advertising — works for your profit.' },
  'services.intro': { 
    ru: 'Бизнес — это единый организм. Мы внедряем инструменты, которые усиливают друг друга.', 
    uz: 'Biznes — bu yagona organizm. Biz bir-birini kuchaytiradigan vositalarni joriy qilamiz.', 
    en: 'Business is a single organism. We implement tools that reinforce each other.' 
  },
  'services.what_we_do': { ru: 'Что делаем', uz: 'Nima qilamiz', en: 'What we do' },
  'services.result': { ru: 'Результат', uz: 'Natija', en: 'Result' },

  // Cases Page
  'cases.page_title': { ru: 'КЕЙСЫ', uz: 'KEYSLAR', en: 'CASES' },
  'cases.intro': { 
    ru: 'Продукты, меняющие правила игры. Фокус на метриках и масштабируемости.', 
    uz: 'O\'yin qoidalarini o\'zgartiradigan mahsulotlar. Metrikalar va masshtablilikka e\'tibor.', 
    en: 'Game-changing products. Focus on metrics and scalability.' 
  },
  'cases.client': { ru: 'Клиент', uz: 'Mijoz', en: 'Client' },
  'cases.result_label': { ru: 'Результат', uz: 'Natija', en: 'Result' },

  // Service Detail
  'service.back': { ru: 'Все услуги', uz: 'Barcha xizmatlar', en: 'All services' },
  'service.audience': { ru: 'Для кого', uz: 'Kim uchun', en: 'For whom' },
  'service.problems': { ru: 'Проблемы', uz: 'Muammolar', en: 'Problems' },
  'service.types': { ru: 'Типы', uz: 'Turlar', en: 'Types' },
  'service.included': { ru: 'Состав работ', uz: 'Ishlar tarkibi', en: 'Scope of work' },
  'service.process': { ru: 'Процесс', uz: 'Jarayon', en: 'Process' },
  'service.roadmap': { ru: 'Roadmap', uz: 'Roadmap', en: 'Roadmap' },
  'service.result_label': { ru: 'Итог', uz: 'Natija', en: 'Result' },

  // Contact Page
  'contact.page_title_1': { ru: 'Готовы обсудить', uz: 'Loyihani', en: 'Ready to discuss' },
  'contact.page_title_2': { ru: 'проект?', uz: 'muhokama qilamizmi?', en: 'a project?' },
  'contact.intro': { ru: 'Заполните форму или пишите напрямую. Отвечаем быстро.', uz: 'Formani to\'ldiring yoki to\'g\'ridan-to\'g\'ri yozing. Tez javob beramiz.', en: 'Fill out the form or write directly. We reply fast.' },
  'contact.label_phone': { ru: 'Телефон', uz: 'Telefon', en: 'Phone' },
  'contact.label_email': { ru: 'Email', uz: 'Email', en: 'Email' },
  'contact.label_office': { ru: 'Офис', uz: 'Ofis', en: 'Office' },
  'contact.form_title': { ru: 'Бриф', uz: 'Brif', en: 'Brief' },
  'contact.form_name': { ru: 'Имя', uz: 'Ism', en: 'Name' },
  'contact.form_contact': { ru: 'Контакт', uz: 'Aloqa', en: 'Contact' },
  'contact.form_task': { ru: 'Задача', uz: 'Vazifa', en: 'Task' },
  'contact.form_btn': { ru: 'Отправить', uz: 'Yuborish', en: 'Send' },
  'contact.sending': { ru: 'Отправка...', uz: 'Yuborilmoqda...', en: 'Sending...' },
  'contact.success_title': { ru: 'Принято!', uz: 'Qabul qilindi!', en: 'Received!' },
  'contact.success_text': { ru: 'Скоро свяжемся.', uz: 'Tez orada bog\'lanamiz.', en: 'We will contact you soon.' },
  'contact.send_more': { ru: 'Еще одна заявка', uz: 'Yana bitta ariza', en: 'Another request' },
  'contact.error_generic': { ru: 'Произошла ошибка при отправке. Попробуйте позже.', uz: 'Yuborishda xatolik yuz berdi. Keyinroq urinib ko\'ring.', en: 'An error occurred while sending. Please try again later.' },
  'contact.error_permission': { ru: 'Ошибка доступа. Проверьте настройки безопасности.', uz: 'Kirish xatosi. Xavfsizlik sozlamalarini tekshiring.', en: 'Access error. Please check security settings.' },
  'contact.error_network': { ru: 'Проблема с сетью. Проверьте подключение к интернету.', uz: 'Tarmoq muammosi. Internet ulanishini tekshiring.', en: 'Network problem. Please check your internet connection.' },
  
  // Submitted Page
  'submitted.page_title': { ru: 'Спасибо за заявку', uz: 'Arizangiz uchun rahmat', en: 'Thank you for your request' },
  'submitted.description': { ru: 'Ваша заявка принята. Мы свяжемся с вами в ближайшее время.', uz: 'Arizangiz qabul qilindi. Tez orada siz bilan bog\'lanamiz.', en: 'Your request has been received. We will contact you soon.' },
  'submitted.title': { ru: 'Спасибо!', uz: 'Rahmat!', en: 'Thank you!' },
  'submitted.text': { ru: 'Ваша заявка принята. Мы свяжемся с вами в ближайшее время.', uz: 'Arizangiz qabul qilindi. Tez orada siz bilan bog\'lanamiz.', en: 'Your request has been received. We will contact you soon.' },
  'submitted.back_home': { ru: 'Вернуться на главную', uz: 'Bosh sahifaga qaytish', en: 'Back to Home' },
  
  // Common UI elements
  'common.order': { ru: 'Заказать', uz: 'Buyurtma berish', en: 'Order' },
  'common.from': { ru: 'от', uz: 'dan', en: 'from' },
  'common.currency': { ru: 'UZS', uz: 'UZS', en: 'UZS' },
  'common.popular': { ru: 'Популярный', uz: 'Mashhur', en: 'Popular' },
  'common.back_to_list': { ru: 'Вернуться к списку', uz: 'Ro\'yxatga qaytish', en: 'Back to list' },
  'common.all_cases': { ru: 'Все кейсы', uz: 'Barcha keyslar', en: 'All cases' },
  'common.all_news': { ru: 'Все новости', uz: 'Barcha yangiliklar', en: 'All news' },
  'common.loading': { ru: 'Загружаем…', uz: 'Yuklanmoqda…', en: 'Loading…' },
  'common.loading_cases': { ru: 'Загружаем кейсы…', uz: 'Keyslar yuklanmoqda…', en: 'Loading cases…' },
  'common.loading_news': { ru: 'Загружаем новости…', uz: 'Yangiliklar yuklanmoqda…', en: 'Loading news…' },
  'common.no_cases': { ru: 'Кейсы пока нет.', uz: 'Keyslar hali yo\'q.', en: 'No cases yet.' },
  'common.no_news': { ru: 'Новостей пока нет.', uz: 'Yangiliklar hali yo\'q.', en: 'No news yet.' },
  'common.no_cases_by_tag': { ru: 'Кейсы по {tag} пока нет.', uz: '{tag} bo\'yicha keyslar hali yo\'q.', en: 'No cases for {tag} yet.' },
  'common.calculate_project': { ru: 'Рассчитать проект', uz: 'Loyihani hisoblash', en: 'Calculate project' },
  'common.discuss_strategy': { ru: 'Обсудить стратегию', uz: 'Strategiyani muhokama qilish', en: 'Discuss strategy' },
  'common.view_case': { ru: 'Смотреть кейс →', uz: 'Keysni ko\'rish →', en: 'View case →' },
  'common.calculate_individual': { ru: 'Рассчитать индивидуальный проект →', uz: 'Individual loyihani hisoblash →', en: 'Calculate individual project →' },
  'common.submit_request': { ru: 'Оставить заявку', uz: 'Ariza qoldirish', en: 'Submit request' },
  'common.portfolio': { ru: 'Примеры работ', uz: 'Ishlar misollari', en: 'Portfolio' },
  'common.process': { ru: 'Процесс', uz: 'Jarayon', en: 'Process' },
  'common.how_we_work': { ru: 'Как мы работаем', uz: 'Biz qanday ishlaymiz', en: 'How we work' },
  'common.live_examples': { ru: 'Живые примеры', uz: 'Jonli misollar', en: 'Live examples' },
  'common.integrations': { ru: 'Работаем с лучшими', uz: 'Eng yaxshilari bilan ishlaymiz', en: 'Working with the best' },
  'common.integrations_subtitle': { ru: 'Интеграции', uz: 'Integratsiyalar', en: 'Integrations' },
  'common.algorithm': { ru: 'От Смысла к Форме', uz: 'Ma\'nodan shaklga', en: 'From Meaning to Form' },
  'common.algorithm_subtitle': { ru: 'Алгоритм работы', uz: 'Ish algoritmi', en: 'Work algorithm' },
  'common.separate_price': { ru: 'Отдельный прайс по запросу', uz: 'So\'rov bo\'yicha alohida narx', en: 'Separate price on request' },
  'common.project_website': { ru: 'Сайт проекта →', uz: 'Loyiha sayti →', en: 'Project website →' },
  'common.instagram': { ru: 'Instagram →', uz: 'Instagram →', en: 'Instagram →' },
  
  // Service Detail - Web
  'service.web.hero_title': { ru: 'Разработка', uz: 'Dasturlash', en: 'Development' },
  'service.web.hero_subtitle': { ru: 'Web & AI Систем', uz: 'Web & AI Tizimlar', en: 'Web & AI Systems' },
  'service.web.hero_desc': { ru: 'Мы создаем цифровые машины продаж с интеграцией Искусственного Интеллекта (AI) и Чат-ботов.', uz: 'Biz Sun\'iy Intellekt (AI) va Chat-botlar integratsiyasi bilan raqamli sotish mashinalarini yaratamiz.', en: 'We create digital sales machines with Artificial Intelligence (AI) and Chatbots integration.' },
  'service.web.web3_title': { ru: 'WEB 3.0 + AI', uz: 'WEB 3.0 + AI', en: 'WEB 3.0 + AI' },
  'service.web.web3_subtitle': { ru: 'Технологии будущего', uz: 'Kelajak texnologiyalari', en: 'Future Technologies' },
  'service.web.web3_desc': { ru: 'Обычного сайта в 2025 году недостаточно. Мы внедряем умные технологии, чтобы ваш бизнес работал 24/7 без участия людей.', uz: '2025 yilda oddiy sayt yetarli emas. Biz sizning biznesingiz 24/7 odamsiz ishlashi uchun aqlli texnologiyalarni joriy qilamiz.', en: 'A regular website is not enough in 2025. We implement smart technologies so your business works 24/7 without human involvement.' },
  'service.web.smart_bots': { ru: 'Умные Чат-боты', uz: 'Aqlli Chat-botlar', en: 'Smart Chatbots' },
  'service.web.smart_bots_desc': { ru: 'Telegram-боты, которые продают, записывают клиентов и отвечают на вопросы вместо менеджеров.', uz: 'Sotadigan, mijozlarni yozadigan va menejerlar o\'rniga savollarga javob beradigan Telegram-botlar.', en: 'Telegram bots that sell, record clients and answer questions instead of managers.' },
  'service.web.ai_integration': { ru: 'AI Интеграция', uz: 'AI Integratsiyasi', en: 'AI Integration' },
  'service.web.ai_integration_desc': { ru: 'Подключаем ChatGPT/Claude для генерации контента, анализа заявок и персонализации предложений на лету.', uz: 'Kontent yaratish, arizalarni tahlil qilish va takliflarni shaxsiylashtirish uchun ChatGPT/Claude ni ulaymiz.', en: 'We connect ChatGPT/Claude for content generation, application analysis and on-the-fly offer personalization.' },
  'service.web.client': { ru: 'Клиент', uz: 'Mijoz', en: 'Client' },
  'service.web.client_writes': { ru: 'Пишет вопрос...', uz: 'Savol yozmoqda...', en: 'Writing question...' },
  'service.web.ai_analysis': { ru: 'AI Анализ', uz: 'AI Tahlil', en: 'AI Analysis' },
  'service.web.ai_analysis_desc': { ru: 'Классификация • Генерация ответа • Проверка наличия', uz: 'Tasniflash • Javob yaratish • Mavjudligini tekshirish', en: 'Classification • Response Generation • Availability Check' },
  'service.web.deal_created': { ru: 'Сделка создана', uz: 'Bitim yaratildi', en: 'Deal created' },
  'service.web.client_recorded': { ru: 'Клиент записан', uz: 'Mijoz yozildi', en: 'Client recorded' },
  'service.web.site_types_title': { ru: 'Типы сайтов', uz: 'Sayt turlari', en: 'Site Types' },
  'service.web.landing_title': { ru: 'Landing Page', uz: 'Landing Page', en: 'Landing Page' },
  'service.web.landing_desc': { ru: 'Одна страница, одна цель, максимальная конверсия. Идеально для быстрого старта продаж или проверки гипотезы.', uz: 'Bir sahifa, bir maqsad, maksimal konversiya. Sotishni tez boshlash yoki gipotezani tekshirish uchun ideal.', en: 'One page, one goal, maximum conversion. Perfect for quick sales start or hypothesis testing.' },
  'service.web.landing_target': { ru: 'Сбор заявок (Lead Gen)', uz: 'Arizalar yig\'ish (Lead Gen)', en: 'Lead Generation' },
  'service.web.corporate_title': { ru: 'Корпоративный сайт', uz: 'Korporativ sayt', en: 'Corporate Website' },
  'service.web.corporate_desc': { ru: 'Цифровое лицо компании. Многостраничная структура, каталог услуг, блог, карьера. Работает на доверие и HR-бренд.', uz: 'Kompaniyaning raqamli yuzi. Ko\'p sahifali struktura, xizmatlar katalogi, blog, karyera. Ishonch va HR-brend uchun ishlaydi.', en: 'Digital face of the company. Multi-page structure, services catalog, blog, career. Works for trust and HR brand.' },
  'service.web.corporate_target': { ru: 'Имидж и информирование', uz: 'Imidj va ma\'lumot', en: 'Image & Information' },
  'service.web.ecommerce_title': { ru: 'E-commerce', uz: 'E-commerce', en: 'E-commerce' },
  'service.web.ecommerce_desc': { ru: 'Полноценный интернет-магазин с корзиной, онлайн-оплатой и синхронизацией остатков. Работает 24/7 без продавцов.', uz: 'Savat, onlayn to\'lov va qoldiqlarni sinxronlashtirish bilan to\'liq internet-do\'kon. 24/7 sotuvchilarsiz ishlaydi.', en: 'Full online store with cart, online payment and inventory sync. Works 24/7 without sellers.' },
  'service.web.ecommerce_target': { ru: 'Прямые продажи', uz: 'To\'g\'ridan-to\'g\'ri sotish', en: 'Direct Sales' },
  'service.web.mvp_title': { ru: 'Web-Сервис / MVP', uz: 'Web-servis / MVP', en: 'Web Service / MVP' },
  'service.web.mvp_desc': { ru: 'Сложные функциональные платформы: личные кабинеты, агрегаторы, CRM-системы, букинг-сервисы.', uz: 'Murakkab funktsional platformalar: shaxsiy kabinetlar, agregatorlar, CRM-tizimlar, bron qilish xizmatlari.', en: 'Complex functional platforms: personal accounts, aggregators, CRM systems, booking services.' },
  'service.web.mvp_target': { ru: 'Автоматизация процессов', uz: 'Jarayonlarni avtomatlashtirish', en: 'Process Automation' },
  'service.web.facts_title': { ru: 'Только факты', uz: 'Faqat faktlar', en: 'Facts Only' },
  'service.web.facts_subtitle': { ru: 'Web-кейсы', uz: 'Web-keyslar', en: 'Web Cases' },
  'service.web.enough_title': { ru: 'Хватит терять клиентов.', uz: 'Mijozlarni yo\'qotishni to\'xtating.', en: 'Stop losing clients.' },
  'service.web.enough_desc': { ru: 'Давайте построим систему, которая будет продавать за вас.', uz: 'Siz uchun sotadigan tizimni quramiz.', en: 'Let\'s build a system that will sell for you.' },
  
  // Service Detail - SMM
  'service.smm.discuss_strategy': { ru: 'Обсудить стратегию', uz: 'Strategiyani muhokama qilish', en: 'Discuss strategy' },
  'service.smm.for_brands': { ru: 'Бренды', uz: 'Brendlar', en: 'Brands' },
  'service.smm.for_brands_desc': { ru: 'Компании, которые хотят усилить присутствие в соцсетях, увеличить узнаваемость и привлечь новых клиентов через контент-маркетинг.', uz: 'Ijtimoiy tarmoqlarda mavjudligini kuchaytirish, taniqlilikni oshirish va kontent-marketing orqali yangi mijozlarni jalb qilishni xohlaydigan kompaniyalar.', en: 'Companies that want to strengthen their presence on social media, increase recognition and attract new clients through content marketing.' },
  'service.smm.for_experts': { ru: 'Эксперты и личные бренды', uz: 'Mutaxassislar va shaxsiy brendlar', en: 'Experts & Personal Brands' },
  'service.smm.for_experts_desc': { ru: 'Специалисты, коучи, консультанты, которые хотят построить личный бренд и привлечь клиентов через экспертность.', uz: 'Shaxsiy brend qurish va ekspertlik orqali mijozlarni jalb qilishni xohlaydigan mutaxassislar, murabbiylar, maslahatchilar.', en: 'Specialists, coaches, consultants who want to build a personal brand and attract clients through expertise.' },
  'service.smm.for_startups': { ru: 'Стартапы и проекты', uz: 'Startaplar va loyihalar', en: 'Startups & Projects' },
  'service.smm.for_startups_desc': { ru: 'Новые бизнесы, которым нужно быстро заявить о себе и набрать первую аудиторию с нуля.', uz: 'O\'zlarini tezda e\'lon qilish va noldan birinchi auditoriyani yig\'ish kerak bo\'lgan yangi bizneslar.', en: 'New businesses that need to quickly announce themselves and build their first audience from scratch.' },
  'service.smm.what_included_title': { ru: 'Что входит', uz: 'Nima kiradi', en: 'What\'s included' },
  'service.smm.content_plan': { ru: 'Контент-план на месяц', uz: 'Oy uchun kontent-reja', en: 'Monthly content plan' },
  'service.smm.content_plan_desc': { ru: 'Стратегия публикаций, темы постов, календарь контента с учетом вашей аудитории и целей.', uz: 'Nashr strategiyasi, postlar mavzulari, auditoriya va maqsadlaringizni hisobga olgan holda kontent taqvimi.', en: 'Publication strategy, post topics, content calendar considering your audience and goals.' },
  'service.smm.shooting': { ru: 'Съемка и монтаж', uz: 'Suratga olish va montaj', en: 'Shooting & Editing' },
  'service.smm.shooting_desc': { ru: 'Профессиональная съемка фото и видео, монтаж Reels и Stories, обработка визуалов.', uz: 'Professional foto va video suratga olish, Reels va Stories montaj, vizuallarni qayta ishlash.', en: 'Professional photo and video shooting, Reels and Stories editing, visual processing.' },
  'service.smm.copywriting': { ru: 'Копирайтинг', uz: 'Kopirayting', en: 'Copywriting' },
  'service.smm.copywriting_desc': { ru: 'Написание продающих текстов, заголовков, описаний с учетом tone of voice бренда.', uz: 'Brendning tone of voice ni hisobga olgan holda sotuvchi matnlar, sarlavhalar, tavsiflar yozish.', en: 'Writing sales texts, headlines, descriptions considering brand tone of voice.' },
  'service.smm.posting': { ru: 'Постинг и модерация', uz: 'Joylashtirish va moderatsiya', en: 'Posting & Moderation' },
  'service.smm.posting_desc': { ru: 'Публикация контента по расписанию, модерация комментариев, ответы на сообщения.', uz: 'Jadval bo\'yicha kontent nashr qilish, sharhlarni moderatsiya qilish, xabarlarga javob berish.', en: 'Publishing content on schedule, moderating comments, responding to messages.' },
  'service.smm.targeting': { ru: 'Настройка таргета', uz: 'Target sozlash', en: 'Targeting Setup' },
  'service.smm.targeting_desc': { ru: 'Настройка рекламных кампаний в Facebook/Instagram, настройка пикселей, оптимизация аудиторий.', uz: 'Facebook/Instagram da reklama kampaniyalarini sozlash, piksel sozlash, auditoriyalarni optimallashtirish.', en: 'Setting up ad campaigns on Facebook/Instagram, pixel setup, audience optimization.' },
  'service.smm.analytics': { ru: 'Аналитика и отчеты', uz: 'Analitika va hisobotlar', en: 'Analytics & Reports' },
  'service.smm.analytics_desc': { ru: 'Отслеживание метрик, анализ эффективности контента, ежемесячные отчеты с рекомендациями.', uz: 'Metrikalarni kuzatish, kontent samaradorligini tahlil qilish, tavsiyalar bilan oylik hisobotlar.', en: 'Tracking metrics, analyzing content effectiveness, monthly reports with recommendations.' },
  'service.smm.collaborations': { ru: 'Коллаборации с блогерами и инфлюенсерами', uz: 'Bloggerlar va inflyuenserlar bilan hamkorlik', en: 'Collaborations with Bloggers & Influencers' },
  'service.smm.collaborations_desc': { ru: 'Организуем партнерства с блогерами, инфлюенсерами и экспертами для расширения охвата и повышения доверия к бренду. Подбираем релевантных партнеров, ведем переговоры, координируем съемки и публикации.', uz: 'Brendning qamrovini kengaytirish va ishonchni oshirish uchun bloggerlar, inflyuenserlar va ekspertlar bilan hamkorlik tashkil qilamiz. Tegishli hamkorlarni tanlaymiz, muzokaralar olib boramiz, suratga olish va nashrlarni muvofiqlashtiramiz.', en: 'We organize partnerships with bloggers, influencers and experts to expand reach and increase brand trust. We select relevant partners, conduct negotiations, coordinate shootings and publications.' },
  
  // Service Detail - Branding
  'service.branding.hero_title': { ru: 'Брендинг и айдентика', uz: 'Brending va identika', en: 'Branding & Identity' },
  'service.branding.hero_desc': { ru: 'Мы упаковываем смыслы бизнеса в визуал, который продает без слов.', uz: 'Biz biznes ma\'nolarini so\'zsiz sotadigan vizualga o\'rab beramiz.', en: 'We package business meanings into visuals that sell without words.' },
  'service.branding.meaning_to_form': { ru: 'От Смысла к Форме', uz: 'Ma\'nodan shaklga', en: 'From Meaning to Form' },
  'service.branding.algorithm': { ru: 'Алгоритм работы', uz: 'Ish algoritmi', en: 'Work Algorithm' },
  'service.branding.concept': { ru: 'Концепция', uz: 'Kontseptsiya', en: 'Concept' },
  'service.branding.concept_desc': { ru: 'Разработка 3-х разноплановых вариантов айдентики.', uz: 'Identikaning 3 xil variantini ishlab chiqish.', en: 'Development of 3 different identity options.' },
  'service.branding.system': { ru: 'Система', uz: 'Tizim', en: 'System' },
  'service.branding.system_desc': { ru: 'Масштабирование стиля на носители: от визитки до вывески.', uz: 'Uslubni tashuvchilarga masshtablash: vizitkadan reklama taxtasigacha.', en: 'Scaling style to media: from business card to signboard.' },
  'service.branding.logo_title': { ru: 'Логотип', uz: 'Logotip', en: 'Logo' },
  'service.branding.logo_features': { ru: '3 варианта логотипа\nПодбор шрифтов\nЦветовая палитра\nФайлы: AI, PDF, PNG', uz: '3 ta logotip varianti\nShriftlarni tanlash\nRang palitrasi\nFayllar: AI, PDF, PNG', en: '3 logo variants\nFont selection\nColor palette\nFiles: AI, PDF, PNG' },
  'service.branding.identity_title': { ru: 'Фирменный стиль', uz: 'Firmaviy uslub', en: 'Corporate Identity' },
  'service.branding.identity_features': { ru: 'Логотип (3 варианта)\nФирменный паттерн\nДизайн визиток и бланков\nОформление соцсетей\nГайдлайн (мини-бук)', uz: 'Logotip (3 variant)\nFirmaviy naqsh\nVizitka va blankalar dizayni\nIjtimoiy tarmoqlar dizayni\nQo\'llanma (mini-kitob)', en: 'Logo (3 variants)\nCorporate pattern\nBusiness cards & letterheads design\nSocial media design\nGuideline (mini-book)' },
  'service.branding.order': { ru: 'Заказать брендинг', uz: 'Brendingni buyurtma qilish', en: 'Order branding' },
  
  // Service Detail - Automation
  'service.automation.hero_title': { ru: 'Автоматизация бизнеса', uz: 'Biznesni avtomatlashtirish', en: 'Business Automation' },
  'service.automation.on_autopilot': { ru: 'Автопилоте', uz: 'Avtopilotda', en: 'On Autopilot' },
  'service.automation.basic_title': { ru: 'Базовый', uz: 'Asosiy', en: 'Basic' },
  'service.automation.pro_title': { ru: 'Профи', uz: 'Profi', en: 'Pro' },
  'service.automation.turnkey_title': { ru: 'Под ключ', uz: 'Kalit sozlab', en: 'Turnkey' },
  'service.automation.integrations_title': { ru: 'Работаем с лучшими', uz: 'Eng yaxshilari bilan ishlaymiz', en: 'Working with the best' },
  'service.automation.integrations_subtitle': { ru: 'Интеграции', uz: 'Integratsiyalar', en: 'Integrations' },
  
  // Service Detail - Ads
  'service.ads.hero_title': { ru: 'Контекстная реклама', uz: 'Kontekstli reklama', en: 'Contextual Advertising' },
  'service.ads.testdrive_title': { ru: 'Тест-драйв', uz: 'Test-drayv', en: 'Test Drive' },
  
  // Common service texts
  'service.loading_cases': { ru: 'Загружаем кейсы…', uz: 'Keyslar yuklanmoqda…', en: 'Loading cases…' },
  'service.no_cases': { ru: 'Кейсы пока нет.', uz: 'Keyslar hali yo\'q.', en: 'No cases yet.' },
  'service.smm.step_01': { ru: 'Стратегия', uz: 'Strategiya', en: 'Strategy' },
  'service.smm.step_01_desc': { ru: 'Анализ аудитории, конкурентов, разработка контент-стратегии и tone of voice.', uz: 'Auditoriya, raqobatchilarni tahlil qilish, kontent-strategiya va tone of voice ishlab chiqish.', en: 'Audience and competitor analysis, content strategy and tone of voice development.' },
  'service.smm.step_02': { ru: 'Продакшн', uz: 'Ishlab chiqarish', en: 'Production' },
  'service.smm.step_02_desc': { ru: 'Съемка фото/видео, создание визуалов, написание текстов и монтаж Reels.', uz: 'Foto/video suratga olish, vizuallar yaratish, matnlar yozish va Reels montaj.', en: 'Photo/video shooting, visual creation, text writing and Reels editing.' },
  'service.smm.step_03': { ru: 'Публикация', uz: 'Nashr qilish', en: 'Publication' },
  'service.smm.step_03_desc': { ru: 'Постинг по расписанию, модерация комментариев, работа с таргетом и аналитика.', uz: 'Jadval bo\'yicha joylashtirish, sharhlarni moderatsiya qilish, target bilan ishlash va analitika.', en: 'Scheduled posting, comment moderation, targeting work and analytics.' },
  'service.smm.basic_title': { ru: 'Базовый', uz: 'Asosiy', en: 'Basic' },
  'service.smm.standard_title': { ru: 'Стандарт', uz: 'Standart', en: 'Standard' },
  'service.smm.premium_title': { ru: 'Премиум', uz: 'Premium', en: 'Premium' },
  'service.smm.basic_features': { ru: 'Контент-план на месяц\n8 постов (фото + текст)\n4 Reels в месяц\nНастройка таргета\nМодерация комментариев', uz: 'Oy uchun kontent-reja\n8 ta post (foto + matn)\nOyiga 4 ta Reels\nTarget sozlash\nSharhlarni moderatsiya qilish', en: 'Monthly content plan\n8 posts (photo + text)\n4 Reels per month\nTargeting setup\nComment moderation' },
  'service.smm.standard_features': { ru: 'Контент-план на месяц\n12 постов (фото + видео)\n8 Reels в месяц\nНастройка таргета\nОтветы на сообщения и комментарии\nДетальная аналитика', uz: 'Oy uchun kontent-reja\n12 ta post (foto + video)\nOyiga 8 ta Reels\nTarget sozlash\nXabarlar va sharhlarga javob berish\nBatafsil analitika', en: 'Monthly content plan\n12 posts (photo + video)\n8 Reels per month\nTargeting setup\nResponses to messages and comments\nDetailed analytics' },
  'service.smm.premium_features': { ru: 'Контент-план на месяц\n16 постов (фото + видео)\n12 Reels в месяц\nНастройка таргета\nОтветы на сообщения и комментарии\nДетальная аналитика', uz: 'Oy uchun kontent-reja\n16 ta post (foto + video)\nOyiga 12 ta Reels\nTarget sozlash\nXabarlar va sharhlarga javob berish\nBatafsil analitika', en: 'Monthly content plan\n16 posts (photo + video)\n12 Reels per month\nTargeting setup\nResponses to messages and comments\nDetailed analytics' },
  
  // Home page
  'home.loading_cases': { ru: 'Загружаем кейсы...', uz: 'Keyslar yuklanmoqda...', en: 'Loading cases...' },
  'home.no_title': { ru: 'Без названия', uz: 'Nomsiz', en: 'No title' },
  'home.seo_title': { ru: 'Системный Digital-партнер | Разработка сайтов, SMM, автоматизация', uz: 'Tizimli Digital-hamkor | Saytlar yaratish, SMM, avtomatlashtirish', en: 'Systemic Digital Partner | Website Development, SMM, Automation' },
  'home.seo_desc': { ru: 'Типа агентство — системный digital-партнер в Узбекистане. Разработка сайтов и веб-приложений, SMM и контент-маркетинг, брендинг, автоматизация бизнеса, CRM, SEO и контекстная реклама. Превращаем бизнес в цифровую экосистему.', uz: 'Tipa agentlik — O\'zbekistondagi tizimli raqamli hamkor. Saytlar va veb-ilovalarni yaratish, SMM va kontent-marketing, brending, biznesni avtomatlashtirish, CRM, SEO va kontekstli reklama. Biznesni raqamli ekotizimga aylantiramiz.', en: 'Tipa agency — systemic digital partner in Uzbekistan. Website and web application development, SMM and content marketing, branding, business automation, CRM, SEO and contextual advertising. Transforming business into a digital ecosystem.' },
  
  // Cases & News pages
  'cases.loading': { ru: 'Загружаем кейсы...', uz: 'Keyslar yuklanmoqda...', en: 'Loading cases...' },
  'cases.no_cases': { ru: 'Кейсов пока нет.', uz: 'Keyslar hali yo\'q.', en: 'No cases yet.' },
  'news.loading': { ru: 'Загружаем новости…', uz: 'Yangiliklar yuklanmoqda…', en: 'Loading news…' },
  'news.no_news': { ru: 'Новостей пока нет.', uz: 'Yangiliklar hali yo\'q.', en: 'No news yet.' },
  
  // Breadcrumbs
  'breadcrumbs.home': { ru: 'Home', uz: 'Bosh sahifa', en: 'Home' },
  
  // Lead Popup
  'lead.name_placeholder': { ru: 'Имя Фамилия', uz: 'Ism Familiya', en: 'First Last Name' },
  'lead.phone_placeholder_uz': { ru: 'XX XXX XX XX', uz: 'XX XXX XX XX', en: 'XX XXX XX XX' },
  'lead.phone_placeholder_ru': { ru: 'XXX XXX-XX-XX', uz: 'XXX XXX-XX-XX', en: 'XXX XXX-XX-XX' },
  'lead.phone_placeholder_us': { ru: '(XXX) XXX-XXXX', uz: '(XXX) XXX-XXXX', en: '(XXX) XXX-XXXX' },
  'lead.phone_placeholder_gb': { ru: 'XXXX XXXXXX', uz: 'XXXX XXXXXX', en: 'XXXX XXXXXX' },
  'lead.phone_placeholder_tj': { ru: 'XXX XX-XX-XX', uz: 'XXX XX-XX-XX', en: 'XXX XX-XX-XX' },
  'lead.task_placeholder': { ru: 'Задача (необязательно)', uz: 'Vazifa (ixtiyoriy)', en: 'Task (optional)' },
  'lead.privacy_text': { ru: 'Нажимая кнопку \'Отправить\', вы автоматически соглашаетесь с', uz: '\'Yuborish\' tugmasini bosish orqali siz avtomatik ravishda rozilik bildirasiz', en: 'By clicking \'Send\' button, you automatically agree with' },
  'lead.privacy_link': { ru: 'политикой конфиденциальности', uz: 'maxfiylik siyosati', en: 'privacy policy' },
  'lead.phone_placeholder_default': { ru: 'Номер телефона', uz: 'Telefon raqami', en: 'Phone number' },
  'lead.country_uz': { ru: 'Узбекистан', uz: 'O\'zbekiston', en: 'Uzbekistan' },
  'lead.country_ru': { ru: 'Россия', uz: 'Rossiya', en: 'Russia' },
  'lead.country_kz': { ru: 'Казахстан', uz: 'Qozog\'iston', en: 'Kazakhstan' },
  'lead.country_tj': { ru: 'Таджикистан', uz: 'Tojikiston', en: 'Tajikistan' },
  'lead.country_kg': { ru: 'Кыргызстан', uz: 'Qirg\'iziston', en: 'Kyrgyzstan' },
  'lead.country_us': { ru: 'США', uz: 'AQSH', en: 'USA' },
  'lead.country_gb': { ru: 'Великобритания', uz: 'Buyuk Britaniya', en: 'United Kingdom' },
  
  // Service Detail - SMM additional
  'service.smm.what_included_subtitle': { ru: 'Полный пакет услуг', uz: 'To\'liq xizmatlar paketi', en: 'Full service package' },
  'service.smm.pricing_title': { ru: 'Стоимость SMM', uz: 'SMM narxi', en: 'SMM Pricing' },
  'service.smm.pricing_subtitle': { ru: 'Тарифы', uz: 'Tariflar', en: 'Plans' },
  
  // About page
  'about.who_we_are': { ru: 'Кто мы такие', uz: 'Biz kimmi', en: 'Who we are' },
  'about.agency_name': { ru: 'Типа агентство.', uz: 'Tipa agentlik.', en: 'Tipa agency.' },
  'about.approach': { ru: 'Подход нетипичный.', uz: 'Yondashuv noan\'anaviy.', en: 'Unconventional approach.' },
  'about.intro_p1': { ru: 'Типа агентство — это команда инженеров и маркетологов, которые ненавидят хаос. Мы не верим в «магию» креатива, если она не подкреплена цифрами.', uz: 'Tipa agentlik — bu xaosni yomon ko\'radigan muhandislar va marketologlar jamoasi. Biz raqamlar bilan tasdiqlanmagan "ijod sehriga" ishonmaymiz.', en: 'Tipa agency is a team of engineers and marketers who hate chaos. We don\'t believe in the "magic" of creativity if it\'s not backed by numbers.' },
  'about.intro_p2': { ru: 'Мы строим цифровые машины по зарабатыванию денег. Сайты, CRM, боты — это просто шестеренки. Главное — как они крутятся вместе.', uz: 'Biz pul ishlash uchun raqamli mashinalar quramiz. Saytlar, CRM, botlar — bu shunchaki tishli g\'ildiraklar. Asosiysi — ular qanday birga aylanadi.', en: 'We build digital money-making machines. Websites, CRM, bots — these are just gears. The main thing is how they work together.' },
  'about.stats_water': { ru: 'Воды', uz: 'Suv', en: 'Water' },
  'about.stats_water_desc': { ru: 'Никаких «продающих текстов» ради объема. Каждое действие, кнопка или пиксель обоснованы аналитикой и целью.', uz: 'Hajm uchun "sotuvchi matnlar" yo\'q. Har bir harakat, tugma yoki piksel analitika va maqsad bilan asoslangan.', en: 'No "sales texts" for volume. Every action, button or pixel is justified by analytics and purpose.' },
  'about.stats_immersion': { ru: 'Погружения', uz: 'Chuqurlashtirish', en: 'Immersion' },
  'about.stats_immersion_desc': { ru: 'Не работаем по брифу «сделайте красиво». Мы лезем в вашу CRM, слушаем звонки и становимся частью бизнеса.', uz: 'Biz "chiroyli qiling" brifiga ishlamaymiz. Biz sizning CRM ingizga kiramiz, qo\'ng\'iroqlarni tinglaymiz va biznesning bir qismiga aylanamiz.', en: 'We don\'t work on a "make it beautiful" brief. We dive into your CRM, listen to calls and become part of the business.' },
  'about.stats_approach': { ru: 'Подход', uz: 'Yondashuv', en: 'Approach' },
  'about.stats_approach_desc': { ru: 'Закрываем цикл целиком. От идеи и логотипа до автоматизации отдела продаж и сквозной аналитики.', uz: 'Biz butun tsiklni yopamiz. G\'oyadan va logotipdan sotish bo\'limini avtomatlashtirish va kesib o\'tuvchi analitikagacha.', en: 'We close the entire cycle. From idea and logo to sales department automation and end-to-end analytics.' },
  
  // Privacy Policy
  'privacy.title': { ru: 'Политика конфиденциальности', uz: 'Maxfiylik siyosati', en: 'Privacy Policy' },
  'privacy.subtitle': { ru: 'Конфиденциальности', uz: 'Maxfiylik', en: 'Confidentiality' },
  'privacy.intro': { ru: 'Официальный документ, описывающий порядок обработки и защиты информации о физических и юридических лицах, пользующихся услугами Типа агентства.', uz: 'Tipa agentligi xizmatlaridan foydalanadigan jismoniy va yuridik shaxslar haqidagi ma\'lumotlarni qayta ishlash va himoya qilish tartibini tavsiflovchi rasmiy hujjat.', en: 'Official document describing the procedure for processing and protecting information about individuals and legal entities using Tipa agency services.' },
  'privacy.table_of_contents': { ru: 'Содержание', uz: 'Mundarija', en: 'Table of Contents' },
  'privacy.have_questions': { ru: 'Есть вопросы? Связаться', uz: 'Savollar bormi? Bog\'lanish', en: 'Have questions? Contact' },
  'privacy.still_questions': { ru: 'Остались вопросы?', uz: 'Savollar qoldimi?', en: 'Still have questions?' },
  'privacy.still_questions_desc': { ru: 'Мы всегда на связи и готовы разъяснить любой пункт.', uz: 'Biz har doim aloqadamiz va har qanday bandni tushuntirishga tayyormiz.', en: 'We are always in touch and ready to clarify any point.' },
  'privacy.section_01_title': { ru: 'Определение терминов', uz: 'Atamalarni belgilash', en: 'Definition of Terms' },
  'privacy.section_02_title': { ru: 'Предмет политики', uz: 'Siyosat predmeti', en: 'Policy Subject' },
  'privacy.section_03_title': { ru: 'Цели сбора', uz: 'Yig\'ish maqsadlari', en: 'Collection Purposes' },
  'privacy.section_04_title': { ru: 'Сроки и способы', uz: 'Muddatlar va usullar', en: 'Terms and Methods' },
  'privacy.section_05_title': { ru: 'Защита информации', uz: 'Ma\'lumotlarni himoya qilish', en: 'Information Protection' },
  
  // Service Detail - Branding additional
  'service.branding.research': { ru: 'Исследование', uz: 'Tadqiqot', en: 'Research' },
  'service.branding.research_desc': { ru: 'Анализ конкурентов, архетипы бренда, поиск метафоры.', uz: 'Raqobatchilarni tahlil qilish, brend arxetiplari, metafora qidirish.', en: 'Competitor analysis, brand archetypes, metaphor search.' },
  'service.branding.brandbook_title': { ru: 'Брендбук', uz: 'Brendbuk', en: 'Brandbook' },
  'service.branding.brandbook_features': { ru: 'Полная айдентика\nБренд-платформа (миссия)\nПравила использования\nМерч и сувенирка\nДизайн упаковки\nПолноценный Brandbook', uz: 'To\'liq identika\nBrend-platforma (missiya)\nFoydalanish qoidalari\nMerch va suvenirlar\nQadoqlash dizayni\nTo\'liq Brandbook', en: 'Full identity\nBrand platform (mission)\nUsage rules\nMerchandise & souvenirs\nPackaging design\nFull Brandbook' },
  'service.branding.brand_title': { ru: 'Бренд', uz: 'Brend', en: 'Brand' },
  'service.branding.pricing_title': { ru: 'Стоимость упаковки', uz: 'Qadoqlash narxi', en: 'Packaging Cost' },
  'service.branding.pricing_subtitle': { ru: 'Инвестиции в имидж', uz: 'Imidjga sarmoya', en: 'Image Investment' },
  'service.branding.create_title': { ru: 'СОЗДАДИМ', uz: 'YARATAMIZ', en: 'WE WILL CREATE' },
  'service.branding.create_desc': { ru: 'Ваш бизнес заслуживает того, чтобы его запомнили.', uz: 'Sizning biznesingiz eslab qolishga loyiq.', en: 'Your business deserves to be remembered.' },
  
  // Service Detail - Automation additional
  'service.automation.exclude_human': { ru: 'Исключаем человеческий фактор. Внедряем CRM, телефонию и сквозную аналитику, чтобы вы управляли бизнесом с экрана смартфона.', uz: 'Inson omilini istisno qilamiz. Biz CRM, telefoniyani va kesib o\'tuvchi analitikani joriy qilamiz, shunda siz biznesni smartfon ekranidan boshqarasiz.', en: 'We exclude the human factor. We implement CRM, telephony and end-to-end analytics so you can manage your business from your smartphone screen.' },
  'service.automation.digitize': { ru: 'Оцифровать бизнес', uz: 'Biznesni raqamlashtirish', en: 'Digitize business' },
  
  // Service Detail - Web additional
  'service.web.types_subtitle': { ru: 'Типы проектов', uz: 'Loyiha turlari', en: 'Project Types' },
  'service.web.pricing_title': { ru: 'Инвестиции в рост', uz: 'O\'sishga sarmoya', en: 'Investment in Growth' },
  'service.web.pricing_subtitle': { ru: 'Прозрачные цены', uz: 'Shaffof narxlar', en: 'Transparent Prices' },
  'service.web.complex_portal': { ru: 'Нужен сложный портал, маркетплейс или сервис с AI?', uz: 'Murakkab portal, marketplace yoki AI bilan servis kerakmi?', en: 'Need a complex portal, marketplace or AI service?' },
  
  // Service Detail - SMM additional
  'service.smm.activation_title': { ru: 'Активация', uz: 'Aktivatsiya', en: 'Activation' },
  'service.smm.activation_subtitle': { ru: 'Бренда в Соцсетях', uz: 'Ijtimoiy tarmoqlarda brend', en: 'Brand in Social Media' },
  'service.smm.activation_desc': { ru: 'Мы строим комьюнити, создаем виральный контент и превращаем подписчиков в клиентов.', uz: 'Biz jamiyat quramiz, virusli kontent yaratamiz va obunachilarni mijozlarga aylantiramiz.', en: 'We build community, create viral content and turn followers into clients.' },
  'service.smm.team_pm': { ru: 'Проджект-менеджер', uz: 'Loyiha menejeri', en: 'Project Manager' },
  'service.smm.team_pm_desc': { ru: 'Контроль сроков и качества', uz: 'Muddatlar va sifat nazorati', en: 'Timeline and quality control' },
  'service.smm.team_mobile': { ru: 'Мобилограф', uz: 'Mobilograf', en: 'Mobileographer' },
  'service.smm.team_mobile_desc': { ru: 'Съемка Reels/Stories на месте', uz: 'Joyida Reels/Stories suratga olish', en: 'On-site Reels/Stories shooting' },
  'service.smm.team_designer': { ru: 'Дизайнер', uz: 'Dizayner', en: 'Designer' },
  'service.smm.team_designer_desc': { ru: 'Визуал, упаковка, motion', uz: 'Vizual, qadoqlash, motion', en: 'Visual, packaging, motion' },
  'service.smm.team_cm': { ru: 'Комьюнити-менеджер', uz: 'Jamiyat menejeri', en: 'Community Manager' },
  'service.smm.team_cm_desc': { ru: 'Ответы, модерация, вовлечение', uz: 'Javoblar, moderatsiya, jalb qilish', en: 'Responses, moderation, engagement' },
  
  // Service Detail - Web additional hero
  'service.web.hero_cta_discuss': { ru: 'ОБСУДИМ', uz: 'MUHOKAMA QILAMIZMI', en: 'DISCUSS' },
  'service.web.hero_cta_project': { ru: 'ПРОЕКТ?', uz: 'LOYIHANI?', en: 'PROJECT?' },
  'service.web.cta_discuss_title': { ru: 'ОБСУДИМ', uz: 'MUHOKAMA QILAMIZMI', en: 'DISCUSS' },
  'service.web.cta_discuss_subtitle': { ru: 'ПРОЕКТ?', uz: 'LOYIHANI?', en: 'PROJECT?' },
  'service.web.cta_discuss_desc': { ru: 'Есть задача? Давайте обсудим её решение. Бесплатно и по делу.', uz: 'Vazifa bormi? Keling, uning yechimini muhokama qilaylik. Bepul va ish bilan.', en: 'Have a task? Let\'s discuss its solution. Free and to the point.' },
  'service.web.what_build': { ru: 'Что будем строить?', uz: 'Nima qurishni boshlaymiz?', en: 'What will we build?' },
  'service.web.landing_features': { ru: 'Уникальный дизайн\nМобильная адаптация\nБазовая SEO настройка\nФормы захвата заявок\nИнтеграция с Telegram\nСрок: 5-7 дней', uz: 'Nozik dizayn\nMobil moslashuv\nAsosiy SEO sozlash\nArizalar yig\'ish shakllari\nTelegram integratsiyasi\nMuddat: 5-7 kun', en: 'Unique design\nMobile adaptation\nBasic SEO setup\nLead capture forms\nTelegram integration\nTimeline: 5-7 days' },
  'service.web.corporate_features': { ru: 'Всё что в Landing Page\nМногостраничная структура\nАдмин-панель (CMS)\nКаталог услуг/товаров\nНовости и Блог\nБазовая аналитика\nСрок: 14-20 дней', uz: 'Landing Page dagi hamma narsa\nKo\'p sahifali struktura\nAdmin-panel (CMS)\nXizmatlar/mahsulotlar katalogi\nYangiliklar va Blog\nAsosiy analitika\nMuddat: 14-20 kun', en: 'Everything in Landing Page\nMulti-page structure\nAdmin panel (CMS)\nServices/products catalog\nNews & Blog\nBasic analytics\nTimeline: 14-20 days' },
  'service.web.ecommerce_features': { ru: 'Полноценный интернет-магазин\nКорзина и Онлайн-оплата\nЛичный кабинет покупателя\nИнтеграция с 1С / МойСклад\nСложные фильтры товаров\nСистема скидок\nСрок: от 30 дней', uz: 'To\'liq internet-do\'kon\nSavat va Onlayn to\'lov\nXaridor shaxsiy kabineti\n1С / МойСклад integratsiyasi\nMurakkab mahsulot filtrlari\nChegirma tizimi\nMuddat: 30 kundan', en: 'Full online store\nCart & Online payment\nCustomer personal account\n1С / МойСклад integration\nComplex product filters\nDiscount system\nTimeline: from 30 days' },
  
  // Service Detail - SMM additional hero
  'service.smm.hero_cta_discuss': { ru: 'ОБСУДИМ', uz: 'MUHOKAMA QILAMIZMI', en: 'DISCUSS' },
  'service.smm.hero_cta_content': { ru: 'КОНТЕНТ?', uz: 'KONTENTNI?', en: 'CONTENT?' },
  'service.smm.team_title': { ru: 'Ваша медиа-команда', uz: 'Sizning media jamoangiz', en: 'Your Media Team' },
  'service.smm.team_subtitle': { ru: 'Squad', uz: 'Jamoa', en: 'Squad' },
  'service.smm.cases_title': { ru: 'Наши кейсы', uz: 'Bizning keyslarimiz', en: 'Our Cases' },
  'service.smm.cases_subtitle': { ru: 'SMM проекты', uz: 'SMM loyihalar', en: 'SMM Projects' },
  
  // Service Detail - Branding additional hero
  'service.branding.hero_visual': { ru: 'Визуальная', uz: 'Vizual', en: 'Visual' },
  'service.branding.hero_dna': { ru: 'ДНК Бренда', uz: 'Brend DNK', en: 'Brand DNA' },
  'service.branding.create_brand': { ru: 'Создать Бренд', uz: 'Brend yaratish', en: 'Create Brand' },
  'service.branding.hero_cta_create': { ru: 'СОЗДАДИМ', uz: 'YARATAMIZMI', en: 'CREATE' },
  'service.branding.hero_cta_brand': { ru: 'БРЕНД?', uz: 'BRENDNI?', en: 'BRAND?' },
  
  // Service Detail - Automation additional hero
  'service.automation.hero_business': { ru: 'Бизнес на', uz: 'Biznes', en: 'Business on' },
  'service.automation.hero_autopilot': { ru: 'Автопилоте', uz: 'Avtopilotda', en: 'Autopilot' },
  'service.automation.hero_cta_implement': { ru: 'ВНЕДРИМ', uz: 'JORIY QILAMIZMI', en: 'IMPLEMENT' },
  'service.automation.hero_cta_system': { ru: 'СИСТЕМУ?', uz: 'TIZIMNI?', en: 'SYSTEM?' },
  'service.automation.hero_stop_losing': { ru: 'Перестаньте терять лиды. Автоматизируйте продажи уже сегодня.', uz: 'Lidlarni yo\'qotishni to\'xtating. Sotishni bugun avtomatlashtiring.', en: 'Stop losing leads. Automate sales today.' },
  'service.automation.setup_crm': { ru: 'Настроить CRM', uz: 'CRM sozlash', en: 'Setup CRM' },
  'service.automation.pricing_title': { ru: 'Стоимость порядка', uz: 'Tartib narxi', en: 'Order Cost' },
  'service.automation.pricing_subtitle': { ru: 'Внедрение CRM', uz: 'CRM joriy etish', en: 'CRM Implementation' },
  'service.automation.problems_title': { ru: 'Проблемы (Как было)', uz: 'Muammolar (Qanday edi)', en: 'Problems (How it was)' },
  'service.automation.problems_excel': { ru: 'Заявки в Excel, блокноте и WhatsApp', uz: 'Arizalar Excel, daftar va WhatsApp da', en: 'Leads in Excel, notebook and WhatsApp' },
  'service.automation.problems_forgot': { ru: 'Менеджеры забывают перезвонить', uz: 'Menejerlar qayta qo\'ng\'iroq qilishni unutadi', en: 'Managers forget to call back' },
  'service.automation.problems_no_understanding': { ru: 'Нет понимания, какая реклама работает', uz: 'Qaysi reklama ishlayotganini tushunish yo\'q', en: 'No understanding of which ads work' },
  'service.automation.problems_manual': { ru: 'Ручной подсчет зарплат и бонусов', uz: 'Ish haqi va bonuslarni qo\'lda hisoblash', en: 'Manual calculation of salaries and bonuses' },
  'service.automation.solution_title': { ru: 'Система (Как мы делаем)', uz: 'Tizim (Biz qanday qilamiz)', en: 'System (How we do it)' },
  'service.automation.solution_leads': { ru: 'Все лиды в одном окне (CRM)', uz: 'Barcha lidlar bir oynada (CRM)', en: 'All leads in one window (CRM)' },
  'service.automation.solution_tasks': { ru: 'Авто-задачи на каждом этапе воронки', uz: 'Har bir vorken bosqichida avto-vazifalar', en: 'Auto-tasks at each funnel stage' },
  'service.automation.solution_analytics': { ru: 'Сквозная аналитика до рубля', uz: 'Rublgacha kesib o\'tuvchi analitika', en: 'End-to-end analytics to the ruble' },
  'service.automation.solution_dashboard': { ru: 'Дашборд руководителя в реальном времени', uz: 'Rahbarning real vaqtda dashboard', en: 'Manager dashboard in real time' },
  'service.automation.taska_partner': { ru: 'Стратегический партнер', uz: 'Strategik hamkor', en: 'Strategic Partner' },
  'service.automation.taska_desc': { ru: 'Вместе с Taska мы предлагаем комплексную систему управления бизнесом с финансовым планированием и управленческим учетом.', uz: 'Taska bilan birgalikda biz moliyaviy rejalashtirish va boshqaruv hisobi bilan kompleks biznes boshqaruv tizimini taklif qilamiz.', en: 'Together with Taska we offer a comprehensive business management system with financial planning and management accounting.' },
  'service.automation.taska_accounting': { ru: 'Управленческий учет и P&L отчеты', uz: 'Boshqaruv hisobi va P&L hisobotlar', en: 'Management accounting & P&L reports' },
  'service.automation.taska_cash': { ru: 'Контроль кассовых разрывов', uz: 'Kassa teshiklari nazorati', en: 'Cash gap control' },
  'service.automation.taska_processes': { ru: 'Настройка под бизнес-процессы', uz: 'Biznes jarayonlariga moslashtirish', en: 'Setup for business processes' },
  'service.automation.taska_planning': { ru: 'Планирование доходов и расходов', uz: 'Daromad va xarajatlarni rejalashtirish', en: 'Income and expense planning' },
  'service.automation.taska_profit': { ru: 'Прибыль', uz: 'Foyda', en: 'Profit' },
  'service.automation.taska_expenses': { ru: 'Расходы', uz: 'Xarajatlar', en: 'Expenses' },
  'service.automation.taska_visit': { ru: 'Перейти на сайт Taska.uz', uz: 'Taska.uz saytiga o\'tish', en: 'Visit Taska.uz website' },
  
  // Service Detail - Ads additional hero
  'service.ads.hero_traffic': { ru: 'Трафик', uz: 'Trafik', en: 'Traffic' },
  'service.ads.hero_money': { ru: 'В Деньги', uz: 'Pulga', en: 'Into Money' },
  'service.ads.hero_desc': { ru: 'Настраиваем поток целевых клиентов из Instagram, Facebook, Google и Яндекс. Платите за результат, а не за клики.', uz: 'Biz Instagram, Facebook, Google va Yandex dan maqsadli mijozlar oqimini sozlaymiz. Natija uchun to\'lang, kliklar uchun emas.', en: 'We set up a stream of targeted clients from Instagram, Facebook, Google and Yandex. Pay for results, not clicks.' },
  'service.ads.launch_ads': { ru: 'Запустить Рекламу', uz: 'Reklamani ishga tushirish', en: 'Launch Ads' },
  'service.ads.target_title': { ru: 'Точно в цель', uz: 'Aniq maqsadga', en: 'Right on Target' },
  'service.ads.target_subtitle': { ru: 'Настройка аудитории', uz: 'Auditoriya sozlash', en: 'Audience Setup' },
  'service.ads.entrepreneurs': { ru: 'Предприниматели', uz: 'Tadbirkorlar', en: 'Entrepreneurs' },
  'service.ads.instagram_title': { ru: 'Instagram Ads', uz: 'Instagram Reklamasi', en: 'Instagram Ads' },
  'service.ads.instagram_desc': { ru: 'Визуальный контент, Reels, Stories. Идеально для B2C, fashion, еды и услуг.', uz: 'Vizual kontent, Reels, Stories. B2C, moda, ovqat va xizmatlar uchun ideal.', en: 'Visual content, Reels, Stories. Perfect for B2C, fashion, food and services.' },
  'service.ads.google_title': { ru: 'Google Ads', uz: 'Google Reklamasi', en: 'Google Ads' },
  'service.ads.google_desc': { ru: 'Горячий спрос. Показываем рекламу тем, кто прямо сейчас ищет ваш товар в поиске.', uz: 'Issiq talab. Hozir qidiruvda mahsulotingizni qidirayotganlarga reklama ko\'rsatamiz.', en: 'Hot demand. We show ads to those who are currently searching for your product.' },
  'service.ads.social_title': { ru: 'Social Ads:', uz: 'Ijtimoiy Reklama:', en: 'Social Ads:' },
  'service.ads.social_subtitle': { ru: 'Instagram & Facebook', uz: 'Instagram va Facebook', en: 'Instagram & Facebook' },
  'service.ads.social_desc': { ru: 'Мы создаем воронку рекламы работающую на результат. Работаем с холодной аудиторией, формируем потребность и догоняем ретаргетингом тех, кто не купил сразу.', uz: 'Biz natijaga ishlaydigan reklama vorkenini yaratamiz. Sovuq auditoriya bilan ishlaymiz, ehtiyojni shakllantiramiz va darhol sotib olmaganlarni retargeting bilan kuzatamiz.', en: 'We create an ad funnel that works for results. We work with cold audience, form demand and catch up with retargeting those who didn\'t buy immediately.' },
  'service.ads.sniper_targeting': { ru: 'Снайперский таргетинг', uz: 'Snayper target', en: 'Sniper Targeting' },
  'service.ads.sniper_desc': { ru: 'Находим клиентов по интересам и поведенческим факторам.', uz: 'Mijozlarni qiziqishlar va xulq-atvor omillari bo\'yicha topamiz.', en: 'We find clients by interests and behavioral factors.' },
  'service.ads.selling_creative': { ru: 'Продающий креатив', uz: 'Sotuvchi kreativ', en: 'Selling Creative' },
  'service.ads.creative_desc': { ru: 'Создаем контент, который пробивает баннерную слепоту.', uz: 'Banner ko\'rlikni yengadigan kontent yaratamiz.', en: 'We create content that breaks through banner blindness.' },
  'service.ads.smart_filters': { ru: 'Умные фильтры', uz: 'Aqlli filtrlar', en: 'Smart Filters' },
  'service.ads.filters_desc': { ru: 'Показываем рекламу только по целевым запросам (например, "заказать ремонт").', uz: 'Reklamani faqat maqsadli so\'rovlar bo\'yicha ko\'rsatamiz (masalan, "remont buyurtma qilish").', en: 'We show ads only for targeted queries (e.g., "order repair").' },
  'service.ads.waste_traffic': { ru: 'Отсекаем "мусорный" трафик', uz: '"Chiqqan" trafikni kesib tashlaymiz', en: 'We cut off "junk" traffic' },
  'service.ads.waste_desc': { ru: 'Отсекаем "мусорный" трафик (слова "бесплатно", "своими руками", "фото"), экономя ваш бюджет.', uz: 'Biz "chiqqan" trafikni kesib tashlaymiz ("bepul", "o\'z qo\'llari bilan", "foto" so\'zlari), byudjetingizni tejaymiz.', en: 'We cut off "junk" traffic (words "free", "DIY", "photo"), saving your budget.' },
  'service.ads.immediate_results': { ru: 'Результат сразу', uz: 'Darhol natija', en: 'Immediate Results' },
  'service.ads.immediate_desc': { ru: 'В отличие от SEO, заявки начинают идти сразу после запуска кампании.', uz: 'SEO dan farqli o\'laroq, arizalar kampaniya ishga tushirilgandan keyin darhol kelishni boshlaydi.', en: 'Unlike SEO, leads start coming immediately after campaign launch.' },
  'service.ads.retargeting': { ru: 'Ретаргетинг', uz: 'Retargeting', en: 'Retargeting' },
  'service.ads.retargeting_desc': { ru: 'Возвращаем до 40% ушедших пользователей, показывая им персональные офферы.', uz: 'Ketgan foydalanuvchilarning 40% gacha qaytaramiz, ularga shaxsiy takliflar ko\'rsatamiz.', en: 'We return up to 40% of users who left by showing them personal offers.' },
  'service.ads.context_title': { ru: 'Context Ads:', uz: 'Kontekstli Reklama:', en: 'Context Ads:' },
  'service.ads.context_subtitle': { ru: 'Google & Yandex', uz: 'Google va Yandex', en: 'Google & Yandex' },
  'service.ads.context_desc': { ru: 'Ловим клиента в момент, когда он сам ищет ваш товар. Это самый "горячий" трафик с максимальной конверсией в продажу.', uz: 'Mijozni u o\'zi mahsulotingizni qidirayotgan paytda tutamiz. Bu eng "issiq" trafik, maksimal sotish konversiyasi bilan.', en: 'We catch the client at the moment when they are searching for your product. This is the "hottest" traffic with maximum sales conversion.' },
  'service.ads.hot_demand': { ru: 'Горячий спрос', uz: 'Issiq talab', en: 'Hot Demand' },
  'service.ads.minus_words': { ru: 'Минус-слова', uz: 'Minus-so\'zlar', en: 'Negative Keywords' },
  'service.ads.instant_result': { ru: 'Мгновенный результат', uz: 'Zudlik bilan natija', en: 'Instant Result' },
  'service.ads.pricing_title': { ru: 'Тарифы на трафик', uz: 'Trafik tariflari', en: 'Traffic Plans' },
  'service.ads.pricing_subtitle': { ru: 'Комиссия агентства', uz: 'Agentlik komissiyasi', en: 'Agency Commission' },
  'service.ads.testdrive_features': { ru: '1 рекламный канал\nСоздание креативов (3 шт)\nНастройка кабинета\nЗапуск за 3 дня\nОтчет по итогам', uz: '1 ta reklama kanali\nKreativlar yaratish (3 ta)\nKabinet sozlash\n3 kunda ishga tushirish\nYakuniy hisobot', en: '1 ad channel\nCreative creation (3 pcs)\nAccount setup\nLaunch in 3 days\nFinal report' },
  'service.ads.complex_title': { ru: 'Комплекс', uz: 'Kompleks', en: 'Complex' },
  'service.ads.complex_features': { ru: '2 канала (Inst + FB/Google)\nКреативы безлимитно\nРетаргетинг\nA/B тестирование\nЕженедельные отчеты\nРабота с Pixel', uz: '2 kanal (Inst + FB/Google)\nCheksiz kreativlar\nRetargeting\nA/B test\nHaftalik hisobotlar\nPixel bilan ishlash', en: '2 channels (Inst + FB/Google)\nUnlimited creatives\nRetargeting\nA/B testing\nWeekly reports\nPixel work' },
  'service.ads.scale_title': { ru: 'Scale', uz: 'Scale', en: 'Scale' },
  'service.ads.scale_features': { ru: 'Все каналы трафика\nСквозная аналитика\nСтратегия масштабирования\nОтдельный проджект\nЕжедневный контроль\nДизайнер в штате', uz: 'Barcha trafik kanallari\nKesib o\'tuvchi analitika\nMasshtablash strategiyasi\nAlohida loyiha menejeri\nKunlik nazorat\nDizayner shtatda', en: 'All traffic channels\nEnd-to-end analytics\nScaling strategy\nDedicated project manager\nDaily control\nIn-house designer' },
  
  // Service Detail - Web pricing
  'service.web.corporate_pricing_title': { ru: 'Корпоративный', uz: 'Korporativ', en: 'Corporate' },
  
  // Service Detail - Ads additional CTA
  'service.ads.hero_cta_need': { ru: 'НУЖНЫ', uz: 'KERAKMI', en: 'NEED' },
  'service.ads.hero_cta_clients': { ru: 'КЛИЕНТЫ?', uz: 'MIJOZLAR?', en: 'CLIENTS?' },
  'service.ads.hero_stop_wasting': { ru: 'Хватит сливать бюджет. Приведем целевых лидов уже через 3 дня.', uz: 'Byudjetni sarflashni to\'xtating. 3 kundan keyin maqsadli lidlarni olib kelamiz.', en: 'Stop wasting budget. We will bring targeted leads in 3 days.' },
  'service.ads.get_forecast': { ru: 'Получить прогноз', uz: 'Prognoz olish', en: 'Get Forecast' },
  
  // Service Detail - SERM
  'service.serm.hero_digital': { ru: 'Цифровой', uz: 'Raqamli', en: 'Digital' },
  'service.serm.hero_shield': { ru: 'Щит Бренда', uz: 'Brend Qalqoni', en: 'Brand Shield' },
  'service.serm.hero_desc': { ru: 'Управляем тем, что о вас говорят. Удаляем негатив, генерируем позитив и защищаем репутацию в поисковой выдаче.', uz: 'Siz haqingizda gapiriladigan narsalarni boshqaramiz. Salbiy narsalarni olib tashlaymiz, ijobiy narsalarni yaratamiz va qidiruv natijalarida obro\'ni himoya qilamiz.', en: 'We manage what is said about you. We remove negativity, generate positivity and protect reputation in search results.' },
  'service.serm.clear_reputation': { ru: 'Очистить репутацию', uz: 'Obro\'ni tozalash', en: 'Clear Reputation' },
  'service.serm.results_title': { ru: 'Результат работы', uz: 'Ish natijalari', en: 'Work Results' },
  'service.serm.results_subtitle': { ru: 'Before / After', uz: 'Oldin / Keyin', en: 'Before / After' },
  'service.serm.rating_low': { ru: 'Рейтинг 2.3', uz: 'Reyting 2.3', en: 'Rating 2.3' },
  'service.serm.rating_high': { ru: 'Рейтинг 4.8', uz: 'Reyting 4.8', en: 'Rating 4.8' },
  'service.serm.bad_review': { ru: '"Ужасный сервис, никто не берет трубку..."', uz: '"Dahshatli xizmat, hech kim telefonni olmaydi..."', en: '"Terrible service, no one answers the phone..."' },
  
  // Service Detail - Automation pricing
  'service.automation.basic_features': { ru: 'Настройка воронки продаж\nПодключение сайта и соцсетей\nИмпорт базы клиентов\nОбучение 2-х сотрудников', uz: 'Sotish vorkenini sozlash\nSayt va ijtimoiy tarmoqlarni ulash\nMijozlar bazasini import qilish\n2 xodimni o\'qitish', en: 'Sales funnel setup\nWebsite and social media connection\nCustomer database import\nTraining 2 employees' },
  'service.automation.pro_features': { ru: 'Всё из Базового\nИнтеграция IP-телефонии\nШаблоны документов\nАвтоматические задачи\nНастройка прав доступа\nОбучение отдела продаж', uz: 'Asosiy paketdagi hamma narsa\nIP-telefoniya integratsiyasi\nHujjat shablonlari\nAvtomatik vazifalar\nKirish huquqlarini sozlash\nSotish bo\'limini o\'qitish', en: 'Everything from Basic\nIP telephony integration\nDocument templates\nAutomatic tasks\nAccess rights setup\nSales department training' },
  'service.automation.turnkey_features': { ru: 'Сложные бизнес-процессы\nИнтеграция с 1С / МойСклад\nСквозная аналитика (Roistat)\nРазработка виджетов\nСопровождение 1 месяц', uz: 'Murakkab biznes jarayonlari\n1С / МойСклад integratsiyasi\nKesib o\'tuvchi analitika (Roistat)\nVidjetlar yaratish\n1 oy davomida qo\'llab-quvvatlash', en: 'Complex business processes\n1С / МойСклад integration\nEnd-to-end analytics (Roistat)\nWidget development\n1 month support' },
  
  // Service Detail - SERM additional
  'service.serm.anatomy_title': { ru: 'Анатомия SERM', uz: 'SERM anatomiyasi', en: 'SERM Anatomy' },
  'service.serm.anatomy_subtitle': { ru: 'Как мы защищаем', uz: 'Biz qanday himoya qilamiz', en: 'How we protect' },
  'service.serm.scanning': { ru: 'Сканирование 24/7', uz: '24/7 skanerlash', en: 'Scanning 24/7' },
  'service.serm.scanning_desc': { ru: 'Наши боты мониторят упоминания бренда в Google, соцсетях, форумах и Telegram-каналах в реальном времени.', uz: 'Bizning botlarimiz Google, ijtimoiy tarmoqlar, forumlar va Telegram kanallarida brend eslatmalarini real vaqtda kuzatadi.', en: 'Our bots monitor brand mentions in Google, social networks, forums and Telegram channels in real-time.' },
  'service.serm.filtering': { ru: 'Фильтрация и Реакция', uz: 'Filtrlash va Reaksiya', en: 'Filtering and Reaction' },
  'service.serm.filtering_desc': { ru: 'Нейросети классифицируют отзывы (позитив/негатив). Мы мгновенно отвечаем на негатив, переводя конфликт в конструктив.', uz: 'Neural tarmoqlar sharhlarni tasniflaydi (ijobiy/salbiy). Biz salbiy narsalarga darhol javob beramiz, nizoni konstruktivga aylantiramiz.', en: 'Neural networks classify reviews (positive/negative). We instantly respond to negativity, turning conflict into constructive dialogue.' },
  'service.serm.displacement': { ru: 'Вытеснение и Посев', uz: 'Siqib chiqarish va Ekish', en: 'Displacement and Seeding' },
  'service.serm.displacement_desc': { ru: 'Генерируем положительный контент и PR-статьи, чтобы вытеснить негатив с первой страницы поиска.', uz: 'Salbiy narsalarni qidiruvning birinchi sahifasidan siqib chiqarish uchun ijobiy kontent va PR maqolalar yaratamiz.', en: 'We generate positive content and PR articles to push negativity out of the first page of search.' },
  'service.serm.protection_title': { ru: 'Защита бизнеса', uz: 'Biznesni himoya qilish', en: 'Business Protection' },
  'service.serm.protection_subtitle': { ru: 'Тарифы SERM', uz: 'SERM tariflari', en: 'SERM Plans' },
  'service.serm.monitoring_title': { ru: 'Мониторинг', uz: 'Monitoring', en: 'Monitoring' },
  'service.serm.monitoring_features': { ru: 'Отслеживание упоминаний\nЕжемесячный отчет\nРекомендации по ответам', uz: 'Eslatmalarni kuzatish\nOylik hisobot\nJavoblar bo\'yicha tavsiyalar', en: 'Mention tracking\nMonthly report\nResponse recommendations' },
  'service.serm.reputation_title': { ru: 'Репутация', uz: 'Obro\'', en: 'Reputation' },
  'service.serm.reputation_features': { ru: 'Мониторинг 24/7\nНаписание положительных отзывов\nОфициальные ответы на негатив\nРабота с картами (Google/Yandex)', uz: '24/7 monitoring\nIjobiy sharhlar yozish\nSalbiy narsalarga rasmiy javoblar\nXaritalar bilan ishlash (Google/Yandex)', en: '24/7 Monitoring\nWriting positive reviews\nOfficial responses to negativity\nWork with maps (Google/Yandex)' },
  'service.serm.cleanup_title': { ru: 'Зачистка', uz: 'Tozalash', en: 'Cleanup' },
  'service.serm.cleanup_features': { ru: 'Юридическое удаление отзывов\nВытеснение негатива из ТОП-10\nPR-статьи на порталах\nКризисный менеджмент\nГарантия конфиденциальности', uz: 'Sharhlarni huquqiy olib tashlash\nSalbiy narsalarni TOP-10 dan siqib chiqarish\nPortalarda PR maqolalar\nInqiroz boshqaruvi\nMaxfiylik kafolati', en: 'Legal removal of reviews\nPushing negativity out of TOP-10\nPR articles on portals\nCrisis management\nConfidentiality guarantee' },
  'service.serm.hero_cta_return': { ru: 'ВЕРНЕМ', uz: 'QAYTARAMIZMI', en: 'RESTORE' },
  'service.serm.hero_cta_trust': { ru: 'ДОВЕРИЕ?', uz: 'ISHONCHNI?', en: 'TRUST?' },
  'service.serm.hero_reputation_text': { ru: 'Репутация строится годами, а рушится за миг. Доверьте ее защиту профессионалам.', uz: 'Obro\' yillar davomida quriladi, lekin bir lahzada vayron bo\'ladi. Uni himoya qilishni mutaxassislarga ishoning.', en: 'Reputation is built over years, but crumbles in an instant. Entrust its protection to professionals.' },
  'service.serm.protect_brand': { ru: 'Защитить бренд', uz: 'Brendni himoya qilish', en: 'Protect Brand' },
  
  // Service Detail - SEO
  'service.seo.hero_be': { ru: 'Быть в', uz: 'Bo\'lish', en: 'Be in' },
  'service.seo.hero_top': { ru: 'ТОПе', uz: 'TOPda', en: 'TOP' },
  'service.seo.hero_desc': { ru: 'Если вас нет на первой странице Google — вас не существует. Выводим бизнес в лидеры поиска и на Google Карты.', uz: 'Agar siz Google ning birinchi sahifasida bo\'lmasangiz — siz mavjud emassiz. Biznesni qidiruv yetakchilariga va Google Xaritalarga chiqaramiz.', en: 'If you\'re not on the first page of Google — you don\'t exist. We bring business to search leaders and Google Maps.' },
  'service.seo.raise_search': { ru: 'Поднять в поиске', uz: 'Qidiruvda ko\'tarish', en: 'Raise in Search' },
  'service.seo.evolution': { ru: 'Эволюция Поиска', uz: 'Qidiruv evolyutsiyasi', en: 'Search Evolution' },
  'service.seo.optimize_for': { ru: 'Мы оптимизируем для', uz: 'Biz optimallashtiramiz', en: 'We optimize for' },
  'service.seo.optimize_desc': { ru: 'Пользователи всё чаще ищут ответы не в поисковой строке, а спрашивают у нейросетей (ChatGPT, Gemini, Perplexity). Мы делаем так, чтобы ваш бренд был в этих ответах.', uz: 'Foydalanuvchilar ko\'proq va ko\'proq javoblarni qidiruv satrida emas, balki neyron tarmoqlardan so\'raydi (ChatGPT, Gemini, Perplexity). Biz sizning brendingiz bu javoblarda bo\'lishini ta\'minlaymiz.', en: 'Users increasingly search for answers not in the search bar, but ask neural networks (ChatGPT, Gemini, Perplexity). We make sure your brand is in these answers.' },
  'service.seo.classic_title': { ru: 'Classic SEO', uz: 'Classic SEO', en: 'Classic SEO' },
  'service.seo.classic_desc': { ru: 'Топ выдачи Google и Yandex по ключевым словам.', uz: 'Google va Yandex da kalit so\'zlar bo\'yicha top natijalar.', en: 'Top results in Google and Yandex for keywords.' },
  'service.seo.ai_title': { ru: 'AI Optimization', uz: 'AI Optimallashtirish', en: 'AI Optimization' },
  'service.seo.ai_desc': { ru: 'Рекомендации бренда в ответах ChatGPT и Gemini.', uz: 'ChatGPT va Gemini javoblarida brend tavsiyalari.', en: 'Brand recommendations in ChatGPT and Gemini answers.' },
  'service.seo.local_title': { ru: 'Локальное доминирование', uz: 'Mahalliy hukmronlik', en: 'Local Dominance' },
  'service.seo.local_subtitle': { ru: 'Google Maps & Yandex', uz: 'Google Maps va Yandex', en: 'Google Maps & Yandex' },
  'service.seo.google_maps_title': { ru: 'Google Maps', uz: 'Google Maps', en: 'Google Maps' },
  'service.seo.google_maps_desc': { ru: 'Оптимизация карточки компании. Фотографии, отзывы, актуальные данные. Вы будете первыми, кого увидит клиент рядом.', uz: 'Kompaniya kartasini optimallashtirish. Fotosuratlar, sharhlar, dolzarb ma\'lumotlar. Siz mijoz yaqinida ko\'radigan birinchi bo\'lasiz.', en: 'Company card optimization. Photos, reviews, current data. You will be the first the client sees nearby.' },
  'service.seo.yandex_maps_title': { ru: 'Yandex Maps', uz: 'Yandex Maps', en: 'Yandex Maps' },
  'service.seo.yandex_maps_desc': { ru: 'Продвижение в Яндекс.Картах. Приоритетное размещение и работа с рейтингом.', uz: 'Yandex.Xaritalarda targ\'ibot. Ustuvor joylashtirish va reyting bilan ishlash.', en: 'Promotion in Yandex.Maps. Priority placement and rating work.' },
  'service.seo.2gis_title': { ru: '2GIS & Другие', uz: '2GIS va Boshqalar', en: '2GIS & Others' },
  'service.seo.2gis_desc': { ru: 'Присутствие во всех справочниках и навигаторах. Ваш клиент найдет дорогу к вам.', uz: 'Barcha ma\'lumotnomalar va navigatorlarda mavjudlik. Mijozingiz sizga yo\'l topadi.', en: 'Presence in all directories and navigators. Your client will find the way to you.' },
  'service.seo.pricing_title': { ru: 'Стоимость SEO', uz: 'SEO narxi', en: 'SEO Cost' },
  'service.seo.pricing_subtitle': { ru: 'Долгосрочные инвестиции', uz: 'Uzoq muddatli sarmoya', en: 'Long-term Investment' },
  'service.seo.geo_title': { ru: 'Карты (GEO)', uz: 'Xaritalar (GEO)', en: 'Maps (GEO)' },
  'service.seo.geo_features': { ru: 'Создание точек Google/Yandex\nНаполнение контентом\nПервые 10 отзывов\nВерификация бизнеса', uz: 'Google/Yandex nuqtalarini yaratish\nKontent bilan to\'ldirish\nBirinchi 10 ta sharh\nBiznesni tasdiqlash', en: 'Creating Google/Yandex points\nContent filling\nFirst 10 reviews\nBusiness verification' },
  'service.seo.start_title': { ru: 'SEO Старт', uz: 'SEO Start', en: 'SEO Start' },
  'service.seo.start_features': { ru: 'Технический аудит сайта\nСбор семантического ядра\nОптимизация мета-тегов\nУскорение загрузки сайта\nТексты для главных страниц', uz: 'Saytning texnik audit\nSemantik yadro yig\'ish\nMeta-teglarni optimallashtirish\nSayt yuklanishini tezlashtirish\nAsosiy sahifalar uchun matnlar', en: 'Site technical audit\nSemantic core collection\nMeta tags optimization\nSite loading speedup\nTexts for main pages' },
  'service.seo.leader_title': { ru: 'SEO Лидер', uz: 'SEO Leader', en: 'SEO Leader' },
  'service.seo.leader_features': { ru: 'Ежемесячное продвижение\nНаписание статей в блог\nВнешние ссылки (Linkbuilding)\nЕженедельная отчетность\nГарантия роста позиций', uz: 'Oylik targ\'ibot\nBlog uchun maqolalar yozish\nTashqi havolalar (Linkbuilding)\nHaftalik hisobot\nPozitsiyalar o\'sish kafolati', en: 'Monthly promotion\nWriting blog articles\nExternal links (Linkbuilding)\nWeekly reporting\nPosition growth guarantee' },
  'service.seo.hero_cta_capture': { ru: 'ЗАХВАТИМ', uz: 'EGALLAB OLAMIZMI', en: 'CAPTURE' },
  'service.seo.hero_cta_results': { ru: 'ВЫДАЧУ?', uz: 'NATIJALARNI?', en: 'RESULTS?' },
  'service.seo.hero_audit_text': { ru: 'Оставьте заявку на бесплатный экспресс-аудит. Мы найдем ошибки, которые мешают вам быть первым.', uz: 'Bepul ekspress-audit uchun ariza qoldiring. Sizni birinchi bo\'lishdan to\'sib turuvchi xatolarni topamiz.', en: 'Submit a request for a free express audit. We will find errors that prevent you from being first.' },
  'service.seo.order_audit': { ru: 'Заказать Аудит', uz: 'Auditni buyurtma qilish', en: 'Order Audit' },
  
  // Privacy Policy - Section 01 (Terms)
  'privacy.term_admin': { ru: 'Администрация сайта', uz: 'Sayt ma\'muriyati', en: 'Site Administration' },
  'privacy.term_admin_desc': { ru: 'Уполномоченные сотрудники на управление сайтом, которые организуют и (или) осуществляют обработку персональных данных.', uz: 'Saytni boshqarish uchun vakolatli xodimlar, ular shaxsiy ma\'lumotlarni tashkil qiladi va (yoki) qayta ishlaydi.', en: 'Authorized employees for site management who organize and/or process personal data.' },
  'privacy.term_personal': { ru: 'Персональные данные', uz: 'Shaxsiy ma\'lumotlar', en: 'Personal Data' },
  'privacy.term_personal_desc': { ru: 'Любая информация, относящаяся к прямо или косвенно определенному или определяемому физическому или юридическому лицу.', uz: 'To\'g\'ridan-to\'g\'ri yoki bilvosita aniqlangan yoki aniqlanadigan jismoniy yoki yuridik shaxsga tegishli har qanday ma\'lumot.', en: 'Any information relating to a directly or indirectly identified or identifiable natural or legal person.' },
  'privacy.term_processing': { ru: 'Обработка данных', uz: 'Ma\'lumotlarni qayta ishlash', en: 'Data Processing' },
  'privacy.term_processing_desc': { ru: 'Любое действие (операция) или совокупность действий, совершаемых с использованием средств автоматизации или без них.', uz: 'Avtomatlashtirish vositalaridan foydalangan holda yoki undan foydalanmasdan bajariladigan har qanday harakat (operatsiya) yoki harakatlar majmui.', en: 'Any action (operation) or set of actions performed with or without automation means.' },
  'privacy.term_confidentiality': { ru: 'Конфиденциальность', uz: 'Maxfiylik', en: 'Confidentiality' },
  'privacy.term_confidentiality_desc': { ru: 'Обязательное для соблюдения требование не допускать распространения данных без согласия субъекта.', uz: 'Sub\'yektning roziligisiz ma\'lumotlarni tarqatmaslik uchun majburiy talab.', en: 'Mandatory requirement not to allow data distribution without the subject\'s consent.' },
  
  // Privacy Policy - Section 02 (Subject)
  'privacy.subject_2_1': { ru: 'Настоящая Политика устанавливает обязательства Администрации по неразглашению и обеспечению режима защиты конфиденциальности данных.', uz: 'Ushbu Siyosat Ma\'muriyatga ma\'lumotlarni oshkor qilmaslik va maxfiylikni himoya qilish rejimini ta\'minlash bo\'yicha majburiyatlarni belgilaydi.', en: 'This Policy establishes the Administration\'s obligations for non-disclosure and ensuring the data confidentiality protection regime.' },
  'privacy.subject_2_2': { ru: 'Данные, разрешённые к обработке, предоставляются Пользователем путём заполнения форм на Сайте (заявка, бриф, контакты):', uz: 'Qayta ishlashga ruxsat berilgan ma\'lumotlar Foydalanuvchi tomonidan Saytdagi shakllarni to\'ldirish orqali taqdim etiladi (ariza, bриф, kontaktlar):', en: 'Data permitted for processing is provided by the User by filling out forms on the Site (application, brief, contacts):' },
  'privacy.subject_name': { ru: 'Имя / Название компании', uz: 'Ism / Kompaniya nomi', en: 'Name / Company Name' },
  'privacy.subject_phone': { ru: 'Контактный телефон', uz: 'Kontakt telefoni', en: 'Contact Phone' },
  'privacy.subject_email': { ru: 'Адрес электронной почты', uz: 'Elektron pochta manzili', en: 'Email Address' },
  'privacy.subject_project': { ru: 'Данные о проекте', uz: 'Loyiha haqida ma\'lumot', en: 'Project Data' },
  
  // Privacy Policy - Section 03 (Purpose)
  'privacy.purpose_intro': { ru: 'Администрация сайта может использовать данные Пользователя в целях:', uz: 'Sayt ma\'muriyati Foydalanuvchi ma\'lumotlarini quyidagi maqsadlarda ishlatishi mumkin:', en: 'Site Administration may use User data for the following purposes:' },
  'privacy.purpose_1': { ru: 'Идентификации Пользователя для оформления заявки и заключения Договора.', uz: 'Ariza rasmiylashtirish va Shartnoma tuzish uchun Foydalanuvchini identifikatsiya qilish.', en: 'User identification for application processing and Contract conclusion.' },
  'privacy.purpose_2': { ru: 'Установления обратной связи (уведомления, запросы, касающиеся использования Сайта).', uz: 'Teskari aloqa o\'rnatish (Sayt foydalanishiga oid bildirishnomalar, so\'rovlar).', en: 'Establishing feedback (notifications, requests regarding Site use).' },
  'privacy.purpose_3': { ru: 'Подтверждения достоверности и полноты предоставленных данных.', uz: 'Ta\'minlangan ma\'lumotlarning to\'g\'riligi va to\'liqligini tasdiqlash.', en: 'Confirming the accuracy and completeness of provided data.' },
  'privacy.purpose_4': { ru: 'Уведомления Пользователя о статусе работы над проектом.', uz: 'Foydalanuvchini loyiha ustida ish holati haqida xabardor qilish.', en: 'Notifying the User about project work status.' },
  
  // Privacy Policy - Section 04 (Terms)
  'privacy.terms_4_1': { ru: 'Обработка персональных данных осуществляется', uz: 'Shaxsiy ma\'lumotlarni qayta ishlash amalga oshiriladi', en: 'Personal data processing is carried out' },
  'privacy.terms_unlimited': { ru: 'без ограничения срока', uz: 'muddat cheklanmagan holda', en: 'without time limitation' },
  'privacy.terms_4_1_rest': { ru: 'любым законным способом, в том числе в информационных системах с использованием средств автоматизации.', uz: 'har qanday qonuniy usul bilan, jumladan avtomatlashtirish vositalaridan foydalangan holda axborot tizimlarida.', en: 'by any legal means, including in information systems using automation means.' },
  'privacy.terms_4_2': { ru: 'Персональные данные могут быть переданы уполномоченным органам государственной власти только по основаниям и в порядке, установленным законодательством.', uz: 'Shaxsiy ma\'lumotlar faqat qonunchilik bilan belgilangan asoslar va tartib bo\'yicha vakolatli davlat organlariga uzatilishi mumkin.', en: 'Personal data may be transferred to authorized state authorities only on grounds and in the manner established by law.' },
  
  // Privacy Policy - Section 05 (Protection)
  'privacy.protection_text': { ru: 'Администрация сайта принимает необходимые организационные и технические меры для защиты информации Пользователя от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения, а также от иных неправомерных действий третьих лиц.', uz: 'Sayt ma\'muriyati Foydalanuvchi ma\'lumotlarini noqonuniy yoki tasodifiy kirish, yo\'q qilish, o\'zgartirish, bloklash, nusxalash, tarqatish, shuningdek uchinchi shaxslarning boshqa noqonuniy harakatlaridan himoya qilish uchun zarur tashkiliy va texnik choralarni qabul qiladi.', en: 'Site Administration takes necessary organizational and technical measures to protect User information from unlawful or accidental access, destruction, modification, blocking, copying, distribution, as well as from other unlawful actions of third parties.' },
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ lang?: string }>();
  
  // Get language from URL or default to 'ru'
  const getLanguageFromUrl = (): Language => {
    try {
      const langFromUrl = params.lang || location?.pathname?.split('/')[1];
      if (langFromUrl === 'ru' || langFromUrl === 'uz' || langFromUrl === 'en') {
        return langFromUrl as Language;
      }
    } catch (e) {
      // Fallback if location is not available
    }
    return 'ru';
  };

  const [language, setLanguage] = useState<Language>(getLanguageFromUrl());

  // Sync language with URL
  useEffect(() => {
    if (!location) return;
    const langFromUrl = getLanguageFromUrl();
    if (langFromUrl !== language) {
      setLanguage(langFromUrl);
    }
  }, [location?.pathname, params?.lang]);

  // Update language and URL
  const updateLanguage = (newLang: Language) => {
    setLanguage(newLang);
    if (!location || !navigate) return;
    const pathWithoutLang = location.pathname.replace(/^\/(ru|uz|en)/, '') || '/';
    const newPath = pathWithoutLang === '/' ? `/${newLang}` : `/${newLang}${pathWithoutLang}`;
    navigate(newPath, { replace: true });
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const getLocalized = (obj: LocalizedString | string): string => {
    if (typeof obj === 'string') return obj;
    return obj[language] || obj.ru;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: updateLanguage, t, getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};