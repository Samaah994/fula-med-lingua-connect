import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Mic, MicOff, Play, Settings, Volume2, VolumeX, MessageSquare, Volume } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { 
  translateText, 
  textToSpeech, 
  languageMetadata, 
  LanguageCode,
  TranslationRequest 
} from '@/services/translationService';
import { useMutation } from '@tanstack/react-query';
import TranslationInfo from '@/components/TranslationInfo';

const TranslatePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const { user } = useUser();
  
  return (
    <DashboardLayout title={t('translate')}>
      <Tabs defaultValue="text">
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
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [fromLang, setFromLang] = useState<LanguageCode>(user?.role === 'doctor' ? 'en' : 'ff');
  const [toLang, setToLang] = useState<LanguageCode>(user?.role === 'doctor' ? 'ff' : 'fr');

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const translateMutation = useMutation({
    mutationFn: translateText,
    onSuccess: (data) => {
      setOutputText(data.translatedText);
      toast({
        title: "Translation complete",
        description: `Translated from ${languageMetadata[data.source].name} to ${languageMetadata[data.target].name}`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Translation failed",
        description: error.message,
      });
    }
  });

  const ttsMutation = useMutation({
    mutationFn: textToSpeech,
    onSuccess: (data) => {
      if (audioRef.current) {
        audioRef.current.src = data.audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Text-to-speech failed",
        description: error.message,
      });
    }
  });

  const handleTranslate = () => {
    if (!inputText.trim()) {
      toast({
        variant: "destructive",
        title: "Empty input",
        description: "Please enter text to translate",
      });
      return;
    }

    translateMutation.mutate({
      text: inputText,
      source: fromLang,
      target: toLang
    });
  };

  const handlePlayAudio = () => {
    if (!outputText.trim()) return;
    
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }
    
    ttsMutation.mutate({
      text: outputText,
      language: toLang
    });
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.onended = null;
      }
    };
  }, []);

  const languages = Object.entries(languageMetadata).map(([code, data]) => ({
    code: code as LanguageCode,
    name: `${data.flag} ${data.name} (${data.nativeName})`
  }));

  return (
    <Card className="bg-card">
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Medical Translation</h2>
            <TranslationInfo sourceLang={fromLang} targetLang={toLang} />
          </div>
          <p className="text-muted-foreground">
            Translate medical conversations between English, French, and Fulfulde with high accuracy.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-5/12">
              <label className="text-sm font-medium mb-2 block">
                {t('from')}:
              </label>
              <Select
                value={fromLang}
                onValueChange={(value: LanguageCode) => {
                  setFromLang(value);
                  if (value === toLang) {
                    const otherLangs = ['en', 'ff', 'fr'].filter(l => l !== value) as LanguageCode[];
                    setToLang(otherLangs[0]);
                  }
                }}
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
            
            <div className="self-center hidden md:block">
              <ArrowRight className="w-6 h-6" />
            </div>
            
            <div className="w-full md:w-5/12">
              <label className="text-sm font-medium mb-2 block">
                {t('to')}:
              </label>
              <Select
                value={toLang}
                onValueChange={(value: LanguageCode) => {
                  setToLang(value);
                  if (value === fromLang) {
                    const otherLangs = ['en', 'ff', 'fr'].filter(l => l !== value) as LanguageCode[];
                    setFromLang(otherLangs[0]);
                  }
                }}
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
              <label className="text-sm font-medium mb-2 block">
                {t('inputText')}:
              </label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t('enterTextToTranslate')}
                className="min-h-32"
              />
            </div>
            
            <Button 
              onClick={handleTranslate} 
              className="w-full" 
              disabled={translateMutation.isPending || !inputText.trim()}>
              {translateMutation.isPending ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  {t('translating')}...
                </>
              ) : t('translate')}
            </Button>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">
                  {t('translationResult')}:
                </label>
                {outputText && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePlayAudio}
                    disabled={ttsMutation.isPending}>
                    {isPlaying ? (
                      <VolumeX className="h-4 w-4 mr-2" />
                    ) : (
                      <Volume2 className="h-4 w-4 mr-2" />
                    )}
                    {isPlaying ? t('stopAudio') : t('playAudio')}
                  </Button>
                )}
              </div>
              <Textarea
                value={outputText}
                readOnly
                placeholder={t('translationWillAppearHere')}
                className="min-h-32"
              />
              <audio ref={audioRef} className="hidden" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const VoiceTranslation: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useUser();
  const { toast } = useToast();
  
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [translation, setTranslation] = useState('');
  const [fromLang, setFromLang] = useState<LanguageCode>(user?.role === 'doctor' ? 'en' : 'ff');
  const [toLang, setToLang] = useState<LanguageCode>(user?.role === 'doctor' ? 'ff' : 'fr');
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const languages = [
    { code: 'en' as LanguageCode, name: 'English' },
    { code: 'ff' as LanguageCode, name: 'Fulfulde' },
    { code: 'fr' as LanguageCode, name: 'Français' }
  ];

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const hasAudioInput = devices.some(device => device.kind === 'audioinput');
        if (hasAudioInput) {
          setMicPermission('granted');
        }
      })
      .catch(err => {
        console.error("Error querying media devices:", err);
      });
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission('granted');
      
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        setTimeout(() => {
          const mockText = "This is a sample transcription of speech that would be processed in a real application.";
          setTranscription(mockText);
          
          setTimeout(() => {
            setTranslation(`[Translated from ${fromLang} to ${toLang}] ${mockText}`);
          }, 500);
        }, 1000);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak now. Recording will automatically stop after 15 seconds if not stopped manually.",
      });
      
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 15000);
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setMicPermission('denied');
      toast({
        variant: "destructive",
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice translation.",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      toast({
        title: "Recording stopped",
        description: "Processing your speech...",
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playTranslation = () => {
    toast({
      title: "Playing audio",
      description: "In a real application, this would play the translated audio.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Voice Translation</h2>
            <p className="text-muted-foreground">
              Speak naturally and get instant translations in your preferred language.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                {t('from')}:
              </label>
              <Select
                value={fromLang}
                onValueChange={(value: LanguageCode) => setFromLang(value)}
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
                onValueChange={(value: LanguageCode) => setToLang(value)}
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
          
          <div className="mb-6 flex justify-center">
            <Button
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              className="h-24 w-24 rounded-full"
              onClick={toggleRecording}
            >
              {isRecording ? (
                <MicOff className="h-10 w-10" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
            </Button>
          </div>
          
          <div className="text-center mb-6">
            {isRecording ? (
              <div className="flex flex-col items-center">
                <div className="flex space-x-1 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150"></div>
                </div>
                <p className="text-sm text-red-500">{t('recording')}...</p>
              </div>
            ) : micPermission === 'denied' ? (
              <p className="text-sm text-destructive">{t('microphoneAccessDenied')}</p>
            ) : (
              <p className="text-sm text-muted-foreground">{t('tapToStartRecording')}</p>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('transcription')}:
              </label>
              <Textarea
                value={transcription}
                readOnly
                placeholder={t('speechWillAppearHere')}
                className="min-h-24 dark:bg-gray-800"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">
                  {t('translationResult')}:
                </label>
                {translation && (
                  <Button variant="outline" size="sm" onClick={playTranslation}>
                    <Volume2 className="h-4 w-4 mr-2" />
                    {t('playAudio')}
                  </Button>
                )}
              </div>
              <Textarea
                value={translation}
                readOnly
                placeholder={t('translationWillAppearHere')}
                className="min-h-24 dark:bg-gray-800"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslatePage;
