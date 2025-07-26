import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useAIWritingAssistant } from '@/hooks/useAIWritingAssistant';

interface SEOAssistantProps {
  title: string;
  content: string;
  onSEOUpdate: (data: { metaDescription: string; keywords: string[] }) => void;
}

export const SEOAssistant: React.FC<SEOAssistantProps> = ({
  title,
  content,
  onSEOUpdate
}) => {
  const { generateSuggestions, isGenerating } = useAIWritingAssistant();
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [seoSuggestions, setSeoSuggestions] = useState<string[]>([]);

  const handleGenerateSEOSuggestions = async () => {
    const suggestions = await generateSuggestions('seo_suggestions', content, title);
    setSeoSuggestions(suggestions);
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      const updatedKeywords = [...keywords, newKeyword.trim()];
      setKeywords(updatedKeywords);
      setNewKeyword('');
      onSEOUpdate({ metaDescription, keywords: updatedKeywords });
    }
  };

  const removeKeyword = (keyword: string) => {
    const updatedKeywords = keywords.filter(k => k !== keyword);
    setKeywords(updatedKeywords);
    onSEOUpdate({ metaDescription, keywords: updatedKeywords });
  };

  const handleMetaDescriptionChange = (value: string) => {
    setMetaDescription(value);
    onSEOUpdate({ metaDescription: value, keywords });
  };

  const getSEOScore = () => {
    let score = 0;
    if (title && title.length >= 30 && title.length <= 60) score += 25;
    if (metaDescription && metaDescription.length >= 120 && metaDescription.length <= 160) score += 25;
    if (keywords.length >= 3) score += 25;
    if (content && content.length >= 300) score += 25;
    return score;
  };

  const seoScore = getSEOScore();

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-info" />
            SEO Assistant
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Score:</span>
            <Badge 
              variant={seoScore >= 75 ? "default" : seoScore >= 50 ? "secondary" : "destructive"}
              className={
                seoScore >= 75 
                  ? "bg-success text-success-foreground" 
                  : seoScore >= 50 
                    ? "bg-warning text-warning-foreground" 
                    : "bg-destructive text-destructive-foreground"
              }
            >
              {seoScore}%
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* SEO Score Breakdown */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            {title && title.length >= 30 && title.length <= 60 ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <AlertCircle className="h-4 w-4 text-warning" />
            )}
            <span className="text-gray-300">Title Length</span>
          </div>
          <div className="flex items-center space-x-2">
            {metaDescription && metaDescription.length >= 120 && metaDescription.length <= 160 ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <AlertCircle className="h-4 w-4 text-warning" />
            )}
            <span className="text-gray-300">Meta Description</span>
          </div>
          <div className="flex items-center space-x-2">
            {keywords.length >= 3 ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <AlertCircle className="h-4 w-4 text-warning" />
            )}
            <span className="text-gray-300">Keywords ({keywords.length}/3+)</span>
          </div>
          <div className="flex items-center space-x-2">
            {content && content.length >= 300 ? (
              <CheckCircle className="h-4 w-4 text-success" />
            ) : (
              <AlertCircle className="h-4 w-4 text-warning" />
            )}
            <span className="text-gray-300">Content Length</span>
          </div>
        </div>

        {/* Meta Description */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            Meta Description ({metaDescription.length}/160)
          </label>
          <Textarea
            value={metaDescription}
            onChange={(e) => handleMetaDescriptionChange(e.target.value)}
            placeholder="Write a compelling meta description that summarizes your content..."
            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            maxLength={160}
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            Keywords
          </label>
          <div className="flex space-x-2 mb-2">
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add keyword..."
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            />
            <Button
              onClick={addKeyword}
              size="sm"
              className="bg-info hover:bg-info/80 text-info-foreground"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="bg-white/10 text-white cursor-pointer hover:bg-white/20"
                onClick={() => removeKeyword(keyword)}
              >
                {keyword} ×
              </Badge>
            ))}
          </div>
        </div>

        {/* AI SEO Suggestions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              SEO Suggestions
            </label>
            <Button
              onClick={handleGenerateSEOSuggestions}
              disabled={isGenerating || !content}
              size="sm"
              className="bg-ai-primary hover:bg-ai-primary/80 text-ai-primary-foreground"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              {isGenerating ? 'Generating...' : 'Get SEO Tips'}
            </Button>
          </div>
          
          {seoSuggestions.length > 0 && (
            <div className="space-y-2">
              {seoSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 bg-ai-primary/10 rounded-lg border border-ai-primary/20"
                >
                  <p className="text-sm text-gray-300">{suggestion}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};