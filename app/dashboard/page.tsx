"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CalendarCheck,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Store,
} from "lucide-react";
import { useData } from "@/lib/store";
import { formatBRL } from "@/lib/mock-data";
import ShareLinkCard from "./_components/share-link-card";

export default function DashboardHome() {
  const { appointments, establishments, professionals, services } = useData();

  const today = new Date().toISOString().slice(0, 10);
  const todayApps = appointments.filter((a) => a.date === today);
  const monthRevenue = appointments
    .filter((a) => a.status !== "cancelado")
    .reduce((acc, a) => {
      const s = services.find((sv) => sv.id === a.serviceId);
      return acc + (s?.price ?? 0);
    }, 0);

  const stats = [
    {
      label: "Agendamentos hoje",
      value: todayApps.length,
      delta: "+12%",
      icon: CalendarCheck,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      label: "Faturamento (mês)",
      value: formatBRL(monthRevenue),
      delta: "+8%",
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Profissionais",
      value: professionals.length,
      delta: `${professionals.length > 0 ? "+" : ""}${professionals.length}`,
      icon: Users,
      color: "bg-violet-100 text-violet-600",
    },
    {
      label: "Taxa de ocupação",
      value: "73%",
      delta: "+5%",
      icon: TrendingUp,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  const upcoming = appointments
    .filter((a) => a.status === "confirmado" || a.status === "pendente")
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Visão geral</h1>
          <p className="text-slate-500 text-sm">
            Acompanhe seus indicadores em tempo real.
          </p>
        </div>
        <Link
          href="/dashboard/appointments"
          className="text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Ver agenda completa
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {s.delta}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border">
          <div className="p-5 border-b flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Próximos agendamentos</h2>
              <p className="text-xs text-slate-500">Confirmados e pendentes</p>
            </div>
            <Link
              href="/dashboard/appointments"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Ver todos
            </Link>
          </div>
          <div className="divide-y">
            {upcoming.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500">
                Nenhum agendamento ativo.
              </div>
            )}
            {upcoming.map((a) => {
              const svc = services.find((s) => s.id === a.serviceId);
              const pro = professionals.find((p) => p.id === a.professionalId);
              const est = establishments.find((e) => e.id === a.establishmentId);
              return (
                <div key={a.id} className="p-4 flex items-center gap-4 hover:bg-slate-50">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex flex-col items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span className="text-[10px] font-bold text-indigo-700">{a.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{a.clientName}</div>
                    <div className="text-xs text-slate-500 truncate">
                      {svc?.name} • {pro?.name} • {est?.name}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold">{formatBRL(svc?.price ?? 0)}</div>
                    <StatusPill status={a.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-5">
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-4 h-4 text-slate-600" />
              <h2 className="font-semibold">Meus estabelecimentos</h2>
            </div>
            <div className="space-y-3">
              {establishments.map((e) => (
                <Link
                  key={e.id}
                  href={`/dashboard/establishments`}
                  className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-slate-50"
                >
                  <Image
                    src={e.logo}
                    alt={e.name}
                    width={40}
                    height={40}
                    className="rounded-lg object-cover w-10 h-10"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">{e.name}</div>
                    <div className="text-xs text-slate-500">{e.category}</div>
                  </div>
                </Link>
              ))}
              {establishments.length === 0 && (
                <p className="text-xs text-slate-500 italic">Nenhum estabelecimento.</p>
              )}
            </div>
          </div>

          <ShareLinkCard establishments={establishments} />
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmado: "bg-emerald-100 text-emerald-700",
    pendente: "bg-amber-100 text-amber-700",
    concluído: "bg-slate-100 text-slate-700",
    cancelado: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${map[status]}`}>
      {status}
    </span>
  );
}
