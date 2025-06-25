
import { useState, useRef } from 'react';
import { startSpeechRecognition, stopSpeechRecognition, STTResponse } from '@/services/speechToTextService';

export const useSpeechToTextEnhanced = () => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Monitor online/offline status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const startListening = (
    language: string,
    onResult: (result: STTResponse) => void
  ) => {
    // Check if online
    if (!isOnline) {
      setError('Speech recognition requires an internet connection. Please check your connection and try again.');
      return;
    }

    if (isListening) {
      stop();
      return;
    }

    setError(null);
    setIsListening(true);
    
    console.log('Starting enhanced STT for language:', language);
    
    const recognition = startSpeechRecognition(
      language,
      (result) => {
        onResult(result);
        setIsListening(false);
      },
      (error) => {
        let errorMessage = error;
        
        // Provide more helpful error messages
        if (error.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.includes('not-allowed')) {
          errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
        } else if (error.includes('no-speech')) {
          errorMessage = 'No speech detected. Please try speaking again.';
        }
        
        setError(errorMessage);
        setIsListening(false);
        console.error('Enhanced STT Error:', errorMessage);
      }
    );
    
    if (recognition) {
      recognitionRef.current = recognition;
      recognition.start();
    } else {
      setIsListening(false);
      setError('Speech recognition not supported in this browser');
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
    error,
    isOnline
  };
};
