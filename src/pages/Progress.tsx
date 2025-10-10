import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Flame, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Habit {
  id: number;
  title: string;
  streak: number;
  completionHistory?: { date: string; status: 'completed' | 'failed' | 'skipped' }[];
}

const Progress = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [progressData, setProgressData] = useState({
    completed: 0,
    failed: 0,
    skipped: 0,
    total: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const habitsKey = `dailydost_habits_${user.id}`;
    const storedHabits = localStorage.getItem(habitsKey);
    if (storedHabits) {
      const parsedHabits = JSON.parse(storedHabits);
      setHabits(parsedHabits);
      
      // Calculate progress statistics
      let completed = 0, failed = 0, skipped = 0;
      parsedHabits.forEach((habit: Habit) => {
        if (habit.completionHistory) {
          habit.completionHistory.forEach(entry => {
            if (entry.status === 'completed') completed++;
            else if (entry.status === 'failed') failed++;
            else if (entry.status === 'skipped') skipped++;
          });
        }
      });
      
      setProgressData({
        completed,
        failed,
        skipped,
        total: completed + failed + skipped
      });
    }
  }, [user]);

  // Generate daily data for the last 7 days
  const generateDailyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    
    return days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const dateStr = date.toISOString().split('T')[0];
      
      let completed = 0, failed = 0, skipped = 0;
      
      habits.forEach(habit => {
        if (habit.completionHistory) {
          const entry = habit.completionHistory.find(e => e.date === dateStr);
          if (entry) {
            if (entry.status === 'completed') completed++;
            else if (entry.status === 'failed') failed++;
            else if (entry.status === 'skipped') skipped++;
          }
        }
      });
      
      return { name: day, completed, failed, skipped };
    });
  };

  // Generate weekly data for the last 4 weeks
  const generateWeeklyData = () => {
    return Array.from({ length: 4 }, (_, weekIndex) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (7 * (4 - weekIndex)));
      
      let completed = 0, failed = 0, skipped = 0;
      
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + day);
        const dateStr = date.toISOString().split('T')[0];
        
        habits.forEach(habit => {
          if (habit.completionHistory) {
            const entry = habit.completionHistory.find(e => e.date === dateStr);
            if (entry) {
              if (entry.status === 'completed') completed++;
              else if (entry.status === 'failed') failed++;
              else if (entry.status === 'skipped') skipped++;
            }
          }
        });
      }
      
      return { name: `Week ${weekIndex + 1}`, completed, failed, skipped };
    });
  };

  // Generate monthly data for the last 6 months
  const generateMonthlyData = () => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    
    return months.map((month, index) => {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
      const nextMonth = new Date(today.getFullYear(), today.getMonth() - (5 - index) + 1, 1);
      
      let completed = 0, failed = 0, skipped = 0;
      
      habits.forEach(habit => {
        if (habit.completionHistory) {
          habit.completionHistory.forEach(entry => {
            const entryDate = new Date(entry.date);
            if (entryDate >= monthDate && entryDate < nextMonth) {
              if (entry.status === 'completed') completed++;
              else if (entry.status === 'failed') failed++;
              else if (entry.status === 'skipped') skipped++;
            }
          });
        }
      });
      
      return { name: month, completed, failed, skipped };
    });
  };

  // Sort habits by streak
  const topStreaks = [...habits].sort((a, b) => b.streak - a.streak).slice(0, 5);

  const dailyData = generateDailyData();
  const weeklyData = generateWeeklyData();
  const monthlyData = generateMonthlyData();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Progress Overview 📊
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Track your journey and celebrate your wins
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{progressData.completed}</div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-destructive" />
                  Failed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">{progressData.failed}</div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Skipped
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-muted-foreground">{progressData.skipped}</div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{progressData.total}</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <Card className="mb-8 border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">Progress Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="daily" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>

                <TabsContent value="daily">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completed" fill="hsl(var(--primary))" />
                        <Bar dataKey="failed" fill="hsl(var(--destructive))" />
                        <Bar dataKey="skipped" fill="hsl(var(--muted))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Daily Average: {(dailyData.reduce((sum, d) => sum + d.completed, 0) / dailyData.length).toFixed(1)} tasks completed
                  </p>
                </TabsContent>

                <TabsContent value="weekly">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="completed" stroke="hsl(var(--primary))" strokeWidth={2} />
                        <Line type="monotone" dataKey="failed" stroke="hsl(var(--destructive))" strokeWidth={2} />
                        <Line type="monotone" dataKey="skipped" stroke="hsl(var(--muted))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Weekly Average: {(weeklyData.reduce((sum, d) => sum + d.completed, 0) / weeklyData.length).toFixed(1)} tasks completed
                  </p>
                </TabsContent>

                <TabsContent value="monthly">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completed" fill="hsl(var(--primary))" />
                        <Bar dataKey="failed" fill="hsl(var(--destructive))" />
                        <Bar dataKey="skipped" fill="hsl(var(--muted))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Monthly Average: {(monthlyData.reduce((sum, d) => sum + d.completed, 0) / monthlyData.length).toFixed(1)} tasks completed
                  </p>
                </TabsContent>

                <TabsContent value="yearly">
                  <div className="h-[300px] w-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-6xl font-bold text-primary mb-4">{progressData.completed}</p>
                      <p className="text-xl text-muted-foreground">Total Tasks Completed This Year</p>
                      <p className="text-sm text-muted-foreground mt-4">
                        Yearly Average: {(progressData.completed / 12).toFixed(1)} tasks/month
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Streak Leaderboard */}
          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                <Flame className="w-6 h-6 text-accent" />
                Top Streaks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topStreaks.length > 0 ? (
                <div className="space-y-3">
                  {topStreaks.map((habit, index) => (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between p-4 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                        <div>
                          <p className="font-semibold text-foreground">{habit.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-accent">
                        <Flame className="w-5 h-5" />
                        <span className="text-xl font-bold">{habit.streak}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No streaks yet. Start completing habits to build your streaks! 🔥
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Progress;
