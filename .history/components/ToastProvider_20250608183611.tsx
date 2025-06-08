// components/ToastProvider.tsx
"use client";

import { useToast } from "@/hooks/use-toast";

export default function ToastProvider() {
  const { ToastContainer } = useToast();
  return <ToastContainer />;
}
