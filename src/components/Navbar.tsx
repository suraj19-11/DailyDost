import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Timer, Users, UserCircle, Menu, TrendingUp, BookOpen } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const NavLinks = () => (
    <>
      <Link to="/dashboard" onClick={() => setOpen(false)}>
        <Button
          variant={isActive("/dashboard") ? "default" : "ghost"}
          size="sm"
          className="gap-2 w-full md:w-auto justify-start"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </Button>
      </Link>
      
      <Link to="/progress">
        <Button
          variant={isActive("/progress") ? "default" : "ghost"}
          size="sm"
          className="gap-2 w-full md:w-auto justify-start"
          onClick={() => setOpen(false)}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Progress</span>
        </Button>
      </Link>
      
      <Link to="/focus">
        <Button
          variant={isActive("/focus") ? "default" : "ghost"}
          size="sm"
          className="gap-2 w-full md:w-auto justify-start"
          onClick={() => setOpen(false)}
        >
          <Timer className="w-4 h-4" />
          <span>Focus Mode</span>
        </Button>
      </Link>
      
      <Link to="/notes">
        <Button
          variant={isActive("/notes") ? "default" : "ghost"}
          size="sm"
          className="gap-2 w-full md:w-auto justify-start"
          onClick={() => setOpen(false)}
        >
          <BookOpen className="w-4 h-4" />
          <span>Notes</span>
        </Button>
      </Link>
      
      <Link to="/buddy">
        <Button
          variant={isActive("/buddy") ? "default" : "ghost"}
          size="sm"
          className="gap-2 w-full md:w-auto justify-start"
          onClick={() => setOpen(false)}
        >
          <Users className="w-4 h-4" />
          <span>Study Buddy</span>
        </Button>
      </Link>
      
      <Link to="/profile">
        <Button
          variant={isActive("/profile") ? "default" : "ghost"}
          size="sm"
          className="gap-2 w-full md:w-auto justify-start"
          onClick={() => setOpen(false)}
        >
          <UserCircle className="w-4 h-4" />
          <span>Profile</span>
        </Button>
      </Link>
    </>
  );

  return (
    <nav className="bg-card/95 border-b sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="text-xl md:text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
            DailyDost
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLinks />
          </div>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
