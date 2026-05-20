"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Scissors,
  Clock,
  Check,
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  Phone,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import type { Professional, Service } from "@/lib/mock-data";
import { formatBRL } from "@/lib/mock-data";
import { useData } from "@/lib/store";

type Step = 1 | 2 | 3 | 4 | 5;

export default function BookingFlow({
  establishmentId,
  services,
  professionals,
}: {
  establishmentId: string;
  services: Service[];
  professionals: Professional[];
}) {
  const { addAppointment } = useData();
  const [step, setStep] = useState<Step>(1);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const service = services.find((s) => s.id === serviceId);
  const professional = professionals.find((p) => p.id === professionalId);

  const availablePros = useMemo(
    () => professionals.filter((p) => !serviceId || p.serviceIds.includes(serviceId)),
    [professionals, serviceId]
  );

  const days = useMemo(() => {
    const arr: { iso: string; label: string; weekday: string; dayNum: string }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      arr.push({
        iso: d.toISOString().slice(0, 10),
        label: i === 0 ? "Hoje" : i === 1 ? "Amanhã" : d.toLocaleDateString("pt-BR", { weekday: "short" }),
        weekday: d.toLocaleDateString("pt-BR", { weekday: "short" }),
        dayNum: String(d.getDate()).padStart(2, "0"),
      });
    }
    return arr;
  }, []);

  const slots = useMemo(() => {
    const list: string[] = [];
    for (let h = 9; h <= 18; h++) {
      list.push(`${String(h).padStart(2, "0")}:00`);
      list.push(`${String(h).padStart(2, "0")}:30`);
    }
    const taken = new Set(["10:00", "11:30", "14:30", "16:00"]);
    return list.map((t) => ({ time: t, available: !taken.has(t) }));
  }, []);

  function reset() {
    setStep(1);
    setServiceId(null);
    setProfessionalId(null);
    setDate(null);
    setTime(null);
    setClientName("");
    setClientPhone("");
    setConfirmed(false);
  }

  if (confirmed) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>
        <h3 className="mt-5 text-2xl font-bold">Agendamento confirmado!</h3>
        <p className="mt-2 text-slate-500 text-sm">
          Em alguns instantes você receberá a confirmação no WhatsApp.
        </p>

        <div className="mt-6 mx-auto max-w-sm bg-slate-50 border rounded-xl p-5 text-left space-y-3 text-sm">
          <Row label="Serviço" value={service?.name ?? ""} />
          <Row label="Profissional" value={professional?.name ?? ""} />
          <Row label="Data" value={formatDate(date!)} />
          <Row label="Horário" value={time!} />
          <Row label="Cliente" value={clientName} />
          <Row label="Valor" value={formatBRL(service?.price ?? 0)} bold />
        </div>

        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Agendar outro horário
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="px-5 sm:px-6 pt-5">
        <Steps current={step} />
      </div>

      <div className="p-5 sm:p-6">
        {step === 1 && (
          <div>
            <h3 className="font-bold flex items-center gap-2">
              <Scissors className="w-4 h-4 text-indigo-600" />
              Escolha o serviço
            </h3>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setServiceId(s.id); setProfessionalId(null); }}
                  className={`text-left p-4 rounded-xl border-2 transition ${
                    serviceId === s.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{s.description}</div>
                    </div>
                    {serviceId === s.id && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {s.durationMin} min
                    </span>
                    <span className="font-bold text-indigo-600">{formatBRL(s.price)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-bold flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Escolha o profissional
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Profissionais que realizam {service?.name}
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              <button
                onClick={() => setProfessionalId("any")}
                className={`p-4 rounded-xl border-2 transition flex items-center gap-3 ${
                  professionalId === "any"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 hover:border-indigo-300"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Sem preferência</div>
                  <div className="text-xs text-slate-500">Maior disponibilidade</div>
                </div>
              </button>

              {availablePros.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProfessionalId(p.id)}
                  className={`p-4 rounded-xl border-2 transition flex items-center gap-3 ${
                    professionalId === p.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <Image
                    src={p.avatar}
                    alt={p.name}
                    width={48}
                    height={48}
                    className="rounded-full w-12 h-12 object-cover"
                  />
                  <div className="text-left">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Escolha a data
            </h3>
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-7 gap-2">
              {days.map((d) => (
                <button
                  key={d.iso}
                  onClick={() => setDate(d.iso)}
                  className={`p-3 rounded-lg border-2 text-center transition ${
                    date === d.iso
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="text-[10px] uppercase font-semibold text-slate-500">{d.label}</div>
                  <div className="text-lg font-bold mt-0.5">{d.dayNum}</div>
                </button>
              ))}
            </div>

            {date && (
              <>
                <h4 className="mt-6 font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Horários disponíveis
                </h4>
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      onClick={() => s.available && setTime(s.time)}
                      disabled={!s.available}
                      className={`p-2.5 rounded-lg border-2 text-sm font-semibold transition ${
                        time === s.time
                          ? "border-indigo-500 bg-indigo-600 text-white"
                          : s.available
                          ? "border-slate-200 hover:border-indigo-300"
                          : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through"
                      }`}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="font-bold flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Seus dados
            </h3>
            <div className="mt-4 space-y-4 max-w-md">
              <div>
                <label className="text-sm font-medium text-slate-700">Nome completo</label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">WhatsApp</label>
                <div className="mt-1 relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Enviaremos a confirmação por aqui.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 className="font-bold">Confirme seu agendamento</h3>
            <div className="mt-4 bg-slate-50 border rounded-xl p-5 space-y-3 text-sm">
              <Row label="Serviço" value={service?.name ?? ""} />
              <Row label="Profissional" value={professional?.name === undefined && professionalId === "any" ? "Sem preferência" : professional?.name ?? ""} />
              <Row label="Data" value={formatDate(date!)} />
              <Row label="Horário" value={time!} />
              <Row label="Duração" value={`${service?.durationMin} min`} />
              <div className="pt-3 border-t" />
              <Row label="Cliente" value={clientName} />
              <Row label="WhatsApp" value={clientPhone} />
              <div className="pt-3 border-t" />
              <Row label="Total" value={formatBRL(service?.price ?? 0)} bold />
            </div>
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 border-t bg-slate-50 rounded-b-2xl flex items-center justify-between gap-3">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
          disabled={step === 1}
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        {step < 5 ? (
          <button
            onClick={() => setStep((s) => (s + 1) as Step)}
            disabled={
              (step === 1 && !serviceId) ||
              (step === 2 && !professionalId) ||
              (step === 3 && (!date || !time)) ||
              (step === 4 && (!clientName || !clientPhone))
            }
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              if (!serviceId || !date || !time) return;
              const finalProId =
                professionalId === "any" || !professionalId
                  ? professionals.find((p) => p.serviceIds.includes(serviceId))?.id ?? ""
                  : professionalId;
              addAppointment({
                establishmentId,
                serviceId,
                professionalId: finalProId,
                clientName,
                clientPhone,
                date,
                time,
                status: "pendente",
              });
              setConfirmed(true);
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirmar agendamento
          </button>
        )}
      </div>
    </div>
  );
}

function Steps({ current }: { current: number }) {
  const labels = ["Serviço", "Profissional", "Data e hora", "Dados", "Confirmar"];
  return (
    <div className="flex items-center gap-2">
      {labels.map((l, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={l} className="flex items-center flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition ${
                done
                  ? "bg-emerald-500 text-white"
                  : active
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {done ? <Check className="w-4 h-4" /> : n}
            </div>
            <div className={`ml-2 text-xs font-semibold hidden sm:block ${active ? "text-indigo-700" : "text-slate-500"}`}>
              {l}
            </div>
            {i < labels.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${done ? "bg-emerald-500" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={bold ? "font-bold text-lg text-indigo-600" : "font-semibold"}>{value}</span>
    </div>
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
