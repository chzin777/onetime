"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Plus,
  Filter,
  Calendar,
  Clock,
  Phone,
  Search,
  CalendarDays,
  Save,
  Trash2,
} from "lucide-react";
import { useData } from "@/lib/store";
import { formatBRL, type Appointment } from "@/lib/mock-data";
import Drawer, { useDrawerState } from "../_components/drawer";

const statusColor: Record<string, string> = {
  confirmado: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pendente: "bg-amber-100 text-amber-700 border-amber-200",
  concluído: "bg-slate-100 text-slate-700 border-slate-200",
  cancelado: "bg-red-100 text-red-700 border-red-200",
};

const statusOptions: Appointment["status"][] = ["confirmado", "pendente", "concluído", "cancelado"];

export default function AppointmentsPage() {
  const {
    appointments,
    establishments,
    professionals,
    services,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  } = useData();

  const [filter, setFilter] = useState("");
  const [estFilter, setEstFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const drawer = useDrawerState<Appointment | "new">();

  const filtered = useMemo(() => {
    return appointments.filter(
      (a) =>
        (!estFilter || a.establishmentId === estFilter) &&
        (!statusFilter || a.status === statusFilter) &&
        (!filter || a.clientName.toLowerCase().includes(filter.toLowerCase()))
    );
  }, [appointments, filter, estFilter, statusFilter]);

  const grouped = filtered.reduce<Record<string, typeof appointments>>((acc, a) => {
    (acc[a.date] ??= []).push(a);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agendamentos</h1>
          <p className="text-slate-500 text-sm">
            Toda a agenda dos seus estabelecimentos. Clique para editar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg border bg-white hover:bg-slate-50">
            <CalendarDays className="w-4 h-4" />
            Calendário
          </button>
          <button
            onClick={() => drawer.openWith("new")}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            Novo agendamento
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        {[
          { label: "Confirmados", value: appointments.filter(a => a.status === "confirmado").length, color: "text-emerald-600" },
          { label: "Pendentes", value: appointments.filter(a => a.status === "pendente").length, color: "text-amber-600" },
          { label: "Concluídos", value: appointments.filter(a => a.status === "concluído").length, color: "text-slate-600" },
          { label: "Cancelados", value: appointments.filter(a => a.status === "cancelado").length, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-4">
            <div className="text-xs text-slate-500">{s.label}</div>
            <div className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border">
        <div className="p-4 border-b flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar por cliente..."
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
          >
            <option value="">Todos os status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Mais filtros
          </button>
        </div>

        <div className="divide-y">
          {sortedDates.length === 0 && (
            <div className="p-12 text-center text-sm text-slate-500">
              Nenhum agendamento encontrado.
            </div>
          )}
          {sortedDates.map((date) => (
            <div key={date}>
              <div className="px-5 py-3 bg-slate-50 flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(date)}
                <span className="text-slate-400 normal-case font-normal">
                  • {grouped[date].length} agendamentos
                </span>
              </div>
              {grouped[date]
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((a) => {
                  const svc = services.find((s) => s.id === a.serviceId);
                  const pro = professionals.find((p) => p.id === a.professionalId);
                  const est = establishments.find((e) => e.id === a.establishmentId);
                  return (
                    <div
                      key={a.id}
                      onClick={() => drawer.openWith(a)}
                      className="p-5 flex items-center gap-5 hover:bg-indigo-50/40 cursor-pointer transition"
                    >
                      <div className="text-center shrink-0">
                        <Clock className="w-4 h-4 mx-auto text-slate-400" />
                        <div className="font-bold text-sm mt-0.5">{a.time}</div>
                        <div className="text-[10px] text-slate-500">{svc?.durationMin}min</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{a.clientName}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColor[a.status]}`}>
                            {a.status}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                          <span>{svc?.name ?? "—"}</span>
                          <span>•</span>
                          <span>{est?.name ?? "—"}</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {a.clientPhone}
                          </span>
                        </div>
                      </div>
                      {pro && (
                        <div className="flex items-center gap-2 shrink-0">
                          <Image
                            src={pro.avatar}
                            alt={pro.name}
                            width={32}
                            height={32}
                            className="rounded-full w-8 h-8 object-cover"
                            unoptimized
                          />
                          <div className="hidden sm:block">
                            <div className="text-xs font-semibold">{pro.name}</div>
                            <div className="text-[10px] text-slate-500">{pro.role}</div>
                          </div>
                        </div>
                      )}
                      <div className="text-right shrink-0">
                        <div className="font-bold text-sm">{formatBRL(svc?.price ?? 0)}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      {drawer.item && (
        <AppointmentDrawer
          open={drawer.open}
          initial={drawer.item === "new" ? null : drawer.item}
          onClose={drawer.close}
          onSave={(data) => {
            if (drawer.item === "new") addAppointment(data);
            else if (drawer.item) updateAppointment({ ...data, id: drawer.item.id });
            drawer.close();
          }}
          onDelete={
            drawer.item === "new"
              ? undefined
              : () => {
                  if (drawer.item && drawer.item !== "new" && confirm(`Excluir agendamento de ${drawer.item.clientName}?`)) {
                    deleteAppointment(drawer.item.id);
                    drawer.close();
                  }
                }
          }
        />
      )}
    </div>
  );
}

function AppointmentDrawer({
  open,
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  initial: Appointment | null;
  onClose: () => void;
  onSave: (a: Omit<Appointment, "id">) => void;
  onDelete?: () => void;
}) {
  const { establishments, services, professionals } = useData();
  const today = new Date().toISOString().slice(0, 10);

  const blank: Omit<Appointment, "id"> = {
    establishmentId: establishments[0]?.id ?? "",
    serviceId: "",
    professionalId: "",
    clientName: "",
    clientPhone: "",
    date: today,
    time: "09:00",
    status: "confirmado",
  };

  const [form, setForm] = useState<Omit<Appointment, "id">>(initial ?? blank);

  const estServices = services.filter((s) => s.establishmentId === form.establishmentId);
  const estPros = professionals.filter(
    (p) => p.establishmentId === form.establishmentId &&
      (!form.serviceId || p.serviceIds.includes(form.serviceId))
  );

  return (
    <Drawer
      open={open}
      title={initial ? `Agendamento de ${initial.clientName}` : "Novo agendamento"}
      subtitle={initial ? "Editar agendamento" : "Criar novo agendamento"}
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
      <div className="p-6 space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-600">Estabelecimento</label>
          <select
            value={form.establishmentId}
            onChange={(e) => setForm({ ...form, establishmentId: e.target.value, serviceId: "", professionalId: "" })}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
          >
            {establishments.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Serviço</label>
            <select
              value={form.serviceId}
              onChange={(e) => setForm({ ...form, serviceId: e.target.value, professionalId: "" })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="">Selecione...</option>
              {estServices.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.durationMin}min)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Profissional</label>
            <select
              value={form.professionalId}
              onChange={(e) => setForm({ ...form, professionalId: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
            >
              <option value="">Selecione...</option>
              {estPros.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Data</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Horário</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        <div className="border-t pt-4 grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Nome do cliente</label>
            <input
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">WhatsApp</label>
            <input
              value={form.clientPhone}
              onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
              placeholder="(11) 99999-9999"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">Status</label>
          <div className="mt-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {statusOptions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm({ ...form, status: s })}
                className={`px-3 py-2 rounded-lg border text-xs font-semibold capitalize ${
                  form.status === s
                    ? `${statusColor[s]}`
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}
