import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, BookOpen, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  category: 'challenge' | 'mistake' | 'reflection';
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<'challenge' | 'mistake' | 'reflection'>('reflection');
  const { toast } = useToast();
  const { user } = useAuth();
  
  const notesKey = `dailydost_notes_${user?.id}`;

  useEffect(() => {
    if (user) {
      const storedNotes = localStorage.getItem(notesKey);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    }
  }, [user, notesKey]);

  const handleAddNote = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      title,
      content,
      date: new Date().toISOString(),
      category
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem(notesKey, JSON.stringify(updatedNotes));

    toast({
      title: "Note saved! 📝",
      description: "Your reflection has been recorded"
    });

    setTitle("");
    setContent("");
    setIsAdding(false);
  };

  const handleDeleteNote = (id: number) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem(notesKey, JSON.stringify(updatedNotes));
    
    toast({
      title: "Note deleted",
      description: "Your note has been removed"
    });
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'challenge': return 'text-accent';
      case 'mistake': return 'text-destructive';
      case 'reflection': return 'text-primary';
      default: return 'text-foreground';
    }
  };

  const getCategoryBg = (cat: string) => {
    switch (cat) {
      case 'challenge': return 'bg-accent/10';
      case 'mistake': return 'bg-destructive/10';
      case 'reflection': return 'bg-primary/10';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Learning Notes 📝
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Reflect on challenges, learn from mistakes, and track your growth
            </p>
          </div>

          {/* Add Note Button */}
          <div className="mb-8">
            {!isAdding ? (
              <Button onClick={() => setIsAdding(true)} className="gap-2 shadow-lg">
                <Plus className="w-4 h-4" />
                Add New Note
              </Button>
            ) : (
              <Card className="border-2 shadow-xl animate-fade-in">
                <CardHeader>
                  <CardTitle>New Note</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Why I struggled with morning study"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={category === 'reflection' ? 'default' : 'outline'}
                        onClick={() => setCategory('reflection')}
                        className="flex-1"
                      >
                        Reflection
                      </Button>
                      <Button
                        type="button"
                        variant={category === 'challenge' ? 'default' : 'outline'}
                        onClick={() => setCategory('challenge')}
                        className="flex-1"
                      >
                        Challenge
                      </Button>
                      <Button
                        type="button"
                        variant={category === 'mistake' ? 'default' : 'outline'}
                        onClick={() => setCategory('mistake')}
                        className="flex-1"
                      >
                        Mistake
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Your Thoughts</Label>
                    <Textarea
                      id="content"
                      placeholder="Write about what you learned, what went wrong, or how you can improve..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleAddNote} className="flex-1">
                      Save Note
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAdding(false);
                        setTitle("");
                        setContent("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Notes List */}
          <div className="space-y-4">
            {notes.length > 0 ? (
              notes.map((note) => (
                <Card
                  key={note.id}
                  className="border-2 hover:shadow-xl transition-all duration-300 animate-fade-in"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className={`w-4 h-4 ${getCategoryColor(note.category)}`} />
                          <span className={`text-xs font-semibold uppercase ${getCategoryColor(note.category)}`}>
                            {note.category}
                          </span>
                        </div>
                        <CardTitle className="text-lg md:text-xl">{note.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(note.date), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`p-4 rounded-lg ${getCategoryBg(note.category)}`}>
                      <p className="text-foreground whitespace-pre-wrap">{note.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-16 border-2 border-dashed">
                <CardContent className="space-y-4">
                  <div className="text-6xl mb-4">📓</div>
                  <h3 className="text-xl font-semibold text-foreground">No notes yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Start documenting your journey. Reflect on challenges and learn from experiences.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
