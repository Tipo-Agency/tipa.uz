import React from 'react';

export const ServiceMarquee: React.FC = () => {
  const items = [
    'MARKETING', 'STRATEGY', 'AUTOMATION', 'DEVELOPMENT', 'BRANDING', 
    'MARKETING', 'STRATEGY', 'AUTOMATION', 'DEVELOPMENT', 'BRANDING',
    'MARKETING', 'STRATEGY', 'AUTOMATION', 'DEVELOPMENT', 'BRANDING'
  ];

  return (
    // Added -rotate-2 permanently (removed md:rotate-0) and scaled/widened to prevent gaps
    <div className="w-[110vw] -ml-[5vw] bg-primary py-4 overflow-hidden relative border-y border-white/10 z-20 transform -rotate-2 origin-center scale-105">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((item, index) => (
          <div key={index} className="mx-8 flex items-center">
            <span className="text-xl md:text-2xl font-display font-bold text-white tracking-widest uppercase">
              {item}
            </span>
            <span className="w-2 h-2 bg-accent-turquoise rounded-full ml-16"></span>
          </div>
        ))}
      </div>
    </div>
  );
};