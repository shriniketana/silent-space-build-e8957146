
import { useState } from "react";
import { VotingCard } from "@/components/VotingCard";
import { VoteConfirmation } from "@/components/VoteConfirmation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useElectionData } from "@/hooks/useElectionData";

export const VotingSection = () => {
  const { roles, settings, loading, submitVote } = useElectionData();
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const handleVote = (roleId: string, candidateId: string) => {
    setVotes(prev => ({ ...prev, [roleId]: candidateId }));
  };

  const handleSubmitAllVotes = async () => {
    if (Object.keys(votes).length === 0) return;

    setIsSubmitting(true);
    
    const success = await submitVote(votes);
    
    if (success) {
      // Generate confirmation code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      setConfirmationCode(code);
      setShowConfirmation(true);
    }
    
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!settings?.voting_open) {
    return (
      <Card className="election-card">
        <CardContent className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Voting is Currently Closed</h2>
          <p className="text-muted-foreground">Please check back later when voting reopens.</p>
        </CardContent>
      </Card>
    );
  }

  const votedCount = Object.keys(votes).length;
  const totalRoles = roles.length;
  const progressPercentage = (votedCount / totalRoles) * 100;

  if (showConfirmation) {
    return <VoteConfirmation confirmationCode={confirmationCode} />;
  }

  const leadershipRoles = roles.filter(role => role.category === "Leadership");
  const houseRoles = roles.filter(role => role.category === "House Captains");

  return (
    <div className="space-y-8">
      {/* Progress Card */}
      <Card className="election-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Voting Progress</span>
            <span className="text-primary">{votedCount}/{totalRoles}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="h-2" />
          <div className="mt-2 text-sm text-muted-foreground">
            {votedCount === 0 
              ? "Start voting by selecting candidates below" 
              : votedCount === totalRoles 
                ? "You've voted for all positions! Submit your ballot when ready." 
                : `You've voted for ${votedCount} out of ${totalRoles} positions`}
          </div>
        </CardContent>
      </Card>

      {/* Leadership Positions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary">Leadership Positions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leadershipRoles.map((role) => (
            <VotingCard
              key={role.id}
              role={role}
              selectedCandidate={votes[role.id]}
              onVote={handleVote}
            />
          ))}
        </div>
      </div>

      {/* House Captains */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary">House Captains</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {houseRoles.map((role) => (
            <VotingCard
              key={role.id}
              role={role}
              selectedCandidate={votes[role.id]}
              onVote={handleVote}
            />
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSubmitAllVotes}
          disabled={votedCount === 0 || isSubmitting}
          className={`vote-button px-8 py-3 text-lg font-semibold rounded-lg text-white ${
            votedCount === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Securing your vote...</span>
            </div>
          ) : (
            `Submit ${votedCount} ${votedCount === 1 ? "Vote" : "Votes"}`
          )}
        </button>
      </div>
    </div>
  );
};
