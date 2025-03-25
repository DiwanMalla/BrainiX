// src/hooks/use-toast.ts
import { useCallback, useState } from "react";

export type ToastVariant = "default" | "success" | "destructive";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({
      title,
      description,
      variant = "default",
      duration = 3000,
    }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [
        ...prev,
        { id, title, description, variant, duration },
      ]);

      // Auto-remove toast after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  // Toast Container Component
  const ToastContainer = () => (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-md p-4 shadow-lg text-white animate-in slide-in-from-bottom-4 duration-300 ${
            t.variant === "success"
              ? "bg-green-500"
              : t.variant === "destructive"
              ? "bg-red-500"
              : "bg-gray-800"
          }`}
        >
          {t.title && <h3 className="font-bold">{t.title}</h3>}
          {t.description && <p>{t.description}</p>}
        </div>
      ))}
    </div>
  );

  return { toast, ToastContainer };
}
