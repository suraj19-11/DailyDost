import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Calendar, Target, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    joinDate: "",
    totalHabits: 0,
    completionRate: 0,
  });

  useEffect(() => {
    if (user) {
      const habitsKey = `dailydost_habits_${user.id}`;
      const storedHabits = localStorage.getItem(habitsKey);
      const habits = storedHabits ? JSON.parse(storedHabits) : [];
      
      // Calculate completion rate
      let totalCompleted = 0;
      let totalEntries = 0;
      
      habits.forEach((habit: any) => {
        if (habit.completionHistory) {
          habit.completionHistory.forEach((entry: any) => {
            totalEntries++;
            if (entry.status === 'completed') {
              totalCompleted++;
            }
          });
        }
      });
      
      const completionRate = totalEntries > 0 ? Math.round((totalCompleted / totalEntries) * 100) : 0;
      
      setProfileData({
        name: user.name,
        email: user.email,
        joinDate: format(new Date(user.joinDate), "MMMM yyyy"),
        totalHabits: habits.length,
        completionRate,
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "See you soon!",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Your Profile
            </h1>
            <p className="text-muted-foreground">
              Track your journey and manage your account
            </p>
          </div>

          {/* Profile Info */}
          <Card className="mb-6 animate-slide-up">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <p className="text-lg font-medium">{profileData.name}</p>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="text-lg font-medium">{profileData.email}</p>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Member since {profileData.joinDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold text-foreground mb-1">
                    {profileData.totalHabits}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Habits</p>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-3xl font-bold text-foreground mb-1">
                    {profileData.completionRate}%
                  </p>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logout */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardContent className="pt-6">
              <Button 
                variant="destructive" 
                className="w-full gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
