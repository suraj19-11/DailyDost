import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, RotateCcw } from "lucide-react";

const FocusMode = () => {
  const [selectedHabit, setSelectedHabit] = useState("");
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (!isBreak) {
      toast({
        title: "Focus session complete! 🎉",
        description: "Great work! Take a 5-minute break.",
      });
      
      // Auto-mark habit as complete
      if (selectedHabit) {
        toast({
          title: "Habit marked complete",
          description: "Your progress has been updated on the dashboard.",
        });
      }
      
      // Switch to break
      setMinutes(5);
      setSeconds(0);
      setIsBreak(true);
    } else {
      toast({
        title: "Break time over!",
        description: "Ready for another focus session?",
      });
      setMinutes(25);
      setSeconds(0);
      setIsBreak(false);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(isBreak ? 5 : 25);
    setSeconds(0);
  };

  const progress = isBreak 
    ? ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100
    : ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Focus Mode 🎯
            </h1>
            <p className="text-muted-foreground">
              Use the Pomodoro technique to stay focused and productive
            </p>
          </div>

          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>
                {isBreak ? "Break Time ☕" : "Focus Session 📚"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Habit Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Habit (Optional)</label>
                <Select value={selectedHabit} onValueChange={setSelectedHabit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a habit to track" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="study">Morning Study Session</SelectItem>
                    <SelectItem value="read">Read 20 pages</SelectItem>
                    <SelectItem value="practice">Practice coding</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Timer Display */}
              <div className="relative">
                <div className="text-center py-12">
                  <div className="text-7xl md:text-8xl font-bold text-foreground mb-4">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-3 justify-center">
                <Button
                  size="lg"
                  onClick={toggleTimer}
                  className="gap-2"
                >
                  {isActive ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Start
                    </>
                  )}
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  onClick={resetTimer}
                  className="gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </Button>
              </div>

              {/* Info */}
              <div className="text-center text-sm text-muted-foreground pt-4">
                {isBreak ? (
                  <p>Take a short break to recharge 🌟</p>
                ) : (
                  <p>Focus for 25 minutes, then take a 5-minute break</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
