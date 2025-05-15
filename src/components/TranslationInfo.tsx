
import React from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useLanguage } from '@/contexts/LanguageContext';
import { languageMetadata } from '@/services/translationService';

interface TranslationInfoProps {
  sourceLang: string;
  targetLang: string;
}

const TranslationInfo: React.FC<TranslationInfoProps> = ({ sourceLang, targetLang }) => {
  const { t } = useLanguage();
  
  const source = languageMetadata[sourceLang as keyof typeof languageMetadata];
  const target = languageMetadata[targetLang as keyof typeof languageMetadata];
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <Info className="h-4 w-4" />
          <span className="sr-only">Translation Information</span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{t('translationInfo')}</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs font-medium">{source.name} {source.flag}</p>
            </div>
            <div>
              <p className="text-xs font-medium">{target.name} {target.flag}</p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default TranslationInfo;
