
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

export interface VoiceRecordingRequest {
  audioBlob: Blob;
  language: LanguageCode;
}

export interface VoiceRecordingResponse {
  text: string;
  confidence?: number;
}

export interface FeedbackRequest {
  translationId?: string;
  originalText: string;
  translatedText: string;
  source: LanguageCode;
  target: LanguageCode;
  rating: 'positive' | 'negative';
  comments?: string;
  userId?: string;
}

export const translateText = async (request: TranslationRequest): Promise<TranslationResponse> => {
  try {
    console.log(`Translating from ${request.source} to ${request.target}: "${request.text}"`);
    
    // Input validation
    if (!request.text || !request.text.trim()) {
      throw new Error('Text to translate cannot be empty');
    }
    
    let direction: string;
    
    // Determine the translation direction
    if (request.source === 'en' && request.target === 'ff') {
      direction = 'en_to_ff';
    } else if (request.source === 'ff' && request.target === 'en') {
      direction = 'ff_to_en';
    } else if (request.source === 'en' && request.target === 'fr') {
      direction = 'en_to_fr';
    } else if (request.source === 'fr' && request.target === 'en') {
      direction = 'fr_to_en';
    } else if (request.source === 'ff' && request.target === 'fr') {
      direction = 'ff_to_fr';
    } else if (request.source === 'fr' && request.target === 'ff') {
      direction = 'fr_to_ff';
    } else {
      throw new Error(`Translation from ${request.source} to ${request.target} is not supported by local models`);
    }
    
    // Call local translation model API
    const response = await fetch('http://localhost:8000/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: request.text,
        direction: direction
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Translation API error: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.translation) {
      throw new Error('No translation returned from server');
    }
    
    return {
      originalText: request.text,
      translatedText: data.translation,
      source: request.source,
      target: request.target,
      model: 'local-nllb',
    };
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate text: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

export const textToSpeech = async (request: TextToSpeechRequest): Promise<TextToSpeechResponse> => {
  try {
    console.log(`Converting text to speech in ${request.language}: "${request.text}"`);
    
    // Input validation
    if (!request.text || !request.text.trim()) {
      throw new Error('Text for speech conversion cannot be empty');
    }
    
    // Placeholder implementation - to be replaced later with local TTS model
    // For now, we'll keep using the Supabase Edge Function as before
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: {
        text: request.text,
        language: request.language,
        voice: request.voice
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }
    
    if (!data || !data.audioContent) {
      console.error('Invalid response from text-to-speech function:', data);
      throw new Error('No audio data returned from server');
    }

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
    throw new Error('Failed to convert text to speech: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

export const processVoiceRecording = async (request: VoiceRecordingRequest): Promise<VoiceRecordingResponse> => {
  try {
    console.log(`Processing voice recording in ${request.language}`);
    
    // Create FormData with audio blob
    const formData = new FormData();
    formData.append('file', request.audioBlob, 'audio.webm');
    formData.append('language', request.language);
    
    // Send to local Whisper STT model API
    const response = await fetch('http://localhost:8001/stt', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Speech-to-text API error: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.text) {
      throw new Error('No transcription returned from server');
    }

    return {
      text: data.text,
      confidence: data.confidence || 0.95
    };
  } catch (error) {
    console.error('Voice processing error:', error);
    throw new Error('Failed to process voice recording: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

// Updated function to submit translation feedback that properly uses the new table
export const submitTranslationFeedback = async (feedback: FeedbackRequest): Promise<void> => {
  try {
    console.log(`Submitting translation feedback for ${feedback.source} to ${feedback.target} translation`);
    
    // Store feedback in Supabase using the correct table name and format
    const { error } = await supabase
      .from('translation_feedback')
      .insert({
        original_text: feedback.originalText,
        translated_text: feedback.translatedText,
        source_language: feedback.source,
        target_language: feedback.target,
        rating: feedback.rating,
        comments: feedback.comments || null,
        user_id: feedback.userId || null,
        translation_id: feedback.translationId || null,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Supabase error submitting feedback:', error);
      throw error;
    }
    
  } catch (error) {
    console.error('Feedback submission error:', error);
    throw new Error('Failed to submit feedback: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

// Enhanced language metadata for UI display with information about model support
export const languageMetadata = {
  en: {
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    voiceOptions: ["nova", "alloy", "echo"],
    sttSupport: "high", // High quality STT support
    ttsSupport: "high", // High quality TTS support
  },
  ff: {
    name: "Fulfulde",
    nativeName: "Fulfulde",
    flag: "🇸🇳",
    voiceOptions: ["shimmer", "alloy"],
    sttSupport: "limited", // Limited STT support
    ttsSupport: "limited", // Limited TTS support
    dataSource: "local-nllb-model" // Source of translation data
  },
  fr: {
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    voiceOptions: ["alloy", "nova"],
    sttSupport: "high", // High quality STT support
    ttsSupport: "high", // High quality TTS support
  },
};
