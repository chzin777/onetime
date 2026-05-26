"use client";

import { useMemo, useState } from "react";
import {
  ListPlus,
  Phone,
  Calendar,
  Sun,
  CloudSun,
  Moon,
  Bell,
  CheckCircle2,
  Trash2,
  Send,
  Plus,
  Save,
} from "lucide-react";
import { useData } from "@/lib/store";
import type { WaitlistEntry } from "@/lib/mock-data";
import Drawer, { useDrawerState } from "../_components/drawer";
import { useToast } from "@/app/_components/toast";

const statusColor: Record<string, string> = {
  aguardando: "bg-amber-100 text-amber-700",
  notificado: "bg-indigo-100 text-indigo-700",
  convertido: "bg-emerald-100 text-emerald-700",
  expirado: "bg-slate-200 text-slate-600",
};

const periodIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  manhã: Sun,
  tarde: CloudSun,
  noite: Moon,
  qualquer: Calendar,
};

export default function WaitlistPage() {
  const toast = useToast();
  const {
    establishments,
    services,
    professionals,
    waitlist,
    addWaitlist,
    updateWaitlist,
    removeWaitlist,
    promoteWaitlist,
  } = useData();

  const [filterEst, setFilterEst] = useState<string>("all");
  const drawer = useDrawerState<{ new: true } | WaitlistEntry>();

  const filtered = useMemo(
    () => (filterEst === "all" ? waitlist : waitlist.filter((w) => w.establishmentId === filterEst)),
    [waitlist, filterEst]
  );

  const grouped = useMemo(() => {
    const g: Record<string, WaitlistEntry[]> = { aguardando: [], notificado: [], convertido: [], expirado: [] };
    filtered.forEach((w) => g[w.status].push(w));
    return g;
  }, [filtered]);

  function notify(w: WaitlistEntry) {
    updateWaitlist({ ...w, status: "notificado" });
    toast.success("Notificação enviada", `WhatsApp de ${w.clientName} avisado da vaga`);
  }

  async function convert(w: WaitlistEntry) {
    const pros = professionals.filter((p) => p.serviceIds.includes(w.serviceId) && (!w.professionalId || p.id === w.professionalId));
    if (!pros.length) {
      toast.error("Sem profissional disponível para esse serviço.");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const date = prompt("Data (YYYY-MM-DD):", w.preferredDate || today);
    if (!date) return;
    const time = prompt("Horário (HH:MM):", "10:00");
    if (!time) return;
    promoteWaitlist(w.id, date, time, pros[0].id);
    toast.success("Convertido", `${w.clientName} agendado em ${date} ${time}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lista de espera</h1>
          <p className="text-slate-500 text-sm">
            Clientes interessados em horários cheios. Quando alguém cancela, o sistema oferece a vaga automaticamente.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={filterEst}
            onChange={(e) => setFilterEst(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm"
          >
            <option value="all">Todos estabelecimentos</option>
            {establishments.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
          <button
            onClick={() => drawer.openWith({ new: true })}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        <StatCard label="Aguardando" value={grouped.aguardando.length} color="bg-amber-50 text-amber-700" />
        <StatCard label="Notificados" value={grouped.notificado.length} color="bg-indigo-50 text-indigo-700" />
        <StatCard label="Convertidos" value={grouped.convertido.length} color="bg-emerald-50 text-emerald-700" />
        <StatCard label="Total" value={filtered.length} color="bg-slate-100 text-slate-700" />
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold">Fila</h2>
          <p className="text-xs text-slate-500">Ordenado por entrada na lista</p>
        </div>
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            <ListPlus className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            Lista de espera vazia.
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((w) => {
              const svc = services.find((s) => s.id === w.serviceId);
              const est = establishments.find((e) => e.id === w.establishmentId);
              const pro = w.professionalId ? professionals.find((p) => p.id === w.professionalId) : null;
              const PI = periodIcon[w.preferredPeriod || "qualquer"];
              return (
                <div key={w.id} className="p-4 flex items-center gap-4 hover:bg-slate-50">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <PI className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{w.clientName}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor[w.status]}`}>
                        {w.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{w.clientPhone}</span>
                      <span>•</span>
                      <span>{svc?.name}</span>
                      <span>•</span>
                      <span>{est?.name}</span>
                      {pro && (<><span>•</span><span>{pro.name}</span></>)}
                      {w.preferredDate && (<><span>•</span><span>{w.preferredDate}</span></>)}
                      {w.preferredPeriod && (<><span>•</span><span className="capitalize">{w.preferredPeriod}</span></>)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {w.status === "aguardando" && (
                      <button
                        onClick={() => notify(w)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        Notificar
                      </button>
                    )}
                    {(w.status === "aguardando" || w.status === "notificado") && (
                      <button
                        onClick={() => convert(w)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Converter
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        const ok = await toast.confirm({
                          title: `Remover ${w.clientName}?`,
                          description: "Tira da lista de espera. Não dá pra desfazer.",
                          confirmLabel: "Remover",
                          danger: true,
                        });
                        if (ok) {
                          removeWaitlist(w.id);
                          toast.success("Removido", `${w.clientName} saiu da fila`);
                        }
                      }}
                      className="press p-2 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {drawer.item && (
        <WaitlistDrawer
          open={drawer.open}
          onClose={drawer.close}
          onSave={(data) => {
            addWaitlist(data);
            drawer.close();
          }}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs mt-1">{label}</div>
    </div>
  );
}

function WaitlistDrawer({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (w: Omit<WaitlistEntry, "id" | "createdAt" | "status">) => void;
}) {
  const { establishments, services, professionals } = useData();
  const [form, setForm] = useState<Omit<WaitlistEntry, "id" | "createdAt" | "status">>({
    establishmentId: establishments[0]?.id ?? "",
    serviceId: "",
    professionalId: undefined,
    clientName: "",
    clientPhone: "",
    preferredDate: undefined,
    preferredPeriod: "qualquer",
  });

  const estServices = services.filter((s) => s.establishmentId === form.establishmentId);
  const estPros = professionals.filter((p) => p.establishmentId === form.establishmentId && (!form.serviceId || p.serviceIds.includes(form.serviceId)));

  return (
    <Drawer
      open={open}
      title="Nova entrada"
      subtitle="Adicionar cliente na lista de espera"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="text-sm font-semibold px-4 py-2 rounded-lg border bg-white hover:bg-slate-50">Cancelar</button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.clientName || !form.clientPhone || !form.serviceId}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
            Adicionar
          </button>
        </>
      }
    >
      <div className="p-6 space-y-4">
        <Field label="Estabelecimento">
          <select value={form.establishmentId} onChange={(e) => setForm({ ...form, establishmentId: e.target.value, serviceId: "", professionalId: undefined })} className="w-full px-3 py-2 rounded-lg border text-sm">
            {establishments.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </Field>
        <Field label="Serviço">
          <select value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm">
            <option value="">Selecione</option>
            {estServices.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </Field>
        <Field label="Profissional (opcional)">
          <select value={form.professionalId ?? ""} onChange={(e) => setForm({ ...form, professionalId: e.target.value || undefined })} className="w-full px-3 py-2 rounded-lg border text-sm">
            <option value="">Sem preferência</option>
            {estPros.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nome">
            <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" />
          </Field>
          <Field label="WhatsApp">
            <input value={form.clientPhone} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })} placeholder="(11) 99999-9999" className="w-full px-3 py-2 rounded-lg border text-sm" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Data preferida (opcional)">
            <input type="date" value={form.preferredDate ?? ""} onChange={(e) => setForm({ ...form, preferredDate: e.target.value || undefined })} className="w-full px-3 py-2 rounded-lg border text-sm" />
          </Field>
          <Field label="Período preferido">
            <select value={form.preferredPeriod} onChange={(e) => setForm({ ...form, preferredPeriod: e.target.value as WaitlistEntry["preferredPeriod"] })} className="w-full px-3 py-2 rounded-lg border text-sm">
              <option value="qualquer">Qualquer</option>
              <option value="manhã">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
            </select>
          </Field>
        </div>
      </div>
    </Drawer>
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
