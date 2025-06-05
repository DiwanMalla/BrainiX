"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className="flex items-center gap-2"
      aria-label="Go back to previous page"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
}
