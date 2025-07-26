-- Add SEO and AI assistance fields to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT[],
ADD COLUMN IF NOT EXISTS ai_generated_suggestions TEXT[];

-- Create a table for tracking AI suggestions
CREATE TABLE IF NOT EXISTS public.ai_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  suggestion_text TEXT NOT NULL,
  suggestion_type TEXT NOT NULL, -- 'content', 'seo', 'structure', etc.
  applied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on ai_suggestions
ALTER TABLE public.ai_suggestions ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_suggestions
CREATE POLICY "Users can view their own suggestions" 
ON public.ai_suggestions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create suggestions for their posts" 
ON public.ai_suggestions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suggestions" 
ON public.ai_suggestions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suggestions" 
ON public.ai_suggestions 
FOR DELETE 
USING (auth.uid() = user_id);