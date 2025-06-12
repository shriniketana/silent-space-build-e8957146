
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminLiveVotes } from "@/hooks/useAdminLiveVotes";
import { Eye, EyeOff, Settings, Vote, Shield, BarChart3, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AdminPanel = ({ isVisible, onClose }: AdminPanelProps) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { liveVotes, loading: votesLoading } = useAdminLiveVotes();

  useEffect(() => {
    if (isVisible) {
      fetchAdminData();
    }
  }, [isVisible]);

  const fetchAdminData = async () => {
    try {
      const [candidatesRes, settingsRes] = await Promise.all([
        supabase.from('candidates').select('*, election_roles(title)'),
        supabase.from('election_settings').select('*').single()
      ]);

      if (candidatesRes.data) setCandidates(candidatesRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const updateVoteBoost = async (candidateId: string, boost: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('candidates')
        .update({ vote_boost: boost })
        .eq('id', candidateId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Vote boost updated successfully! ${boost > 0 ? `Added ${boost} bonus votes` : 'Removed vote boost'}`,
      });

      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vote boost",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleResultsVisibility = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('election_settings')
        .update({ results_visible: !settings.results_visible })
        .eq('id', 1);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Results are now ${!settings.results_visible ? 'visible to all users' : 'hidden from public view'}`,
      });

      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update results visibility",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVotingStatus = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('election_settings')
        .update({ voting_open: !settings.voting_open })
        .eq('id', 1);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Voting is now ${!settings.voting_open ? 'open' : 'closed'}`,
      });

      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update voting status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReleaseDate = async (newDate: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('election_settings')
        .update({ results_release_date: newDate })
        .eq('id', 1);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Release date updated successfully",
      });

      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update release date",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Admin Panel - Authorized Access Only
            </CardTitle>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Warning Banner */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Restricted Access</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                This panel is exclusively for aniketh@optra.me. All actions are logged.
              </p>
            </div>

            <Tabs defaultValue="control" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="control">Election Controls</TabsTrigger>
                <TabsTrigger value="votes">Vote Manipulation</TabsTrigger>
                <TabsTrigger value="live">Live Tracking</TabsTrigger>
              </TabsList>

              <TabsContent value="control" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Election Controls
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={toggleResultsVisibility}
                      disabled={loading}
                      variant={settings?.results_visible ? "destructive" : "default"}
                      className="w-full"
                    >
                      {settings?.results_visible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {settings?.results_visible ? "Hide Results" : "Show Results"}
                    </Button>

                    <Button
                      onClick={toggleVotingStatus}
                      disabled={loading}
                      variant={settings?.voting_open ? "destructive" : "default"}
                      className="w-full"
                    >
                      {settings?.voting_open ? "Close Voting" : "Open Voting"}
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Label htmlFor="releaseDate" className="text-xs">Release:</Label>
                      <Input
                        id="releaseDate"
                        type="datetime-local"
                        value={settings?.results_release_date ? new Date(settings.results_release_date).toISOString().slice(0, 16) : ''}
                        onChange={(e) => updateReleaseDate(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="votes" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Vote className="h-4 w-4" />
                    Vote Manipulation System
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidates.map((candidate) => (
                      <Card key={candidate.id} className="p-4 border-2 hover:border-primary/50 transition-colors">
                        <div className="space-y-3">
                          <div>
                            <div className="font-medium text-lg">{candidate.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {candidate.election_roles?.title}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Label htmlFor={`boost-${candidate.id}`} className="font-medium">
                              Vote Boost:
                            </Label>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateVoteBoost(candidate.id, Math.max(0, (candidate.vote_boost || 0) - 10))}
                                disabled={loading}
                              >
                                -10
                              </Button>
                              <Input
                                id={`boost-${candidate.id}`}
                                type="number"
                                value={candidate.vote_boost || 0}
                                onChange={(e) => updateVoteBoost(candidate.id, parseInt(e.target.value) || 0)}
                                className="w-20 text-center"
                                min="0"
                                disabled={loading}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateVoteBoost(candidate.id, (candidate.vote_boost || 0) + 10)}
                                disabled={loading}
                              >
                                +10
                              </Button>
                            </div>
                          </div>
                          
                          {candidate.vote_boost > 0 && (
                            <div className="text-xs text-green-600 font-medium">
                              +{candidate.vote_boost} artificial votes active
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="live" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Live Vote Tracking
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Vote Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Vote Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary mb-4">
                          Total Votes: {liveVotes.totalVotes}
                        </div>
                        
                        {Object.entries(liveVotes.votesByRole).map(([role, candidates]) => (
                          <div key={role} className="mb-4">
                            <h4 className="font-medium text-sm mb-2">{role}</h4>
                            <div className="space-y-1">
                              {Object.entries(candidates)
                                .sort(([,a], [,b]) => b - a)
                                .map(([candidate, votes]) => (
                                <div key={candidate} className="flex justify-between text-sm">
                                  <span>{candidate}</span>
                                  <span className="font-medium">{votes}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Recent Votes */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Recent Votes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {liveVotes.recentVotes.map((vote) => (
                            <div key={vote.id} className="flex justify-between items-center text-sm border-b pb-2">
                              <div>
                                <div className="font-medium">{vote.candidateName}</div>
                                <div className="text-muted-foreground text-xs">{vote.roleName}</div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(vote.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          ))}
                          {liveVotes.recentVotes.length === 0 && (
                            <div className="text-center text-muted-foreground text-sm py-4">
                              No votes yet
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="text-xs text-center text-red-600 font-medium border-t pt-4">
              ⚠️ Admin access restricted to aniketh@optra.me only ⚠️
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
