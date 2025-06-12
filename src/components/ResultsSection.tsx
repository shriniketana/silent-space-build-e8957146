
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useElectionResults } from "@/hooks/useElectionResults";

export const ResultsSection = () => {
  const { results, loading, resultsVisible } = useElectionResults();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Securely fetching results...</p>
      </div>
    );
  }

  if (!resultsVisible) {
    return (
      <Card className="election-card">
        <CardContent className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Results Not Yet Available</h2>
          <p className="text-muted-foreground">
            Election results will be released on the scheduled date. Please check back later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const leadershipResults = results.filter(r => 
    ["head-boy", "head-girl", "deputy-head-boy", "deputy-head-girl"].includes(r.id)
  );
  
  const houseResults = results.filter(r => 
    !["head-boy", "head-girl", "deputy-head-boy", "deputy-head-girl"].includes(r.id)
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-primary">Live Election Results</h2>
        <p className="text-muted-foreground">Real-time updates as votes are counted</p>
      </div>

      <Tabs defaultValue="leadership">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="leadership">Leadership Positions</TabsTrigger>
          <TabsTrigger value="houses">House Positions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leadership" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leadershipResults.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="houses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {houseResults.map((result) => (
              <ResultCard key={result.id} result={result} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <AuditLogCard />
    </div>
  );
};

interface ResultCardProps {
  result: {
    id: string;
    title: string;
    candidates: Array<{ id: string; name: string; votes: number }>;
    totalVotes: number;
  };
}

const ResultCard = ({ result }: ResultCardProps) => {
  const sortedCandidates = [...result.candidates].sort((a, b) => b.votes - a.votes);
  
  return (
    <Card className="election-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{result.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedCandidates.map((candidate) => {
          const percentage = result.totalVotes > 0 
            ? Math.round((candidate.votes / result.totalVotes) * 100) 
            : 0;
            
          return (
            <div key={candidate.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{candidate.name}</span>
                </div>
                <div className="text-muted-foreground">
                  {percentage}% ({candidate.votes} votes)
                </div>
              </div>
              <Progress 
                value={percentage} 
                className="h-2" 
              />
            </div>
          );
        })}
        
        <div className="text-xs text-right text-muted-foreground pt-2">
          Total votes: {result.totalVotes}
        </div>
      </CardContent>
    </Card>
  );
};

const AuditLogCard = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <span>Public Audit Log</span>
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
            Live
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-center text-muted-foreground py-4">
          Vote audit logs will appear here when voting begins.
        </div>
        <div className="text-xs text-muted-foreground text-center mt-4">
          This is a public, immutable record of all votes. No personal information is revealed.
        </div>
      </CardContent>
    </Card>
  );
};
