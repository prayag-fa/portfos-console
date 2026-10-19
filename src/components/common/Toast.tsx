import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastApi {
  push: (kind: ToastKind, message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const STYLES: Record<ToastKind, { icon: typeof Info; tone: string }> = {
  success: { icon: CheckCircle2, tone: 'text-emerald-500' },
  error: { icon: AlertCircle, tone: 'text-rose-500' },
  info: { icon: Info, tone: 'text-slate-800' },
};

const DISMISS_MS = 3800;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = nextId.current++;
      setToasts((t) => [...t.slice(-3), { id, kind, message }]);
      window.setTimeout(() => dismiss(id), DISMISS_MS);
    },
    [dismiss]
  );

  const api = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-24 right-4 z-[100] flex flex-col gap-2 lg:bottom-6 lg:right-6"
      >
        {toasts.map((t) => {
          const { icon: Icon, tone } = STYLES[t.kind];
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex min-w-64 max-w-sm animate-toast-in items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-xl shadow-slate-900/10"
            >
              <Icon className={cn('h-5 w-5 shrink-0', tone)} />
              <p className="flex-1 text-sm font-medium text-slate-800">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastApi => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
