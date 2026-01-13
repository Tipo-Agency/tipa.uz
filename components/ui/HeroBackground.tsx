import React from 'react';

export const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dark fade overlay - slightly reduced opacity to show grid better */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-transparent to-dark z-10"></div>
      
      {/* Perspective Grid */}
      <div className="absolute inset-0 z-0 opacity-30 perspective-grid">
        <div className="grid-lines"></div>
      </div>
      
      {/* 3D Geometric Floating Shapes - Reduced count for cleaner look */}
      <div className="absolute top-20 right-[10%] w-64 h-64 border border-primary/20 rotate-12 animate-float z-0 opacity-20"></div>
      
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-glow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-turquoise/10 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};