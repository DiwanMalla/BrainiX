"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

export function CourseGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="relative h-[400px] animate-pulse rounded-lg bg-muted/50"
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border p-4 animate-pulse">
      <div className="h-48 bg-muted/50 rounded-md mb-4" />
      <div className="space-y-3">
        <div className="h-5 w-2/3 bg-muted/50 rounded" />
        <div className="h-4 w-full bg-muted/50 rounded" />
        <div className="h-4 w-4/5 bg-muted/50 rounded" />
      </div>
    </div>
  );
}
