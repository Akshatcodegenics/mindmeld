
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Brain, Sparkles, Save, Eye, Users, Send } from 'lucide-react';

const Write = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([
    "Consider adding more emotional depth to this paragraph",
    "This would be a great place for a metaphor",
    "Your readers might connect better with a personal example here"
  ]);

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
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Panel */}
          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-purple-500/10 rounded-lg border border-purple-400/20">
                    <p className="text-sm text-gray-300">{suggestion}</p>
                    <Button size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700 text-white">
                      Apply
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

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
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Publish Story
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Save as Draft
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
