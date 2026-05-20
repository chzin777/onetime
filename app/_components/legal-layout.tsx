import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "./logo";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo size={32} />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          OneTime — documento legal
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">Última atualização: {updated}</p>

        <div className="mt-10 prose prose-slate max-w-none text-slate-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-slate-900 [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-slate-900 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-indigo-600 [&_a]:underline">
          {children}
        </div>

        <div className="mt-16 pt-8 border-t text-sm text-slate-500">
          Dúvidas? Entre em contato:{" "}
          <a href="mailto:contato@onetime.app" className="text-indigo-600 font-semibold">
            contato@onetime.app
          </a>
        </div>
      </article>

      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4 text-sm">
          <span>© 2026 OneTime. Todos os direitos reservados.</span>
          <div className="flex gap-4">
            <Link href="/termos" className="hover:text-white">Termos</Link>
            <Link href="/privacidade" className="hover:text-white">Privacidade</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
