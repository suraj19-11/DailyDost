import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";

const HabitForm = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [frequency, setFrequency] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [customDays, setCustomDays] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day: string) => {
    setCustomDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const habitsKey = `dailydost_habits_${user.id}`;
    
    // Get existing habits from localStorage
    const storedHabits = localStorage.getItem(habitsKey);
    const habits = storedHabits ? JSON.parse(storedHabits) : [];
    
    // Create new habit
    const newHabit = {
      id: Date.now(),
      title,
      category,
      frequency: frequency === 'custom' ? customDays.join(', ') : frequency,
      reminderTime,
      streak: 0,
      completed: false,
      progress: 60,
      completionHistory: []
    };
    
    // Save to localStorage
    const updatedHabits = [...habits, newHabit];
    localStorage.setItem(habitsKey, JSON.stringify(updatedHabits));
    
    toast({
      title: "Habit created! 🎯",
      description: "Your new habit has been added to your dashboard.",
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-4 gap-2"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <Card className="animate-fade-in border-2 shadow-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl md:text-3xl">Create New Habit</CardTitle>
              <p className="text-sm text-muted-foreground">Build a new routine that sticks</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Habit Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., Morning Study Session"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency *</Label>
                  <Select value={frequency} onValueChange={setFrequency} required>
                    <SelectTrigger>
                      <SelectValue placeholder="How often?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Everyday">Everyday</SelectItem>
                      <SelectItem value="Weekdays">Weekdays (Mon-Fri)</SelectItem>
                      <SelectItem value="Weekends">Weekends (Sat-Sun)</SelectItem>
                      <SelectItem value="custom">Choose Specific Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {frequency === 'custom' && (
                  <div className="space-y-2">
                    <Label>Select Days</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {daysOfWeek.map(day => (
                        <Button
                          key={day}
                          type="button"
                          variant={customDays.includes(day) ? 'default' : 'outline'}
                          onClick={() => toggleDay(day)}
                          className="w-full text-sm"
                        >
                          {day.slice(0, 3)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reminder">Reminder Time *</Label>
                  <Input
                    id="reminder"
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    We'll notify you at this time to complete your habit
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    Create Habit
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HabitForm;
