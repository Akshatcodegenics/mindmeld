
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Header } from '@/components/Header';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Brain, 
  Users, 
  TrendingUp,
  Clock,
  Eye,
  Sparkles,
  BookOpen
} from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();

  // Mock post data - in a real app, this would be fetched based on the ID
  const post = {
    id: parseInt(id || '1'),
    title: "The Psychology of AI-Human Creative Collaboration",
    content: `
      In the rapidly evolving landscape of artificial intelligence, one of the most fascinating developments is the emergence of AI-human creative partnerships. This isn't about AI replacing human creativity – it's about amplification, enhancement, and the birth of entirely new forms of collaborative expression.

      ## The New Creative Paradigm

      Traditional creative processes have always been deeply personal and solitary endeavors. A writer alone with their thoughts, wrestling with words in the quiet hours of the night. But what happens when we introduce an intelligent collaborator that never tires, never judges, and can offer infinite perspectives?

      The result is something unprecedented: a creative partnership that combines human intuition, emotion, and lived experience with AI's vast knowledge synthesis and pattern recognition capabilities.

      ## Understanding the Human Element

      What makes human creativity irreplaceable is our ability to feel, to suffer, to love, and to translate these profound experiences into words that resonate with other human souls. AI may process millions of texts, but it has never felt the sting of heartbreak or the euphoria of first love.

      This is where the magic happens – when AI's analytical prowess meets human emotional intelligence, we get stories that are both intellectually rigorous and emotionally compelling.

      ## The Collaborative Dance

      In practice, AI-human collaboration in writing feels like having a conversation with the most well-read person you've ever met – someone who can instantly recall relevant examples, suggest alternative phrasings, and help you explore ideas from angles you might never have considered.

      The AI doesn't write for you; it writes with you. It becomes a thinking partner that helps you push past creative blocks, refine your voice, and discover new depths in your storytelling.

      ## Emotional Intelligence in the Loop

      Perhaps most importantly, this collaboration is guided by emotional intelligence – both human and artificial. Modern AI systems are increasingly capable of understanding emotional nuance, helping writers craft stories that don't just inform but truly move their readers.

      The future of creative writing isn't about choosing between human or artificial intelligence – it's about weaving them together into something greater than the sum of their parts.
    `,
    author: "Dr. Sarah Chen",
    avatar: "SC",
    readTime: "8 min read",
    emotionScore: 92,
    collaborators: 5,
    aiEnhancements: 12,
    tags: ["AI", "Psychology", "Creativity", "Collaboration"],
    engagement: {
      likes: 342,
      comments: 28,
      shares: 15,
      views: 1567
    },
    adaptations: 3,
    emotionalJourney: [0.2, 0.6, 0.8, 0.4, 0.9, 0.7, 0.8],
    status: "published",
    publishedDate: "3 days ago"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Post Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="border-purple-400/30 text-purple-300">
              <Sparkles className="h-3 w-3 mr-1" />
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </Badge>
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{post.engagement.views}</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {post.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-white font-semibold">{post.author}</div>
                <div className="text-gray-400 text-sm">
                  Published {post.publishedDate} • {post.collaborators} collaborators
                </div>
              </div>
            </div>
          </div>

          {/* AI Enhancement Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-purple-500/10 rounded-lg p-3 text-center">
              <Brain className="h-5 w-5 text-purple-400 mx-auto mb-1" />
              <div className="text-purple-300 text-sm font-medium">{post.aiEnhancements}</div>
              <div className="text-gray-400 text-xs">AI Boosts</div>
            </div>
            <div className="bg-pink-500/10 rounded-lg p-3 text-center">
              <Heart className="h-5 w-5 text-pink-400 mx-auto mb-1" />
              <div className="text-pink-300 text-sm font-medium">{post.emotionScore}%</div>
              <div className="text-gray-400 text-xs">Emotion</div>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-3 text-center">
              <TrendingUp className="h-5 w-5 text-blue-400 mx-auto mb-1" />
              <div className="text-blue-300 text-sm font-medium">{post.adaptations}</div>
              <div className="text-gray-400 text-xs">Versions</div>
            </div>
            <div className="bg-green-500/10 rounded-lg p-3 text-center">
              <Users className="h-5 w-5 text-green-400 mx-auto mb-1" />
              <div className="text-green-300 text-sm font-medium">{post.collaborators}</div>
              <div className="text-gray-400 text-xs">Writers</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline" className="border-white/20 text-white/70">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Post Content */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 mb-8">
          <CardContent className="p-8">
            <div className="prose prose-invert prose-lg max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => (
                <div key={index} className="mb-6">
                  {paragraph.startsWith('##') ? (
                    <h2 className="text-2xl font-bold text-white mb-4 mt-8">
                      {paragraph.replace('## ', '')}
                    </h2>
                  ) : (
                    <p className="text-gray-300 leading-relaxed">
                      {paragraph}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Section */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex space-x-6 text-gray-400">
                <button className="flex items-center space-x-2 hover:text-pink-400 transition-colors">
                  <Heart className="h-5 w-5" />
                  <span>{post.engagement.likes}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.engagement.comments}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                  <Share2 className="h-5 w-5" />
                  <span>{post.engagement.shares}</span>
                </button>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Save to Library
                </Button>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Brain className="h-4 w-4 mr-2" />
                  Enhance with AI
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Emotional Journey Visualization */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <h3 className="text-white font-semibold">Emotional Journey Through This Story</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-end space-x-2 h-16 mb-4">
              {post.emotionalJourney.map((intensity, i) => (
                <div 
                  key={i}
                  className="bg-gradient-to-t from-pink-500 to-purple-500 rounded-t flex-1 transition-all hover:opacity-80"
                  style={{ height: `${intensity * 100}%` }}
                ></div>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              This visualization shows the emotional intensity throughout the story, 
              helping readers understand the narrative arc and emotional peaks.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PostDetail;
