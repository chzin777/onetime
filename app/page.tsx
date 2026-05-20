import Link from "next/link";
import Image from "next/image";
import {
  CalendarCheck,
  MessageCircle,
  Users,
  Scissors,
  Sparkles,
  Dog,
  Store,
  ShieldCheck,
  Clock,
  BarChart3,
  ArrowRight,
  Check,
  Smartphone,
  Bell,
  Globe,
  Zap,
} from "lucide-react";
import FaqItem from "./_components/faq-item";
import SplitText from "./_components/split-text";
import NavLink from "./_components/nav-link";
import TextType from "./_components/text-type";
import Logo, { LogoMark } from "./_components/logo";

export default function LandingPage() {
  return (
    <main className="flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo size={36} />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <NavLink href="#features" className="hover:text-slate-900 transition">Recursos</NavLink>
            <NavLink href="#segments" className="hover:text-slate-900 transition">Para quem é</NavLink>
            <NavLink href="#pricing" className="hover:text-slate-900 transition">Planos</NavLink>
            <NavLink href="#faq" className="hover:text-slate-900 transition">FAQ</NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Entrar
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-300/30 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Novo: Integração nativa com WhatsApp
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight flex flex-wrap gap-x-3">
              <SplitText
                text="Agendamentos online sem complicação"
                tag="span"
                className="leading-tight hero-headline"
                textAlign="left"
                splitType="words, chars"
                delay={30}
                duration={1}
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.2}
                rootMargin="0px"
              />
            </h1>
            <div className="relative mt-6">
              <p className="text-lg text-slate-600 leading-relaxed invisible" aria-hidden="true">
                Plataforma completa para petshops, barbearias, salões e prestadores de serviço. Seus clientes agendam pelo link, você gerencia tudo num só lugar.
              </p>
              <TextType
                as="p"
                text="Plataforma completa para petshops, barbearias, salões e prestadores de serviço. Seus clientes agendam pelo link, você gerencia tudo num só lugar."
                className="absolute inset-0 text-lg text-slate-600 leading-relaxed"
                typingSpeed={25}
                initialDelay={400}
                loop={false}
                showCursor
                cursorCharacter="|"
                cursorClassName="text-indigo-600 font-light"
                startOnVisible
              />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
              >
                Testar grátis por 14 dias
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/b/barbearia-vintage"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 font-semibold hover:border-slate-300 transition"
              >
                Ver demo de agendamento
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" /> Sem cartão de crédito
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" /> Cancele quando quiser
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-3xl blur-2xl opacity-20" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white">
              <Image
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&h=700&fit=crop"
                alt="Painel de agendamentos"
                width={900}
                height={700}
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Hoje</p>
                <p className="font-bold">23 agendamentos</p>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">WhatsApp</p>
                <p className="font-bold">Conectado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="segments" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold tracking-tight">Feito para o seu negócio</h2>
            <p className="mt-3 text-slate-600">
              Qualquer prestador de serviço com agenda. Aqui vão alguns exemplos.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Dog, label: "Petshops", color: "bg-amber-100 text-amber-600" },
              { icon: Scissors, label: "Barbearias", color: "bg-slate-200 text-slate-700" },
              { icon: Sparkles, label: "Salões de beleza", color: "bg-pink-100 text-pink-600" },
              { icon: Store, label: "E muito mais", color: "bg-indigo-100 text-indigo-600" },
            ].map((s) => (
              <div
                key={s.label}
                className="p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color} group-hover:scale-110 transition`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{s.label}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Agenda online, gestão de profissionais e serviços com preços e duração.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Recursos</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight">Tudo o que você precisa</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Da landing page do seu estabelecimento até o lembrete via WhatsApp, sem precisar de mil ferramentas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Globe, title: "Link público de agendamento", desc: "Cada estabelecimento ganha sua URL para clientes agendarem online." },
              { icon: Users, title: "Gestão de profissionais", desc: "Cadastre equipe e defina quais serviços cada um realiza." },
              { icon: Scissors, title: "Catálogo de serviços", desc: "Preço, duração, categoria. Tudo personalizável." },
              { icon: Clock, title: "Horários de atendimento", desc: "Configure dias e horários por estabelecimento." },
              { icon: MessageCircle, title: "WhatsApp via Evolution API", desc: "Confirmações e lembretes automáticos. Basta conectar." },
              { icon: BarChart3, title: "Relatórios", desc: "Faturamento, taxa de ocupação e ranking de serviços." },
              { icon: Bell, title: "Notificações em tempo real", desc: "Avise sua equipe assim que cair um novo agendamento." },
              { icon: ShieldCheck, title: "Multi-estabelecimento", desc: "Gerencie várias unidades em uma conta só." },
              { icon: Smartphone, title: "Mobile first", desc: "Funciona perfeitamente no celular do seu cliente." },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition"
              >
                <div className="w-11 h-11 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Planos</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight">
              Comece grátis. Cresça quando quiser.
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Todos os planos incluem 14 dias grátis e cancelamento a qualquer momento. Sem multa, sem fidelidade.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {[
              {
                name: "Início",
                price: 49 as number | null,
                priceLabel: null as string | null,
                priceHint: null as string | null,
                href: "/login",
                tagline: "Pra quem está começando agora.",
                cta: "Começar grátis",
                badge: null as string | null,
                highlight: false,
                groups: [
                  {
                    title: "O essencial",
                    items: [
                      "1 estabelecimento",
                      "Até 3 profissionais",
                      "Agendamentos ilimitados pelo link público",
                      "Catálogo de serviços com preço e duração",
                      "Horários de atendimento personalizados",
                    ],
                  },
                  {
                    title: "Pra você economizar tempo",
                    items: [
                      "Painel administrativo completo",
                      "Confirmação por email para o cliente",
                      "Cancelamento e reagendamento em 1 clique",
                    ],
                  },
                  {
                    title: "Suporte",
                    items: ["Atendimento por email em até 24h", "Central de ajuda com tutoriais"],
                  },
                ],
              },
              {
                name: "Profissional",
                price: 99 as number | null,
                priceLabel: null as string | null,
                priceHint: null as string | null,
                href: "/login",
                tagline: "Pro negócio que está crescendo. O queridinho dos clientes.",
                cta: "Quero o Profissional",
                highlight: true,
                badge: "MAIS POPULAR" as string | null,
                groups: [
                  {
                    title: "Tudo do Início, mais:",
                    items: [
                      "Até 3 estabelecimentos",
                      "Profissionais ilimitados",
                      "Serviços ilimitados",
                    ],
                  },
                  {
                    title: "WhatsApp que vende sozinho",
                    items: [
                      "Integração nativa com Evolution API",
                      "Confirmação automática pelo WhatsApp",
                      "Lembretes 24h e 1h antes (reduz no-show até 70%)",
                      "Mensagem de agradecimento pós-atendimento",
                    ],
                  },
                  {
                    title: "Decisões baseadas em dados",
                    items: [
                      "Relatórios de faturamento e ocupação",
                      "Ranking dos serviços mais vendidos",
                      "Performance por profissional",
                      "Exportação CSV/Excel",
                    ],
                  },
                  {
                    title: "Suporte prioritário",
                    items: ["Chat ao vivo em horário comercial", "Resposta em até 2 horas úteis"],
                  },
                ],
              },
              {
                name: "Empresarial",
                price: null as number | null,
                priceLabel: "Sob consulta" as string | null,
                priceHint: "preço sob medida pra sua operação" as string | null,
                href: "mailto:contato@onetime.app?subject=Plano%20Empresarial",
                tagline: "Pra redes, franquias e quem leva o negócio a sério.",
                cta: "Entrar em contato",
                badge: null as string | null,
                highlight: false,
                groups: [
                  {
                    title: "Tudo do Profissional, mais:",
                    items: [
                      "Quantas unidades você quiser, sem limite",
                      "Cadastro de vários usuários (recepção, gerente, etc.) com permissões diferentes",
                      "Painel único pra ver todas as unidades de uma vez",
                    ],
                  },
                  {
                    title: "A cara do seu negócio",
                    items: [
                      "Use seu próprio endereço (ex: agendar.suamarca.com.br) no lugar do nosso",
                      "Coloque sua logo e suas cores no painel e na página de agendamento",
                      "Emails de confirmação saindo do seu próprio domínio",
                    ],
                  },
                  {
                    title: "Conecte com outros sistemas",
                    items: [
                      "Plug com Google Agenda e Outlook automático",
                      "Possibilidade de integrar com seu ERP, CRM ou sistema de gestão",
                      "Sincronização com sua equipe técnica (se tiver)",
                    ],
                  },
                  {
                    title: "Atendimento VIP",
                    items: [
                      "Uma pessoa do nosso time como ponto focal seu (responde no WhatsApp)",
                      "Treinamento ao vivo com sua equipe ao contratar",
                      "Compromisso por contrato: sistema no ar 99,9% do tempo, com indenização se cair",
                    ],
                  },
                ],
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`relative p-7 rounded-2xl border transition flex flex-col ${
                  p.highlight
                    ? "border-indigo-500 shadow-2xl shadow-indigo-500/20 md:scale-105 bg-gradient-to-br from-white to-indigo-50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                {p.highlight && p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold tracking-wide">
                    {p.badge}
                  </div>
                )}

                <h3 className="font-bold text-2xl">{p.name}</h3>
                <p className="mt-1 text-sm text-slate-600 min-h-[2.5rem]">{p.tagline}</p>

                <div className="mt-4 flex items-baseline gap-1 min-h-[3rem]">
                  {p.price !== null ? (
                    <>
                      <span className="text-4xl font-bold">R$ {p.price}</span>
                      <span className="text-slate-500">/mês</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold">{p.priceLabel}</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  {p.price !== null
                    ? "cobrado mensalmente • cancele quando quiser"
                    : p.priceHint}
                </p>

                <Link
                  href={p.href}
                  className={`mt-5 block text-center py-3 rounded-xl font-semibold transition ${
                    p.highlight
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {p.cta}
                </Link>

                <div className="mt-7 space-y-5">
                  {p.groups.map((g) => (
                    <div key={g.title}>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {g.title}
                      </h4>
                      <ul className="mt-2 space-y-2">
                        {g.items.map((it) => (
                          <li key={it} className="flex items-start gap-2 text-sm text-slate-700">
                            <Check className={`w-4 h-4 mt-0.5 shrink-0 ${p.highlight ? "text-indigo-600" : "text-emerald-500"}`} />
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border bg-slate-50 p-6 sm:p-8 grid sm:grid-cols-3 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Garantia de 14 dias</h4>
                <p className="text-slate-600 text-xs mt-0.5">
                  Teste sem cartão. Se não gostar, basta sair.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Mudança instantânea de plano</h4>
                <p className="text-slate-600 text-xs mt-0.5">
                  Faça upgrade ou downgrade quando precisar, sem perder dados.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Atualizações grátis pra sempre</h4>
                <p className="text-slate-600 text-xs mt-0.5">
                  Novos recursos sem custo adicional, no plano que você já paga.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-indigo-600 to-violet-600">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <Zap className="w-12 h-12 mx-auto opacity-90" />
          <h2 className="mt-4 text-4xl font-bold tracking-tight">
            Pronto pra parar de perder agendamentos?
          </h2>
          <p className="mt-3 text-indigo-100 text-lg">
            Crie sua conta em 2 minutos. Sem cartão.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-indigo-600 font-semibold hover:bg-indigo-50 transition shadow-xl"
          >
            Começar grátis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-10">Perguntas frequentes</h2>
          <div className="space-y-3">
            {[
              { q: "Preciso instalar algum app?", a: "Não. É 100% web. Funciona em qualquer navegador, no computador ou no celular." },
              { q: "Como funciona a integração com WhatsApp?", a: "Usamos a Evolution API. Você cola suas credenciais nas configurações e o sistema envia confirmações e lembretes automáticos." },
              { q: "Posso ter mais de um estabelecimento?", a: "Sim. O plano Profissional permite até 3 e o Empresarial é ilimitado." },
              { q: "Os clientes precisam se cadastrar?", a: "Não. Eles agendam apenas com nome e telefone através do link público." },
            ].map((f) => (
              <FaqItem key={f.q} question={f.q} answer={f.a} />
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <LogoMark size={32} />
              <span className="font-bold text-white">OneTime</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Agendamento online para o seu negócio.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li><NavLink href="#features" className="hover:text-white">Recursos</NavLink></li>
              <li><NavLink href="#pricing" className="hover:text-white">Planos</NavLink></li>
              <li><NavLink href="#faq" className="hover:text-white">FAQ</NavLink></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Sobre</a></li>
              <li><a href="#" className="hover:text-white">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/termos" className="hover:text-white">Termos</Link></li>
              <li><Link href="/privacidade" className="hover:text-white">Privacidade</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-slate-800 text-sm text-slate-500">
          © 2026 OneTime. Todos os direitos reservados.
        </div>
      </footer>
    </main>
  );
}
