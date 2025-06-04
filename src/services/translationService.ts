
// Simplified translation service for easy debugging and maintenance

export type LanguageCode = 'en' | 'ff' | 'fr';

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
}

// Feedback interfaces
export interface FeedbackRequest {
  originalText: string;
  translatedText: string;
  source: LanguageCode;
  target: LanguageCode;
  rating: 'positive' | 'negative';
  comments?: string;
  userId?: string;
  translationId?: string;
}

// Simple translation function - replace with your model
export const translateText = async (request: TranslationRequest): Promise<TranslationResponse> => {
  console.log(`Translating from ${request.source} to ${request.target}: "${request.text}"`);
  
  if (!request.text?.trim()) {
    throw new Error('Text to translate cannot be empty');
  }
  
  try {
    // Determine direction for your model
    const direction = `${request.source}_to_${request.target}`;
    
    // Call your local translation model
    const response = await fetch('http://localhost:8000/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: request.text,
        direction: direction
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data?.translation) {
      throw new Error('No translation returned from server');
    }
    
    return {
      originalText: request.text,
      translatedText: data.translation,
      source: request.source,
      target: request.target,
    };
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Simple feedback submission - replace with your backend
export const submitTranslationFeedback = async (feedback: FeedbackRequest): Promise<void> => {
  console.log('Submitting feedback:', feedback);
  
  try {
    // Replace with your feedback API endpoint
    const response = await fetch('http://localhost:8000/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });
    
    if (!response.ok) {
      throw new Error(`Feedback submission failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Feedback submission error:', error);
    // Don't throw error - feedback is optional
  }
};

// Language metadata for UI
export const languageMetadata = {
  en: { name: "English", nativeName: "English", flag: "🇬🇧" },
  ff: { name: "Fulfulde", nativeName: "Fulfulde", flag: "🇸🇳" },
  fr: { name: "French", nativeName: "Français", flag: "🇫🇷" },
};
