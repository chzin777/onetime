"use client";

import { useMemo, useState } from "react";
import {
  Share2,
  Copy,
  Check,
  Users,
  TrendingUp,
  Save,
  Award,
  Send,
} from "lucide-react";
import { useData } from "@/lib/store";
import { useToast } from "@/app/_components/toast";

export default function ReferralsPage() {
  const toast = useToast();
  const {
    establishments,
    clients,
    referralPrograms,
    referralRedemptions,
    updateReferralProgram,
    redeemReferral,
  } = useData();

  const [activeEst, setActiveEst] = useState<string>(establishments[0]?.id ?? "");
  const [copied, setCopied] = useState<string | null>(null);

  const prog = useMemo(
    () =>
      referralPrograms.find((p) => p.establishmentId === activeEst) ?? {
        establishmentId: activeEst,
        enabled: false,
        referrerReward: 20,
        referredReward: 15,
        rewardType: "discount_percent" as const,
        minRedemption: 1,
      },
    [referralPrograms, activeEst]
  );

  const [draft, setDraft] = useState(prog);
  useMemo(() => setDraft(prog), [prog]);

  const estClients = useMemo(() => clients.filter((c) => c.establishmentId === activeEst), [clients, activeEst]);
  const estRedemptions = useMemo(() => referralRedemptions.filter((r) => r.establishmentId === activeEst), [referralRedemptions, activeEst]);
  const est = establishments.find((e) => e.id === activeEst);

  const totalRefs = estRedemptions.length;
  const completed = estRedemptions.filter((r) => r.status === "concluído").length;
  const pending = estRedemptions.filter((r) => r.status === "pendente").length;

  const topReferrers = useMemo(() => {
    const map = new Map<string, number>();
    estRedemptions.filter((r) => r.status === "concluído").forEach((r) => {
      map.set(r.referrerClientId, (map.get(r.referrerClientId) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([id, count]) => ({ client: estClients.find((c) => c.id === id), count }))
      .filter((x) => x.client)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [estRedemptions, estClients]);

  function copyLink(code: string) {
    const link = `${typeof window !== "undefined" ? window.location.origin : ""}/b/${est?.slug}?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopied(code);
    toast.info("Link copiado", "Cole no WhatsApp do cliente");
    setTimeout(() => setCopied(null), 2000);
  }

  function rewardLabel(type: typeof prog.rewardType, value: number) {
    if (type === "discount_percent") return `${value}% OFF`;
    if (type === "discount_fixed") return `R$ ${value} OFF`;
    return "Serviço grátis";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Indicações</h1>
          <p className="text-slate-500 text-sm">
            Cada cliente tem um código único. Quando indicado faz primeiro agendamento, ambos ganham recompensa.
          </p>
        </div>
        <select value={activeEst} onChange={(e) => setActiveEst(e.target.value)} className="px-3 py-2 rounded-lg border text-sm">
          {establishments.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl border p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="font-semibold">Programa</h2>
              <p className="text-xs text-slate-500">Configuração de indicações</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Programa ativo</span>
            <button
              onClick={() => setDraft({ ...draft, enabled: !draft.enabled })}
              className={`relative w-11 h-6 rounded-full transition ${draft.enabled ? "bg-emerald-500" : "bg-slate-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition ${draft.enabled ? "translate-x-5" : ""}`} />
            </button>
          </div>

          <Field label="Tipo de recompensa">
            <select
              value={draft.rewardType}
              onChange={(e) => setDraft({ ...draft, rewardType: e.target.value as typeof draft.rewardType })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
            >
              <option value="discount_percent">% de desconto</option>
              <option value="discount_fixed">R$ fixo de desconto</option>
              <option value="free_service">Serviço grátis</option>
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Quem indicou">
              <input
                type="number"
                min={0}
                value={draft.referrerReward}
                onChange={(e) => setDraft({ ...draft, referrerReward: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </Field>
            <Field label="Quem foi indicado">
              <input
                type="number"
                min={0}
                value={draft.referredReward}
                onChange={(e) => setDraft({ ...draft, referredReward: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </Field>
          </div>

          <Field label="Mín. agendamentos do indicado para liberar">
            <input
              type="number"
              min={1}
              value={draft.minRedemption}
              onChange={(e) => setDraft({ ...draft, minRedemption: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
            />
          </Field>

          <button
            onClick={() => { updateReferralProgram(draft); toast.success("Programa salvo"); }}
            className="press w-full inline-flex items-center justify-center gap-2 h-12 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Save className="w-4 h-4" />
            Salvar programa
          </button>

          <div className="pt-4 border-t text-xs text-slate-500">
            Recompensa atual: indicador <strong>{rewardLabel(draft.rewardType, draft.referrerReward)}</strong>, indicado <strong>{rewardLabel(draft.rewardType, draft.referredReward)}</strong>.
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <StatCard icon={Users} label="Total indicações" value={String(totalRefs)} color="bg-indigo-100 text-indigo-600" />
            <StatCard icon={TrendingUp} label="Concluídas" value={String(completed)} color="bg-emerald-100 text-emerald-600" />
            <StatCard icon={Send} label="Pendentes" value={String(pending)} color="bg-amber-100 text-amber-600" />
          </div>

          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h3 className="font-semibold">Top indicadores</h3>
              <p className="text-xs text-slate-500">Clientes que mais trouxeram amigos</p>
            </div>
            {topReferrers.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">Nenhuma indicação concluída ainda.</div>
            ) : (
              <div className="divide-y">
                {topReferrers.map((t, i) => (
                  <div key={t.client!.id} className="p-4 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm flex items-center gap-2">
                        {t.client!.name}
                        {i === 0 && <Award className="w-4 h-4 text-amber-500" />}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Código: <span className="font-mono">{t.client!.referralCode}</span></div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{t.count}</div>
                      <div className="text-[10px] text-slate-500">indicações</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h3 className="font-semibold">Códigos dos clientes</h3>
              <p className="text-xs text-slate-500">Copie e envie via WhatsApp</p>
            </div>
            {estClients.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">Sem clientes cadastrados.</div>
            ) : (
              <div className="divide-y max-h-96 overflow-y-auto">
                {estClients.map((c) => (
                  <div key={c.id} className="p-3 flex items-center gap-3 hover:bg-slate-50">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{c.name}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{c.referralCode}</div>
                    </div>
                    <button
                      onClick={() => copyLink(c.referralCode)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50"
                    >
                      {copied === c.referralCode ? (
                        <><Check className="w-3.5 h-3.5 text-emerald-600" />Copiado</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" />Copiar link</>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h3 className="font-semibold">Histórico de indicações</h3>
            </div>
            {estRedemptions.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">Nenhuma indicação registrada.</div>
            ) : (
              <div className="divide-y">
                {estRedemptions.map((r) => {
                  const referrer = clients.find((c) => c.id === r.referrerClientId);
                  return (
                    <div key={r.id} className="p-4 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">
                          <strong>{referrer?.name ?? "—"}</strong> indicou <strong>{r.referredName}</strong>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 font-mono">{r.code} • {r.createdAt}</div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                        r.status === "concluído" ? "bg-emerald-100 text-emerald-700" :
                        r.status === "pendente" ? "bg-amber-100 text-amber-700" :
                        "bg-slate-200 text-slate-600"
                      }`}>
                        {r.status}
                      </span>
                      {r.status === "pendente" && (
                        <button
                          onClick={() => { redeemReferral(r.id, "concluído"); toast.success("Indicação liberada", `Recompensa para ${r.referredName}`); }}
                          className="press text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        >
                          Liberar
                        </button>
                      )}
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

function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; color: string }) {
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
