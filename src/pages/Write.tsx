
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Brain, Sparkles, Save, Eye, Users, Send, RefreshCw } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Write = () => {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState([
    "Consider adding more emotional depth to this paragraph",
    "This would be a great place for a metaphor", 
    "Your readers might connect better with a personal example here"
  ]);

  // Auto-save functionality
  useEffect(() => {
    if (!title && !content) return;
    
    const autoSaveInterval = setInterval(() => {
      const draft = {
        id: Date.now(),
        title: title || 'Untitled Draft',
        content,
        savedAt: new Date().toISOString()
      };
      
      const existingDrafts = JSON.parse(localStorage.getItem('story-drafts') || '[]');
      const updatedDrafts = [draft, ...existingDrafts.slice(0, 4)]; // Keep only 5 drafts
      localStorage.setItem('story-drafts', JSON.stringify(updatedDrafts));
      setSavedDrafts(updatedDrafts);
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [title, content]);

  // Load saved drafts on component mount
  useEffect(() => {
    const drafts = JSON.parse(localStorage.getItem('story-drafts') || '[]');
    setSavedDrafts(drafts);
  }, []);

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
      await createPost({
        title: title || 'Untitled Draft',
        content,
        published: false,
        excerpt: content.slice(0, 150) + '...'
      });
      
      toast({ title: "Draft saved successfully!" });
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

    setIsSaving(true);
    try {
      const post = await createPost({
        title,
        content,
        published: true,
        excerpt: content.slice(0, 150) + '...'
      });
      
      if (post) {
        toast({ title: "Story published successfully!" });
        navigate(`/post/${post.id}`);
      }
    } catch (error) {
      toast({ title: "Failed to publish story", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplySuggestion = (suggestion: string) => {
    // Simple implementation: append suggestion as comment
    const newContent = content + '\n\n<!-- AI Suggestion: ' + suggestion + ' -->\n\n';
    setContent(newContent);
    toast({ title: "Suggestion applied to your content" });
  };

  const generateNewSuggestions = () => {
    setIsGeneratingSuggestions(true);
    
    // Simulate AI suggestion generation
    setTimeout(() => {
      const suggestions = [
        "Try adding dialogue to make this section more engaging",
        "This paragraph could benefit from more sensory details",
        "Consider restructuring this section for better flow",
        "Add a transition sentence to connect these ideas",
        "This would be stronger with a specific example"
      ];
      
      const randomSuggestions = suggestions
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      setAiSuggestions(randomSuggestions);
      setIsGeneratingSuggestions(false);
      toast({ title: "New suggestions generated!" });
    }, 2000);
  };

  const loadDraft = (draft: any) => {
    setTitle(draft.title);
    setContent(draft.content);
    toast({ title: "Draft loaded successfully" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Create Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Masterpiece</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Write with AI assistance, get community feedback, and watch your ideas evolve.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <span className="text-white font-medium">AI-Enhanced Editor</span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                    className="border-light-blue/50 text-light-blue hover:bg-light-blue hover:text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Draft'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsPreview(!isPreview)}
                    className="border-accent/50 text-accent hover:bg-accent hover:text-white"
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
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white text-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <textarea
                      placeholder="Start writing your story... The AI will help enhance your words as you write."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={20}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </>
                ) : (
                  <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-white">{title || 'Untitled Story'}</h1>
                    <div className="prose prose-invert max-w-none">
                      {content.split('\n').map((paragraph, index) => (
                        <p key={index} className="text-gray-300 mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Panel */}
          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
                  AI Suggestions
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={generateNewSuggestions}
                  disabled={isGeneratingSuggestions}
                  className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                >
                  <RefreshCw className={`h-4 w-4 ${isGeneratingSuggestions ? 'animate-spin' : ''}`} />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-purple-500/10 rounded-lg border border-purple-400/20">
                    <p className="text-sm text-gray-300">{suggestion}</p>
                    <Button 
                      size="sm" 
                      onClick={() => handleApplySuggestion(suggestion)}
                      className="mt-2 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Apply
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Saved Drafts */}
            {savedDrafts.length > 0 && (
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Recent Drafts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {savedDrafts.slice(0, 3).map((draft, index) => (
                    <div key={draft.id} className="p-2 bg-white/5 rounded border border-white/10">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-white font-medium">{draft.title}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(draft.savedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => loadDraft(draft)}
                          className="border-green-400/50 text-green-400 hover:bg-green-400 hover:text-black"
                        >
                          Load
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-400" />
                  Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Collaborators
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Send className="h-4 w-4 mr-2" />
                  Request Feedback
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Publishing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handlePublish}
                  disabled={isSaving || !title.trim() || !content.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50"
                >
                  {isSaving ? 'Publishing...' : 'Publish Story'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="w-full border-light-blue/50 text-light-blue hover:bg-light-blue hover:text-white"
                >
                  {isSaving ? 'Saving...' : 'Save as Draft'}
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
