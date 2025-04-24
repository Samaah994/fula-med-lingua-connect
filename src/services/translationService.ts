
import { createClient } from '@supabase/supabase-js';
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
  voice?: string; // Optional voice ID for TTS
}

export interface TextToSpeechResponse {
  audioUrl: string;
}

// Mock translation function - in a real app, this would call an API
export const translateText = async (request: TranslationRequest): Promise<TranslationResponse> => {
  try {
    console.log(`Translating from ${request.source} to ${request.target}: "${request.text}"`);
    
    // Mock delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, this would call a translation API or edge function
    // Mock translation result based on language pair
    const translationPrefix = `[Translated from ${request.source} to ${request.target}] `;
    
    return {
      originalText: request.text,
      translatedText: translationPrefix + request.text,
      source: request.source,
      target: request.target,
      confidence: 0.85,
      model: "mock-model-v1",
    };
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate text');
  }
};

// Mock text-to-speech function - in a real app, this would call a TTS API
export const textToSpeech = async (request: TextToSpeechRequest): Promise<TextToSpeechResponse> => {
  try {
    console.log(`Converting text to speech in ${request.language}: "${request.text}"`);
    
    // Mock delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real implementation, this would call a TTS API or edge function
    // Mock audio URL - in a real app this would be a URL to the audio file
    return {
      audioUrl: "data:audio/mp3;base64,MOCK_AUDIO_DATA",
    };
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
    voiceOptions: ["en-US-Standard-A", "en-US-Standard-B"],
  },
  ff: {
    name: "Fulfulde",
    nativeName: "Fulfulde",
    flag: "🇸🇳", // Using Senegal flag as proxy for Fulfulde
    voiceOptions: ["default"],
  },
  fr: {
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    voiceOptions: ["fr-FR-Standard-A", "fr-FR-Standard-B"],
  },
};
