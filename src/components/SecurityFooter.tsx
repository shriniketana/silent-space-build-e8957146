
import { Lock, Shield, Clock } from "lucide-react";

export const SecurityFooter = () => {
  return (
    <footer className="mt-8 py-6 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/02d22b05-a31a-48ce-86d3-a507a65912c0.png" 
              alt="Narayana Educational Institutions" 
              className="h-10 w-auto mr-3"
            />
            <div>
              <div className="font-semibold text-primary text-sm">Student Council Elections 2025</div>
              <div className="text-xs text-muted-foreground">BLR HSR Campus</div>
            </div>
          </div>
          
          <div className="security-badge rounded-full px-4 py-2 text-primary-foreground flex items-center text-sm">
            <Shield className="h-4 w-4 mr-2" />
            <span>Military-Grade Encryption Enabled</span>
          </div>
        </div>
        
        <div className="mt-6 text-xs text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-2 text-primary" />
              <span>All votes are encrypted in transit and at rest</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-primary" />
              <span>Protected by Supabase Row-Level Security</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              <span>Last updated: {new Date().toLocaleString()}</span>
            </div>
          </div>
          
          <div className="text-center mt-4">
            &copy; {new Date().getFullYear()} Narayana Educational Institutions. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
