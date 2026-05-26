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
  Wallet,
  Copy,
  ListPlus,
  Gift,
  AlertTriangle,
} from "lucide-react";
import type { Professional, Service } from "@/lib/mock-data";
import { formatBRL, computeDeposit } from "@/lib/mock-data";
import { useData } from "@/lib/store";
import { useToast } from "@/app/_components/toast";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function BookingFlow({
  establishmentId,
  services,
  professionals,
}: {
  establishmentId: string;
  services: Service[];
  professionals: Professional[];
}) {
  const toast = useToast();
  const {
    addAppointment,
    appointments,
    blocks,
    addWaitlist,
    clients,
    addClient,
    addReferral,
    addLoyaltyPoints,
    loyaltyConfigs,
    referralPrograms,
  } = useData();

  const [step, setStep] = useState<Step>(1);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [refValid, setRefValid] = useState<null | { ok: boolean; referrer?: string }>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [pixPaid, setPixPaid] = useState(false);
  const [waitlistAdded, setWaitlistAdded] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  const service = services.find((s) => s.id === serviceId);
  const professional = professionals.find((p) => p.id === professionalId);
  const loyalty = loyaltyConfigs.find((c) => c.establishmentId === establishmentId);
  const refProg = referralPrograms.find((p) => p.establishmentId === establishmentId);

  const availablePros = useMemo(
    () => professionals.filter((p) => !serviceId || p.serviceIds.includes(serviceId)),
    [professionals, serviceId]
  );

  const days = useMemo(() => {
    const arr: { iso: string; label: string; dayNum: string; blocked: boolean }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      const blocked = blocks.some(
        (b) =>
          b.establishmentId === establishmentId &&
          b.date === iso &&
          b.allDay &&
          (!b.professionalId || b.professionalId === professionalId)
      );
      arr.push({
        iso,
        label: i === 0 ? "Hoje" : i === 1 ? "Amanhã" : d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
        dayNum: String(d.getDate()).padStart(2, "0"),
        blocked,
      });
    }
    return arr;
  }, [blocks, establishmentId, professionalId]);

  const slots = useMemo(() => {
    if (!date) return [];
    const list: string[] = [];
    for (let h = 9; h <= 18; h++) {
      list.push(`${String(h).padStart(2, "0")}:00`);
      list.push(`${String(h).padStart(2, "0")}:30`);
    }
    const taken = appointments
      .filter(
        (a) =>
          a.establishmentId === establishmentId &&
          a.date === date &&
          a.status !== "cancelado" &&
          (!professionalId || professionalId === "any" || a.professionalId === professionalId)
      )
      .map((a) => a.time);
    const capacity = service?.capacity ?? 1;
    const counts: Record<string, number> = {};
    taken.forEach((t) => (counts[t] = (counts[t] ?? 0) + 1));
    const blockedSlots = new Set<string>();
    blocks
      .filter(
        (b) =>
          b.establishmentId === establishmentId &&
          b.date === date &&
          !b.allDay &&
          (!b.professionalId || b.professionalId === professionalId)
      )
      .forEach((b) => {
        list.forEach((slot) => {
          if (b.fromTime && b.toTime && slot >= b.fromTime && slot < b.toTime) blockedSlots.add(slot);
        });
      });

    return list.map((t) => ({
      time: t,
      available: !blockedSlots.has(t) && (counts[t] ?? 0) < capacity,
    }));
  }, [date, appointments, establishmentId, professionalId, service, blocks]);

  const allFull = useMemo(() => !!date && slots.length > 0 && slots.every((s) => !s.available), [date, slots]);

  function validateReferral() {
    if (!referralCode) {
      setRefValid(null);
      return;
    }
    const found = clients.find(
      (c) => c.referralCode.toLowerCase() === referralCode.toLowerCase() && c.establishmentId === establishmentId
    );
    setRefValid(found ? { ok: true, referrer: found.name } : { ok: false });
  }

  function reset() {
    setStep(1);
    setServiceId(null);
    setProfessionalId(null);
    setDate(null);
    setTime(null);
    setClientName("");
    setClientPhone("");
    setReferralCode("");
    setRefValid(null);
    setConfirmed(false);
    setPixPaid(false);
    setWaitlistAdded(false);
  }

  function confirmBooking() {
    if (!serviceId || !date || !time || !service) return;
    const finalProId =
      professionalId === "any" || !professionalId
        ? professionals.find((p) => p.serviceIds.includes(serviceId))?.id ?? ""
        : professionalId;

    const depositAmount = computeDeposit(service);
    const needsDeposit = service.depositRequired;

    let client = clients.find((c) => c.phone === clientPhone && c.establishmentId === establishmentId);
    if (!client) {
      client = addClient({ establishmentId, name: clientName, phone: clientPhone });
    }

    const points = loyalty?.enabled ? Math.floor(service.price * loyalty.pointsPerReal) : 0;
    if (points > 0) addLoyaltyPoints(client.id, points);

    if (refValid?.ok && referralCode) {
      const referrer = clients.find((c) => c.referralCode.toLowerCase() === referralCode.toLowerCase());
      if (referrer) {
        addReferral({
          establishmentId,
          code: referralCode.toUpperCase(),
          referrerClientId: referrer.id,
          referredClientId: client.id,
          referredName: clientName,
          status: "pendente",
        });
      }
    }

    addAppointment({
      establishmentId,
      serviceId,
      professionalId: finalProId,
      clientId: client.id,
      clientName,
      clientPhone,
      date,
      time,
      status: needsDeposit && !pixPaid ? "aguardando_pagamento" : "confirmado",
      depositRequired: needsDeposit,
      depositAmount: needsDeposit ? depositAmount : undefined,
      depositPaid: needsDeposit ? pixPaid : undefined,
      pixTxId: needsDeposit ? `PIX-MOCK-${Math.random().toString(36).slice(2, 6).toUpperCase()}` : undefined,
      loyaltyPointsAwarded: points || undefined,
      referralCodeUsed: refValid?.ok ? referralCode.toUpperCase() : undefined,
    });
    setConfirmed(true);
  }

  function joinWaitlist() {
    if (!serviceId || !clientName || !clientPhone) {
      toast.error("Preencha nome e telefone antes.");
      return;
    }
    addWaitlist({
      establishmentId,
      serviceId,
      professionalId: professionalId && professionalId !== "any" ? professionalId : undefined,
      clientName,
      clientPhone,
      preferredDate: date ?? undefined,
      preferredPeriod: "qualquer",
    });
    setWaitlistAdded(true);
  }

  if (waitlistAdded) {
    return (
      <div className="p-6 sm:p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto">
          <ListPlus className="w-10 h-10 text-indigo-600" />
        </div>
        <h3 className="mt-5 text-xl sm:text-2xl font-bold">Você está na lista!</h3>
        <p className="mt-2 text-slate-500 text-sm max-w-md mx-auto">
          Avisaremos no WhatsApp <strong>{clientPhone}</strong> quando abrir vaga. Primeiro a confirmar leva.
        </p>
        <button
          onClick={reset}
          className="press mt-6 h-12 px-6 text-sm font-semibold rounded-xl bg-indigo-600 text-white"
        >
          Voltar ao início
        </button>
      </div>
    );
  }

  if (confirmed) {
    const needsPay = service?.depositRequired && !pixPaid;
    return (
      <div className="p-6 sm:p-8 text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${needsPay ? "bg-amber-100" : "bg-emerald-100"}`}>
          {needsPay ? <Wallet className="w-10 h-10 text-amber-600" /> : <CheckCircle2 className="w-10 h-10 text-emerald-600" />}
        </div>
        <h3 className="mt-5 text-xl sm:text-2xl font-bold">
          {needsPay ? "Aguardando pagamento" : "Agendamento confirmado!"}
        </h3>
        <p className="mt-2 text-slate-500 text-sm">
          {needsPay ? "Finalize o sinal em até 30 minutos." : "Confirmação chega no seu WhatsApp."}
        </p>

        <div className="mt-6 mx-auto max-w-sm bg-slate-50 border rounded-2xl p-5 text-left space-y-3 text-sm">
          <Row label="Serviço" value={service?.name ?? ""} />
          <Row label="Profissional" value={professional?.name ?? (professionalId === "any" ? "Sem preferência" : "")} />
          <Row label="Data" value={formatDate(date!)} />
          <Row label="Horário" value={time!} />
          <Row label="Cliente" value={clientName} />
          {refValid?.ok && <Row label="Indicação" value={referralCode.toUpperCase()} />}
          {loyalty?.enabled && (
            <Row label="Pontos ganhos" value={`+${Math.floor((service?.price ?? 0) * loyalty.pointsPerReal)}`} />
          )}
          <Row label="Total" value={formatBRL(service?.price ?? 0)} bold />
        </div>

        <button
          onClick={reset}
          className="press mt-6 h-12 px-6 text-sm font-semibold rounded-xl bg-indigo-600 text-white"
        >
          Agendar outro horário
        </button>
      </div>
    );
  }

  const showFooter = step !== 4 || !allFull;

  return (
    <div className="flex flex-col">
      <ProgressBar current={step} hasDeposit={!!service?.depositRequired} />

      <div className="px-4 sm:px-6 py-5 sm:py-6 pb-28 sm:pb-6">
        {step === 1 && (
          <div>
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <Scissors className="w-4 h-4 text-indigo-600" />
              Escolha o serviço
            </h3>
            <p className="text-xs text-slate-500 mt-1">O que você quer agendar?</p>
            <div className="mt-4 space-y-2.5 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setServiceId(s.id); setProfessionalId(null); }}
                  className={`press w-full text-left p-4 rounded-2xl border-2 transition ${
                    serviceId === s.id ? "border-indigo-500 bg-indigo-50" : "border-slate-200 active:border-indigo-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{s.description}</div>
                    </div>
                    {serviceId === s.id && (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {s.durationMin} min
                    </span>
                    <span className="font-bold text-indigo-600 text-base">{formatBRL(s.price)}</span>
                  </div>
                  {s.depositRequired && (
                    <div className="mt-2 text-[10px] font-semibold inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                      <Wallet className="w-3 h-3" />
                      Sinal {formatBRL(computeDeposit(s))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Profissional
            </h3>
            <p className="text-xs text-slate-500 mt-1">Quem faz {service?.name}</p>
            <div className="mt-4 space-y-2.5 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
              <button
                onClick={() => setProfessionalId("any")}
                className={`press w-full p-4 rounded-2xl border-2 transition flex items-center gap-3 ${
                  professionalId === "any" ? "border-indigo-500 bg-indigo-50" : "border-slate-200 active:border-indigo-300"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-semibold">Sem preferência</div>
                  <div className="text-xs text-slate-500">Maior disponibilidade</div>
                </div>
                {professionalId === "any" && <Check className="w-5 h-5 text-indigo-600 shrink-0" />}
              </button>

              {availablePros.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProfessionalId(p.id)}
                  className={`press w-full p-4 rounded-2xl border-2 transition flex items-center gap-3 ${
                    professionalId === p.id ? "border-indigo-500 bg-indigo-50" : "border-slate-200 active:border-indigo-300"
                  }`}
                >
                  <Image src={p.avatar} alt={p.name} width={48} height={48} className="rounded-full w-12 h-12 object-cover shrink-0" unoptimized />
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-semibold truncate">{p.name}</div>
                    <div className="text-xs text-slate-500 truncate">{p.role}</div>
                  </div>
                  {professionalId === p.id && <Check className="w-5 h-5 text-indigo-600 shrink-0" />}
                </button>
              ))}
            </div>
            {service && service.capacity > 1 && (
              <p className="mt-4 text-xs text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2 flex items-center gap-2">
                ⚡ Atende até {service.capacity} pessoas no mesmo horário.
              </p>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Data
            </h3>

            <div className="mt-3 -mx-4 sm:mx-0 snap-x-list no-scrollbar flex gap-2 px-4 sm:px-0 sm:grid sm:grid-cols-7 sm:gap-2">
              {days.map((d) => (
                <button
                  key={d.iso}
                  onClick={() => !d.blocked && setDate(d.iso)}
                  disabled={d.blocked}
                  className={`press shrink-0 sm:shrink w-14 sm:w-auto py-3 px-3 sm:px-2 rounded-xl border-2 text-center transition ${
                    d.blocked
                      ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                      : date === d.iso
                      ? "border-indigo-500 bg-indigo-600 text-white"
                      : "border-slate-200 active:border-indigo-300 bg-white"
                  }`}
                >
                  <div className={`text-[10px] uppercase font-bold ${date === d.iso ? "text-indigo-100" : "text-slate-500"}`}>{d.label}</div>
                  <div className="text-lg font-bold mt-0.5">{d.dayNum}</div>
                  {d.blocked && <div className="text-[8px] mt-0.5">block.</div>}
                </button>
              ))}
            </div>

            {date && (
              <>
                <h4 className="mt-6 text-sm sm:text-base font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Horários
                </h4>
                <div className="mt-3 grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      onClick={() => s.available && setTime(s.time)}
                      disabled={!s.available}
                      className={`press h-11 rounded-xl border-2 text-sm font-semibold transition ${
                        time === s.time
                          ? "border-indigo-500 bg-indigo-600 text-white"
                          : s.available
                          ? "border-slate-200 active:border-indigo-300 bg-white"
                          : "border-slate-100 bg-slate-50 text-slate-300 line-through"
                      }`}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
                {allFull && (
                  <div className="mt-4 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-amber-900">Todos horários ocupados</div>
                      <p className="text-xs text-amber-700 mt-1">
                        Entre na lista de espera. Avisaremos no WhatsApp ao abrir vaga.
                      </p>
                      <button
                        onClick={() => setStep(4)}
                        className="press mt-3 h-10 px-4 text-xs font-semibold rounded-xl bg-amber-600 text-white inline-flex items-center gap-2"
                      >
                        <ListPlus className="w-3.5 h-3.5" />
                        Entrar na lista
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Seus dados
            </h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Nome</label>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Como devemos te chamar?"
                  autoComplete="name"
                  className="mt-1.5 w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">WhatsApp</label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  autoComplete="tel"
                  className="mt-1.5 w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <p className="mt-1.5 text-xs text-slate-500">Confirmação chega aqui.</p>
              </div>

              {refProg?.enabled && (
                <div>
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-violet-600" />
                    Código de indicação <span className="text-slate-400 font-normal">(opcional)</span>
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      value={referralCode}
                      onChange={(e) => { setReferralCode(e.target.value.toUpperCase()); setRefValid(null); }}
                      placeholder="JOAO-X7K2"
                      className="flex-1 h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-mono uppercase"
                    />
                    <button
                      onClick={validateReferral}
                      disabled={!referralCode}
                      className="press h-12 px-4 rounded-xl bg-violet-600 text-white text-sm font-semibold disabled:opacity-40"
                    >
                      Validar
                    </button>
                  </div>
                  {refValid?.ok && (
                    <p className="mt-2 text-xs text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2">
                      ✓ Indicado por <strong>{refValid.referrer}</strong>. Você ganha {refProg.referredReward}{refProg.rewardType === "discount_percent" ? "%" : refProg.rewardType === "discount_fixed" ? " R$" : ""} de desconto.
                    </p>
                  )}
                  {refValid && !refValid.ok && (
                    <p className="mt-2 text-xs text-rose-700 bg-rose-50 rounded-xl px-3 py-2">Código inválido neste estabelecimento.</p>
                  )}
                </div>
              )}

              {allFull && (
                <button
                  onClick={joinWaitlist}
                  className="press w-full h-12 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-xl bg-amber-500 text-white"
                >
                  <ListPlus className="w-4 h-4" />
                  Entrar na lista de espera
                </button>
              )}
            </div>
          </div>
        )}

        {step === 5 && service?.depositRequired && (
          <PixStep
            amount={computeDeposit(service)}
            total={service.price}
            paid={pixPaid}
            onPay={() => { setPixPaid(true); toast.success("Pagamento confirmado", "Sinal recebido (simulado)"); }}
            copied={copiedPix}
            onCopy={() => {
              navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX0136mock-pix-onetime-MOCK-COPIACOLA52040000530398654" + computeDeposit(service).toFixed(2) + "5802BR5913OneTime6009SAO PAULO62070503***6304ABCD");
              setCopiedPix(true);
              toast.info("Código copiado", "Cole no seu app do banco");
              setTimeout(() => setCopiedPix(false), 2000);
            }}
          />
        )}

        {step === 6 && (
          <div>
            <h3 className="text-base sm:text-lg font-bold">Confirme</h3>
            <p className="text-xs text-slate-500 mt-1">Revise antes de finalizar</p>
            <div className="mt-4 bg-slate-50 border rounded-2xl p-5 space-y-3 text-sm">
              <Row label="Serviço" value={service?.name ?? ""} />
              <Row label="Profissional" value={professional?.name === undefined && professionalId === "any" ? "Sem preferência" : professional?.name ?? ""} />
              <Row label="Data" value={formatDate(date!)} />
              <Row label="Horário" value={time!} />
              <Row label="Duração" value={`${service?.durationMin} min`} />
              <div className="pt-3 border-t" />
              <Row label="Cliente" value={clientName} />
              <Row label="WhatsApp" value={clientPhone} />
              {refValid?.ok && <Row label="Indicação" value={referralCode.toUpperCase()} />}
              <div className="pt-3 border-t" />
              {service?.depositRequired && (
                <>
                  <Row label="Sinal (Pix)" value={`${formatBRL(computeDeposit(service))} ${pixPaid ? "✓ pago" : "pendente"}`} />
                  <Row label="No local" value={formatBRL(service.price - computeDeposit(service))} />
                </>
              )}
              {loyalty?.enabled && service && (
                <Row label="Pontos fidelidade" value={`+${Math.floor(service.price * loyalty.pointsPerReal)}`} />
              )}
              <Row label="Total" value={formatBRL(service?.price ?? 0)} bold />
            </div>
          </div>
        )}
      </div>

      {showFooter && (
        <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t pb-safe">
          <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1) as Step)}
              disabled={step === 1}
              className="press h-12 px-4 sm:px-5 inline-flex items-center gap-1.5 text-sm font-semibold rounded-xl border bg-white disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar</span>
            </button>

            {step < 6 ? (
              <button
                onClick={() => {
                  if (step === 4 && service && !service.depositRequired) {
                    setStep(6);
                  } else {
                    setStep((s) => (s + 1) as Step);
                  }
                }}
                disabled={
                  (step === 1 && !serviceId) ||
                  (step === 2 && !professionalId) ||
                  (step === 3 && (!date || !time)) ||
                  (step === 4 && (!clientName || !clientPhone)) ||
                  (step === 5 && service?.depositRequired && !pixPaid)
                }
                className="press flex-1 sm:flex-initial h-12 px-5 sm:px-6 inline-flex items-center justify-center gap-2 text-sm font-bold rounded-xl bg-indigo-600 text-white disabled:opacity-40"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={confirmBooking}
                className="press flex-1 sm:flex-initial h-12 px-5 sm:px-6 inline-flex items-center justify-center gap-2 text-sm font-bold rounded-xl bg-emerald-600 text-white"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirmar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressBar({ current, hasDeposit }: { current: number; hasDeposit: boolean }) {
  const total = hasDeposit ? 6 : 5;
  const adjusted = hasDeposit ? current : current === 6 ? 5 : current;
  const pct = (adjusted / total) * 100;
  const labels = hasDeposit
    ? ["Serviço", "Profissional", "Data", "Dados", "Pix", "Confirmar"]
    : ["Serviço", "Profissional", "Data", "Dados", "Confirmar"];
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
      <div className="px-4 sm:px-6 pt-4 pb-3">
        <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold">
          <span className="text-indigo-700">Passo {adjusted}/{total}</span>
          <span className="text-slate-500 truncate">{labels[adjusted - 1]}</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function PixStep({
  amount,
  total,
  paid,
  onPay,
  copied,
  onCopy,
}: {
  amount: number;
  total: number;
  paid: boolean;
  onPay: () => void;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div>
      <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
        <Wallet className="w-4 h-4 text-amber-600" />
        Sinal Pix
      </h3>
      <p className="text-xs text-slate-500 mt-1">
        Pague <strong>{formatBRL(amount)}</strong> pra confirmar. Restante {formatBRL(total - amount)} no local.
      </p>

      <div className="mt-5 space-y-4">
        <div className="bg-white border-2 border-amber-200 rounded-2xl p-5 text-center">
          <div className="aspect-square max-w-[200px] mx-auto bg-[linear-gradient(45deg,#000_25%,transparent_25%),linear-gradient(-45deg,#000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#000_75%),linear-gradient(-45deg,transparent_75%,#000_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] rounded-lg" />
          <div className="mt-3 text-[10px] text-slate-500">QR Code Pix (mock)</div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1.5">Pix Copia e Cola</div>
            <div className="font-mono text-[11px] bg-slate-50 border rounded-xl p-3 break-all leading-relaxed">
              00020126580014BR.GOV.BCB.PIX0136mock-pix-onetime-MOCK-COPIACOLA52040000530398654{amount.toFixed(2)}5802BR5913OneTime6009SAO PAULO62070503***6304ABCD
            </div>
            <button
              onClick={onCopy}
              className="press mt-2 w-full h-11 inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-xl border bg-white"
            >
              {copied ? <><Check className="w-4 h-4 text-emerald-600" />Copiado</> : <><Copy className="w-4 h-4" />Copiar código</>}
            </button>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3 space-y-1">
            <div>Valor: <strong className="text-slate-900">{formatBRL(amount)}</strong></div>
            <div>Expira em: <strong className="text-rose-600">30:00</strong></div>
            <div>Beneficiário: <strong>OneTime</strong></div>
          </div>

          <button
            onClick={onPay}
            disabled={paid}
            className="press w-full h-12 inline-flex items-center justify-center gap-2 text-sm font-bold rounded-xl bg-emerald-600 text-white disabled:bg-emerald-500 disabled:opacity-70"
          >
            {paid ? <><Check className="w-4 h-4" />Pagamento confirmado</> : <>Já paguei (simular)</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className={bold ? "font-bold text-lg text-indigo-600" : "font-semibold text-right"}>{value}</span>
    </div>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
}
