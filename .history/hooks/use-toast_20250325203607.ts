// src/hooks/use-toast.ts
import { useContext } from "react";
import { ToastContext } from "@/components/ui/toast";

export type ToastVariant = "default" | "destructive" | "success";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export function useToast() {
  const { addToast } = useContext(ToastContext);

  if (!addToast) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const toast = ({
    title,
    description,
    variant,
    duration,
  }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    addToast({ id, title, description, variant, duration });
  };

  return { toast };
}
