"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Smartphone, Sparkles, X } from "lucide-react";

type GyroStatus = "unknown" | "unsupported" | "auto" | "pending" | "granted" | "denied";

type IOSRequestPerm = { requestPermission?: () => Promise<"granted" | "denied"> };

type Ctx = {
  status: GyroStatus;
  enabled: boolean;
  requestGrant: () => Promise<boolean>;
};

const GyroCtx = createContext<Ctx>({ status: "unknown", enabled: false, requestGrant: async () => false });

const STORAGE_KEY = "onetime:gyro:choice";

export function useGyro() {
  return useContext(GyroCtx);
}

export function GyroProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<GyroStatus>("unknown");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch || typeof window.DeviceOrientationEvent === "undefined") {
      setStatus("unsupported");
      return;
    }
    const DOE = window.DeviceOrientationEvent as unknown as IOSRequestPerm;
    const needsPerm = typeof DOE.requestPermission === "function";
    if (!needsPerm) {
      setStatus("auto");
      return;
    }
    const saved = (typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null) as GyroStatus | null;
    if (saved === "granted") {
      setStatus("granted");
    } else if (saved === "denied") {
      setStatus("denied");
    } else {
      setStatus("pending");
      const t = setTimeout(() => setShowModal(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const requestGrant = useCallback(async (): Promise<boolean> => {
    const DOE = window.DeviceOrientationEvent as unknown as IOSRequestPerm;
    if (typeof DOE.requestPermission !== "function") return false;
    try {
      const res = await DOE.requestPermission();
      const ok = res === "granted";
      const next: GyroStatus = ok ? "granted" : "denied";
      setStatus(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      setShowModal(false);
      return ok;
    } catch {
      setStatus("denied");
      try { localStorage.setItem(STORAGE_KEY, "denied"); } catch {}
      setShowModal(false);
      return false;
    }
  }, []);

  function skip() {
    setStatus("denied");
    try { localStorage.setItem(STORAGE_KEY, "denied"); } catch {}
    setShowModal(false);
  }

  const enabled = status === "auto" || status === "granted";

  return (
    <GyroCtx.Provider value={{ status, enabled, requestGrant }}>
      {children}

      {showModal && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm fade-in" onClick={skip} />
          <div className="relative w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl sheet-enter pb-safe overflow-hidden">
            <div className="pt-2 sm:hidden">
              <div className="sheet-handle" />
            </div>
            <button
              onClick={skip}
              className="press absolute top-3 right-3 p-2 rounded-full hover:bg-slate-100 z-10"
              aria-label="Fechar"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>

            <div className="px-6 pt-6 pb-2">
              <div className="relative h-32 mb-4 flex items-center justify-center">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-24 mx-auto max-w-[160px] rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-2xl shadow-indigo-500/30" style={{ transform: "perspective(600px) rotateX(18deg) rotateY(-12deg)" }} />
                <Smartphone className="relative w-16 h-16 text-white" style={{ transform: "perspective(600px) rotateX(18deg) rotateY(-12deg)" }} />
                <Sparkles className="absolute top-2 right-12 w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-center">Ative os efeitos 3D</h2>
              <p className="mt-2 text-sm text-slate-600 text-center">
                Incline seu celular pra dar vida aos cards. Funciona em iPhones modernos e exige sua permissão.
              </p>
            </div>

            <div className="p-6 space-y-2">
              <button
                onClick={requestGrant}
                className="press w-full h-12 inline-flex items-center justify-center gap-2 text-sm font-bold rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
              >
                <Sparkles className="w-4 h-4" />
                Ativar agora
              </button>
              <button
                onClick={skip}
                className="press w-full h-11 text-sm font-semibold text-slate-500"
              >
                Agora não
              </button>
            </div>
          </div>
        </div>
      )}
    </GyroCtx.Provider>
  );
}
