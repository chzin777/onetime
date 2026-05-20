"use client";

import { useEffect, useState } from "react";
import { Clock, Save, Copy, CalendarOff, Check } from "lucide-react";
import { useData } from "@/lib/store";
import { defaultHours, type DayHours } from "@/lib/mock-data";

export default function HoursPage() {
  const { establishments, hoursByEst, setHours } = useData();
  const [estId, setEstId] = useState<string>(establishments[0]?.id ?? "");
  const [hours, setLocalHours] = useState<DayHours[]>(
    hoursByEst[estId] ?? defaultHours
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalHours(hoursByEst[estId] ?? defaultHours);
  }, [estId, hoursByEst]);

  function update(idx: number, patch: Partial<DayHours>) {
    setLocalHours((prev) => prev.map((h, i) => (i === idx ? { ...h, ...patch } : h)));
  }

  function copyToAll(idx: number) {
    const src = hours[idx];
    setLocalHours((prev) =>
      prev.map((h) => ({ ...h, open: src.open, from: src.from, to: src.to }))
    );
  }

  function save() {
    setHours(estId, hours);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  if (!estId) {
    return (
      <div className="bg-white rounded-2xl border p-12 text-center text-sm text-slate-500">
        Cadastre um estabelecimento antes de configurar horários.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Horários de atendimento</h1>
          <p className="text-slate-500 text-sm">
            Defina os horários por estabelecimento.
          </p>
        </div>
        <button
          onClick={save}
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Salvo!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Salvar alterações
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-2xl border">
        <div className="p-5 border-b flex items-center gap-4 flex-wrap">
          <label className="text-sm font-medium">Estabelecimento:</label>
          <select
            value={estId}
            onChange={(e) => setEstId(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
          >
            {establishments.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        <div className="divide-y">
          {hours.map((h, idx) => (
            <div key={h.day} className="px-5 h-20 flex items-center gap-4 flex-wrap">
              <div className="w-24 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">{h.day}</span>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={h.open}
                  onChange={(e) => update(idx, { open: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 relative transition">
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${h.open ? "translate-x-5" : ""}`} />
                </div>
                <span className="text-sm text-slate-600">{h.open ? "Aberto" : "Fechado"}</span>
              </label>

              {h.open ? (
                <div className="flex items-center gap-2 ml-auto flex-wrap">
                  <input
                    type="time"
                    value={h.from}
                    onChange={(e) => update(idx, { from: e.target.value })}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm"
                  />
                  <span className="text-slate-400">até</span>
                  <input
                    type="time"
                    value={h.to}
                    onChange={(e) => update(idx, { to: e.target.value })}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm"
                  />
                  <button
                    onClick={() => copyToAll(idx)}
                    className="p-1.5 rounded hover:bg-slate-100"
                    title="Replicar para todos os dias"
                    aria-label="Copiar"
                  >
                    <Copy className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              ) : (
                <div className="ml-auto flex items-center gap-2 text-sm text-slate-400">
                  <CalendarOff className="w-4 h-4" />
                  Não atendemos
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <h3 className="font-semibold text-amber-900">Datas especiais</h3>
        <p className="text-sm text-amber-800 mt-1">
          Em breve: configure feriados, folgas e horários especiais por data.
        </p>
      </div>
    </div>
  );
}
