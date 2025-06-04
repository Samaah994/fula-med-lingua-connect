
// Simple speech-to-text service using browser API
export interface STTRequest {
  language: string;
}

export interface STTResponse {
  text: string;
  confidence: number;
}

export const startSpeechRecognition = (
  language: string,
  onResult: (result: STTResponse) => void,
  onError: (error: string) => void
): SpeechRecognition | null => {
  
  // Check if browser supports speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    onError('Speech recognition not supported in this browser');
    return null;
  }

  const recognition = new SpeechRecognition();
  
  // Set language based on request
  const languageMap: Record<string, string> = {
    'en': 'en-US',
    'fr': 'fr-FR',
    'ff': 'en-US' // Fallback to English for Fulfulde
  };
  
  recognition.lang = languageMap[language] || 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  recognition.onstart = () => {
    console.log('STT: Speech recognition started');
  };
  
  recognition.onresult = (event) => {
    const result = event.results[0][0];
    console.log('STT: Recognition result:', result.transcript);
    
    onResult({
      text: result.transcript,
      confidence: result.confidence || 0.9
    });
  };
  
  recognition.onerror = (event) => {
    console.error('STT: Recognition error:', event.error);
    onError(`Speech recognition error: ${event.error}`);
  };
  
  recognition.onend = () => {
    console.log('STT: Speech recognition ended');
  };
  
  return recognition;
};

// Stop speech recognition
export const stopSpeechRecognition = (recognition: SpeechRecognition | null) => {
  if (recognition) {
    recognition.stop();
    console.log('STT: Speech recognition stopped');
  }
};
