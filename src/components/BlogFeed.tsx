
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Brain, 
  Users, 
  TrendingUp,
  Clock,
  Eye,
  Sparkles
} from 'lucide-react';

export const BlogFeed = () => {
  const [selectedPost, setSelectedPost] = useState(0);

  const posts = [
    {
      id: 1,
      title: "The Psychology of AI-Human Creative Collaboration",
      excerpt: "Exploring how artificial intelligence amplifies human creativity rather than replacing it...",
      author: "Dr. Sarah Chen",
      avatar: "SC",
      readTime: "8 min read",
      emotionScore: 92,
      collaborators: 5,
      aiEnhancements: 12,
      tags: ["AI", "Psychology", "Creativity"],
      engagement: {
        likes: 342,
        comments: 28,
        shares: 15
      },
      adaptations: 3, // How many different versions exist for different audiences
      emotionalJourney: [0.2, 0.6, 0.8, 0.4, 0.9, 0.7, 0.8], // Emotional intensity throughout the article
      status: "evolving" // evolving, published, collaborative
    },
    {
      id: 2,
      title: "Building Empathy Through Shared Storytelling",
      excerpt: "How community-driven narratives are reshaping our understanding of human connection...",
      author: "Maya Rodriguez",
      avatar: "MR",
      readTime: "12 min read",
      emotionScore: 87,
      collaborators: 8,
      aiEnhancements: 7,
      tags: ["Community", "Storytelling", "Empathy"],
      engagement: {
        likes: 567,
        comments: 43,
        shares: 29
      },
      adaptations: 5,
      emotionalJourney: [0.3, 0.5, 0.7, 0.9, 0.6, 0.8, 0.9],
      status: "collaborative"
    },
    {
      id: 3,
      title: "The Future of Distributed Creativity",
      excerpt: "Imagine a world where ideas flow freely between minds, enhanced by AI and validated by community...",
      author: "Alex Thompson",
      avatar: "AT",
      readTime: "15 min read",
      emotionScore: 94,
      collaborators: 12,
      aiEnhancements: 23,
      tags: ["Future", "Web3", "Innovation"],
      engagement: {
        likes: 892,
        comments: 67,
        shares: 84
      },
      adaptations: 7,
      emotionalJourney: [0.4, 0.6, 0.8, 0.5, 0.9, 0.8, 0.95],
      status: "published"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-400/30 text-green-300">
            Live Content Feed
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Stories in
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"> Motion</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Watch content evolve in real-time as AI and community intelligence shape every story.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <Card 
              key={post.id}
              className={`bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer ${
                selectedPost === index ? 'ring-2 ring-purple-400 scale-105' : ''
              }`}
              onClick={() => setSelectedPost(index)}
            >
              <CardHeader className="pb-4">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-3">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      post.status === 'evolving' ? 'border-yellow-400/30 text-yellow-300' :
                      post.status === 'collaborative' ? 'border-blue-400/30 text-blue-300' :
                      'border-green-400/30 text-green-300'
                    }`}
                  >
                    {post.status === 'evolving' && <Sparkles className="h-3 w-3 mr-1" />}
                    {post.status === 'collaborative' && <Users className="h-3 w-3 mr-1" />}
                    {post.status === 'published' && <Eye className="h-3 w-3 mr-1" />}
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </Badge>
                  <div className="text-xs text-gray-400">{post.readTime}</div>
                </div>

                {/* Title */}
                <h3 className="text-white text-lg font-semibold leading-tight mb-3 hover:text-purple-300 transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Author */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                      {post.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-white text-sm font-medium">{post.author}</div>
                    <div className="text-gray-400 text-xs">+ {post.collaborators} collaborators</div>
                  </div>
                </div>

                {/* AI Enhancement Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-purple-500/10 rounded-lg p-2">
                    <Brain className="h-4 w-4 text-purple-400 mx-auto mb-1" />
                    <div className="text-purple-300 text-xs font-medium">{post.aiEnhancements}</div>
                    <div className="text-gray-400 text-xs">AI Boosts</div>
                  </div>
                  <div className="bg-pink-500/10 rounded-lg p-2">
                    <Heart className="h-4 w-4 text-pink-400 mx-auto mb-1" />
                    <div className="text-pink-300 text-xs font-medium">{post.emotionScore}%</div>
                    <div className="text-gray-400 text-xs">Emotion</div>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-2">
                    <TrendingUp className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                    <div className="text-blue-300 text-xs font-medium">{post.adaptations}</div>
                    <div className="text-gray-400 text-xs">Versions</div>
                  </div>
                </div>

                {/* Emotional Journey Visualization */}
                <div className="space-y-2">
                  <div className="text-xs text-gray-400">Emotional Journey</div>
                  <div className="flex items-end space-x-1 h-8">
                    {post.emotionalJourney.map((intensity, i) => (
                      <div 
                        key={i}
                        className="bg-gradient-to-t from-pink-500 to-purple-500 rounded-t flex-1 transition-all hover:opacity-80"
                        style={{ height: `${intensity * 100}%` }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs border-white/20 text-white/70">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Engagement */}
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <div className="flex space-x-4 text-gray-400">
                    <button className="flex items-center space-x-1 hover:text-pink-400 transition-colors">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">{post.engagement.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">{post.engagement.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span className="text-xs">{post.engagement.shares}</span>
                    </button>
                  </div>
                  <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                    Read & Enhance
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4">
            Join the Collective
          </Button>
        </div>
      </div>
    </section>
  );
};
