
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// This function now just proxies to your local FastAPI translation server
// Note: In production, you would replace this with direct API calls from frontend
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, source, target } = await req.json();
    
    console.log(`[PROXY] Forwarding translation request from ${source} to ${target}: "${text}"`);
    
    // This function is no longer used directly as we're calling local APIs from the frontend
    // It's kept as a placeholder in case you need to revert or have authentication requirements later
    return new Response(
      JSON.stringify({ 
        translatedText: "This Edge Function is deprecated. Using direct API calls to local models instead.",
        info: "Please use direct API calls to http://localhost:8000/translate and http://localhost:8001/stt"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Translation proxy error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
