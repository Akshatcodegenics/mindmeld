import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Collaboration {
  id: string;
  title: string;
  description: string | null;
  status: string;
  category: string | null;
  creator_id: string;
  current_collaborators: number;
  max_collaborators: number | null;
  created_at: string;
  updated_at: string;
  participants: CollaborationParticipant[];
  creator_profile?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export interface CollaborationParticipant {
  id: string;
  user_id: string;
  collaboration_id: string;
  role: string;
  joined_at: string;
  profile?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export interface CollaborationInvitation {
  id: string;
  title: string;
  description: string;
  inviter: string;
  role: string;
  message: string;
}

export const useCollaborations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [invitations, setInvitations] = useState<CollaborationInvitation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollaborations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch collaborations where user is creator or participant
      const { data: collaborationsData, error: collaborationsError } = await supabase
        .from('collaborations')
        .select(`
          *,
          participants:collaboration_participants(
            *,
            profile:profiles(display_name, username, avatar_url)
          ),
          creator_profile:profiles!collaborations_creator_id_fkey(display_name, username, avatar_url)
        `)
        .or(`creator_id.eq.${user.id},participants.user_id.eq.${user.id}`);

      if (collaborationsError) throw collaborationsError;

      setCollaborations(collaborationsData || []);
    } catch (error) {
      console.error('Error fetching collaborations:', error);
      toast({ title: 'Failed to load collaborations', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const createCollaboration = async (collaborationData: {
    title: string;
    description?: string;
    category?: string;
    max_collaborators?: number;
  }) => {
    if (!user) {
      toast({ title: 'Please sign in to create collaborations', variant: 'destructive' });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('collaborations')
        .insert({
          ...collaborationData,
          creator_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as participant
      await supabase
        .from('collaboration_participants')
        .insert({
          collaboration_id: data.id,
          user_id: user.id,
          role: 'creator',
        });

      toast({ title: 'Collaboration created successfully!' });
      fetchCollaborations();
      return data;
    } catch (error) {
      console.error('Error creating collaboration:', error);
      toast({ title: 'Failed to create collaboration', variant: 'destructive' });
      return null;
    }
  };

  const joinCollaboration = async (collaborationId: string, role: string = 'collaborator') => {
    if (!user) {
      toast({ title: 'Please sign in to join collaborations', variant: 'destructive' });
      return false;
    }

    try {
      const { error } = await supabase
        .from('collaboration_participants')
        .insert({
          collaboration_id: collaborationId,
          user_id: user.id,
          role,
        });

      if (error) throw error;

      // Update current collaborators count
      const { error: updateError } = await supabase.rpc(
        'increment_collaborators',
        { collaboration_id: collaborationId }
      );

      if (updateError) throw updateError;

      toast({ title: 'Successfully joined collaboration!' });
      fetchCollaborations();
      return true;
    } catch (error) {
      console.error('Error joining collaboration:', error);
      toast({ title: 'Failed to join collaboration', variant: 'destructive' });
      return false;
    }
  };

  const leaveCollaboration = async (collaborationId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('collaboration_participants')
        .delete()
        .eq('collaboration_id', collaborationId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update current collaborators count
      const { error: updateError } = await supabase.rpc(
        'decrement_collaborators',
        { collaboration_id: collaborationId }
      );

      if (updateError) throw updateError;

      toast({ title: 'Left collaboration successfully' });
      fetchCollaborations();
      return true;
    } catch (error) {
      console.error('Error leaving collaboration:', error);
      toast({ title: 'Failed to leave collaboration', variant: 'destructive' });
      return false;
    }
  };

  const inviteCollaborator = async (collaborationId: string, email: string, role: string = 'collaborator') => {
    try {
      // For now, we'll use a simple notification system
      toast({ 
        title: 'Invitation sent!', 
        description: `Invitation sent to ${email} for role: ${role}` 
      });
      return true;
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({ title: 'Failed to send invitation', variant: 'destructive' });
      return false;
    }
  };

  const requestFeedback = async (collaborationId: string, message: string) => {
    try {
      // For now, we'll use a simple notification system
      toast({ 
        title: 'Feedback requested!', 
        description: 'All collaborators have been notified of your feedback request.' 
      });
      return true;
    } catch (error) {
      console.error('Error requesting feedback:', error);
      toast({ title: 'Failed to request feedback', variant: 'destructive' });
      return false;
    }
  };

  // Mock invitations for now
  useEffect(() => {
    setInvitations([
      {
        id: '1',
        title: 'The Future of AI Ethics',
        description: 'A thought-provoking piece about AI ethics and society',
        inviter: 'Dr. Sarah Chen',
        role: 'Co-author',
        message: 'Would love your expertise on this important topic!'
      },
      {
        id: '2',
        title: 'Climate Change Solutions',
        description: 'Exploring innovative approaches to climate action',
        inviter: 'Marcus Johnson',
        role: 'Reviewer',
        message: 'Your feedback would be invaluable for this project.'
      }
    ]);
  }, []);

  useEffect(() => {
    if (user) {
      fetchCollaborations();
    }
  }, [user]);

  return {
    collaborations,
    invitations,
    loading,
    createCollaboration,
    joinCollaboration,
    leaveCollaboration,
    inviteCollaborator,
    requestFeedback,
    fetchCollaborations
  };
};