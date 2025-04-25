
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, source, target } = await req.json()
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    console.log(`Translating from ${source} to ${target}: "${text}"`)

    const systemPrompt = `You are a professional translator specialized in medical terminology and healthcare communication. 
    You are fluent in English (en), French (fr), and Fulfulde (ff). 
    Translate the text accurately while preserving medical meaning and cultural context.
    If translating to Fulfulde, ensure proper use of medical terminology in Fulfulde.
    Respond ONLY with the translation, no explanations or additional text.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Translate this text from ${source} to ${target}: "${text}"`
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent translations
      }),
    })

    const data = await response.json()
    const translatedText = data.choices[0].message.content.trim()

    return new Response(
      JSON.stringify({ translatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Translation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
