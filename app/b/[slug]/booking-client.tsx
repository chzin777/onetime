"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Clock, Star, Share2, ChevronLeft } from "lucide-react";
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
            Link <code className="bg-slate-100 px-1 rounded">/b/{slug}</code> não existe.
          </p>
          <Link
            href="/"
            className="press mt-5 inline-block text-sm font-semibold px-5 py-3 rounded-xl bg-indigo-600 text-white"
          >
            Voltar
          </Link>
        </div>
      </div>
    );
  }

  const estServices = services.filter((s) => s.establishmentId === est.id);
  const estPros = professionals.filter((p) => p.establishmentId === est.id);

  function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: est!.name, text: `Agende em ${est!.name}`, url: window.location.href }).catch(() => {});
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative h-44 sm:h-64 bg-slate-200">
        <Image src={est.cover} alt={est.name} fill className="object-cover" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

        <div className="absolute top-0 inset-x-0 pt-safe">
          <div className="flex items-center justify-between p-3 sm:p-4">
            <Link
              href="/"
              className="press w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <button
              onClick={share}
              className="press w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow"
              aria-label="Compartilhar"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-3 sm:px-4 -mt-12 sm:-mt-16 relative pb-32 sm:pb-16">
        <div className="bg-white rounded-2xl border shadow-sm p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <Image
              src={est.logo}
              alt={est.name}
              width={80}
              height={80}
              className="rounded-2xl border-4 border-white shadow-md w-16 h-16 sm:w-20 sm:h-20 object-cover -mt-10 sm:-mt-12"
              unoptimized
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">{est.category}</span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{est.name}</h1>
              <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-700">4.9</span>
                  <span>(127)</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Aberto agora
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t grid sm:grid-cols-2 gap-2 sm:gap-3 text-sm text-slate-600">
            <a href={`https://maps.google.com/?q=${encodeURIComponent(est.address)}`} target="_blank" rel="noreferrer" className="press flex items-start gap-2 -mx-2 px-2 py-1.5 rounded-lg hover:bg-slate-50">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-indigo-500" />
              <span className="text-xs sm:text-sm">{est.address}</span>
            </a>
            <a href={`tel:${est.phone.replace(/\D/g, "")}`} className="press flex items-center gap-2 -mx-2 px-2 py-1.5 rounded-lg hover:bg-slate-50">
              <Phone className="w-4 h-4 shrink-0 text-indigo-500" />
              <span className="text-xs sm:text-sm">{est.phone}</span>
            </a>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <BookingFlow
            establishmentId={est.id}
            services={estServices}
            professionals={estPros}
          />
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Agendamento por <span className="font-semibold text-slate-600">OneTime</span>
        </p>
      </div>
    </div>
  );
}
