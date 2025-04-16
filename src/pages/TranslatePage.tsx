
import React, { useState } from 'react';
import { ArrowRight, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';

const TranslatePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useUser();
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [fromLang, setFromLang] = useState<Language>(user?.role === 'doctor' ? 'en' : 'ff');
  const [toLang, setToLang] = useState<Language>(user?.role === 'doctor' ? 'ff' : 'fr');
  const [isRecording, setIsRecording] = useState(false);

  const handleTranslate = () => {
    // This is a mock translation - in a real app, you'd call a translation API
    setOutputText(`[Translated from ${fromLang} to ${toLang}] ${inputText}`);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      // In a real app, here you'd stop recording and process the voice input
      setInputText('This is a sample transcription from voice input.');
    } else {
      // Start recording logic would go here
    }
  };

  const languages = [
    { code: 'en' as Language, name: 'English' },
    { code: 'ff' as Language, name: 'Fulfulde' },
    { code: 'fr' as Language, name: 'Français' }
  ];

  return (
    <DashboardLayout title={t('translate')}>
      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  {t('from')}:
                </label>
                <Select
                  value={fromLang}
                  onValueChange={(value: Language) => setFromLang(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="self-center">
                <ArrowRight className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  {t('to')}:
                </label>
                <Select
                  value={toLang}
                  onValueChange={(value: Language) => setToLang(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">
                    {t('inputText')}:
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleRecording}
                    className={isRecording ? "text-red-500" : ""}
                  >
                    {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                    {isRecording ? t('stopRecording') : t('startRecording')}
                  </Button>
                </div>
                
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('enterTextToTranslate')}
                  className="min-h-32"
                />
              </div>
              
              <Button onClick={handleTranslate} className="w-full">
                {t('translate')}
              </Button>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('translationResult')}:
                </label>
                <Textarea
                  value={outputText}
                  readOnly
                  placeholder={t('translationWillAppearHere')}
                  className="min-h-32"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TranslatePage;
