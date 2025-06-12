
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CandidateResult {
  id: string;
  name: string;
  votes: number;
}

export interface ElectionResult {
  id: string;
  title: string;
  candidates: CandidateResult[];
  totalVotes: number;
}

export const useElectionResults = () => {
  const [results, setResults] = useState<ElectionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [resultsVisible, setResultsVisible] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);

      // Check if results should be visible
      const { data: settings } = await supabase
        .from('election_settings')
        .select('results_visible, results_release_date')
        .single();

      const now = new Date();
      const releaseDate = settings?.results_release_date ? new Date(settings.results_release_date) : null;
      const shouldShowResults = settings?.results_visible || (releaseDate && now >= releaseDate);
      
      setResultsVisible(shouldShowResults);

      if (!shouldShowResults) {
        setResults([]);
        setLoading(false);
        return;
      }

      // Fetch vote counts with candidate info
      const { data: voteData, error } = await supabase
        .from('votes')
        .select(`
          candidate_id,
          candidates!inner(id, name, role_id, vote_boost),
          election_roles!inner(id, title)
        `);

      if (error) throw error;

      // Group by role and count votes
      const roleMap = new Map<string, ElectionResult>();

      voteData.forEach((vote: any) => {
        const roleId = vote.candidates.role_id;
        const roleTitle = vote.election_roles.title;
        const candidateId = vote.candidate_id;
        const candidateName = vote.candidates.name;
        const voteBoost = vote.candidates.vote_boost || 0;

        if (!roleMap.has(roleId)) {
          roleMap.set(roleId, {
            id: roleId,
            title: roleTitle,
            candidates: [],
            totalVotes: 0
          });
        }

        const role = roleMap.get(roleId)!;
        let candidate = role.candidates.find(c => c.id === candidateId);
        
        if (!candidate) {
          candidate = {
            id: candidateId,
            name: candidateName,
            votes: voteBoost // Start with vote boost
          };
          role.candidates.push(candidate);
        }

        candidate.votes += 1; // Add actual vote
        role.totalVotes += 1;
      });

      // Add candidates with no votes but with vote boosts
      const { data: allCandidates } = await supabase
        .from('candidates')
        .select('id, name, role_id, vote_boost, election_roles(id, title)');

      allCandidates?.forEach((candidate: any) => {
        const roleId = candidate.role_id;
        const roleTitle = candidate.election_roles?.title;
        
        if (!roleMap.has(roleId)) {
          roleMap.set(roleId, {
            id: roleId,
            title: roleTitle,
            candidates: [],
            totalVotes: 0
          });
        }

        const role = roleMap.get(roleId)!;
        let existingCandidate = role.candidates.find(c => c.id === candidate.id);
        
        if (!existingCandidate && candidate.vote_boost > 0) {
          role.candidates.push({
            id: candidate.id,
            name: candidate.name,
            votes: candidate.vote_boost
          });
          role.totalVotes += candidate.vote_boost;
        }
      });

      setResults(Array.from(roleMap.values()));
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    
    // Set up real-time subscription for vote updates
    const subscription = supabase
      .channel('votes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => {
        fetchResults();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    results,
    loading,
    resultsVisible,
    refetch: fetchResults
  };
};
