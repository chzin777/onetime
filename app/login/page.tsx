"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CalendarCheck,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Logo, { LogoMark } from "@/app/_components/logo";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("admin@agendi.app");
  const [password, setPassword] = useState("demo1234");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 700);
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-block mb-10">
            <Logo size={36} />
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo de volta</h1>
          <p className="mt-2 text-slate-600">
            Entre para gerenciar seus agendamentos.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <div className="mt-1.5 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Senha</label>
                <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  Esqueci a senha
                </a>
              </div>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" className="rounded border-slate-300" defaultChecked />
              Manter conectado
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Entrando...
                </>
              ) : (
                <>
                  Entrar <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-3 rounded-lg bg-slate-50 border text-xs text-slate-600">
            <strong>Demo:</strong> use qualquer email e senha. Você será direcionado ao painel.
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            Ainda não tem conta?{" "}
            <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Criar conta grátis
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block relative bg-gradient-to-br from-indigo-600 to-violet-700">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
        <div className="relative h-full flex items-center justify-center p-12 text-white">
          <div className="max-w-md">
            <LogoMark size={56} className="opacity-95" />
            <h2 className="mt-6 text-4xl font-bold leading-tight">
              Seu negócio organizado em um só lugar.
            </h2>
            <p className="mt-4 text-indigo-100 leading-relaxed">
              Mais de 2.000 estabelecimentos confiam no OneTime para gerenciar
              agendamentos, clientes e equipes.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { n: "+50k", l: "Agendamentos/mês" },
                { n: "98%", l: "Satisfação" },
                { n: "24/7", l: "Suporte" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-3xl font-bold">{s.n}</div>
                  <div className="text-xs text-indigo-200 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
