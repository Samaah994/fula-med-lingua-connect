
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SpeechProcessingRequest {
  audio: string; // base64 encoded audio
  language: string;
  userId?: string;
}

interface SpeechProcessingResponse {
  transcription: string;
  confidence: number;
  language: string;
  processingTime: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { audio, language, userId }: SpeechProcessingRequest = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    console.log(`Speech processing request for language: ${language}`);

    // Process audio in chunks to handle large files
    const binaryAudio = processBase64Chunks(audio);
    
    // Prepare form data for OpenAI Whisper API
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');
    
    // Map language codes for Whisper
    const whisperLanguage = mapLanguageForWhisper(language);
    if (whisperLanguage) {
      formData.append('language', whisperLanguage);
    }

    // Send to OpenAI Whisper
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const result = await response.json();
    const processingTime = Date.now() - startTime;

    const speechResponse: SpeechProcessingResponse = {
      transcription: result.text || '',
      confidence: 0.9, // Whisper doesn't provide confidence scores
      language: language,
      processingTime
    };

    console.log(`Speech processing completed in ${processingTime}ms: "${result.text}"`);

    return new Response(JSON.stringify(speechResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Speech processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function processBase64Chunks(base64String: string, chunkSize = 32768): Uint8Array {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

function mapLanguageForWhisper(language: string): string | null {
  const languageMap: Record<string, string> = {
    'en': 'en',
    'fr': 'fr',
    'ff': 'en' // Fallback to English for Fulfulde
  };
  
  return languageMap[language] || null;
}
