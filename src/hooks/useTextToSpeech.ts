
import { useState } from 'react';
import { convertTextToSpeech, stopSpeech, TTSRequest } from '@/services/textToSpeechService';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speak = async (text: string, language: string) => {
    if (!text.trim()) {
      setError('No text to speak');
      return;
    }

    try {
      setError(null);
      setIsPlaying(true);
      console.log('Starting TTS for:', text);
      
      const request: TTSRequest = { text, language };
      await convertTextToSpeech(request);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Speech failed';
      setError(errorMessage);
      console.error('TTS Hook Error:', errorMessage);
    } finally {
      setIsPlaying(false);
    }
  };

  const stop = () => {
    stopSpeech();
    setIsPlaying(false);
    setError(null);
  };

  return {
    speak,
    stop,
    isPlaying,
    error
  };
};
