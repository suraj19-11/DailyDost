import { Button } from "@/components/ui/button";
import { BookOpen, Target, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import heroLogo from '../components/assests/HeroLogo.png';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
           <img 
            src={heroLogo} 
            alt="DailyDost Logo" 
             className="mx-auto h-32 md:h-36g mb-6" // Adjust h-20/h-24 for desired size
/>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              From Tracker to Ally – Build Habits That Stick
            </p>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Smart habit tracking for students. Stay consistent with your study routines, 
              wellness goals, and personal development – all in one distraction-free platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 font-semibold px-8">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-background" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 74L60 69.3C120 64.7 240 55.3 360 50.7C480 46 600 46 720 50.7C840 55.3 960 64.7 1080 64.7C1200 64.7 1320 55.3 1380 50.7L1440 46V74H1380C1320 74 1200 74 1080 74C960 74 840 74 720 74C600 74 480 74 360 74C240 74 120 74 60 74H0Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
            Everything You Need to Stay Consistent
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-card animate-slide-up">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Track Habits</h3>
              <p className="text-muted-foreground">
                Build sustainable routines with flexible tracking and momentum scores
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Focus Mode</h3>
              <p className="text-muted-foreground">
                Pomodoro timer to help you stay focused and productive during study sessions
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Study Buddy</h3>
              <p className="text-muted-foreground">
                Connect with friends and motivate each other to stay on track
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-card animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Progress Insights</h3>
              <p className="text-muted-foreground">
                Visualize your consistency and celebrate your growth over time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Build Better Habits?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join DailyDost today and start your journey toward consistent growth
          </p>
          <Link to="/signup">
            <Button size="lg" className="font-semibold px-8">
              Start Free Today
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 DailyDost. Your trusted habit tracking companion.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
