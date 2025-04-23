"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, X } from "lucide-react";

interface CourseNotesProps {
  notes: string;
  setNotes: (value: string) => void;
  saveNotes: () => void;
  setShowNotes: (value: boolean) => void;
}

export default function CourseNotes({
  notes,
  setNotes,
  saveNotes,
  setShowNotes,
}: CourseNotesProps) {
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
          <Textarea
            className="min-h-[200px] mb-3"
            placeholder="Take notes for this lesson..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={saveNotes}>
              <PenLine className="h-4 w-4 mr-2" />
              Save Notes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
