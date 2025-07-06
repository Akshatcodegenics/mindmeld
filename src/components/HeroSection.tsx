
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, ArrowRight, Users, Target, TrendingUp } from 'lucide-react';

export const HeroSection = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    { icon: Brain, text: "AI amplifies your creativity", color: "text-purple-400" },
    { icon: Users, text: "Community perfects your ideas", color: "text-blue-400" },
    { icon: Target, text: "Content adapts to every reader", color: "text-green-400" },
    { icon: TrendingUp, text: "Emotional analytics guide your writing", color: "text-pink-400" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        {/* Hero Badge */}
        <Badge className="mb-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-400/30 text-purple-300 px-4 py-2">
          <Sparkles className="h-4 w-4 mr-2 animate-spin" />
          The Future of Blogging is Here
        </Badge>

        {/* Main Headlines */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Your Ideas,
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
            {" "}Amplified
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          The first blogging platform where human creativity meets AI intelligence 
          and community wisdom to create content that evolves, adapts, and inspires.
        </p>

        {/* Dynamic Feature Display */}
        <div className="mb-10 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-3 transition-all duration-500">
            {React.createElement(features[currentFeature].icon, {
              className: `h-6 w-6 ${features[currentFeature].color}`
            })}
            <span className="text-white font-medium">{features[currentFeature].text}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold group">
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
            Explore Features
          </Button>
        </div>

        {/* Social Proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-slate-900"></div>
              ))}
            </div>
            <span className="text-sm">10,000+ Writers</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm">50M+ AI-Enhanced Words</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-sm">1M+ Collaborations</span>
          </div>
        </div>
      </div>
    </section>
  );
};
