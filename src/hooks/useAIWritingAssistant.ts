import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AISuggestion {
  id: string;
  text: string;
  type: 'content' | 'seo' | 'structure';
  applied: boolean;
}

export const useAIWritingAssistant = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const generateSuggestions = async (
    action: 'generate_suggestions' | 'seo_suggestions' | 'regenerate_suggestions',
    content: string,
    title: string,
    currentSuggestions?: string[]
  ) => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-writing-assistant', {
        body: {
          action,
          content,
          title,
          currentSuggestions
        }
      });

      if (error) {
        console.error('AI assistant error:', error);
        throw new Error(error.message || 'Failed to generate suggestions');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const newSuggestions = data?.suggestions || [];
      setSuggestions(newSuggestions);
      
      toast({
        title: "AI Suggestions Generated",
        description: `Generated ${newSuggestions.length} new suggestions for your content.`,
      });

      return newSuggestions;
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate AI suggestions",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = (suggestion: string, currentContent: string): string => {
    // Smart suggestion application based on content
    if (suggestion.toLowerCase().includes('title') || suggestion.toLowerCase().includes('headline')) {
      return currentContent + '\n\n<!-- AI Suggestion for Title: ' + suggestion + ' -->\n';
    }
    
    if (suggestion.toLowerCase().includes('paragraph') || suggestion.toLowerCase().includes('section')) {
      return currentContent + '\n\n<!-- AI Suggestion: ' + suggestion + ' -->\n\n[Apply this suggestion here]\n';
    }
    
    if (suggestion.toLowerCase().includes('transition') || suggestion.toLowerCase().includes('connect')) {
      return currentContent + '\n\n<!-- Transition Suggestion: ' + suggestion + ' -->\n';
    }

    // Default application
    return currentContent + '\n\n<!-- AI Writing Tip: ' + suggestion + ' -->\n';
  };

  return {
    isGenerating,
    suggestions,
    setSuggestions,
    generateSuggestions,
    applySuggestion,
  };
};