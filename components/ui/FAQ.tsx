import React, { useState, useEffect } from 'react';
import { Section, SectionTitle } from './Section';
import { useLanguage } from '../../context/LanguageContext';
import { Icons } from '../../constants';
import { useLocation } from 'react-router-dom';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button 
        className="w-full py-6 flex justify-between items-center text-left group"
        onClick={onClick}
      >
        <span className={`font-display font-bold text-lg md:text-xl transition-colors ${isOpen ? 'text-primary' : 'text-white group-hover:text-gray-300'}`}>
          {question}
        </span>
        <span className={`ml-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45 text-primary' : 'text-gray-500'}`}>
          <Icons.Plus />
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-400 leading-relaxed pr-8">
          {answer}
        </p>
      </div>
    </div>
  );
};

export const FAQSection: React.FC<{ data: { q: any, a: any }[] }> = ({ data }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t, getLocalized } = useLanguage();
  const location = useLocation();

  // Generate FAQPage Schema.org structured data
  useEffect(() => {
    if (!data || data.length === 0) return;

    const baseUrl = 'https://tipa.uz';
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.map((item) => ({
        '@type': 'Question',
        name: getLocalized(item.q),
        acceptedAnswer: {
          '@type': 'Answer',
          text: getLocalized(item.a)
        }
      }))
    };

    // Remove existing FAQPage schema if any
    const existing = document.querySelector('script[data-faq-schema]');
    if (existing) {
      existing.remove();
    }

    // Add new FAQPage schema
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-faq-schema', 'true');
    script.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      const toRemove = document.querySelector('script[data-faq-schema]');
      if (toRemove) {
        toRemove.remove();
      }
    };
  }, [data, getLocalized, location.pathname]);

  if (!data || data.length === 0) return null;

  return (
    <Section className="bg-dark-surface">
      <SectionTitle title={t('faq.title')} subtitle={t('faq.subtitle')} />
      <div className="max-w-3xl mx-auto bg-dark border border-white/5 rounded-3xl p-8 md:p-10">
        {data.map((item, idx) => (
          <FAQItem 
            key={idx}
            question={getLocalized(item.q)}
            answer={getLocalized(item.a)}
            isOpen={openIndex === idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </div>
    </Section>
  );
};