"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  CalendarClock,
  ListPlus,
  MoreHorizontal,
  Store,
  Users,
  Scissors,
  CalendarX,
  Gift,
  Share2,
  Clock,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";

const primary = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard, match: (p: string) => p === "/dashboard" },
  { href: "/dashboard/appointments", label: "Agenda", icon: CalendarClock, match: (p: string) => p.startsWith("/dashboard/appointments") },
  { href: "/dashboard/waitlist", label: "Espera", icon: ListPlus, match: (p: string) => p.startsWith("/dashboard/waitlist") },
  { href: "/dashboard/establishments", label: "Locais", icon: Store, match: (p: string) => p.startsWith("/dashboard/establishments") },
];

const more = [
  { href: "/dashboard/professionals", label: "Profissionais", icon: Users },
  { href: "/dashboard/services", label: "Serviços", icon: Scissors },
  { href: "/dashboard/blocks", label: "Bloqueios", icon: CalendarX },
  { href: "/dashboard/loyalty", label: "Fidelidade", icon: Gift },
  { href: "/dashboard/referrals", label: "Indicações", icon: Share2 },
  { href: "/dashboard/hours", label: "Horários", icon: Clock },
  { href: "/dashboard/whatsapp", label: "WhatsApp", icon: MessageCircle },
  { href: "/dashboard/settings", label: "Configurações", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = more.some((m) => pathname.startsWith(m.href));

  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t pb-safe"
        aria-label="Navegação principal"
      >
        <ul className="flex items-stretch justify-around">
          {primary.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`press flex flex-col items-center justify-center gap-0.5 h-14 transition ${
                    active ? "text-indigo-600" : "text-slate-500 active:text-slate-700"
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${active ? "scale-110" : ""}`} strokeWidth={active ? 2.4 : 2} />
                  <span className={`text-[10px] font-semibold ${active ? "" : "text-slate-500"}`}>{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li className="flex-1">
            <button
              onClick={() => setMoreOpen(true)}
              className={`press w-full flex flex-col items-center justify-center gap-0.5 h-14 transition ${
                isMoreActive ? "text-indigo-600" : "text-slate-500 active:text-slate-700"
              }`}
              aria-label="Mais opções"
            >
              <MoreHorizontal className="w-5 h-5" strokeWidth={isMoreActive ? 2.4 : 2} />
              <span className="text-[10px] font-semibold">Mais</span>
            </button>
          </li>
        </ul>
      </nav>

      {moreOpen && (
        <MoreSheet pathname={pathname} onClose={() => setMoreOpen(false)} />
      )}
    </>
  );
}

function MoreSheet({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 fade-in" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl sheet-enter pb-safe max-h-[88vh] overflow-hidden flex flex-col">
        <div className="pt-2">
          <div className="sheet-handle" />
        </div>
        <div className="px-5 py-3 border-b flex items-center justify-between">
          <h3 className="font-bold">Mais opções</h3>
          <button onClick={onClose} className="press p-2 -mr-2 rounded-full hover:bg-slate-100 text-sm font-semibold text-indigo-600">
            Fechar
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-3 gap-3 p-5">
            {more.map((m) => {
              const Icon = m.icon;
              const active = pathname.startsWith(m.href);
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  onClick={onClose}
                  className={`press rounded-2xl border p-4 flex flex-col items-center gap-2 text-center transition ${
                    active ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold leading-tight">{m.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="px-5 pb-5">
            <Link
              href="/"
              onClick={onClose}
              className="press flex items-center justify-center gap-2 h-12 rounded-xl border bg-white text-rose-600 font-semibold text-sm hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
