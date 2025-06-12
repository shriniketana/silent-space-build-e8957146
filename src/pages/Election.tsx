
import { useState } from "react";
import { Header } from "@/components/Header";
import { VotingSection } from "@/components/VotingSection";
import { ResultsSection } from "@/components/ResultsSection";
import { CountdownTimer } from "@/components/CountdownTimer";
import { SecurityFooter } from "@/components/SecurityFooter";
import { AdminPanel } from "@/components/AdminPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Election = () => {
  const [activeTab, setActiveTab] = useState<"vote" | "results">("vote");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // Check if current user is admin
  const isAdmin = adminAuthenticated && adminEmail === "aniketh@optra.me";

  const handleAdminLogin = () => {
    console.log('Admin login attempt:', { adminEmail, adminPassword });
    if (adminEmail === "aniketh@optra.me" && adminPassword === "manipulation") {
      setAdminAuthenticated(true);
      setShowAdminPanel(true);
      console.log('Admin authenticated successfully');
    } else {
      alert("Invalid admin credentials");
      console.log('Admin authentication failed');
    }
    setAdminPassword("");
  };

  const electionEndDate = new Date("2025-12-31T23:59:59");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              Student Council Elections 2025
            </h1>
            <CountdownTimer endDate={electionEndDate} />
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-6">
            <div className="bg-muted rounded-lg p-1 inline-flex">
              <button
                onClick={() => setActiveTab("vote")}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  activeTab === "vote"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Cast Your Vote
              </button>
              <button
                onClick={() => setActiveTab("results")}
                className={`px-6 py-2 rounded-md font-medium transition-all ${
                  activeTab === "results"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Results
              </button>
              
              {/* Admin Panel Access */}
              <div className="flex items-center space-x-2 ml-4">
                <input
                  type="email"
                  placeholder="Admin email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
                <Button onClick={handleAdminLogin} size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {activeTab === "vote" ? (
          <VotingSection />
        ) : (
          <ResultsSection />
        )}
      </main>

      <SecurityFooter />
      
      {/* Admin Panel */}
      {isAdmin && (
        <AdminPanel 
          isVisible={showAdminPanel} 
          onClose={() => setShowAdminPanel(false)} 
        />
      )}
    </div>
  );
};

export default Election;
