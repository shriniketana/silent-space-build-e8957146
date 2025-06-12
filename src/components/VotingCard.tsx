
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { ElectionRole } from "@/hooks/useElectionData";

interface VotingCardProps {
  role: ElectionRole;
  selectedCandidate: string | undefined;
  onVote: (roleId: string, candidateId: string) => void;
}

export const VotingCard = ({ role, selectedCandidate, onVote }: VotingCardProps) => {
  return (
    <Card className="election-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{role.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedCandidate} className="space-y-2">
          {role.candidates.map((candidate) => {
            const isSelected = selectedCandidate === candidate.id;
            
            return (
              <div
                key={candidate.id}
                className={`flex items-center space-x-2 p-3 rounded-md border transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem
                  value={candidate.id}
                  id={`${role.id}-${candidate.id}`}
                  className="data-[state=checked]:border-primary data-[state=checked]:text-primary"
                  onClick={() => onVote(role.id, candidate.id)}
                />
                <Label
                  htmlFor={`${role.id}-${candidate.id}`}
                  className="flex flex-1 items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-medium">{candidate.name}</div>
                    {candidate.description && (
                      <div className="text-sm text-muted-foreground">
                        {candidate.description}
                      </div>
                    )}
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
