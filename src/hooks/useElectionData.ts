
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ElectionRole {
  id: string;
  title: string;
  category: "Leadership" | "House Captains";
  candidates: Array<{
    id: string;
    name: string;
    description?: string;
    vote_boost?: number;
  }>;
}

export interface ElectionSettings {
  results_visible: boolean;
  voting_open: boolean;
  results_release_date: string;
}

export interface VoteResult {
  candidate_id: string;
  candidate_name: string;
  vote_count: number;
  total_votes: number;
}

export const useElectionData = () => {
  const [roles, setRoles] = useState<ElectionRole[]>([]);
  const [settings, setSettings] = useState<ElectionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchElectionData = async () => {
    try {
      setLoading(true);
      console.log('Starting to fetch election data...');
      
      // Fetch roles
      console.log('Fetching election roles...');
      const { data: rolesData, error: rolesError } = await supabase
        .from('election_roles')
        .select('*')
        .order('id');

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        throw rolesError;
      }
      console.log('Roles data:', rolesData);

      // Fetch candidates
      console.log('Fetching candidates...');
      const { data: candidatesData, error: candidatesError } = await supabase
        .from('candidates')
        .select('*')
        .order('name');

      if (candidatesError) {
        console.error('Error fetching candidates:', candidatesError);
        throw candidatesError;
      }
      console.log('Candidates data:', candidatesData);

      // Fetch settings
      console.log('Fetching election settings...');
      const { data: settingsData, error: settingsError } = await supabase
        .from('election_settings')
        .select('*')
        .single();

      if (settingsError) {
        console.error('Error fetching settings:', settingsError);
        if (settingsError.code === 'PGRST116') {
          console.log('No settings found, using defaults');
          setSettings({
            results_visible: false,
            voting_open: true,
            results_release_date: new Date().toISOString()
          });
        } else {
          throw settingsError;
        }
      } else {
        console.log('Settings data:', settingsData);
        setSettings(settingsData);
      }

      // Group candidates by role
      const groupedRoles: ElectionRole[] = (rolesData || []).map(role => ({
        id: role.id,
        title: role.title,
        category: role.category as "Leadership" | "House Captains",
        candidates: (candidatesData || [])
          .filter(candidate => candidate.role_id === role.id)
          .map(candidate => ({
            id: candidate.id,
            name: candidate.name,
            description: candidate.description || undefined,
            vote_boost: candidate.vote_boost || 0
          }))
      }));

      console.log('Grouped roles:', groupedRoles);
      setRoles(groupedRoles);
    } catch (error) {
      console.error('Error fetching election data:', error);
      toast({
        title: "Error",
        description: "Failed to load election data. Please check the console for details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitVote = async (votes: Record<string, string>) => {
    try {
      console.log('Submitting votes:', votes);
      
      // Generate a unique session ID for this voting session
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Submit all votes for this session
      const votePromises = Object.entries(votes).map(([roleId, candidateId]) => 
        supabase.from('votes').insert({
          student_id: sessionId,
          role_id: roleId,
          candidate_id: candidateId
        })
      );

      const results = await Promise.all(votePromises);
      
      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Vote submission errors:', errors);
        throw new Error(errors.map(e => e.error?.message).join(', '));
      }

      console.log('Votes submitted successfully');
      toast({
        title: "Success",
        description: "Your votes have been submitted successfully!",
        variant: "default"
      });

      return true;
    } catch (error) {
      console.error('Error submitting votes:', error);
      toast({
        title: "Error",
        description: "Failed to submit votes. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchElectionData();
  }, []);

  return {
    roles,
    settings,
    loading,
    refetch: fetchElectionData,
    submitVote
  };
};
