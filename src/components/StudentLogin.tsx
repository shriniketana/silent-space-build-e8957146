
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentLoginProps {
  onLogin: (studentId: string) => void;
}

export const StudentLogin = ({ onLogin }: StudentLoginProps) => {
  const [studentId, setStudentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that student ID is exactly 7 digits
    if (!studentId || !/^\d{7}$/.test(studentId)) {
      toast({
        title: "Invalid Student ID",
        description: "Please enter a valid 7-digit student ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate authentication delay for security
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Authentication Successful",
      description: "Welcome to the Student Council Elections",
    });
    
    onLogin(studentId);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <p className="text-muted-foreground">
          Enter your 7-digit Student ID to access the secure voting platform
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="studentId" className="text-sm font-medium">
          Student ID
        </Label>
        <div className="relative">
          <Input
            id="studentId"
            type="text"
            placeholder="Enter your 7-digit Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="pl-10"
            maxLength={7}
            required
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full vote-button"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Authenticating...</span>
          </div>
        ) : (
          "Access Voting Platform"
        )}
      </Button>

      <div className="text-xs text-center text-muted-foreground">
        <div className="flex items-center justify-center space-x-1">
          <Lock className="h-3 w-3" />
          <span>Your information is protected with military-grade encryption</span>
        </div>
      </div>
    </form>
  );
};
