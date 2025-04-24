
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Mic, MicOff, Play, Settings, Volume2, VolumeX, MessageSquare, Volume } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';

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
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [fromLang, setFromLang] = useState<Language>(user?.role === 'doctor' ? 'en' : 'ff');
  const [toLang, setToLang] = useState<Language>(user?.role === 'doctor' ? 'ff' : 'fr');

  const handleTranslate = () => {
    // This is a mock translation - in a real app, you'd call a translation API
    setOutputText(`[Translated from ${fromLang} to ${toLang}] ${inputText}`);
  };

  const languages = [
    { code: 'en' as Language, name: 'English' },
    { code: 'ff' as Language, name: 'Fulfulde' },
    { code: 'fr' as Language, name: 'Français' }
  ];

  return (
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
            <label className="text-sm font-medium mb-2 block">
              {t('inputText')}:
            </label>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('enterTextToTranslate')}
              className="min-h-32 dark:bg-gray-800"
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
              className="min-h-32 dark:bg-gray-800"
            />
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
  const [fromLang, setFromLang] = useState<Language>(user?.role === 'doctor' ? 'en' : 'ff');
  const [toLang, setToLang] = useState<Language>(user?.role === 'doctor' ? 'ff' : 'fr');
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  // Mock media recorder
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const languages = [
    { code: 'en' as Language, name: 'English' },
    { code: 'ff' as Language, name: 'Fulfulde' },
    { code: 'fr' as Language, name: 'Français' }
  ];

  useEffect(() => {
    // Check if microphone permission is already granted
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const hasAudioInput = devices.some(device => device.kind === 'audioinput');
        if (hasAudioInput) {
          // This doesn't actually tell us permission status, just that audio devices exist
          // We'll know for sure when we try to access the microphone
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
        // Mock transcription
        setTimeout(() => {
          const mockText = "This is a sample transcription of speech that would be processed in a real application.";
          setTranscription(mockText);
          
          // Mock translation
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
      
      // Auto-stop after 15 seconds
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
      
      // Stop all audio tracks
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
    // In a real app, this would use text-to-speech API
    toast({
      title: "Playing audio",
      description: "In a real application, this would play the translated audio.",
    });
  };

  return (
    <div className="space-y-6">
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
          
          {/* Microphone Interface */}
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
          
          {/* Recording status indicator */}
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
          
          {/* Transcription Display */}
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
