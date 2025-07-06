
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Menu, X, Sparkles, Zap } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <Brain className="h-8 w-8 text-purple-400" />
              <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MindMeld
              </h1>
              <p className="text-xs text-purple-300/70">Intelligent Writing Collective</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/discover" className="text-white/80 hover:text-white transition-colors hover:bg-white/10 px-3 py-2 rounded-lg">
              Discover
            </Link>
            <Link to="/write" className="text-white/80 hover:text-white transition-colors hover:bg-white/10 px-3 py-2 rounded-lg">
              Write
            </Link>
            <Link to="/collaborate" className="text-white/80 hover:text-white transition-colors hover:bg-white/10 px-3 py-2 rounded-lg">
              Collaborate
            </Link>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400/30">
              <Zap className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/signin">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link to="/write">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                Start Writing
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              <Link to="/discover" className="text-white/80 hover:text-white transition-colors px-3 py-2" onClick={() => setIsMenuOpen(false)}>
                Discover
              </Link>
              <Link to="/write" className="text-white/80 hover:text-white transition-colors px-3 py-2" onClick={() => setIsMenuOpen(false)}>
                Write
              </Link>
              <Link to="/collaborate" className="text-white/80 hover:text-white transition-colors px-3 py-2" onClick={() => setIsMenuOpen(false)}>
                Collaborate
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="text-white hover:bg-white/10 justify-start w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/write" onClick={() => setIsMenuOpen(false)}>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full">
                    Start Writing
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
