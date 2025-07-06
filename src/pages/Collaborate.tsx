
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Header } from '@/components/Header';
import { Users, MessageCircle, GitBranch, Crown, Clock, Plus } from 'lucide-react';

const Collaborate = () => {
  const activeCollaborations = [
    {
      id: 1,
      title: "The Future of Distributed Creativity",
      collaborators: [
        { name: "Alex T.", avatar: "AT", role: "Lead Writer" },
        { name: "Sarah M.", avatar: "SM", role: "Editor" },
        { name: "Mike R.", avatar: "MR", role: "Researcher" }
      ],
      status: "Active",
      lastActivity: "2 hours ago",
      progress: 75
    },
    {
      id: 2,
      title: "Building Empathy Through Stories",
      collaborators: [
        { name: "Emily C.", avatar: "EC", role: "Lead Writer" },
        { name: "David L.", avatar: "DL", role: "Co-Writer" }
      ],
      status: "Review",
      lastActivity: "1 day ago",
      progress: 90
    }
  ];

  const invitations = [
    {
      id: 1,
      title: "AI Ethics in Creative Writing",
      inviter: "Dr. Jennifer Walsh",
      role: "Co-Writer",
      message: "Would love to collaborate on this piece about AI ethics. Your expertise would be valuable!"
    },
    {
      id: 2,
      title: "Climate Change Narratives",
      inviter: "Mark Thompson",
      role: "Editor",
      message: "Looking for an editor to help refine this environmental piece."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Collaborate &
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"> Create Together</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Join forces with other writers, share ideas, and create stories that are greater than the sum of their parts.
          </p>
          
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white">
            <Plus className="h-5 w-5 mr-2" />
            Start New Collaboration
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Active Collaborations */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-400" />
              Active Collaborations
            </h2>
            <div className="space-y-4">
              {activeCollaborations.map((collab) => (
                <Card key={collab.id} className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg">{collab.title}</CardTitle>
                      <Badge variant="outline" className={`${
                        collab.status === 'Active' ? 'border-green-400/30 text-green-300' : 'border-yellow-400/30 text-yellow-300'
                      }`}>
                        {collab.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex -space-x-2">
                      {collab.collaborators.map((collaborator, index) => (
                        <div key={index} className="flex items-center">
                          <Avatar className="h-8 w-8 border-2 border-slate-900">
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                              {collaborator.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {index === 0 && <Crown className="h-3 w-3 text-yellow-400 ml-1" />}
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{collab.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${collab.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Clock className="h-4 w-4 mr-1" />
                        {collab.lastActivity}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <GitBranch className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Collaboration Invitations */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <MessageCircle className="h-6 w-6 mr-2 text-green-400" />
              Invitations
            </h2>
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <Card key={invitation.id} className="bg-white/5 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{invitation.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs">
                          {invitation.inviter.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-300 text-sm">{invitation.inviter}</span>
                      <Badge variant="outline" className="border-green-400/30 text-green-300 text-xs">
                        {invitation.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400 text-sm">{invitation.message}</p>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex-1">
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 flex-1">
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Collaborate;
