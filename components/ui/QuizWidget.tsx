import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useModal } from '../../context/ModalContext';
import { trackQuizGoal, trackSocialClick } from '../../lib/analytics';
import { createLead } from '../../services/leadService';
import { CONTACT_INFO, SERVICES_DATA } from '../../constants';

const QUIZ_DELAY_MS = 3000;

type Step = 1 | 2 | 3 | 4 | 5;
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

const selectAndNext = (
  setter: () => void,
  track: () => void,
  nextStep: Step,
  setStep: (s: Step) => void
) => {
  setter();
  track();
  setStep(nextStep);
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

  const optionClass = (selected: boolean) =>
    `block w-full text-left px-4 py-3 rounded-xl border transition-all ${
      selected ? 'bg-primary/25 border-primary text-white ring-2 ring-primary/50' : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/10'
    }`;

  if (!canShow) return null;

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          className="fixed bottom-6 left-6 z-[90] flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary text-white font-display font-bold text-base uppercase tracking-wider shadow-xl shadow-primary/40 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 transition-all animate-pulse hover:animate-none border-2 border-primary/80"
        >
          <span className="text-2xl" aria-hidden>🎁</span>
          {t('quiz.cta')}
        </button>
      )}

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm z-[200]" onClick={handleClose} />
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="w-full max-w-lg max-h-[90vh] overflow-hidden rounded-3xl bg-dark-surface border border-white/10 shadow-2xl flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={goBack}
                      className="p-2 rounded-full border border-white/20 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium"
                    >
                      ← {t('quiz.back')}
                    </button>
                  )}
                  <span className="text-gray-400 text-sm truncate max-w-[200px]">
                    {step === 1 && t('quiz.step1_title')}
                    {step === 2 && t('quiz.step2_title')}
                    {step === 3 && t('quiz.step3_title')}
                    {step === 4 && t('quiz.step4_title')}
                    {step === 5 && t('quiz.claim_gift')}
                  </span>
                </div>
                <button type="button" onClick={handleClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {/* Step 1: Service — клик = переход на шаг 2 */}
                {step === 1 && (
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-xl text-white mb-4">{t('quiz.step1_title')}</h3>
                    {SERVICES_DATA.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => selectAndNext(() => setServiceId(s.id), () => trackQuizGoal('quiz_step_1'), 2, setStep)}
                        className={optionClass(serviceId === s.id)}
                      >
                        {getLocalized(s.title)}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 2: Pain — клик = переход на шаг 3 */}
                {step === 2 && (
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-xl text-white mb-4">{t('quiz.step2_title')}</h3>
                    {(['no_leads', 'ads', 'no_system', 'scale'] as const).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => selectAndNext(() => setPain(key), () => trackQuizGoal('quiz_step_2'), 3, setStep)}
                        className={optionClass(pain === key)}
                      >
                        {t(`quiz.step2_${key}`)}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 3: Who — клик = переход на шаг 4 */}
                {step === 3 && (
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-xl text-white mb-4">{t('quiz.step3_title')}</h3>
                    {(['owner', 'marketer', 'startup', 'other'] as const).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => selectAndNext(() => setWho(key), () => trackQuizGoal('quiz_step_3'), 4, setStep)}
                        className={optionClass(who === key)}
                      >
                        {t(`quiz.step3_${key}`)}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 4: When — клик = переход на шаг 5 */}
                {step === 4 && (
                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-xl text-white mb-4">{t('quiz.step4_title')}</h3>
                    {(['urgent', 'planning', 'exploring'] as const).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => selectAndNext(() => setWhen(key), () => trackQuizGoal('quiz_step_4'), 5, setStep)}
                        className={optionClass(when === key)}
                      >
                        {t(`quiz.step4_${key}`)}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 5: Подарки + форма — «Забери свой подарок» */}
                {step === 5 && (
                  <div className="space-y-6">
                    <h3 className="font-display font-bold text-2xl text-white text-center">{t('quiz.claim_gift')}</h3>
                    <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/40 p-5 space-y-3">
                      <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">🎁 {t('quiz.your_gifts')}</p>
                      <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white/5">
                        <span className="text-2xl">✅</span>
                        <span className="text-white font-medium">{t('quiz.offer_always_1')}</span>
                      </div>
                      <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white/5">
                        <span className="text-2xl">✅</span>
                        <span className="text-white font-medium">{t('quiz.offer_always_2')}</span>
                      </div>
                      {getServiceBonusKey(serviceId) && (
                        <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-primary/20 border border-primary/40">
                          <span className="text-2xl">🎁</span>
                          <span className="text-white font-bold">{t(getServiceBonusKey(serviceId)!)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm text-center">{t('quiz.claim_gift_sub')}</p>
                    <form onSubmit={handleQuizSubmit} className="space-y-4">
                      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
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
            </div>
          </div>
        </>
      )}
    </>
  );
};
