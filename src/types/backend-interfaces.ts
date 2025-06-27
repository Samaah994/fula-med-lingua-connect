
// Medical Translation Service Types
export interface TranslationRequest {
  text: string;
  sourceLanguage: 'en' | 'fr' | 'ff';
  targetLanguage: 'en' | 'fr' | 'ff';
  context?: 'medical' | 'general';
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  context?: string;
}

// Speech Processing Service Types
export interface SpeechToTextRequest {
  audioData: string; // base64 encoded audio
  language: 'en' | 'fr' | 'ff';
  format: 'wav' | 'mp3' | 'webm';
}

export interface SpeechToTextResponse {
  transcription: string;
  confidence: number;
  language: string;
  duration?: number;
}

export interface TextToSpeechRequest {
  text: string;
  language: 'en' | 'fr' | 'ff';
  voice?: 'male' | 'female';
  speed?: number;
}

export interface TextToSpeechResponse {
  audioData: string; // base64 encoded audio
  format: string;
  duration: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// Language Support
export interface LanguageInfo {
  code: 'en' | 'fr' | 'ff';
  name: string;
  nativeName: string;
  flag: string;
  supported: {
    translation: boolean;
    speechToText: boolean;
    textToSpeech: boolean;
  };
}

// Service Configuration
export interface ServiceConfig {
  translation: {
    endpoint: string;
    timeout: number;
    maxRetries: number;
  };
  voiceProcessing: {
    endpoint: string;
    timeout: number;
    maxRetries: number;
    maxAudioSize: number; // in bytes
  };
}
