import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, CheckCircle, BookOpen, Heart, Sparkles, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Habit {
  id: number;
  title: string;
  category: string;
  streak: number;
  completed: boolean;
  progress: number;
  frequency: string;
  reminderTime?: string;
  completionHistory?: { date: string; status: 'completed' | 'failed' | 'skipped' }[];
}

const Dashboard = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const userName = user?.name || "Student";
  const habitsKey = `dailydost_habits_${user?.id}`;

  // Load habits from localStorage on mount
  useEffect(() => {
    if (user) {
      const storedHabits = localStorage.getItem(habitsKey);
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      }
    }
  }, [user, habitsKey]);

  const toggleComplete = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        const newCompleted = !habit.completed;
        const newProgress = newCompleted ? 100 : Math.max(60, habit.progress - 10);
        const newStreak = newCompleted ? habit.streak + 1 : habit.streak;
        
        const history = habit.completionHistory || [];
        const todayIndex = history.findIndex(entry => entry.date === today);
        
        let newHistory;
        if (newCompleted) {
          if (todayIndex >= 0) {
            newHistory = [...history];
            newHistory[todayIndex] = { date: today, status: 'completed' };
          } else {
            newHistory = [...history, { date: today, status: 'completed' }];
          }
        } else {
          if (todayIndex >= 0) {
            newHistory = history.filter((_, index) => index !== todayIndex);
          } else {
            newHistory = history;
          }
        }
        
        return { 
          ...habit, 
          completed: newCompleted, 
          progress: newProgress, 
          streak: newStreak,
          completionHistory: newHistory
        };
      }
      return habit;
    });
    setHabits(updatedHabits);
    localStorage.setItem(habitsKey, JSON.stringify(updatedHabits));
    
    const habit = habits.find(h => h.id === id);
    toast({
      title: habit?.completed ? "Unmarked!" : "Great job! 🎉",
      description: habit?.completed ? "Keep track of your progress" : "Habit completed for today",
    });
  };

  const skipHabit = (id: number) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedHabits = habits.map(habit => {
      if (habit.id === id) {
        const history = habit.completionHistory || [];
        const todayIndex = history.findIndex(entry => entry.date === today);
        
        let newHistory;
        if (todayIndex >= 0) {
          newHistory = [...history];
          newHistory[todayIndex] = { date: today, status: 'skipped' };
        } else {
          newHistory = [...history, { date: today, status: 'skipped' }];
        }
        
        return {
          ...habit,
          completionHistory: newHistory,
        };
      }
      return habit;
    });

    setHabits(updatedHabits);
    localStorage.setItem(habitsKey, JSON.stringify(updatedHabits));
    toast({
      title: "Task Skipped ⏭️",
      description: "You can complete it tomorrow!",
    });
  };

  const deleteHabit = (id: number) => {
    const updatedHabits = habits.filter(habit => habit.id !== id);
    setHabits(updatedHabits);
    localStorage.setItem(habitsKey, JSON.stringify(updatedHabits));
    toast({
      title: "Habit deleted",
      description: "The habit has been removed from your dashboard",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Academic": return <BookOpen className="w-5 h-5 text-primary" />;
      case "Health": return <Heart className="w-5 h-5 text-accent" />;
      case "Personal": return <Sparkles className="w-5 h-5 text-purple-500" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Keep building your momentum – every day counts!
            </p>
          </div>

          {/* Add Habit Button */}
          <div className="mb-8">
            <Link to="/habit/new">
              <Button className="gap-2 shadow-lg hover:shadow-xl transition-shadow">
                <Plus className="w-4 h-4" />
                Add New Habit
              </Button>
            </Link>
          </div>

          {/* Habits Grid */}
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {habits.map((habit, index) => (
              <Card 
                key={habit.id} 
                className="hover:shadow-xl transition-all duration-300 animate-slide-up border-2 hover:border-primary/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getCategoryIcon(habit.category)}
                      <CardTitle className="text-base md:text-lg truncate">{habit.title}</CardTitle>
                    </div>
                    {habit.completed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteHabit(habit.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{habit.category} • {habit.frequency}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Momentum Score</span>
                      <span className="font-semibold text-primary">{habit.progress}%</span>
                    </div>
                    <Progress value={habit.progress} className="h-2.5" />
                  </div>

                  <div className="flex items-center justify-between py-2 px-3 bg-accent/10 rounded-lg">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Streak: </span>
                      <span className="font-bold text-accent text-base">{habit.streak} days 🔥</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!habit.completed && (
                      <Button
                        onClick={() => skipHabit(habit.id)}
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        title="Skip for today"
                      >
                        <span className="text-sm">⏭️</span>
                        Skip
                      </Button>
                    )}
                    <Button 
                      onClick={() => toggleComplete(habit.id)}
                      variant={habit.completed ? "outline" : "default"}
                      className="flex-1 gap-2 font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {habit.completed ? "Completed Today ✓" : "Mark as Done"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {habits.length === 0 && (
            <Card className="text-center py-16 animate-fade-in border-2 border-dashed">
              <CardContent className="space-y-4">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-foreground">No habits yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Start building your routine! Create your first habit and begin your journey to success.
                </p>
                <Link to="/habit/new">
                  <Button className="gap-2 shadow-lg">
                    <Plus className="w-4 h-4" />
                    Create Your First Habit
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
