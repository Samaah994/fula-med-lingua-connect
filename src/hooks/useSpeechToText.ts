
import { useState, useRef } from 'react';
import { startSpeechRecognition, stopSpeechRecognition, STTResponse } from '@/services/speechToTextService';

export const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = (
    language: string,
    onResult: (result: STTResponse) => void
  ) => {
    if (isListening) {
      stop();
      return;
    }

    setError(null);
    setIsListening(true);
    
    console.log('Starting STT for language:', language);
    
    const recognition = startSpeechRecognition(
      language,
      (result) => {
        onResult(result);
        setIsListening(false);
      },
      (error) => {
        setError(error);
        setIsListening(false);
        console.error('STT Hook Error:', error);
      }
    );
    
    if (recognition) {
      recognitionRef.current = recognition;
      recognition.start();
    } else {
      setIsListening(false);
      setError('Speech recognition not supported');
    }
  };

  const stop = () => {
    if (recognitionRef.current) {
      stopSpeechRecognition(recognitionRef.current);
      recognitionRef.current = null;
    }
    setIsListening(false);
    setError(null);
  };

  return {
    startListening,
    stop,
    isListening,
    error
  };
};
