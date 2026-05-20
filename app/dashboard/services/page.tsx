"use client";

import { useState } from "react";
import {
  Plus,
  Clock,
  DollarSign,
  Tag,
  Pencil,
  Trash2,
  Scissors,
  Save,
} from "lucide-react";
import { useData } from "@/lib/store";
import { formatBRL, type Service } from "@/lib/mock-data";
import Drawer, { useDrawerState } from "../_components/drawer";

const blankSvc: Omit<Service, "id"> = {
  establishmentId: "",
  name: "",
  description: "",
  durationMin: 30,
  price: 0,
  category: "Geral",
};

export default function ServicesPage() {
  const { establishments, services, addService, updateService, deleteService } = useData();
  const drawer = useDrawerState<Service | { new: true; establishmentId: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Serviços</h1>
          <p className="text-slate-500 text-sm">
            Catálogo de serviços oferecidos.
          </p>
        </div>
        <button
          onClick={() => drawer.openWith({ new: true, establishmentId: establishments[0]?.id ?? "" })}
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Novo serviço
        </button>
      </div>

      {establishments.length === 0 && (
        <div className="bg-white rounded-2xl border p-12 text-center text-sm text-slate-500">
          Cadastre um estabelecimento antes de criar serviços.
        </div>
      )}

      {establishments.map((est) => {
        const estServices = services.filter((s) => s.establishmentId === est.id);
        return (
          <div key={est.id} className="bg-white rounded-2xl border">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{est.name}</h2>
                <p className="text-xs text-slate-500">{estServices.length} serviços cadastrados</p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                {est.category}
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
              {estServices.map((s) => (
                <div
                  key={s.id}
                  onClick={() => drawer.openWith(s)}
                  className="rounded-xl border p-4 hover:border-indigo-300 hover:shadow-sm transition cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                      <Scissors className="w-5 h-5 text-violet-600" />
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); drawer.openWith(s); }}
                        className="p-1.5 rounded hover:bg-slate-100"
                        aria-label="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Excluir ${s.name}?`)) deleteService(s.id);
                        }}
                        className="p-1.5 rounded hover:bg-red-50"
                        aria-label="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <h3 className="mt-3 font-semibold">{s.name}</h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2 min-h-[2rem]">
                    {s.description}
                  </p>
                  <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {s.durationMin} min
                    </div>
                    <div className="flex items-center gap-1 font-bold text-emerald-600">
                      <DollarSign className="w-3.5 h-3.5" />
                      {formatBRL(s.price)}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
                    <Tag className="w-3 h-3" />
                    {s.category}
                  </div>
                </div>
              ))}
              <button
                onClick={() => drawer.openWith({ new: true, establishmentId: est.id })}
                className="rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 transition min-h-[180px] flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600"
              >
                <Plus className="w-6 h-6" />
                <span className="mt-2 text-xs font-semibold">Adicionar serviço</span>
              </button>
            </div>
          </div>
        );
      })}

      {drawer.item && (
        <ServiceDrawer
          open={drawer.open}
          initial={"new" in drawer.item ? null : drawer.item}
          defaultEstablishmentId={drawer.item.establishmentId}
          onClose={drawer.close}
          onSave={(data) => {
            if (drawer.item && "new" in drawer.item) addService(data);
            else if (drawer.item && "id" in drawer.item) updateService({ ...data, id: drawer.item.id });
            drawer.close();
          }}
          onDelete={
            drawer.item && "new" in drawer.item
              ? undefined
              : () => {
                  if (drawer.item && "id" in drawer.item && confirm(`Excluir ${drawer.item.name}?`)) {
                    deleteService(drawer.item.id);
                    drawer.close();
                  }
                }
          }
        />
      )}
    </div>
  );
}

function ServiceDrawer({
  open,
  initial,
  defaultEstablishmentId,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  initial: Service | null;
  defaultEstablishmentId: string;
  onClose: () => void;
  onSave: (s: Omit<Service, "id">) => void;
  onDelete?: () => void;
}) {
  const { establishments } = useData();
  const [form, setForm] = useState<Omit<Service, "id">>(
    initial ?? { ...blankSvc, establishmentId: defaultEstablishmentId }
  );

  return (
    <Drawer
      open={open}
      title={initial?.name ?? "Novo serviço"}
      subtitle={initial ? "Editar serviço" : "Cadastrar novo serviço"}
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
      <div className="p-6 space-y-5">
        <div>
          <label className="text-xs font-medium text-slate-600">Estabelecimento</label>
          <select
            value={form.establishmentId}
            onChange={(e) => setForm({ ...form, establishmentId: e.target.value })}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
          >
            {establishments.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">Nome do serviço</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Duração (min)</label>
            <input
              type="number"
              min={5}
              step={5}
              value={form.durationMin}
              onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Preço (R$)</label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Categoria</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
}
