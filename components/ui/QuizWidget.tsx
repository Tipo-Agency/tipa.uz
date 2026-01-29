import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useModal } from '../../context/ModalContext';
import { trackQuizGoal, trackSocialClick } from '../../lib/analytics';
import { createLead } from '../../services/leadService';
import { CONTACT_INFO, SERVICES_DATA } from '../../constants';

const QUIZ_DELAY_MS = 3000;

type Step = 1 | 2 | 3 | 4 | 5 | 6;
type Pain = 'no_leads' | 'ads' | 'no_system' | 'scale';
type Who = 'owner' | 'marketer' | 'startup' | 'other';
type When = 'urgent' | 'planning' | 'exploring';

const getServiceBonusKey = (serviceId: string | null): string | null => {
  if (!serviceId) return null;
  if (serviceId === 'smm') return 'quiz.offer_smm';
  if (serviceId === 'web') return 'quiz.offer_web';
  if (serviceId === 'ads') return 'quiz.offer_ads';
  if (serviceId === 'automation') return 'quiz.offer_automation';
  return null;
};

export const QuizWidget: React.FC = () => {
  const { pathname } = useLocation();
  const { t, language } = useLanguage();
  const { openThankYou } = useModal();
  const [canShow, setCanShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [pain, setPain] = useState<Pain | null>(null);
  const [who, setWho] = useState<Who | null>(null);
  const [when, setWhen] = useState<When | null>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const offerViewedRef = useRef(false);

  const segments = pathname.split('/').filter(Boolean);
  const isServiceDetailPage = segments[1] === 'services' && !!segments[2];
  const preSelectServiceId = isServiceDetailPage ? segments[2] || null : null;

  // Показываем квиз на всех страницах через 3 сек
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setCanShow(true);
      trackQuizGoal('quiz_show');
    }, QUIZ_DELAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  const handleOpen = () => {
    setIsOpen(true);
    setPain(null);
    setWho(null);
    setWhen(null);
    offerViewedRef.current = false;
    trackQuizGoal('quiz_widget_click');
    trackQuizGoal('quiz_start');
    // Если открыли квиз на странице конкретной услуги — этап 1 пропускаем, услуга уже выбрана контекстом
    if (preSelectServiceId) {
      setServiceId(preSelectServiceId);
      setStep(2);
      trackQuizGoal('quiz_step_1');
    } else {
      setServiceId(null);
      setStep(1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    trackQuizGoal('quiz_close');
  };

  useEffect(() => {
    if (step === 5 && !offerViewedRef.current) {
      offerViewedRef.current = true;
      trackQuizGoal('quiz_offer_view');
    }
  }, [step]);

  const goNext = () => {
    if (step === 1) trackQuizGoal('quiz_step_1');
    if (step === 2) trackQuizGoal('quiz_step_2');
    if (step === 3) trackQuizGoal('quiz_step_3');
    if (step === 4) trackQuizGoal('quiz_step_4');
    setStep((s) => (s + 1) as Step);
  };

  const goBack = () => {
    setStep((s) => Math.max(1, s - 1) as Step);
  };

  const getLocalized = (obj: { ru: string; uz: string; en: string }) => obj[language] || obj.ru;

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formName.trim() || !formPhone.trim()) {
      setError(t('lead.error_name') || 'Заполните поля');
      return;
    }
    setIsSubmitting(true);
    try {
      const nameParts = formName.trim().split(/\s+/);
      await createLead({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: formPhone.replace(/\D/g, ''),
        phoneCountryCode: '+998',
        sourceSection: 'quiz',
      });
      trackQuizGoal('quiz_lead_submit');
      setIsSubmitting(false);
      handleClose();
      setTimeout(() => openThankYou(), 300);
    } catch (err) {
      console.error(err);
      setError(t('contact.error_generic') || 'Ошибка отправки');
      setIsSubmitting(false);
    }
  };

  if (!canShow) return null;

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-[90] px-5 py-3 rounded-full bg-primary text-white font-display font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/30 hover:scale-105 transition-all"
        >
          {t('quiz.cta')}
        </button>
      )}

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-[200]" onClick={handleClose} />
          <div className="fixed bottom-6 right-6 z-[201] w-[calc(100vw-2rem)] max-w-md max-h-[85vh] overflow-hidden rounded-3xl bg-dark-surface border border-white/10 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-gray-400 text-sm">
                {step === 1 && t('quiz.step1_title').slice(0, 20)}
                {step === 2 && t('quiz.step2_title').slice(0, 20)}
                {step === 3 && t('quiz.step3_title')}
                {step === 4 && t('quiz.step4_title').slice(0, 20)}
                {step === 5 && t('quiz.offer_title')}
                {step === 6 && t('quiz.final_title')}
              </span>
              <button type="button" onClick={handleClose} className="text-gray-400 hover:text-white p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {/* Step 1: Service */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-lg text-white mb-4">{t('quiz.step1_title')}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {SERVICES_DATA.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setServiceId(s.id)}
                        className={`text-left px-4 py-3 rounded-xl border transition-all ${
                          serviceId === s.id ? 'bg-primary/20 border-primary text-white' : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                        }`}
                      >
                        {getLocalized(s.title)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Pain */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-lg text-white mb-4">{t('quiz.step2_title')}</h3>
                  {(['no_leads', 'ads', 'no_system', 'scale'] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPain(key)}
                      className={`block w-full text-left px-4 py-3 rounded-xl border transition-all ${
                        pain === key ? 'bg-primary/20 border-primary text-white' : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      {t(`quiz.step2_${key}`)}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Who */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-lg text-white mb-4">{t('quiz.step3_title')}</h3>
                  {(['owner', 'marketer', 'startup', 'other'] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setWho(key)}
                      className={`block w-full text-left px-4 py-3 rounded-xl border transition-all ${
                        who === key ? 'bg-primary/20 border-primary text-white' : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      {t(`quiz.step3_${key}`)}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 4: When */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-lg text-white mb-4">{t('quiz.step4_title')}</h3>
                  {(['urgent', 'planning', 'exploring'] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setWhen(key)}
                      className={`block w-full text-left px-4 py-3 rounded-xl border transition-all ${
                        when === key ? 'bg-primary/20 border-primary text-white' : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      {t(`quiz.step4_${key}`)}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 5: Offer */}
              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-lg text-white mb-4">{t('quiz.offer_title')}</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">✅ {t('quiz.offer_always_1')}</li>
                    <li className="flex items-center gap-2">✅ {t('quiz.offer_always_2')}</li>
                    {getServiceBonusKey(serviceId) && (
                      <li className="flex items-center gap-2">👉 {t(getServiceBonusKey(serviceId)!)}</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Step 6: Form */}
              {step === 6 && (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-lg text-white mb-4">{t('quiz.final_title')}</h3>
                  <form onSubmit={handleQuizSubmit} className="space-y-4">
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <input
                      type="text"
                      required
                      placeholder={t('lead.name_placeholder')}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                    <input
                      type="tel"
                      required
                      placeholder={t('lead.phone_placeholder_default')}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-full font-display font-bold uppercase tracking-wider bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isSubmitting ? t('contact.sending') : t('contact.form_btn')}
                    </button>
                    <a
                      href={CONTACT_INFO.socials.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackSocialClick('telegram', { location: 'quiz' })}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-[#2AABEE]/50 text-[#2AABEE] hover:bg-[#2AABEE]/10 font-display font-bold text-sm uppercase"
                    >
                      {t('lead.write_telegram')}
                    </a>
                  </form>
                </div>
              )}
            </div>
            {step < 6 && (
              <div className="p-4 border-t border-white/10 flex gap-2">
                {step > 1 && (
                  <button type="button" onClick={goBack} className="px-4 py-2 rounded-full border border-white/20 text-gray-400 hover:text-white text-sm">
                    {t('quiz.back')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={goNext}
                  disabled={
                    (step === 1 && !serviceId) ||
                    (step === 2 && !pain) ||
                    (step === 3 && !who) ||
                    (step === 4 && !when)
                  }
                  className="flex-1 py-3 rounded-full font-display font-bold text-sm uppercase bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
                >
                  {t('quiz.next')}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
