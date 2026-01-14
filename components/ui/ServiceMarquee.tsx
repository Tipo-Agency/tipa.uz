import React from 'react';

export const ServiceMarquee: React.FC = () => {
  const items = [
    'MARKETING', 'STRATEGY', 'AUTOMATION', 'DEVELOPMENT', 'BRANDING', 
    'MARKETING', 'STRATEGY', 'AUTOMATION', 'DEVELOPMENT', 'BRANDING',
    'MARKETING', 'STRATEGY', 'AUTOMATION', 'DEVELOPMENT', 'BRANDING'
  ];

  return (
    // Wrapper with overflow-hidden to prevent horizontal scroll on mobile
    <div className="w-full overflow-hidden relative" style={{ maxWidth: '100vw', position: 'relative', overflowX: 'hidden' }}>
      {/* Added -rotate-2 permanently (removed md:rotate-0) and scaled/widened to prevent gaps */}
      <div 
        className="bg-primary py-4 overflow-hidden relative border-y border-white/10 z-20 transform -rotate-2 origin-center" 
        style={{ 
          width: '110vw',
          marginLeft: '-5vw',
          maxWidth: 'none'
        }}
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {items.map((item, index) => (
            <div key={index} className="mx-4 md:mx-8 flex items-center">
              <span className="text-xl md:text-2xl font-display font-bold text-white tracking-widest uppercase">
                {item}
              </span>
              <span className="w-2 h-2 bg-accent-turquoise rounded-full ml-8 md:ml-16"></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};