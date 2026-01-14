import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  light?: boolean; // Default is dark now
}

export const Section: React.FC<SectionProps> = ({ children, className = '', id, light = false }) => {
  return (
    <section 
      id={id} 
      className={`py-24 md:py-32 relative overflow-x-hidden ${light ? 'bg-[#F4F4F9] text-dark' : 'bg-transparent text-white'} ${className}`}
    >
      <div className="container mx-auto relative z-10">
        {children}
      </div>
    </section>
  );
};

export const SectionTitle: React.FC<{ 
  title: string; 
  subtitle?: string; 
  centered?: boolean;
  lightMode?: boolean; 
}> = ({ title, subtitle, centered = false, lightMode = false }) => {
  return (
    <div className={`mb-16 md:mb-24 ${centered ? 'text-center' : ''}`}>
      {subtitle && (
        <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
            <span className={`h-px w-8 ${lightMode ? 'bg-primary' : 'bg-accent-turquoise'}`}></span>
            <span className={`font-display font-medium text-xs tracking-[0.2em] uppercase ${lightMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {subtitle}
            </span>
        </div>
      )}
      <h2 className={`font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.1] ${lightMode ? 'text-dark' : 'text-white'}`}>
        {title}
      </h2>
    </div>
  );
};