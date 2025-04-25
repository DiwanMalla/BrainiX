"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Edit, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Note, Course } from "@/types/my-learning";

interface CourseNotesProps {
  course: Course;
  lessonId: string;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  setShowNotes: (value: boolean) => void;
}

export default function CourseNotes({
  course,
  lessonId,
  notes,
  setNotes,
  setShowNotes,
}: CourseNotesProps) {
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddNote = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) {
      toast({
        title: "Error",
        description: "Note content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("/api/courses/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          lessonId,
          content: newNoteContent,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add note");
      }

      const newNote = await res.json();
      setNotes([newNote, ...notes]);
      setNewNoteContent("");
      setIsDialogOpen(false);
      toast({
        title: "Note Added",
        description: "Your note has been added successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add note.",
        variant: "destructive",
      });
    }
  };

  const handleEditNote = async () => {
    if (!editingNote || !newNoteContent.trim()) {
      toast({
        title: "Error",
        description: "Note content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("/api/courses/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteId: editingNote.id,
          content: newNoteContent,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update note");
      }

      const updatedNote = await res.json();
      setNotes(
        notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
      );
      setNewNoteContent("");
      setEditingNote(null);
      setIsDialogOpen(false);
      toast({
        title: "Note Updated",
        description: "Your note has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update note.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const res = await fetch("/api/courses/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete note");
      }

      setNotes(notes.filter((note) => note.id !== noteId));
      toast({
        title: "Note Deleted",
        description: "Your note has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete note.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 bg-muted/50 border-b flex justify-between items-center">
          <h3 className="font-semibold">Your Notes</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowNotes(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mb-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingNote ? "Edit Note" : "Add Note"}
                </DialogTitle>
              </DialogHeader>
              <Textarea
                className="min-h-[100px]"
                placeholder="Write your note here..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewNoteContent("");
                    setEditingNote(null);
                    setIsDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={editingNote ? handleEditNote : handleAddNote}>
                  {editingNote ? "Save Changes" : "Add Note"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <ScrollArea className="h-[300px]">
            {notes.length === 0 ? (
              <p className="text-muted-foreground">
                No notes yet. Add one above!
              </p>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <Card key={note.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm">{note.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created: {new Date(note.createdAt).toLocaleString()}
                        </p>
                        {note.createdAt !== note.updatedAt && (
                          <p className="text-xs text-muted-foreground">
                            Updated: {new Date(note.updatedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setNewNoteContent(note.content);
                            setEditingNote(note);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
