"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Clock, Star, CalendarCheck } from "lucide-react";
import { useData } from "@/lib/store";
import BookingFlow from "./booking-flow";

export default function PublicBookingClient({ slug }: { slug: string }) {
  const { establishments, services, professionals, hydrated } = useData();
  const est = establishments.find((e) => e.slug === slug);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">
        Carregando...
      </div>
    );
  }

  if (!est) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border p-8 max-w-md text-center">
          <h1 className="text-xl font-bold">Estabelecimento não encontrado</h1>
          <p className="mt-2 text-sm text-slate-500">
            O link <code className="bg-slate-100 px-1 rounded">/b/{slug}</code> não existe.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Voltar à página inicial
          </Link>
        </div>
      </div>
    );
  }

  const estServices = services.filter((s) => s.establishmentId === est.id);
  const estPros = professionals.filter((p) => p.establishmentId === est.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative h-56 sm:h-64 bg-slate-200">
        <Image src={est.cover} alt={est.name} fill className="object-cover" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-16 relative pb-16">
        <div className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <Image
              src={est.logo}
              alt={est.name}
              width={80}
              height={80}
              className="rounded-xl border-4 border-white shadow-md w-20 h-20 object-cover -mt-12"
              unoptimized
            />
            <div className="flex-1">
              <span className="text-xs font-semibold text-indigo-600">{est.category}</span>
              <h1 className="text-2xl font-bold tracking-tight">{est.name}</h1>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-700">4.9</span>
                  <span>(127)</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Aberto agora
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t grid sm:grid-cols-2 gap-3 text-sm text-slate-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
              {est.address}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0 text-slate-400" />
              {est.phone}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl border shadow-sm">
          <div className="p-5 sm:p-6 border-b flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-lg">Agendar atendimento</h2>
          </div>
          <BookingFlow
            establishmentId={est.id}
            services={estServices}
            professionals={estPros}
          />
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Sistema de agendamento por <span className="font-semibold text-slate-600">OneTime</span>
        </p>
      </div>
    </div>
  );
}
