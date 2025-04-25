import { supabase } from '@/integrations/supabase/client';

// Language codes supported by the translation service
export type LanguageCode = 'en' | 'ff' | 'fr';

// Translation direction types
export type TranslationDirection = 
  | 'en-ff' | 'en-fr' 
  | 'ff-en' | 'ff-fr'
  | 'fr-en' | 'fr-ff';

export interface TranslationRequest {
  text: string;
  source: LanguageCode;
  target: LanguageCode;
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  source: LanguageCode;
  target: LanguageCode;
  confidence?: number;
  model?: string;
}

export interface TextToSpeechRequest {
  text: string;
  language: LanguageCode;
  voice?: string;
}

export interface TextToSpeechResponse {
  audioUrl: string;
}

export const translateText = async (request: TranslationRequest): Promise<TranslationResponse> => {
  try {
    console.log(`Translating from ${request.source} to ${request.target}: "${request.text}"`);
    
    const { data, error } = await supabase.functions.invoke('translate', {
      body: {
        text: request.text,
        source: request.source,
        target: request.target
      }
    });

    if (error) throw error;

    return {
      originalText: request.text,
      translatedText: data.translatedText,
      source: request.source,
      target: request.target,
      confidence: 0.95,
      model: "gpt-4o-mini",
    };
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate text');
  }
};

export const textToSpeech = async (request: TextToSpeechRequest): Promise<TextToSpeechResponse> => {
  try {
    console.log(`Converting text to speech in ${request.language}: "${request.text}"`);
    
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: {
        text: request.text,
        language: request.language,
        voice: request.voice
      }
    });

    if (error) throw error;

    // Create a Blob from the base64 audio data
    const binaryAudio = atob(data.audioContent);
    const arrayBuffer = new ArrayBuffer(binaryAudio.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryAudio.length; i++) {
      view[i] = binaryAudio.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(blob);

    return { audioUrl };
  } catch (error) {
    console.error('Text-to-speech error:', error);
    throw new Error('Failed to convert text to speech');
  }
};

// Language metadata for UI display
export const languageMetadata = {
  en: {
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    voiceOptions: ["nova", "alloy", "echo"],
  },
  ff: {
    name: "Fulfulde",
    nativeName: "Fulfulde",
    flag: "🇸🇳",
    voiceOptions: ["shimmer", "alloy"],
  },
  fr: {
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    voiceOptions: ["alloy", "nova"],
  },
};
