"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, Search, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { currentUser } from "@/lib/mock-data";
import Logo from "@/app/_components/logo";

const titleMap: Record<string, string> = {
  "/dashboard": "Início",
  "/dashboard/appointments": "Agenda",
  "/dashboard/waitlist": "Lista de espera",
  "/dashboard/establishments": "Estabelecimentos",
  "/dashboard/professionals": "Profissionais",
  "/dashboard/services": "Serviços",
  "/dashboard/blocks": "Bloqueios",
  "/dashboard/loyalty": "Fidelidade",
  "/dashboard/referrals": "Indicações",
  "/dashboard/hours": "Horários",
  "/dashboard/whatsapp": "WhatsApp",
  "/dashboard/settings": "Configurações",
};

export default function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const title = titleMap[pathname] ?? "OneTime";

  return (
    <>
      <header className="bg-white border-b sticky top-0 z-30 pt-safe">
        <div className="h-14 lg:h-16 flex items-center px-4 sm:px-6 lg:px-8 gap-3">
          <Link href="/dashboard" className="lg:hidden flex items-center">
            <Logo size={28} wordmarkClassName="font-bold tracking-tight text-base" />
          </Link>

          <h1 className="lg:hidden text-base font-bold tracking-tight ml-auto absolute left-1/2 -translate-x-1/2 truncate max-w-[55%] text-center pointer-events-none">
            {title}
          </h1>

          <div className="hidden lg:block relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar agendamentos, clientes..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-transparent focus:bg-white focus:border-slate-300 focus:outline-none text-sm"
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="press lg:hidden p-2.5 rounded-full hover:bg-slate-100 active:bg-slate-200"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5 text-slate-600" />
            </button>

            <button className="press relative p-2.5 rounded-full hover:bg-slate-100 active:bg-slate-200" aria-label="Notificações">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="relative" ref={ref}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="press flex items-center gap-3 p-1 lg:pr-2 rounded-full lg:rounded-lg hover:bg-slate-100 transition"
              >
                <div className="text-right hidden lg:block">
                  <div className="text-sm font-semibold leading-tight">{currentUser.name}</div>
                  <div className="text-xs text-slate-500">Plano {currentUser.plan}</div>
                </div>
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  width={32}
                  height={32}
                  className="rounded-full w-8 h-8 lg:w-9 lg:h-9"
                />
                <ChevronDown className={`w-4 h-4 text-slate-400 hidden lg:block transition ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border bg-white shadow-xl overflow-hidden z-50">
                  <div className="p-4 border-b bg-slate-50 flex items-center gap-3">
                    <Image src={currentUser.avatar} alt={currentUser.name} width={40} height={40} className="rounded-full" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{currentUser.name}</div>
                      <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
                    </div>
                  </div>

                  <div className="p-1">
                    <Link href="/dashboard/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-slate-50">
                      <User className="w-4 h-4 text-slate-500" />
                      Meu perfil
                    </Link>
                    <Link href="/dashboard/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-slate-50">
                      <Settings className="w-4 h-4 text-slate-500" />
                      Configurações
                    </Link>
                  </div>

                  <div className="p-1 border-t">
                    <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4" />
                      Sair
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 fade-in" onClick={() => setSearchOpen(false)} />
          <div className="absolute inset-x-0 top-0 bg-white shadow-lg pt-safe">
            <div className="flex items-center gap-2 p-3">
              <button
                onClick={() => setSearchOpen(false)}
                className="press p-2 rounded-full hover:bg-slate-100 text-sm font-semibold text-indigo-600"
              >
                Cancelar
              </button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="search"
                  autoFocus
                  placeholder="Buscar agendamentos, clientes..."
                  className="w-full pl-9 pr-3 h-11 rounded-xl bg-slate-100 border border-transparent focus:bg-white focus:border-slate-300 focus:outline-none text-base"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
