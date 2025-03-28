import { useCallback, useRef, useState } from "react";

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
  const toastsRef = useRef<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => {
      const updatedToasts = prev.filter((t) => t.id !== id);
      toastsRef.current = updatedToasts;
      return updatedToasts;
    });
  }, []);

  const toast = useCallback(
    ({
      title,
      description,
      variant = "default",
      duration = 3000,
    }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = { id, title, description, variant, duration };

      toastsRef.current = [...toastsRef.current, newToast];
      setToasts(toastsRef.current);

      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  // Toast Container Component
  const ToastContainer = () => (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      role="alert"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-md p-4 shadow-lg text-white animate-in slide-in-from-bottom-4 fade-out duration-300 ${
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
