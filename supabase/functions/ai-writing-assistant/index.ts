import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const { action, content, title, currentSuggestions } = await req.json();

    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(JSON.stringify({ 
        error: 'AI service not configured. Please add OpenAI API key to edge function secrets.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let prompt = '';
    let suggestions: string[] = [];

    switch (action) {
      case 'generate_suggestions':
        prompt = `As a writing assistant, analyze this content and provide 3 specific, actionable suggestions to improve the writing:

Title: ${title || 'Untitled'}
Content: ${content || 'No content yet'}

Focus on:
1. Content structure and flow
2. Writing style and engagement
3. Clarity and readability

Provide each suggestion as a complete sentence that starts with an action verb. Make suggestions specific to the content provided.`;
        break;

      case 'seo_suggestions':
        prompt = `As an SEO expert, analyze this blog post and provide 3 specific SEO improvements:

Title: ${title || 'Untitled'}
Content: ${content || 'No content yet'}

Provide suggestions for:
1. Title optimization
2. Content structure for SEO
3. Keywords and readability

Each suggestion should be actionable and specific to this content.`;
        break;

      case 'regenerate_suggestions':
        prompt = `As a writing assistant, provide 3 NEW and different writing suggestions for this content. Avoid these previous suggestions: ${currentSuggestions?.join(', ') || 'none'}

Title: ${title || 'Untitled'}
Content: ${content || 'No content yet'}

Focus on different aspects like:
- Tone and voice
- Examples and details  
- Structure and transitions
- Reader engagement

Provide fresh, specific suggestions that haven't been mentioned before.`;
        break;

      default:
        throw new Error('Invalid action');
    }

    console.log('Making OpenAI request for action:', action);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert writing assistant. Provide exactly 3 specific, actionable suggestions. Each suggestion should be 1-2 sentences and start with an action verb. Be direct and helpful.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    // Parse suggestions from the response
    const lines = generatedText.split('\n').filter((line: string) => line.trim());
    suggestions = lines
      .filter((line: string) => line.match(/^\d+\.?\s+/) || line.includes('.'))
      .map((line: string) => line.replace(/^\d+\.?\s*/, '').trim())
      .filter((line: string) => line.length > 10)
      .slice(0, 3);

    // If parsing fails, split by sentences
    if (suggestions.length < 3) {
      suggestions = generatedText
        .split(/[.!?]+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 20)
        .slice(0, 3)
        .map((s: string) => s + (s.endsWith('.') ? '' : '.'));
    }

    console.log('Generated suggestions:', suggestions);

    return new Response(JSON.stringify({ 
      suggestions,
      action 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-writing-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred while generating suggestions'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});