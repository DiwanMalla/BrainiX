"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PenLine, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LessonNotesProps {
  courseId: string;
  lessonId: string;
  initialNotes: string | null;
  onClose: () => void;
}

export default function LessonNotes({
  courseId,
  lessonId,
  initialNotes,
  onClose,
}: LessonNotesProps) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveNotes = useCallback(async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/courses/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          lessonId,
          notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save notes");
      }

      toast({
        title: "Notes Saved",
        description: "Your notes have been saved successfully.",
      });
    } catch (error: any) {
      console.error("Save notes error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save notes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [courseId, lessonId, notes, toast]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 bg-muted/50 border-b flex justify-between items-center">
          <h3 className="font-semibold">Your Notes</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <Textarea
            className="min-h-[200px] mb-3"
            placeholder="Take notes for this lesson..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isSaving}
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={saveNotes} disabled={isSaving}>
              <PenLine className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Notes"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
