
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface TranslationRequest {
  text: string;
  source: string;
  target: string;
  userId?: string;
}

interface TranslationResponse {
  translatedText: string;
  confidence: number;
  processingTime: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    const { text, source, target, userId }: TranslationRequest = await req.json();

    if (!text || !source || !target) {
      throw new Error('Missing required fields: text, source, target');
    }

    console.log(`Translation request: ${source} -> ${target}, Text: "${text}"`);

    // For now, we'll implement a simple rule-based translation system
    // In production, you could integrate with external translation APIs
    let translatedText = await performTranslation(text, source, target);
    
    const processingTime = Date.now() - startTime;
    const confidence = calculateConfidence(text, source, target);

    // Store translation in database if userId is provided
    if (userId) {
      await storeTranslation({
        userId,
        originalText: text,
        translatedText,
        sourceLanguage: source,
        targetLanguage: target,
        confidence,
        processingTime
      });
    }

    const response: TranslationResponse = {
      translatedText,
      confidence,
      processingTime
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function performTranslation(text: string, source: string, target: string): Promise<string> {
  // Basic translation logic - in production, integrate with translation APIs
  const translations: Record<string, Record<string, Record<string, string>>> = {
    'en': {
      'ff': {
        'hello': 'jam',
        'goodbye': 'ko yaa',
        'thank you': 'a jaarama',
        'please': 'tii',
        'yes': 'eey',
        'no': 'alaa',
        'doctor': 'doktor',
        'patient': 'njiɗmaaku',
        'medicine': 'lekki',
        'pain': 'hendu',
        'sick': 'marudo',
        'hospital': 'hopital'
      },
      'fr': {
        'hello': 'bonjour',
        'goodbye': 'au revoir',
        'thank you': 'merci',
        'please': 's\'il vous plaît',
        'yes': 'oui',
        'no': 'non',
        'doctor': 'médecin',
        'patient': 'patient',
        'medicine': 'médicament',
        'pain': 'douleur',
        'sick': 'malade',
        'hospital': 'hôpital'
      }
    },
    'ff': {
      'en': {
        'jam': 'hello',
        'ko yaa': 'goodbye',
        'a jaarama': 'thank you',
        'tii': 'please',
        'eey': 'yes',
        'alaa': 'no',
        'doktor': 'doctor',
        'njiɗmaaku': 'patient',
        'lekki': 'medicine',
        'hendu': 'pain',
        'marudo': 'sick',
        'hopital': 'hospital'
      },
      'fr': {
        'jam': 'bonjour',
        'ko yaa': 'au revoir',
        'a jaarama': 'merci',
        'tii': 's\'il vous plaît',
        'eey': 'oui',
        'alaa': 'non',
        'doktor': 'médecin',
        'njiɗmaaku': 'patient',
        'lekki': 'médicament',
        'hendu': 'douleur',
        'marudo': 'malade',
        'hopital': 'hôpital'
      }
    },
    'fr': {
      'en': {
        'bonjour': 'hello',
        'au revoir': 'goodbye',
        'merci': 'thank you',
        's\'il vous plaît': 'please',
        'oui': 'yes',
        'non': 'no',
        'médecin': 'doctor',
        'patient': 'patient',
        'médicament': 'medicine',
        'douleur': 'pain',
        'malade': 'sick',
        'hôpital': 'hospital'
      },
      'ff': {
        'bonjour': 'jam',
        'au revoir': 'ko yaa',
        'merci': 'a jaarama',
        's\'il vous plaît': 'tii',
        'oui': 'eey',
        'non': 'alaa',
        'médecin': 'doktor',
        'patient': 'njiɗmaaku',
        'médicament': 'lekki',
        'douleur': 'hendu',
        'malade': 'marudo',
        'hôpital': 'hopital'
      }
    }
  };

  const lowerText = text.toLowerCase().trim();
  
  // Check for exact matches first
  if (translations[source]?.[target]?.[lowerText]) {
    return translations[source][target][lowerText];
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(translations[source]?.[target] || {})) {
    if (lowerText.includes(key) || key.includes(lowerText)) {
      return value;
    }
  }

  // Fallback - return formatted translation
  return `[Translated from ${source} to ${target}]: ${text}`;
}

function calculateConfidence(text: string, source: string, target: string): number {
  // Simple confidence calculation based on text length and language pair
  const baseConfidence = 0.8;
  const lengthFactor = Math.min(text.length / 100, 1) * 0.1;
  
  // Higher confidence for supported language pairs
  const supportedPairs = ['en-ff', 'ff-en', 'en-fr', 'fr-en', 'ff-fr', 'fr-ff'];
  const pairBonus = supportedPairs.includes(`${source}-${target}`) ? 0.1 : 0;
  
  return Math.min(baseConfidence + lengthFactor + pairBonus, 1.0);
}

async function storeTranslation(data: {
  userId: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  processingTime: number;
}) {
  try {
    const { error } = await supabase
      .from('translation_messages')
      .insert([
        {
          sender_id: data.userId,
          original_text: data.originalText,
          translated_text: data.translatedText,
          original_language: data.sourceLanguage,
          target_language: data.targetLanguage
        }
      ]);

    if (error) {
      console.error('Error storing translation:', error);
    }
  } catch (error) {
    console.error('Database error:', error);
  }
}
