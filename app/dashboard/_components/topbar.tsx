"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, Search, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { currentUser } from "@/lib/mock-data";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="h-16 bg-white border-b sticky top-0 z-30 flex items-center px-6 lg:px-8 gap-4">
      <div className="relative w-full max-w-md ml-10 lg:ml-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          placeholder="Buscar agendamentos, clientes..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-transparent focus:bg-white focus:border-slate-300 focus:outline-none text-sm"
        />
      </div>

      <button className="ml-auto relative p-2 rounded-lg hover:bg-slate-100" aria-label="Notificações">
        <Bell className="w-5 h-5 text-slate-600" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3 p-1 pr-2 rounded-lg hover:bg-slate-100 transition"
        >
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold leading-tight">{currentUser.name}</div>
            <div className="text-xs text-slate-500">Plano {currentUser.plan}</div>
          </div>
          <Image
            src={currentUser.avatar}
            alt={currentUser.name}
            width={36}
            height={36}
            className="rounded-full"
          />
          <ChevronDown className={`w-4 h-4 text-slate-400 hidden sm:block transition ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-64 rounded-xl border bg-white shadow-xl overflow-hidden z-50">
            <div className="p-4 border-b bg-slate-50 flex items-center gap-3">
              <Image
                src={currentUser.avatar}
                alt={currentUser.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{currentUser.name}</div>
                <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
              </div>
            </div>

            <div className="p-1">
              <Link
                href="/dashboard/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-slate-50"
              >
                <User className="w-4 h-4 text-slate-500" />
                Meu perfil
              </Link>
              <Link
                href="/dashboard/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-slate-50"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                Configurações
              </Link>
            </div>

            <div className="p-1 border-t">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
