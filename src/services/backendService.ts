
import { 
  TranslationRequest, 
  TranslationResponse, 
  SpeechToTextRequest, 
  SpeechToTextResponse,
  TextToSpeechRequest,
  TextToSpeechResponse,
  ApiResponse,
  ServiceConfig 
} from '@/types/backend-interfaces';

const config: ServiceConfig = {
  translation: {
    endpoint: '/functions/v1/medical-translation',
    timeout: 10000,
    maxRetries: 3
  },
  voiceProcessing: {
    endpoint: '/functions/v1/voice-processing',
    timeout: 15000,
    maxRetries: 2,
    maxAudioSize: 10 * 1024 * 1024 // 10MB
  }
};

class BackendService {
  private supabaseUrl = 'https://digabfdrnkftuvmivvzk.supabase.co';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ2FiZmRybmtmdHV2bWl2dnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzkwODksImV4cCI6MjA2MDQxNTA4OX0.ntcCmv-0PyIp-ATmRjxiDr9X3a7ce5yYXt9R3spSXTI';

  // Translation Service
  async translateText(request: TranslationRequest): Promise<TranslationResponse> {
    const response = await this.makeRequest(
      `${this.supabaseUrl}${config.translation.endpoint}`,
      request,
      config.translation.timeout
    );

    return response as TranslationResponse;
  }

  // Speech-to-Text Service
  async convertSpeechToText(request: SpeechToTextRequest): Promise<SpeechToTextResponse> {
    // Validate audio size
    if (request.audioData.length > config.voiceProcessing.maxAudioSize) {
      throw new Error('Audio file too large');
    }

    const response = await this.makeRequest(
      `${this.supabaseUrl}${config.voiceProcessing.endpoint}/speech-to-text`,
      request,
      config.voiceProcessing.timeout
    );

    return response as SpeechToTextResponse;
  }

  // Text-to-Speech Service
  async convertTextToSpeech(request: TextToSpeechRequest): Promise<TextToSpeechResponse> {
    const response = await this.makeRequest(
      `${this.supabaseUrl}${config.voiceProcessing.endpoint}/text-to-speech`,
      request,
      config.voiceProcessing.timeout
    );

    return response as TextToSpeechResponse;
  }

  // Generic request handler
  private async makeRequest(
    url: string, 
    data: any, 
    timeout: number
  ): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseKey}`,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        throw new Error(`Request failed: ${error.message}`);
      }
      throw new Error('Request failed: Unknown error');
    }
  }

  // Health check
  async checkServiceHealth(): Promise<{ translation: boolean; voiceProcessing: boolean }> {
    try {
      const [translationHealth, voiceHealth] = await Promise.allSettled([
        this.makeRequest(`${this.supabaseUrl}${config.translation.endpoint}`, { 
          text: 'test', 
          sourceLanguage: 'en', 
          targetLanguage: 'fr' 
        }, 5000),
        this.makeRequest(`${this.supabaseUrl}${config.voiceProcessing.endpoint}/text-to-speech`, { 
          text: 'test', 
          language: 'en' 
        }, 5000)
      ]);

      return {
        translation: translationHealth.status === 'fulfilled',
        voiceProcessing: voiceHealth.status === 'fulfilled'
      };
    } catch {
      return { translation: false, voiceProcessing: false };
    }
  }
}

export const backendService = new BackendService();
export default backendService;
