import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '../../services/siteDataService';
import { useLanguage } from '../../context/LanguageContext';
import { useLocalizedLink } from '../../lib/useLocalizedLink';

export interface NewsCardItem {
  id: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  date: string;
  tags?: Tag[];
}

export const NewsCard: React.FC<{ item: NewsCardItem }> = ({ item }) => {
  const { t } = useLanguage();
  const newsLink = useLocalizedLink(`/news/${item.id}`);

  return (
    <Link
      to={newsLink}
      className="group flex flex-col h-full bg-dark-surface border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={`${item.title} - новость от Типа агентство`}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark via-primary/10 to-dark" />
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="bg-dark/80 backdrop-blur px-3 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/10"
                style={tag.color ? { borderColor: tag.color, color: tag.color } : undefined}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="text-gray-500 text-xs font-mono mb-3">{item.date}</div>
        <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
          {item.excerpt}
        </p>
        <div className="flex items-center text-primary font-bold text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
          {t('news.read')} →
        </div>
      </div>
    </Link>
  );
};

