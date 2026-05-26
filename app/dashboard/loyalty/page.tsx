"use client";

import { useMemo, useState } from "react";
import {
  Gift,
  Star,
  Award,
  Trophy,
  Plus,
  Minus,
  TrendingUp,
  Save,
} from "lucide-react";
import { useData } from "@/lib/store";
import { formatBRL } from "@/lib/mock-data";
import { useToast } from "@/app/_components/toast";

export default function LoyaltyPage() {
  const toast = useToast();
  const {
    establishments,
    clients,
    loyaltyConfigs,
    updateLoyaltyConfig,
    addLoyaltyPoints,
    redeemLoyaltyReward,
  } = useData();

  const [activeEst, setActiveEst] = useState<string>(establishments[0]?.id ?? "");

  const cfg = useMemo(
    () =>
      loyaltyConfigs.find((c) => c.establishmentId === activeEst) ?? {
        establishmentId: activeEst,
        enabled: false,
        pointsPerReal: 1,
        rewardThreshold: 500,
        rewardDescription: "Serviço grátis",
      },
    [loyaltyConfigs, activeEst]
  );

  const [draft, setDraft] = useState(cfg);
  useMemo(() => setDraft(cfg), [cfg]);

  const estClients = useMemo(
    () =>
      clients
        .filter((c) => c.establishmentId === activeEst)
        .slice()
        .sort((a, b) => b.loyaltyPoints - a.loyaltyPoints),
    [clients, activeEst]
  );

  const totalPoints = estClients.reduce((acc, c) => acc + c.loyaltyPoints, 0);
  const eligible = estClients.filter((c) => c.loyaltyPoints >= cfg.rewardThreshold).length;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Programa de fidelidade</h1>
          <p className="text-slate-500 text-sm">
            Configure pontos por R$ gasto e a recompensa. Clientes acumulam e resgatam.
          </p>
        </div>
        <select value={activeEst} onChange={(e) => setActiveEst(e.target.value)} className="px-3 py-2 rounded-lg border text-sm">
          {establishments.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl border p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Gift className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold">Configuração</h2>
              <p className="text-xs text-slate-500">Regras do programa</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Programa ativo</span>
            <button
              onClick={() => setDraft({ ...draft, enabled: !draft.enabled })}
              className={`relative w-11 h-6 rounded-full transition ${draft.enabled ? "bg-emerald-500" : "bg-slate-300"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition ${draft.enabled ? "translate-x-5" : ""}`}
              />
            </button>
          </div>

          <Field label="Pontos por R$ gasto">
            <input
              type="number"
              min={0}
              step={0.5}
              value={draft.pointsPerReal}
              onChange={(e) => setDraft({ ...draft, pointsPerReal: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
            />
            <p className="text-[10px] text-slate-500 mt-1">Ex: 1 ponto = R$ 1 / 2 pontos = R$ 1</p>
          </Field>

          <Field label="Pontos para resgate">
            <input
              type="number"
              min={50}
              step={50}
              value={draft.rewardThreshold}
              onChange={(e) => setDraft({ ...draft, rewardThreshold: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
            />
          </Field>

          <Field label="Descrição da recompensa">
            <input
              value={draft.rewardDescription}
              onChange={(e) => setDraft({ ...draft, rewardDescription: e.target.value })}
              placeholder="Ex: Corte grátis, R$50 OFF..."
              className="w-full px-3 py-2 rounded-lg border text-sm"
            />
          </Field>

          <button
            onClick={() => { updateLoyaltyConfig(draft); toast.success("Configuração salva"); }}
            className="press w-full inline-flex items-center justify-center gap-2 h-12 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Save className="w-4 h-4" />
            Salvar configuração
          </button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <StatCard icon={Star} label="Clientes participantes" value={String(estClients.length)} color="bg-indigo-100 text-indigo-600" />
            <StatCard icon={TrendingUp} label="Pontos circulantes" value={totalPoints.toLocaleString("pt-BR")} color="bg-emerald-100 text-emerald-600" />
            <StatCard icon={Trophy} label="Aptos a resgatar" value={String(eligible)} color="bg-amber-100 text-amber-600" />
          </div>

          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Ranking</h3>
                <p className="text-xs text-slate-500">Resgate: {cfg.rewardThreshold} pts → {cfg.rewardDescription}</p>
              </div>
            </div>
            {estClients.length === 0 ? (
              <div className="p-12 text-center text-sm text-slate-500">Nenhum cliente cadastrado.</div>
            ) : (
              <div className="divide-y">
                {estClients.map((c, i) => {
                  const pct = Math.min(100, (c.loyaltyPoints / cfg.rewardThreshold) * 100);
                  const canRedeem = c.loyaltyPoints >= cfg.rewardThreshold;
                  return (
                    <div key={c.id} className="p-4 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{c.name}</span>
                          {canRedeem && <Award className="w-4 h-4 text-amber-500" />}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{c.phone}</div>
                        <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className={`h-full ${canRedeem ? "bg-emerald-500" : "bg-indigo-500"}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-lg font-bold">{c.loyaltyPoints}</div>
                        <div className="text-[10px] text-slate-500">/ {cfg.rewardThreshold} pts</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => addLoyaltyPoints(c.id, 10)}
                          className="p-1.5 rounded-lg hover:bg-emerald-50"
                          title="+10 pontos"
                        >
                          <Plus className="w-3.5 h-3.5 text-emerald-600" />
                        </button>
                        <button
                          onClick={() => addLoyaltyPoints(c.id, -10)}
                          className="p-1.5 rounded-lg hover:bg-red-50"
                          title="-10 pontos"
                        >
                          <Minus className="w-3.5 h-3.5 text-red-500" />
                        </button>
                        <button
                          onClick={() => {
                            if (redeemLoyaltyReward(c.id)) {
                              toast.success(`Recompensa resgatada`, `${cfg.rewardDescription} para ${c.name}`);
                            }
                          }}
                          disabled={!canRedeem}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          Resgatar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border p-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
