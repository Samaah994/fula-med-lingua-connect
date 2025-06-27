
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Translation service interface
interface TranslationRequest {
  text: string;
  sourceLanguage: 'en' | 'fr' | 'ff';
  targetLanguage: 'en' | 'fr' | 'ff';
  context?: 'medical' | 'general';
}

interface TranslationResponse {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  context?: string;
}

// Simple translation function - replace with your preferred translation service
function translateText(request: TranslationRequest): TranslationResponse {
  console.log('Translation request:', request);
  
  // Mock translation logic - replace with your actual translation service
  const translations: Record<string, Record<string, string>> = {
    'en_to_fr': {
      'hello': 'bonjour',
      'goodbye': 'au revoir',
      'thank you': 'merci',
      'please': 's\'il vous plaît'
    },
    'en_to_ff': {
      'hello': 'jam',
      'goodbye': 'sellam',
      'thank you': 'jaaraama',
      'please': 'mujangel'
    },
    'fr_to_en': {
      'bonjour': 'hello',
      'au revoir': 'goodbye',
      'merci': 'thank you',
      's\'il vous plaît': 'please'
    }
  };

  const translationKey = `${request.sourceLanguage}_to_${request.targetLanguage}`;
  const translationMap = translations[translationKey] || {};
  
  // Simple word-by-word translation for demo
  const words = request.text.toLowerCase().split(' ');
  const translatedWords = words.map(word => translationMap[word] || word);
  const translatedText = translatedWords.join(' ');

  return {
    originalText: request.text,
    translatedText: translatedText || `[${request.targetLanguage}] ${request.text}`,
    sourceLanguage: request.sourceLanguage,
    targetLanguage: request.targetLanguage,
    confidence: 0.8,
    context: request.context
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    const request: TranslationRequest = await req.json();
    
    // Validate request
    if (!request.text || !request.sourceLanguage || !request.targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: text, sourceLanguage, targetLanguage' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const result = translateText(request);
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: 'Translation failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
