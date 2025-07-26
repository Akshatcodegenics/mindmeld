import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Header } from '@/components/Header';
import { SEOAssistant } from '@/components/SEOAssistant';
import { 
  Brain, 
  Sparkles, 
  Save, 
  Eye, 
  Users, 
  Send, 
  RefreshCw, 
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  BookOpen
} from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAIWritingAssistant } from '@/hooks/useAIWritingAssistant';
import { useAutosave } from '@/hooks/useAutosave';

const Write = () => {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState<any[]>([]);
  const [showRecovery, setShowRecovery] = useState(false);

  // AI Writing Assistant
  const { 
    generateSuggestions, 
    applySuggestion, 
    isGenerating, 
    suggestions, 
    setSuggestions 
  } = useAIWritingAssistant();

  // Autosave functionality
  const { 
    lastSaved, 
    isDirty, 
    recoverAutosave, 
    clearAutosave, 
    forceSave 
  } = useAutosave(title, content);

  // Check for autosave recovery on mount
  useEffect(() => {
    const autosaveData = recoverAutosave();
    if (autosaveData && (autosaveData.title || autosaveData.content)) {
      setShowRecovery(true);
    }
  }, []);

  // Load saved drafts on component mount
  useEffect(() => {
    const drafts = JSON.parse(localStorage.getItem('story-drafts') || '[]');
    setSavedDrafts(drafts);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      toast({ 
        title: "Authentication Required", 
        description: "Please sign in to access the writing editor.",
        variant: "destructive" 
      });
      navigate('/signin');
    }
  }, [user, navigate, toast]);

  const handleRecoverAutosave = () => {
    const autosaveData = recoverAutosave();
    if (autosaveData) {
      setTitle(autosaveData.title);
      setContent(autosaveData.content);
      setShowRecovery(false);
      toast({ title: "Draft recovered successfully!" });
    }
  };

  const handleDismissRecovery = () => {
    clearAutosave();
    setShowRecovery(false);
  };

  const handleSaveDraft = async () => {
    if (!user) {
      toast({ title: "Please sign in to save drafts", variant: "destructive" });
      return;
    }

    if (!title.trim() && !content.trim()) {
      toast({ title: "Please add some content before saving", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const post = await createPost({
        title: title || 'Untitled Draft',
        content,
        published: false,
        excerpt: content.slice(0, 150) + (content.length > 150 ? '...' : ''),
        category: 'draft',
        tags: keywords
      });
      
      if (post) {
        // Save to local drafts as well
        const draft = {
          id: post.id,
          title: title || 'Untitled Draft',
          content,
          savedAt: new Date().toISOString()
        };
        
        const existingDrafts = JSON.parse(localStorage.getItem('story-drafts') || '[]');
        const updatedDrafts = [draft, ...existingDrafts.slice(0, 4)];
        localStorage.setItem('story-drafts', JSON.stringify(updatedDrafts));
        setSavedDrafts(updatedDrafts);
        
        clearAutosave(); // Clear autosave since we saved officially
        toast({ title: "Draft saved successfully!" });
      }
    } catch (error) {
      toast({ title: "Failed to save draft", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!user) {
      toast({ title: "Please sign in to publish", variant: "destructive" });
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({ title: "Please add title and content before publishing", variant: "destructive" });
      return;
    }

    if (content.length < 100) {
      toast({ title: "Content is too short. Please write at least 100 characters.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const post = await createPost({
        title,
        content,
        published: true,
        excerpt: content.slice(0, 150) + (content.length > 150 ? '...' : ''),
        category: 'published',
        tags: keywords
      });
      
      if (post) {
        clearAutosave(); // Clear autosave since we published
        toast({ title: "Story published successfully!" });
        navigate(`/post/${post.id}`);
      }
    } catch (error) {
      toast({ title: "Failed to publish story", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateContentSuggestions = async () => {
    await generateSuggestions('generate_suggestions', content, title);
  };

  const handleRegenerateContentSuggestions = async () => {
    await generateSuggestions('regenerate_suggestions', content, title, suggestions);
  };

  const handleApplySuggestion = (suggestion: string) => {
    const newContent = applySuggestion(suggestion, content);
    setContent(newContent);
    forceSave(); // Force autosave after applying suggestion
    toast({ title: "Suggestion applied to your content" });
  };

  const loadDraft = (draft: any) => {
    setTitle(draft.title);
    setContent(draft.content);
    clearAutosave(); // Clear autosave when loading a draft
    toast({ title: "Draft loaded successfully" });
  };

  const getWordCount = () => content.split(/\s+/).filter(word => word.length > 0).length;
  const getReadingTime = () => Math.ceil(getWordCount() / 200);

  if (!user) {
    return null; // Component will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Recovery Alert */}
        {showRecovery && (
          <Alert className="mb-6 bg-warning/10 border-warning/50 text-warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between w-full">
              <span>We found an unsaved draft. Would you like to recover it?</span>
              <div className="flex space-x-2 ml-4">
                <Button size="sm" onClick={handleRecoverAutosave} className="bg-warning hover:bg-warning/80 text-warning-foreground">
                  Recover
                </Button>
                <Button size="sm" variant="outline" onClick={handleDismissRecovery} className="border-warning/50 text-warning hover:bg-warning/10">
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create Your
            <span className="bg-gradient-to-r from-ai-primary to-ai-secondary bg-clip-text text-transparent"> Masterpiece</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Write with AI assistance, optimize for SEO, and create compelling content.
          </p>
          
          {/* Writing Stats */}
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>{getWordCount()} words</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{getReadingTime()} min read</span>
            </div>
            {lastSaved && (
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
            {isDirty && (
              <div className="flex items-center space-x-1">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span>Unsaved changes</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-ai-primary" />
                  <span className="text-white font-medium">AI-Enhanced Editor</span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={handleSaveDraft}
                    disabled={isSaving || (!title.trim() && !content.trim())}
                    className="bg-info hover:bg-info/80 text-info-foreground"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Draft'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsPreview(!isPreview)}
                    className="border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {isPreview ? 'Edit' : 'Preview'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isPreview ? (
                  <>
                    <input
                      type="text"
                      placeholder="Your amazing title goes here..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white text-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ai-primary transition-all"
                    />
                    <textarea
                      placeholder="Start writing your story... The AI will help enhance your words as you write."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={24}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ai-primary resize-none transition-all"
                    />
                  </>
                ) : (
                  <div className="space-y-6 p-4">
                    <div className="border-b border-white/20 pb-4">
                      <h1 className="text-3xl font-bold text-white mb-2">{title || 'Untitled Story'}</h1>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{getWordCount()} words</span>
                        <span>{getReadingTime()} minute read</span>
                        {keywords.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <span>Tags:</span>
                            {keywords.slice(0, 3).map((keyword, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="prose prose-lg prose-invert max-w-none">
                      {content.split('\n').map((paragraph, index) => (
                        <p key={index} className="text-gray-300 mb-4 leading-relaxed text-lg">
                          {paragraph || '\u00A0'}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Suggestions Panel */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-ai-primary" />
                  AI Writing Assistant
                </CardTitle>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    onClick={handleGenerateContentSuggestions}
                    disabled={isGenerating || !content.trim()}
                    className="bg-ai-primary hover:bg-ai-primary/80 text-ai-primary-foreground"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Brain className="h-4 w-4" />
                    )}
                  </Button>
                  {suggestions.length > 0 && (
                    <Button
                      size="sm"
                      onClick={handleRegenerateContentSuggestions}
                      disabled={isGenerating}
                      className="bg-ai-secondary hover:bg-ai-secondary/80 text-ai-secondary-foreground"
                    >
                      <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-ai-primary/10 rounded-lg border border-ai-primary/20">
                      <p className="text-sm text-gray-300 mb-2">{suggestion}</p>
                      <Button 
                        size="sm" 
                        onClick={() => handleApplySuggestion(suggestion)}
                        className="bg-ai-primary hover:bg-ai-primary/80 text-ai-primary-foreground"
                      >
                        Apply
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Brain className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 mb-3">
                      {content.trim() ? 'Get AI suggestions to improve your writing' : 'Start writing to get AI suggestions'}
                    </p>
                    <Button
                      size="sm"
                      onClick={handleGenerateContentSuggestions}
                      disabled={isGenerating || !content.trim()}
                      className="bg-ai-primary hover:bg-ai-primary/80 text-ai-primary-foreground"
                    >
                      {isGenerating ? 'Generating...' : 'Generate Suggestions'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SEO Assistant */}
            <SEOAssistant
              title={title}
              content={content}
              onSEOUpdate={(data) => {
                setMetaDescription(data.metaDescription);
                setKeywords(data.keywords);
              }}
            />

            {/* Saved Drafts */}
            {savedDrafts.length > 0 && (
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-gray-400" />
                    Recent Drafts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {savedDrafts.slice(0, 3).map((draft, index) => (
                    <div key={draft.id} className="p-3 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">{draft.title}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(draft.savedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => loadDraft(draft)}
                          className="ml-2 bg-success hover:bg-success/80 text-success-foreground"
                        >
                          Load
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Collaboration */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-400" />
                  Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => toast({ title: "Coming Soon", description: "Collaboration features will be available soon!" })}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Invite Collaborators
                </Button>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => toast({ title: "Coming Soon", description: "Feedback requests will be available soon!" })}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Request Feedback
                </Button>
              </CardContent>
            </Card>

            {/* Publishing Options */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Publishing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handlePublish}
                  disabled={isSaving || !title.trim() || !content.trim() || content.length < 100}
                  className="w-full bg-gradient-to-r from-ai-primary to-ai-secondary hover:from-ai-primary/90 hover:to-ai-secondary/90 text-white disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Story'
                  )}
                </Button>
                <Button 
                  onClick={handleSaveDraft}
                  disabled={isSaving || (!title.trim() && !content.trim())}
                  className="w-full bg-info hover:bg-info/80 text-info-foreground"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save as Draft'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Write;