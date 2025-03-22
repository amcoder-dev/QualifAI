import React from 'react';
import logoImage from '../../assets/logo.png';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src={logoImage} 
        alt="QualifAI Logo" 
        className="h-30 w-auto"
      />
    </div>
  );
};