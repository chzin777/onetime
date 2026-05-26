"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";
type Toast = { id: string; title: string; description?: string; kind: ToastKind; duration: number };

type ToastApi = {
  show: (t: Omit<Toast, "id" | "duration"> & { duration?: number }) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  confirm: (opts: { title: string; description?: string; confirmLabel?: string; cancelLabel?: string; danger?: boolean }) => Promise<boolean>;
};

const Ctx = createContext<ToastApi | null>(null);

const iconMap: Record<ToastKind, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};

const colorMap: Record<ToastKind, string> = {
  success: "bg-emerald-600 text-white",
  error: "bg-rose-600 text-white",
  info: "bg-slate-900 text-white",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<null | {
    title: string;
    description?: string;
    confirmLabel: string;
    cancelLabel: string;
    danger: boolean;
    resolve: (v: boolean) => void;
  }>(null);
  const idRef = useRef(0);

  const show = useCallback((t: Omit<Toast, "id" | "duration"> & { duration?: number }) => {
    const id = String(++idRef.current);
    const toast: Toast = { id, duration: 3200, ...t };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, toast.duration);
  }, []);

  const api: ToastApi = {
    show,
    success: (title, description) => show({ title, description, kind: "success" }),
    error: (title, description) => show({ title, description, kind: "error" }),
    info: (title, description) => show({ title, description, kind: "info" }),
    confirm: ({ title, description, confirmLabel = "Confirmar", cancelLabel = "Cancelar", danger = false }) =>
      new Promise<boolean>((resolve) => {
        setConfirmState({ title, description, confirmLabel, cancelLabel, danger, resolve });
      }),
  };

  function closeConfirm(result: boolean) {
    if (confirmState) {
      confirmState.resolve(result);
      setConfirmState(null);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && confirmState) closeConfirm(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmState]);

  return (
    <Ctx.Provider value={api}>
      {children}

      <div className="fixed left-0 right-0 bottom-0 z-[100] flex flex-col items-center gap-2 px-3 pb-3 pb-safe pointer-events-none">
        {toasts.map((t) => {
          const Icon = iconMap[t.kind];
          return (
            <div
              key={t.id}
              className={`toast-in pointer-events-auto w-full max-w-sm flex items-start gap-3 rounded-2xl px-4 py-3 shadow-2xl ${colorMap[t.kind]}`}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm leading-tight">{t.title}</div>
                {t.description && <div className="text-xs opacity-90 mt-0.5 leading-snug">{t.description}</div>}
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                className="shrink-0 p-0.5 opacity-70 hover:opacity-100"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {confirmState && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 fade-in" onClick={() => closeConfirm(false)} />
          <div className="relative w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl sheet-enter pb-safe">
            <div className="pt-2 sm:hidden">
              <div className="sheet-handle" />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg">{confirmState.title}</h3>
              {confirmState.description && (
                <p className="mt-2 text-sm text-slate-500">{confirmState.description}</p>
              )}
              <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button
                  onClick={() => closeConfirm(false)}
                  className="press h-12 px-5 rounded-xl border bg-white font-semibold text-sm hover:bg-slate-50"
                >
                  {confirmState.cancelLabel}
                </button>
                <button
                  onClick={() => closeConfirm(true)}
                  className={`press h-12 px-5 rounded-xl font-semibold text-sm text-white ${
                    confirmState.danger ? "bg-rose-600 hover:bg-rose-700" : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {confirmState.confirmLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
