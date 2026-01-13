import React, { useEffect, useState } from 'react';
import { PARTNERS_LOGOS } from '../../constants';
import { getSiteData, PartnerLogo } from '../../services/siteDataService';

export const Partners: React.FC = () => {
  const [logos, setLogos] = useState<PartnerLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { partnerLogos } = await getSiteData();
        if (partnerLogos && partnerLogos.length > 0) {
          setLogos(partnerLogos);
        } else if (process.env.NODE_ENV === 'development') {
          console.warn('No partner logos found in Firestore, using static fallback');
        }
      } catch (e) {
        console.error('Failed to load partner logos from Firestore, using static fallback.', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const hasDynamic = logos.length > 0;
  const displayLogos = hasDynamic ? logos : PARTNERS_LOGOS;
  
  // Для плавной анимации marquee нужно минимум 3 копии, но если логотипов мало, дублируем больше
  // Если логотипов >= 3, дублируем 2 раза (итого 3 копии)
  // Если логотипов < 3, дублируем больше раз для плавной анимации
  const getDuplicatedLogos = () => {
    if (displayLogos.length === 0) return [];
    if (displayLogos.length >= 3) {
      return displayLogos.concat(displayLogos).concat(displayLogos);
    } else {
      // Если логотипов мало (1-2), дублируем больше раз для плавной анимации
      const copies = Math.ceil(6 / displayLogos.length); // Нужно минимум 6 элементов для плавной анимации
      let duplicated = [...displayLogos];
      for (let i = 0; i < copies; i++) {
        duplicated = duplicated.concat(displayLogos);
      }
      return duplicated;
    }
  };

  return (
    <div className="w-full bg-dark-surface border-y border-white/5 py-12 overflow-hidden relative">
      <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-dark-surface to-transparent z-10" />
      <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-dark-surface to-transparent z-10" />

      <div className="flex animate-marquee whitespace-nowrap items-center">
        {getDuplicatedLogos().map(
          (item, index) => {
            const key = hasDynamic ? (item as PartnerLogo).id + index : `${item}-${index}`;
            const name = hasDynamic ? (item as PartnerLogo).name : (item as string);
            const logoUrl = hasDynamic ? (item as PartnerLogo).logoUrl : undefined;
            const websiteUrl = hasDynamic ? (item as PartnerLogo).websiteUrl : undefined;

            const content = logoUrl && logoUrl.trim() ? (
              <img
                src={logoUrl}
                alt={`Логотип партнера ${name}`}
                className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all max-w-[200px]"
                loading="lazy"
                onError={(e) => {
                  console.warn(`Failed to load logo image for ${name}:`, logoUrl);
                  // Fallback to text if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('span');
                    fallback.className = 'text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 uppercase';
                    fallback.textContent = name;
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <span className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 uppercase">
                {name}
              </span>
            );

            const inner = (
              <div
                className="mx-12 opacity-40 hover:opacity-100 transition-opacity cursor-pointer flex items-center"
              >
                {content}
              </div>
            );

            return websiteUrl ? (
              <a key={key} href={websiteUrl} target="_blank" rel="noreferrer">
                {inner}
              </a>
            ) : (
              <div key={key}>{inner}</div>
            );
          }
        )}
      </div>
    </div>
  );
};
