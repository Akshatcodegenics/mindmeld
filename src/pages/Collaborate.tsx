import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/Header';
import { Plus, Users, MessageCircle, GitBranch, Crown, Clock, Mail, User } from 'lucide-react';
import { useCollaborations } from '@/hooks/useCollaborations';
import { useAuth } from '@/contexts/AuthContext';

const Collaborate = () => {
  console.log('Collaborate component rendering, attempting to use useAuth');
  const { user } = useAuth();
  const { 
    collaborations, 
    invitations, 
    loading, 
    createCollaboration, 
    inviteCollaborator, 
    requestFeedback,
    acceptInvitation,
    declineInvitation 
  } = useCollaborations();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [selectedCollaboration, setSelectedCollaboration] = useState<string | null>(null);
  
  // Form states
  const [newCollabTitle, setNewCollabTitle] = useState('');
  const [newCollabDescription, setNewCollabDescription] = useState('');
  const [newCollabCategory, setNewCollabCategory] = useState('');
  const [newCollabMaxCollabs, setNewCollabMaxCollabs] = useState('');
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('collaborator');
  
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, user: string, message: string, timestamp: string}>>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const handleCreateCollaboration = async () => {
    if (!newCollabTitle.trim()) return;

    const collaboration = await createCollaboration({
      title: newCollabTitle,
      description: newCollabDescription || undefined,
      category: newCollabCategory || undefined,
      max_collaborators: newCollabMaxCollabs ? parseInt(newCollabMaxCollabs) : undefined,
    });

    if (collaboration) {
      setShowCreateDialog(false);
      setNewCollabTitle('');
      setNewCollabDescription('');
      setNewCollabCategory('');
      setNewCollabMaxCollabs('');
    }
  };

  const handleInviteCollaborator = async () => {
    if (!selectedCollaboration || !inviteEmail.trim()) return;

    const success = await inviteCollaborator(selectedCollaboration, inviteEmail, inviteRole);
    if (success) {
      setShowInviteDialog(false);
      setInviteEmail('');
      setInviteRole('collaborator');
      setSelectedCollaboration(null);
    }
  };

  const handleRequestFeedback = async () => {
    if (!selectedCollaboration || !feedbackMessage.trim()) return;

    const success = await requestFeedback(selectedCollaboration, feedbackMessage);
    if (success) {
      setShowFeedbackDialog(false);
      setFeedbackMessage('');
      setSelectedCollaboration(null);
    }
  };

  const openInviteDialog = (collaborationId: string) => {
    setSelectedCollaboration(collaborationId);
    setShowInviteDialog(true);
  };

  const openFeedbackDialog = (collaborationId: string) => {
    setSelectedCollaboration(collaborationId);
    setShowFeedbackDialog(true);
  };

  const openChatDialog = (collaborationId: string) => {
    setSelectedCollaboration(collaborationId);
    setShowChatDialog(true);
    
    // Connect to WebSocket
    const ws = new WebSocket('wss://bwpkgzyjdnptidlxpyzt.functions.supabase.co/collaboration-chat');
    
    ws.onopen = () => {
      console.log('Connected to chat');
      setSocket(ws);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setChatMessages(prev => [...prev, {
          id: Date.now().toString(),
          user: data.user,
          message: data.message,
          timestamp: data.timestamp
        }]);
      }
    };
    
    ws.onclose = () => {
      console.log('Chat disconnected');
      setSocket(null);
    };
  };

  const sendChatMessage = () => {
    if (socket && chatMessage.trim()) {
      socket.send(JSON.stringify({
        message: chatMessage,
        user: user?.email || 'Anonymous',
        collaborationId: selectedCollaboration
      }));
      setChatMessage('');
    }
  };

  // Mock active collaborations to show UI
  const mockActiveCollaborations = [
    {
      id: '1',
      title: 'The Art of Digital Storytelling',
      collaborators: 4,
      status: 'Active',
      progress: 65,
      lastActivity: '2 hours ago'
    },
    {
      id: '2', 
      title: 'Climate Solutions for the Future',
      collaborators: 2,
      status: 'Review',
      progress: 90,
      lastActivity: '1 day ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Collaborative
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Storytelling</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Connect with fellow writers, share ideas, and create amazing stories together.
          </p>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Plus className="h-5 w-5 mr-2" />
                Start New Collaboration
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Collaboration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Collaboration title"
                  value={newCollabTitle}
                  onChange={(e) => setNewCollabTitle(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                />
                <Textarea
                  placeholder="Describe your collaboration idea..."
                  value={newCollabDescription}
                  onChange={(e) => setNewCollabDescription(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                />
                <Select value={newCollabCategory} onValueChange={setNewCollabCategory}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fiction">Fiction</SelectItem>
                    <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                    <SelectItem value="poetry">Poetry</SelectItem>
                    <SelectItem value="journalism">Journalism</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Max collaborators (optional)"
                  value={newCollabMaxCollabs}
                  onChange={(e) => setNewCollabMaxCollabs(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                />
                <Button 
                  onClick={handleCreateCollaboration}
                  disabled={!newCollabTitle.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Create Collaboration
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Collaborations */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-400" />
              Active Collaborations
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                <div className="text-center text-gray-400">Loading collaborations...</div>
              ) : collaborations.length === 0 ? (
                <div className="text-center text-gray-400">
                  No active collaborations yet. Create your first collaboration above!
                </div>
              ) : (
                collaborations.map((collaboration) => (
                  <Card key={collaboration.id} className="bg-white/5 backdrop-blur-xl border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-white">{collaboration.title}</CardTitle>
                        <p className="text-gray-400 text-sm mt-1">{collaboration.description}</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        {collaboration.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span className="text-gray-300 text-sm">
                          {collaboration.current_collaborators} collaborator{collaboration.current_collaborators !== 1 ? 's' : ''}
                          {collaboration.max_collaborators && ` / ${collaboration.max_collaborators} max`}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => openInviteDialog(collaboration.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Invite
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => openFeedbackDialog(collaboration.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Feedback
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              {/* Show mock collaborations for better UX */}
              {mockActiveCollaborations.map((collaboration) => (
                <Card key={`mock-${collaboration.id}`} className="bg-white/5 backdrop-blur-xl border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{collaboration.title}</CardTitle>
                      <p className="text-gray-400 text-sm mt-1">Active collaboration project</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      {collaboration.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">{collaboration.collaborators} collaborators</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{collaboration.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${collaboration.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>Last activity: {collaboration.lastActivity}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => openChatDialog(collaboration.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                      <Button size="sm" variant="outline" className="border-purple-400/50 text-purple-400 hover:bg-purple-400 hover:text-white">
                        <GitBranch className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Invitations */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Mail className="h-6 w-6 mr-2 text-green-400" />
              Invitations
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              {invitations.map((invitation) => (
                <Card key={invitation.id} className="bg-white/5 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">{invitation.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-600 text-white">
                          {invitation.inviter.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-gray-300">{invitation.inviter}</p>
                        <Badge variant="outline" className="border-blue-400/50 text-blue-400">
                          {invitation.role}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{invitation.message}</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => acceptInvitation(invitation.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => declineInvitation(invitation.id)}
                        className="border-red-400/50 text-red-400 hover:bg-red-400 hover:text-white"
                      >
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Dialogs for invite and feedback */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Invite Collaborator</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Collaborator email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collaborator">Collaborator</SelectItem>
                  <SelectItem value="reviewer">Reviewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleInviteCollaborator}
                disabled={!inviteEmail.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Send Invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Request Feedback</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="What specific feedback are you looking for?"
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
                rows={4}
              />
              <Button 
                onClick={handleRequestFeedback}
                disabled={!feedbackMessage.trim()}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Request Feedback
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
          <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Collaboration Chat</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="h-64 overflow-y-auto bg-slate-800 rounded p-3 space-y-2">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="text-sm">
                    <span className="text-blue-400 font-semibold">{msg.user}: </span>
                    <span className="text-gray-300">{msg.message}</span>
                  </div>
                ))}
                {chatMessages.length === 0 && (
                  <div className="text-gray-500 text-center">No messages yet...</div>
                )}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  className="bg-slate-800 border-slate-600 text-white flex-1"
                />
                <Button 
                  onClick={sendChatMessage}
                  disabled={!chatMessage.trim() || !socket}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Send
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Collaborate;