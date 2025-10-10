import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, TrendingUp, Send } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const StudyBuddy = () => {
  const [buddyEmail, setBuddyEmail] = useState("");
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buddyEmail) return;
    
    // TODO: Connect to backend when Lovable Cloud is enabled
    setConnected(true);
    toast({
      title: "Connection sent!",
      description: `Invitation sent to ${buddyEmail}`,
    });
    setBuddyEmail("");
  };

  const sendMessage = (message: string) => {
    toast({
      title: "Message sent!",
      description: `"${message}" sent to your buddy`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Study Buddy 👥
            </h1>
            <p className="text-muted-foreground">
              Connect with friends and stay motivated together
            </p>
          </div>

          {/* Connect Form */}
          {!connected && (
            <Card className="mb-6 animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Connect with a Study Buddy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleConnect} className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="Enter friend's email"
                    value={buddyEmail}
                    onChange={(e) => setBuddyEmail(e.target.value)}
                    required
                  />
                  <Button type="submit">
                    Connect
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Progress Comparison */}
          {connected && (
            <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
              {/* Your Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall</span>
                    <span className="text-2xl font-bold text-primary">75%</span>
                  </div>
                  <Progress value={75} className="h-3" />
                  
                  <div className="space-y-3 pt-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Morning Study</span>
                        <span className="text-accent">7 day streak 🔥</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Exercise</span>
                        <span className="text-accent">5 day streak 🔥</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Buddy's Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sarah's Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall</span>
                    <span className="text-2xl font-bold text-primary">82%</span>
                  </div>
                  <Progress value={82} className="h-3" />
                  
                  <div className="space-y-3 pt-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Reading Time</span>
                        <span className="text-accent">12 day streak 🔥</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Meditation</span>
                        <span className="text-accent">9 day streak 🔥</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Messages */}
          {connected && (
            <Card className="mt-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Quick Motivation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => sendMessage("Keep going!")}
                    className="h-auto py-3"
                  >
                    Keep going! 💪
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => sendMessage("Nice work!")}
                    className="h-auto py-3"
                  >
                    Nice work! 🌟
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => sendMessage("You got this!")}
                    className="h-auto py-3"
                  >
                    You got this! 🚀
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => sendMessage("Great streak!")}
                    className="h-auto py-3"
                  >
                    Great streak! 🔥
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyBuddy;
