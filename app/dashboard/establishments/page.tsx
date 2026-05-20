"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Plus,
  MapPin,
  Phone,
  ExternalLink,
  CheckCircle2,
  Save,
  Trash2,
  Pencil,
} from "lucide-react";
import { useData } from "@/lib/store";
import type { Establishment } from "@/lib/mock-data";
import Drawer, { useDrawerState } from "../_components/drawer";

const categories: Establishment["category"][] = [
  "Petshop",
  "Barbearia",
  "Salão de Beleza",
  "Clínica",
  "Estética",
];

const blank: Omit<Establishment, "id"> = {
  slug: "",
  name: "",
  category: "Barbearia",
  address: "",
  phone: "",
  logo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop",
  cover: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=400&fit=crop",
  active: true,
};

export default function EstablishmentsPage() {
  const { establishments, addEstablishment, updateEstablishment, deleteEstablishment } = useData();
  const drawer = useDrawerState<Establishment | "new">();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Estabelecimentos</h1>
          <p className="text-slate-500 text-sm">
            Gerencie as unidades do seu negócio.
          </p>
        </div>
        <button
          onClick={() => drawer.openWith("new")}
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Novo estabelecimento
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {establishments.map((e) => (
          <div
            key={e.id}
            className="bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition group"
          >
            <div className="relative h-32 bg-slate-100">
              <Image src={e.cover} alt={e.name} fill className="object-cover" />
              <div className="absolute -bottom-7 left-4">
                <Image
                  src={e.logo}
                  alt={e.name}
                  width={56}
                  height={56}
                  className="rounded-xl border-4 border-white object-cover w-14 h-14"
                />
              </div>
            </div>

            <div className="p-5 pt-10">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold">{e.name}</h3>
                  <span className="text-xs text-indigo-600 font-semibold">{e.category}</span>
                </div>
                {e.active && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    Ativo
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-500">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span className="truncate">{e.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{e.phone}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between gap-2">
                <Link
                  href={`/b/${e.slug}`}
                  target="_blank"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  Ver link público
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <button
                  onClick={() => drawer.openWith(e)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 inline-flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" />
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => drawer.openWith("new")}
          className="bg-white rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 transition min-h-[280px] flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <span className="mt-3 font-semibold text-sm">Adicionar estabelecimento</span>
        </button>
      </div>

      {drawer.item && (
        <EstablishmentDrawer
          open={drawer.open}
          initial={drawer.item === "new" ? null : drawer.item}
          onClose={drawer.close}
          onSave={(data) => {
            if (drawer.item === "new") addEstablishment(data);
            else if (drawer.item) updateEstablishment({ ...data, id: drawer.item.id });
            drawer.close();
          }}
          onDelete={
            drawer.item === "new"
              ? undefined
              : () => {
                  if (drawer.item && drawer.item !== "new" && confirm(`Excluir ${drawer.item.name}? Profissionais, serviços e agendamentos vinculados também serão removidos.`)) {
                    deleteEstablishment(drawer.item.id);
                    drawer.close();
                  }
                }
          }
        />
      )}
    </div>
  );
}

function EstablishmentDrawer({
  open,
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  initial: Establishment | null;
  onClose: () => void;
  onSave: (e: Omit<Establishment, "id">) => void;
  onDelete?: () => void;
}) {
  const [form, setForm] = useState<Omit<Establishment, "id">>(
    initial ?? blank
  );

  function slugify(v: string) {
    return v
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  return (
    <Drawer
      open={open}
      title={initial ? initial.name : "Novo estabelecimento"}
      subtitle={initial ? "Editar dados" : "Cadastrar nova unidade"}
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
          <label className="text-xs font-medium text-slate-600">Nome</label>
          <input
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm({
                ...form,
                name,
                slug: initial ? form.slug : slugify(name),
              });
            }}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Categoria</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Establishment["category"] })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Slug (URL)</label>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm font-mono"
            />
            <p className="mt-1 text-[10px] text-slate-500">/b/{form.slug || "..."}</p>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">Endereço</label>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">Telefone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="(11) 99999-9999"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">URL do Logo</label>
            <input
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm font-mono text-[11px]"
            />
            {form.logo && (
              <Image
                src={form.logo}
                alt="logo preview"
                width={48}
                height={48}
                className="mt-2 rounded-lg w-12 h-12 object-cover"
                unoptimized
              />
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">URL da Capa</label>
            <input
              value={form.cover}
              onChange={(e) => setForm({ ...form, cover: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm font-mono text-[11px]"
            />
            {form.cover && (
              <Image
                src={form.cover}
                alt="cover preview"
                width={160}
                height={48}
                className="mt-2 rounded-lg w-40 h-12 object-cover"
                unoptimized
              />
            )}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
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
      </div>
    </Drawer>
  );
}
