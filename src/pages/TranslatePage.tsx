
import React, { useState } from 'react';
import { ArrowRight, Mic, MicOff, Volume2, VolumeX, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

// Simple language options
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ff', name: 'Fulfulde', flag: '🇸🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

const TranslatePage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <DashboardLayout title={t('translate')}>
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="mb-6 w-full grid grid-cols-2">
          <TabsTrigger value="text">
            <MessageSquare className="w-4 h-4 mr-2" />
            {t('textTranslation')}
          </TabsTrigger>
          <TabsTrigger value="voice">
            <Mic className="w-4 h-4 mr-2" />
            {t('voiceTranslation')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <TextTranslation />
        </TabsContent>
        <TabsContent value="voice">
          <VoiceTranslation />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

const TextTranslation: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useUser();
  const { toast } = useToast();
  const { speak, stop, isPlaying, error } = useTextToSpeech();
  
  // Simple state management
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [fromLang, setFromLang] = useState(user?.role === 'doctor' ? 'en' : 'ff');
  const [toLang, setToLang] = useState(user?.role === 'doctor' ? 'ff' : 'fr');
  const [isTranslating, setIsTranslating] = useState(false);

  // Simple translation function - you can replace this with your model
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter text to translate",
      });
      return;
    }

    setIsTranslating(true);
    console.log(`Translating from ${fromLang} to ${toLang}: "${inputText}"`);
    
    try {
      // TODO: Replace this with your translation model API call
      // For now, using a simple placeholder
      const response = await fetch('http://localhost:8000/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          direction: `${fromLang}_to_${toLang}`
        }),
      });
      
      if (!response.ok) {
        throw new Error('Translation failed');
      }
      
      const data = await response.json();
      setOutputText(data.translation || 'Translation not available');
      
      toast({
        title: "Success",
        description: "Text translated successfully",
      });
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback for demo
      setOutputText(`[Translated from ${fromLang} to ${toLang}]: ${inputText}`);
    } finally {
      setIsTranslating(false);
    }
  };

  // Simple TTS function
  const handlePlayAudio = async () => {
    if (!outputText.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No text to speak",
      });
      return;
    }
    
    if (isPlaying) {
      stop();
    } else {
      await speak(outputText, toLang);
      if (error) {
        toast({
          variant: "destructive",
          title: "Speech Error",
          description: error,
        });
      }
    }
  };

  return (
    <Card className="bg-card">
      <CardContent className="pt-6 space-y-4">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">{t('medicalTranslation')}</h2>
          <p className="text-muted-foreground">{t('translateMedicalConversations')}</p>
        </div>
        
        {/* Language Selection */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-5/12">
            <label className="text-sm font-medium mb-2 block">{t('from')}:</label>
            <Select value={fromLang} onValueChange={setFromLang}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="self-center">
            <ArrowRight className="w-6 h-6" />
          </div>
          
          <div className="w-full md:w-5/12">
            <label className="text-sm font-medium mb-2 block">{t('to')}:</label>
            <Select value={toLang} onValueChange={setToLang}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Input Text */}
        <div>
          <label className="text-sm font-medium mb-2 block">{t('inputText')}:</label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('enterTextToTranslate')}
            className="min-h-32"
          />
        </div>
        
        {/* Translate Button */}
        <Button 
          onClick={handleTranslate} 
          className="w-full" 
          disabled={isTranslating || !inputText.trim()}
        >
          {isTranslating ? 'Translating...' : t('translate')}
        </Button>
        
        {/* Output Text */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">{t('translationResult')}:</label>
            {outputText && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePlayAudio}
                disabled={!outputText.trim()}
              >
                {isPlaying ? (
                  <VolumeX className="h-4 w-4 mr-2" />
                ) : (
                  <Volume2 className="h-4 w-4 mr-2" />
                )}
                {isPlaying ? 'Stop' : 'Play'}
              </Button>
            )}
          </div>
          <Textarea
            value={outputText}
            readOnly
            placeholder={t('translationWillAppearHere')}
            className="min-h-32"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const VoiceTranslation: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <Mic className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Voice Translation</h3>
          <p className="text-muted-foreground">Voice translation will be implemented in the next phase</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslatePage;
