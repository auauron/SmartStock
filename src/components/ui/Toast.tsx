import { useState, useEffect, useCallback, useRef } from "react";
import { X, Undo2 } from "lucide-react";

export interface ToastData {
  id: string;
  message: string;
  onUndo?: () => void;
  durationMs?: number;
}

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const duration = toast.durationMs ?? 5000;
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    const frame = () => {
      const elapsed = Date.now() - startRef.current;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining > 0) {
        rafId = requestAnimationFrame(frame);
      }
    };

    let rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [duration]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 200);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss, toast.id]);

  const handleUndo = () => {
    toast.onUndo?.();
    setVisible(false);
    setTimeout(() => onDismiss(toast.id), 200);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onDismiss(toast.id), 200);
  };

  return (
    <div
      role="alert"
      className="relative overflow-hidden bg-gray-900 text-white rounded-lg shadow-lg"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.2s ease, transform 0.2s ease",
        minWidth: "320px",
        maxWidth: "420px",
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-sm flex-1">{toast.message}</span>

        {toast.onUndo && (
          <button
            onClick={handleUndo}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors shrink-0"
          >
            <Undo2 className="w-3.5 h-3.5" />
            Undo
          </button>
        )}

        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700">
        <div
          className="h-full bg-emerald-500 transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, dismissToast };
}
