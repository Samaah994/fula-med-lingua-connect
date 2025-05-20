
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

// Simplified Logo component
const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const { t } = useLanguage();
  
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-10 w-10',
  };
  
  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`rounded-full bg-primary flex items-center justify-center text-white font-bold ${sizeClasses[size]}`}>
        <span>F</span>
      </div>
      <span className={`font-bold text-primary ${textSizes[size]}`}>{t('appName')}</span>
    </div>
  );
};

export default React.memo(Logo);
