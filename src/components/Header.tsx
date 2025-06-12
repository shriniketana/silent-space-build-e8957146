
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="institutional-header sticky top-0 z-50 w-full px-4 py-3 md:px-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/02d22b05-a31a-48ce-86d3-a507a65912c0.png" 
            alt="Narayana Educational Institutions" 
            className="h-12 md:h-16 w-auto"
          />
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-primary">Student Council Elections 2025</h1>
            <p className="text-sm text-muted-foreground">BLR HSR Campus</p>
          </div>
        </div>

        {/* Security Indicators */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-primary">
            <Lock className="h-5 w-5 secure-pulse" />
            <span className="hidden md:inline text-sm font-medium">Secured</span>
          </div>
          
          <Button variant="outline" size="sm" className="hidden md:inline-flex">
            Admin Login
          </Button>
        </div>
      </div>
    </header>
  );
};
