"use client";

import { useMemo, useState } from "react";
import {
  CalendarX,
  Plus,
  Trash2,
  Save,
  Sun,
  Coffee,
  PartyPopper,
  Wrench,
  CalendarOff,
} from "lucide-react";
import { useData } from "@/lib/store";
import type { Block } from "@/lib/mock-data";
import Drawer, { useDrawerState } from "../_components/drawer";
import { useToast } from "@/app/_components/toast";

const typeIcon: Record<Block["type"], React.ComponentType<{ className?: string }>> = {
  folga: Sun,
  feriado: PartyPopper,
  almoço: Coffee,
  evento: CalendarOff,
  manutenção: Wrench,
};

const typeColor: Record<Block["type"], string> = {
  folga: "bg-amber-100 text-amber-700",
  feriado: "bg-rose-100 text-rose-700",
  almoço: "bg-orange-100 text-orange-700",
  evento: "bg-violet-100 text-violet-700",
  manutenção: "bg-slate-200 text-slate-700",
};

export default function BlocksPage() {
  const toast = useToast();
  const { establishments, professionals, blocks, addBlock, updateBlock, deleteBlock } = useData();
  const drawer = useDrawerState<Block | { new: true }>();
  const [filterEst, setFilterEst] = useState<string>("all");

  const filtered = useMemo(
    () => (filterEst === "all" ? blocks : blocks.filter((b) => b.establishmentId === filterEst)).slice().sort((a, b) => a.date.localeCompare(b.date)),
    [blocks, filterEst]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bloqueios</h1>
          <p className="text-slate-500 text-sm">
            Folgas, feriados, almoços e eventos. Horários bloqueados não aparecem disponíveis para agendamento.
          </p>
        </div>
        <div className="flex gap-2">
          <select value={filterEst} onChange={(e) => setFilterEst(e.target.value)} className="px-3 py-2 rounded-lg border text-sm">
            <option value="all">Todos estabelecimentos</option>
            {establishments.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <button
            onClick={() => drawer.openWith({ new: true })}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            Novo bloqueio
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            <CalendarX className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            Nenhum bloqueio cadastrado.
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((b) => {
              const Icon = typeIcon[b.type];
              const est = establishments.find((e) => e.id === b.establishmentId);
              const pro = b.professionalId ? professionals.find((p) => p.id === b.professionalId) : null;
              return (
                <div
                  key={b.id}
                  onClick={() => drawer.openWith(b)}
                  className="p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${typeColor[b.type]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{b.reason}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeColor[b.type]}`}>{b.type}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {formatDate(b.date)} • {b.allDay ? "Dia inteiro" : `${b.fromTime} - ${b.toTime}`} • {est?.name}
                      {pro && ` • ${pro.name}`}
                      {!pro && " • Estabelecimento todo"}
                    </div>
                  </div>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const ok = await toast.confirm({
                        title: `Remover bloqueio?`,
                        description: b.reason,
                        confirmLabel: "Remover",
                        danger: true,
                      });
                      if (ok) { deleteBlock(b.id); toast.success("Bloqueio removido"); }
                    }}
                    className="press p-2 rounded-lg hover:bg-red-50 shrink-0"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {drawer.item && (
        <BlockDrawer
          open={drawer.open}
          initial={"new" in drawer.item ? null : drawer.item}
          onClose={drawer.close}
          onSave={(data) => {
            if (drawer.item && "new" in drawer.item) addBlock(data);
            else if (drawer.item && "id" in drawer.item) updateBlock({ ...data, id: drawer.item.id });
            drawer.close();
          }}
          onDelete={
            drawer.item && "new" in drawer.item
              ? undefined
              : async () => {
                  if (drawer.item && "id" in drawer.item) {
                    const ok = await toast.confirm({ title: "Remover bloqueio?", confirmLabel: "Remover", danger: true });
                    if (ok) {
                      deleteBlock(drawer.item.id);
                      toast.success("Bloqueio removido");
                      drawer.close();
                    }
                  }
                }
          }
        />
      )}
    </div>
  );
}

function BlockDrawer({
  open,
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  initial: Block | null;
  onClose: () => void;
  onSave: (b: Omit<Block, "id">) => void;
  onDelete?: () => void;
}) {
  const { establishments, professionals } = useData();
  const [form, setForm] = useState<Omit<Block, "id">>(
    initial ?? {
      establishmentId: establishments[0]?.id ?? "",
      professionalId: undefined,
      date: new Date().toISOString().slice(0, 10),
      fromTime: "12:00",
      toTime: "13:00",
      allDay: true,
      reason: "",
      type: "folga",
    }
  );

  const estPros = professionals.filter((p) => p.establishmentId === form.establishmentId);

  return (
    <Drawer
      open={open}
      title={initial ? "Editar bloqueio" : "Novo bloqueio"}
      subtitle={initial ? initial.reason : "Cadastrar folga, feriado ou bloqueio"}
      onClose={onClose}
      footer={
        <>
          {onDelete && (
            <button onClick={onDelete} className="mr-auto inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          )}
          <button onClick={onClose} className="text-sm font-semibold px-4 py-2 rounded-lg border bg-white hover:bg-slate-50">Cancelar</button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.reason || !form.date}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"
          >
            <Save className="w-4 h-4" />
            Salvar
          </button>
        </>
      }
    >
      <div className="p-6 space-y-4">
        <Field label="Estabelecimento">
          <select value={form.establishmentId} onChange={(e) => setForm({ ...form, establishmentId: e.target.value, professionalId: undefined })} className="w-full px-3 py-2 rounded-lg border text-sm">
            {establishments.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </Field>
        <Field label="Escopo">
          <select
            value={form.professionalId ?? ""}
            onChange={(e) => setForm({ ...form, professionalId: e.target.value || undefined })}
            className="w-full px-3 py-2 rounded-lg border text-sm"
          >
            <option value="">Estabelecimento inteiro</option>
            {estPros.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Block["type"] })} className="w-full px-3 py-2 rounded-lg border text-sm">
              <option value="folga">Folga</option>
              <option value="feriado">Feriado</option>
              <option value="almoço">Almoço</option>
              <option value="evento">Evento</option>
              <option value="manutenção">Manutenção</option>
            </select>
          </Field>
          <Field label="Data">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" />
          </Field>
        </div>
        <Field label="Motivo / descrição">
          <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" placeholder="Ex: Folga semanal, Natal, Almoço..." />
        </Field>
        <div className="flex items-center gap-2">
          <input
            id="allday"
            type="checkbox"
            checked={form.allDay}
            onChange={(e) => setForm({ ...form, allDay: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300"
          />
          <label htmlFor="allday" className="text-sm">Dia inteiro</label>
        </div>
        {!form.allDay && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="De">
              <input type="time" value={form.fromTime} onChange={(e) => setForm({ ...form, fromTime: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" />
            </Field>
            <Field label="Até">
              <input type="time" value={form.toTime} onChange={(e) => setForm({ ...form, toTime: e.target.value })} className="w-full px-3 py-2 rounded-lg border text-sm" />
            </Field>
          </div>
        )}
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

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
}
