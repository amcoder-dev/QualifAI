// src/components/layout/Background.tsx
import React from 'react';

interface BackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const Background: React.FC<BackgroundProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-[#F2EFFF] ${className}`}>
      {children}
    </div>
  );
};