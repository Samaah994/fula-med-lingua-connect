
// Simple text-to-speech service for easy debugging
export interface TTSRequest {
  text: string;
  language: string;
}

export interface TTSResponse {
  audioUrl: string;
}

export const convertTextToSpeech = async (request: TTSRequest): Promise<TTSResponse> => {
  console.log(`TTS: Converting text in ${request.language}: "${request.text}"`);
  
  try {
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
      return await browserTextToSpeech(request);
    } else {
      throw new Error('Text-to-speech not supported in this browser');
    }
  } catch (error) {
    console.error('TTS Error:', error);
    throw new Error(`Text-to-speech failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Browser-based text-to-speech implementation
const browserTextToSpeech = async (request: TTSRequest): Promise<TTSResponse> => {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(request.text);
    
    // Set language based on request
    const languageMap: Record<string, string> = {
      'en': 'en-US',
      'fr': 'fr-FR',
      'ff': 'en-US' // Fallback to English for Fulfulde
    };
    
    utterance.lang = languageMap[request.language] || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => {
      console.log('TTS: Speech started');
    };
    
    utterance.onend = () => {
      console.log('TTS: Speech ended');
      // Return a dummy URL since we're using browser synthesis
      resolve({ audioUrl: 'browser-synthesis' });
    };
    
    utterance.onerror = (event) => {
      console.error('TTS: Speech error:', event.error);
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
  });
};

// Stop any ongoing speech
export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    console.log('TTS: Speech stopped');
  }
};
