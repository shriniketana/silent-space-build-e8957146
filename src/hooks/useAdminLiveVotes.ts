
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LiveVoteData {
  totalVotes: number;
  votesByRole: Record<string, Record<string, number>>;
  recentVotes: Array<{
    id: string;
    candidateName: string;
    roleName: string;
    timestamp: string;
  }>;
}

export const useAdminLiveVotes = () => {
  const [liveVotes, setLiveVotes] = useState<LiveVoteData>({
    totalVotes: 0,
    votesByRole: {},
    recentVotes: []
  });
  const [loading, setLoading] = useState(true);

  const fetchLiveVotes = async () => {
    try {
      setLoading(true);

      // Fetch all votes with candidate and role information
      const { data: voteData, error: voteError } = await supabase
        .from('votes')
        .select(`
          id,
          candidate_id,
          role_id,
          created_at,
          candidates(name, election_roles(title))
        `)
        .order('created_at', { ascending: false });

      if (voteError) throw voteError;

      // Process the data
      const votesByRole: Record<string, Record<string, number>> = {};
      const recentVotes: any[] = [];

      voteData.forEach((vote: any) => {
        const roleName = vote.candidates?.election_roles?.title || 'Unknown Role';
        const candidateName = vote.candidates?.name || 'Unknown Candidate';

        // Count votes by role and candidate
        if (!votesByRole[roleName]) {
          votesByRole[roleName] = {};
        }
        if (!votesByRole[roleName][candidateName]) {
          votesByRole[roleName][candidateName] = 0;
        }
        votesByRole[roleName][candidateName]++;

        // Add to recent votes (limit to last 20)
        if (recentVotes.length < 20) {
          recentVotes.push({
            id: vote.id,
            candidateName,
            roleName,
            timestamp: vote.created_at
          });
        }
      });

      setLiveVotes({
        totalVotes: voteData.length,
        votesByRole,
        recentVotes
      });
    } catch (error) {
      console.error('Error fetching live votes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveVotes();

    // Set up real-time subscription for live updates
    const subscription = supabase
      .channel('admin_live_votes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => {
        console.log('New vote detected, updating live data...');
        fetchLiveVotes();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    liveVotes,
    loading,
    refetch: fetchLiveVotes
  };
};
