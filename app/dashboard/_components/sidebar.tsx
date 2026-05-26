"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Users,
  Scissors,
  CalendarClock,
  Clock,
  MessageCircle,
  Settings,
  LogOut,
  ListPlus,
  CalendarX,
  Gift,
  Share2,
} from "lucide-react";
import Logo from "@/app/_components/logo";

const nav = [
  { href: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { href: "/dashboard/establishments", label: "Estabelecimentos", icon: Store },
  { href: "/dashboard/professionals", label: "Profissionais", icon: Users },
  { href: "/dashboard/services", label: "Serviços", icon: Scissors },
  { href: "/dashboard/appointments", label: "Agendamentos", icon: CalendarClock },
  { href: "/dashboard/waitlist", label: "Lista de espera", icon: ListPlus },
  { href: "/dashboard/blocks", label: "Bloqueios", icon: CalendarX },
  { href: "/dashboard/loyalty", label: "Fidelidade", icon: Gift },
  { href: "/dashboard/referrals", label: "Indicações", icon: Share2 },
  { href: "/dashboard/hours", label: "Horários", icon: Clock },
  { href: "/dashboard/whatsapp", label: "WhatsApp", icon: MessageCircle },
  { href: "/dashboard/settings", label: "Configurações", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 bg-white border-r flex-col">
      <div className="h-16 px-5 flex items-center border-b">
        <Link href="/dashboard">
          <Logo size={32} wordmarkClassName="font-bold tracking-tight" />
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {nav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Link>
      </div>
    </aside>
  );
}
