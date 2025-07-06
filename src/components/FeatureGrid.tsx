
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Users, 
  Target, 
  TrendingUp, 
  GitBranch, 
  Eye, 
  Zap,
  Heart,
  Lightbulb,
  Network,
  Timer,
  Shield
} from 'lucide-react';

export const FeatureGrid = () => {
  const features = [
    {
      icon: Brain,
      title: "Adaptive Content Evolution",
      description: "Your articles automatically adapt tone, complexity, and examples for different readers in real-time.",
      badge: "AI Core",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: Heart,
      title: "Emotional Journey Mapping",
      description: "Track reader emotions paragraph-by-paragraph with visual heat maps and sentiment analysis.",
      badge: "Analytics",
      gradient: "from-pink-500 to-red-500"
    },
    {
      icon: Users,
      title: "Ghost Collaboration Network",
      description: "Anonymous AI-human hybrid writing where strangers contribute to your drafts with verified attribution.",
      badge: "Community",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: Target,
      title: "Predictive Reader Intelligence",
      description: "AI predicts which readers will love your content and distributes to pre-qualified audiences.",
      badge: "Smart Distribution",
      gradient: "from-orange-500 to-yellow-500"
    },
    {
      icon: GitBranch,
      title: "Living Document Ecosystem",
      description: "Articles grow, branch, and spawn related content while maintaining original ownership.",
      badge: "Evolution",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Network,
      title: "Synaptic Discovery Engine",
      description: "AI creates connections between unrelated articles, enabling neural browsing and discovery.",
      badge: "Discovery",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: Timer,
      title: "Temporal Content Layers",
      description: "Articles exist in multiple time states with editing history and time-capsule publishing.",
      badge: "Time Travel",
      gradient: "from-violet-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Blockchain Ownership",
      description: "Proof of authorship and NFT-based limited edition posts with permanent ownership records.",
      badge: "Web3",
      gradient: "from-emerald-500 to-green-500"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-400/30 text-purple-300">
            Revolutionary Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Never-Before-Seen
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Innovation</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Each feature is designed to push the boundaries of what's possible in content creation and collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.gradient} bg-opacity-20`}>
                    <feature.icon className={`h-6 w-6 text-white`} />
                  </div>
                  <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-white text-lg group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Highlight */}
        <div className="mt-16 p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl border border-purple-400/20">
          <div className="text-center">
            <Lightbulb className="h-12 w-12 text-yellow-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-white mb-4">The MindMeld Difference</h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Unlike traditional platforms, MindMeld doesn't just host your content—it enhances, 
              evolves, and amplifies it through the collective intelligence of AI and community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
