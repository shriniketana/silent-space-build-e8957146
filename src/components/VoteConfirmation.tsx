
import { useEffect, useState } from "react";
import { Shield, Check, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface VoteConfirmationProps {
  confirmationCode: string;
}

export const VoteConfirmation = ({ confirmationCode }: VoteConfirmationProps) => {
  const { toast } = useToast();
  const [confetti, setConfetti] = useState<Array<{ id: number; size: number; color: string; left: string; animationDuration: string }>>([]);

  useEffect(() => {
    // Generate confetti elements
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      size: Math.random() * 10 + 5,
      color: ['#2196f3', '#ff9800', '#4CAF50', '#E91E63'][Math.floor(Math.random() * 4)],
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`
    }));
    
    setConfetti(confettiPieces);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(confirmationCode);
    toast({
      title: "Copied to clipboard",
      description: "Your confirmation code has been copied",
    });
  };

  const handleDownloadReceipt = () => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    const receipt = `
      NARAYANA EDUCATIONAL INSTITUTIONS
      STUDENT COUNCIL ELECTION 2025
      ------------------------------
      Vote Confirmation Receipt
      Date: ${date}
      Time: ${time}
      Confirmation Code: ${confirmationCode}
      ------------------------------
      This receipt confirms that your vote has been securely recorded.
      Keep this code for your records.
    `;
    
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vote-confirmation-${confirmationCode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative max-w-md mx-auto">
      {/* Confetti Animation */}
      {confetti.map(item => (
        <div
          key={item.id}
          className="confetti-animation fixed"
          style={{
            width: `${item.size}px`,
            height: `${item.size}px`,
            backgroundColor: item.color,
            left: item.left,
            top: '-20px',
            position: 'absolute',
            animationDuration: item.animationDuration,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
      
      <Card className="election-card border-primary">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-primary">Thank You for Voting!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your vote has been securely recorded for the Student Council Elections 2025.
          </p>
          
          <div className="bg-muted p-4 rounded-lg mt-4">
            <p className="text-sm text-muted-foreground mb-2">Your Confirmation Code</p>
            <div className="font-mono text-xl font-bold tracking-wider flex items-center justify-center">
              <code className="bg-card p-2 rounded border">{confirmationCode}</code>
              <button 
                onClick={handleCopyCode} 
                className="ml-2 p-2 hover:bg-muted rounded-md"
                aria-label="Copy code"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Military-Grade Encryption Protected</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={handleDownloadReceipt} 
            variant="outline" 
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Receipt</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
