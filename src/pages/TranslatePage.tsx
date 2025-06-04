
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
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { translateText } from '@/services/translationService';

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
  const { startListening, stop: stopListening, isListening, error: sttError } = useSpeechToText();
  
  // Simple state management
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [fromLang, setFromLang] = useState(user?.role === 'doctor' ? 'en' : 'ff');
  const [toLang, setToLang] = useState(user?.role === 'doctor' ? 'ff' : 'fr');
  const [isTranslating, setIsTranslating] = useState(false);

  // Simple translation function
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
      const result = await translateText({
        text: inputText,
        source: fromLang as any,
        target: toLang as any
      });
      
      setOutputText(result.translatedText);
      
      toast({
        title: "Success",
        description: "Text translated successfully",
      });
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback for demo
      setOutputText(`[Translated from ${fromLang} to ${toLang}]: ${inputText}`);
      
      toast({
        variant: "destructive",
        title: "Translation Error",
        description: "Using fallback translation for demo",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  // Text-to-speech function
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

  // Speech-to-text function
  const handleSpeechToText = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(fromLang, (result) => {
        setInputText(result.text);
        toast({
          title: "Speech Recognition",
          description: `Captured: "${result.text}"`,
        });
      });
      
      if (sttError) {
        toast({
          variant: "destructive",
          title: "Speech Recognition Error",
          description: sttError,
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
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">{t('inputText')}:</label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSpeechToText}
              className={isListening ? 'bg-red-100 text-red-700' : ''}
            >
              {isListening ? (
                <MicOff className="h-4 w-4 mr-2" />
              ) : (
                <Mic className="h-4 w-4 mr-2" />
              )}
              {isListening ? 'Stop' : 'Speak'}
            </Button>
          </div>
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
  const { user } = useUser();
  const { toast } = useToast();
  const { speak, stop, isPlaying } = useTextToSpeech();
  const { startListening, stop: stopListening, isListening } = useSpeechToText();
  
  const [fromLang, setFromLang] = useState(user?.role === 'doctor' ? 'en' : 'ff');
  const [toLang, setToLang] = useState(user?.role === 'doctor' ? 'ff' : 'fr');
  const [recognizedText, setRecognizedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const handleVoiceTranslation = async () => {
    if (isListening) {
      stopListening();
      return;
    }

    startListening(fromLang, async (result) => {
      setRecognizedText(result.text);
      
      try {
        const translation = await translateText({
          text: result.text,
          source: fromLang as any,
          target: toLang as any
        });
        
        setTranslatedText(translation.translatedText);
        
        // Automatically speak the translation
        await speak(translation.translatedText, toLang);
        
        toast({
          title: "Voice Translation Complete",
          description: `"${result.text}" → "${translation.translatedText}"`,
        });
      } catch (error) {
        console.error('Voice translation error:', error);
        const fallback = `[Translated from ${fromLang} to ${toLang}]: ${result.text}`;
        setTranslatedText(fallback);
        await speak(fallback, toLang);
      }
    });
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {/* Language Selection */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
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

        {/* Voice Translation Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleVoiceTranslation}
            className={`w-32 h-32 rounded-full ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isListening ? (
              <MicOff className="h-12 w-12" />
            ) : (
              <Mic className="h-12 w-12" />
            )}
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            {isListening ? 'Listening... Tap to stop' : 'Tap to start voice translation'}
          </p>
        </div>

        {/* Results */}
        {recognizedText && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Recognized Speech:</label>
              <div className="p-3 bg-muted rounded-md">
                {recognizedText}
              </div>
            </div>
            
            {translatedText && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Translation:</label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => speak(translatedText, toLang)}
                    disabled={isPlaying}
                  >
                    {isPlaying ? (
                      <VolumeX className="h-4 w-4 mr-2" />
                    ) : (
                      <Volume2 className="h-4 w-4 mr-2" />
                    )}
                    Play
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  {translatedText}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TranslatePage;
