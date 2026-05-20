"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Search,
  Save,
  Clock,
  CalendarOff,
  Trash2,
  Check,
} from "lucide-react";
import { useData } from "@/lib/store";
import {
  defaultHours,
  type Professional,
  type DayHours,
} from "@/lib/mock-data";
import Drawer, { useDrawerState } from "../_components/drawer";

const blankPro: Omit<Professional, "id"> = {
  establishmentId: "",
  name: "",
  role: "",
  avatar: "https://i.pravatar.cc/200?img=68",
  serviceIds: [],
  active: true,
  hours: defaultHours,
};

export default function ProfessionalsPage() {
  const {
    professionals,
    establishments,
    services,
    addProfessional,
    updateProfessional,
    deleteProfessional,
  } = useData();

  const [filter, setFilter] = useState("");
  const [estFilter, setEstFilter] = useState<string>("");
  const drawer = useDrawerState<Professional | "new">();

  const filtered = useMemo(() => {
    return professionals.filter(
      (p) =>
        (!estFilter || p.establishmentId === estFilter) &&
        (!filter || p.name.toLowerCase().includes(filter.toLowerCase()))
    );
  }, [professionals, filter, estFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profissionais</h1>
          <p className="text-slate-500 text-sm">
            Equipe que realiza os atendimentos. Clique para editar.
          </p>
        </div>
        <button
          onClick={() => drawer.openWith("new")}
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Adicionar profissional
        </button>
      </div>

      <div className="bg-white rounded-2xl border">
        <div className="p-4 border-b flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar profissional..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 text-sm"
            />
          </div>
          <select
            value={estFilter}
            onChange={(e) => setEstFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
          >
            <option value="">Todos estabelecimentos</option>
            {establishments.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Profissional</th>
                <th className="text-left px-5 py-3 font-medium">Estabelecimento</th>
                <th className="text-left px-5 py-3 font-medium">Serviços</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p) => {
                const est = establishments.find((e) => e.id === p.establishmentId);
                const proServices = services.filter((s) => p.serviceIds.includes(s.id));
                return (
                  <tr
                    key={p.id}
                    onClick={() => drawer.openWith(p)}
                    className="hover:bg-indigo-50/40 cursor-pointer transition"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={p.avatar}
                          alt={p.name}
                          width={40}
                          height={40}
                          className="rounded-full w-10 h-10 object-cover"
                          unoptimized
                        />
                        <div>
                          <div className="font-semibold text-sm">{p.name}</div>
                          <div className="text-xs text-slate-500">{p.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{est?.name ?? "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {proServices.slice(0, 3).map((s) => (
                          <span
                            key={s.id}
                            className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700"
                          >
                            {s.name}
                          </span>
                        ))}
                        {proServices.length > 3 && (
                          <span className="text-[10px] text-slate-500">+{proServices.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        p.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                      }`}>
                        {p.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); drawer.openWith(p); }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-slate-500">
                    Nenhum profissional encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {drawer.item && (
        <ProfessionalDrawer
          open={drawer.open}
          initial={drawer.item === "new" ? null : drawer.item}
          onClose={drawer.close}
          onSave={(data) => {
            if (drawer.item === "new") addProfessional(data);
            else if (drawer.item) updateProfessional({ ...data, id: drawer.item.id });
            drawer.close();
          }}
          onDelete={
            drawer.item === "new"
              ? undefined
              : () => {
                  if (drawer.item && drawer.item !== "new" && confirm(`Excluir ${drawer.item.name}?`)) {
                    deleteProfessional(drawer.item.id);
                    drawer.close();
                  }
                }
          }
        />
      )}
    </div>
  );
}

function ProfessionalDrawer({
  open,
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  initial: Professional | null;
  onClose: () => void;
  onSave: (p: Omit<Professional, "id">) => void;
  onDelete?: () => void;
}) {
  const { establishments, services } = useData();
  const seed = initial ?? {
    ...blankPro,
    establishmentId: establishments[0]?.id ?? "",
  };
  const [form, setForm] = useState<Omit<Professional, "id">>({
    ...seed,
    hours: seed.hours ?? defaultHours,
  });

  const estServices = services.filter((s) => s.establishmentId === form.establishmentId);

  function toggleService(id: string) {
    setForm((f) => ({
      ...f,
      serviceIds: f.serviceIds.includes(id)
        ? f.serviceIds.filter((x) => x !== id)
        : [...f.serviceIds, id],
    }));
  }

  function updateHour(idx: number, patch: Partial<DayHours>) {
    setForm((f) => ({
      ...f,
      hours: (f.hours ?? defaultHours).map((h, i) => (i === idx ? { ...h, ...patch } : h)),
    }));
  }

  function changeEstablishment(estId: string) {
    setForm((f) => ({ ...f, establishmentId: estId, serviceIds: [] }));
  }

  return (
    <Drawer
      open={open}
      title={initial?.name ?? "Novo profissional"}
      subtitle={initial ? "Editar profissional" : "Cadastrar novo profissional"}
      onClose={onClose}
      footer={
        <>
          {onDelete && (
            <button
              onClick={onDelete}
              className="mr-auto inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          )}
          <button
            onClick={onClose}
            className="text-sm font-semibold px-4 py-2 rounded-lg border bg-white hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Save className="w-4 h-4" />
            Salvar
          </button>
        </>
      }
    >
      <div className="p-6 space-y-7">
        <section>
          <h3 className="font-semibold text-sm mb-3">Dados básicos</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600">Nome</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Cargo</label>
              <input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="text-xs font-medium text-slate-600">URL do avatar</label>
            <input
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm font-mono text-[11px]"
            />
          </div>

          <label className="mt-4 flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 relative transition">
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${form.active ? "translate-x-5" : ""}`} />
            </div>
            <span className="text-sm">{form.active ? "Ativo" : "Inativo"}</span>
          </label>
        </section>

        <section>
          <h3 className="font-semibold text-sm mb-3">Estabelecimento</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {establishments.map((e) => {
              const selected = form.establishmentId === e.id;
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => changeEstablishment(e.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition ${
                    selected
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <Image
                    src={e.logo}
                    alt={e.name}
                    width={36}
                    height={36}
                    className="rounded-lg w-9 h-9 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate">{e.name}</div>
                    <div className="text-[10px] text-slate-500">{e.category}</div>
                  </div>
                  {selected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-sm mb-1">Serviços que realiza</h3>
          <p className="text-xs text-slate-500 mb-3">
            {form.serviceIds.length} de {estServices.length} selecionados
          </p>
          <div className="space-y-2">
            {estServices.map((s) => {
              const checked = form.serviceIds.includes(s.id);
              return (
                <label
                  key={s.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                    checked
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleService(s.id)}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{s.name}</div>
                    <div className="text-xs text-slate-500">
                      {s.durationMin} min • R$ {s.price.toFixed(2)} • {s.category}
                    </div>
                  </div>
                </label>
              );
            })}
            {estServices.length === 0 && (
              <p className="text-xs text-slate-500 italic">
                Nenhum serviço cadastrado neste estabelecimento.
              </p>
            )}
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-sm mb-1">Horários do profissional</h3>
          <p className="text-xs text-slate-500 mb-3">
            Sobrescreve o horário do estabelecimento.
          </p>
          <div className="rounded-lg border divide-y">
            {(form.hours ?? defaultHours).map((h, idx) => (
              <div key={h.day} className="px-3 h-14 flex items-center gap-3">
                <div className="w-14 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-sm font-semibold">{h.day}</span>
                </div>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={h.open}
                    onChange={(e) => updateHour(idx, { open: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 relative transition">
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${h.open ? "translate-x-4" : ""}`} />
                  </div>
                </label>

                {h.open ? (
                  <div className="flex items-center gap-2 ml-auto">
                    <input
                      type="time"
                      value={h.from}
                      onChange={(e) => updateHour(idx, { from: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 text-xs"
                    />
                    <span className="text-slate-400 text-xs">até</span>
                    <input
                      type="time"
                      value={h.to}
                      onChange={(e) => updateHour(idx, { to: e.target.value })}
                      className="px-2 py-1 rounded border border-slate-200 text-xs"
                    />
                  </div>
                ) : (
                  <span className="ml-auto text-xs text-slate-400 flex items-center gap-1">
                    <CalendarOff className="w-3.5 h-3.5" />
                    Folga
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </Drawer>
  );
}
