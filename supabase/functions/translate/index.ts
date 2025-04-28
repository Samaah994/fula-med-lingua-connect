
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Fulfulde seed phrases from openlanguagedata/oldi_seed dataset
const fulaSeedPhrases = {
  // Medical terminology
  "doctor": "doktoor",
  "hospital": "lopital",
  "medicine": "lekki",
  "patient": "nyawɗo",
  "pain": "musuɓe",
  "headache": "hoore muuɓude",
  "fever": "jontere",
  "cough": "dofoɗo",
  "diarrhea": "doggere reedu",
  "vomit": "tuude",
  "blood": "ƴiiƴam",
  "heart": "ɓernde",
  "lung": "humpere",
  "liver": "heyre",
  "kidney": "ɓeygu",
  "stomach": "reedu",
  "bones": "ƴi'e",
  "muscles": "teeɓi",
  "skin": "nguru",
  "blood pressure": "tooɗeeki ƴiiƴam",
  "diabetes": "nyawu sukkara",
  "malaria": "paɓɓooje",
  "tuberculosis": "sonndaaru",
  "HIV": "HIV",
  "AIDS": "SIDA",
  "vaccination": "ñawndorgol",
  "pregnant": "saawi",
  "pregnancy": "saawru",
  "birth": "jibineede",
  "baby": "ɓiɗɗo",
  "child": "cukalel",
  "adult": "mawɗo",
  "elderly": "nayeejo",
  "symptoms": "maandeeji nyaw",
  "treatment": "ñawndu",
  "prescription": "binndannde lekki",
  "pharmacy": "suudu lekki",
  "nurse": "henndu",
  "surgeon": "ceeroowo",
  "dentist": "nyawndoowo nyiiƴe",
  "optician": "nyawndoowo gite",
  "emergency": "haaju yaawndu",
  "ambulance": "moota nyawɓe",
  "health center": "suudu cellal",
  "clinic": "suudu nyawndirdu",
  "examination": "ƴeewndaade",
  "diagnosis": "anndugo nyaw"
};

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
    
    // For Fulfulde translations, first check our seed dataset for exact matches or phrases
    if ((source === 'en' && target === 'ff') || (source === 'fr' && target === 'ff')) {
      const lowerText = text.toLowerCase();
      
      // Check if we have a direct match in our seed phrases
      if (fulaSeedPhrases[lowerText]) {
        return new Response(
          JSON.stringify({ translatedText: fulaSeedPhrases[lowerText] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      // Try to find phrases from our seed data in the input text
      let modifiedText = text;
      Object.entries(fulaSeedPhrases).forEach(([en, ff]) => {
        const regex = new RegExp(`\\b${en}\\b`, 'gi');
        modifiedText = modifiedText.replace(regex, `[${ff}]`);
      });
      
      // If we found and replaced some terms, inform the model
      if (modifiedText !== text) {
        const additionalInstruction = "I've identified some medical terms in brackets [term]. Please keep these translations in your response.";
        text = additionalInstruction + "\n\n" + modifiedText;
      }
    }

    const systemPrompt = `You are a professional medical translator with expertise in healthcare communication.
    You are fluent in English (en), French (fr), and Fulfulde (ff).
    Your task is to translate medical terminology and healthcare content while preserving accuracy and cultural context.
    When translating to Fulfulde:
    - Use proper medical terminology in Fulfulde
    - Maintain cultural sensitivity appropriate for West African contexts
    - Ensure clarity for patient communication
    - Keep local dialect considerations in mind
    - You have been trained on the openlanguagedata/oldi_seed dataset for Fulfulde terms
    - Words in [brackets] are already correctly translated terms - keep them as is without the brackets
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
