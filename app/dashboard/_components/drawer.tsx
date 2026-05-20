"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

const ANIM_MS = 280;

export type DrawerState<T> = {
  item: T | null;
  open: boolean;
  openWith: (item: T) => void;
  close: () => void;
};

export function useDrawerState<T>(): DrawerState<T> {
  const [item, setItem] = useState<T | null>(null);
  const [open, setOpen] = useState(false);

  function openWith(x: T) {
    setItem(x);
    requestAnimationFrame(() => setOpen(true));
  }

  function close() {
    setOpen(false);
    setTimeout(() => setItem(null), ANIM_MS);
  }

  return { item, open, openWith, close };
}

export default function Drawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      const r = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(r);
    }
    setVisible(false);
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        onClick={onClose}
        className={`flex-1 bg-black/40 backdrop-blur-sm transition-opacity ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: `${ANIM_MS}ms` }}
      />
      <aside
        className={`w-full max-w-xl bg-white shadow-2xl flex flex-col h-full overflow-hidden transition-transform ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transitionDuration: `${ANIM_MS}ms` }}
      >
        <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="min-w-0">
            <h2 className="font-bold truncate">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">{children}</div>

        <div className="px-6 py-4 border-t bg-slate-50 flex items-center justify-end gap-2">
          {footer}
        </div>
      </aside>
    </div>
  );
}
