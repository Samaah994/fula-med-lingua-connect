
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const { t } = useLanguage();
  
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
  };
  
  const textSizes = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`rounded-full bg-primary flex items-center justify-center text-white font-bold ${sizeClasses[size]}`}>
        <span>FM</span>
      </div>
      <span className={`font-bold text-primary ${textSizes[size]}`}>FulaMed</span>
    </div>
  );
};

export default Logo;
