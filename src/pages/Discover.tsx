
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Search, TrendingUp, Users, Clock, Heart, Eye } from 'lucide-react';

const Discover = () => {
  const trendingPosts = [
    {
      id: 1,
      title: "The Future of AI in Creative Writing",
      author: "Sarah Johnson",
      excerpt: "Exploring how artificial intelligence is revolutionizing the way we approach creative writing and storytelling.",
      readTime: "5 min read",
      likes: 234,
      views: 1200,
      category: "AI & Technology"
    },
    {
      id: 2,
      title: "Building Communities Through Shared Stories",
      author: "Mike Chen",
      excerpt: "How collaborative writing platforms are bringing people together through the power of shared narratives.",
      readTime: "8 min read",
      likes: 189,
      views: 890,
      category: "Community"
    },
    {
      id: 3,
      title: "The Psychology of Emotional Storytelling",
      author: "Dr. Emily Rodriguez",
      excerpt: "Understanding how emotional intelligence can enhance your writing and connect with readers on a deeper level.",
      readTime: "12 min read",
      likes: 345,
      views: 1567,
      category: "Psychology"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Discover Amazing
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Stories</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Explore trending posts, discover new writers, and find content that inspires you.
          </p>
          
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search stories, topics, or authors..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {trendingPosts.map((post) => (
            <Card key={post.id} className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="border-purple-400/30 text-purple-300">
                    {post.category}
                  </Badge>
                  <span className="text-xs text-gray-400">{post.readTime}</span>
                </div>
                <CardTitle className="text-white text-xl leading-tight hover:text-purple-300 transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{post.author}</span>
                  <div className="flex items-center space-x-4 text-gray-400 text-sm">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            Load More Stories
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Discover;
