"use client";

import Image from "next/image";
import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Bell,
  CreditCard,
  Building2,
  Globe,
  Save,
  ChevronRight,
  Check,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { currentUser } from "@/lib/mock-data";
import { useData } from "@/lib/store";

type TabKey = "profile" | "company" | "billing" | "notifications" | "security" | "domain";

const tabs: { key: TabKey; icon: typeof User; label: string }[] = [
  { key: "profile", icon: User, label: "Perfil" },
  { key: "company", icon: Building2, label: "Empresa" },
  { key: "billing", icon: CreditCard, label: "Plano e cobrança" },
  { key: "notifications", icon: Bell, label: "Notificações" },
  { key: "security", icon: Lock, label: "Segurança" },
  { key: "domain", icon: Globe, label: "Domínio personalizado" },
];

export default function SettingsPage() {
  const [active, setActive] = useState<TabKey>("profile");
  const { resetAll } = useData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-slate-500 text-sm">
          Gerencie sua conta e preferências.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <nav className="lg:col-span-1 space-y-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active === t.key
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-3">
                <t.icon className="w-4 h-4" />
                {t.label}
              </span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          ))}

          <div className="pt-4 mt-4 border-t">
            <button
              onClick={() => {
                if (confirm("Restaurar dados originais? Tudo que você criou será perdido.")) {
                  resetAll();
                }
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <RefreshCw className="w-4 h-4" />
              Restaurar demo
            </button>
          </div>
        </nav>

        <div className="lg:col-span-3 space-y-6">
          {active === "profile" && <ProfileTab />}
          {active === "company" && <CompanyTab />}
          {active === "billing" && <BillingTab />}
          {active === "notifications" && <NotificationsTab />}
          {active === "security" && <SecurityTab />}
          {active === "domain" && <DomainTab />}
        </div>
      </div>
    </div>
  );
}

function Card({ title, icon, children, footer }: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border">
      <div className="p-5 border-b">
        <h2 className="font-semibold flex items-center gap-2">
          {icon}
          {title}
        </h2>
      </div>
      <div className="p-5">{children}</div>
      {footer && <div className="p-5 border-t bg-slate-50 rounded-b-2xl flex justify-end">{footer}</div>}
    </div>
  );
}

function SaveBtn({ onSave }: { onSave?: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => { onSave?.(); setDone(true); setTimeout(() => setDone(false), 1500); }}
      className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
    >
      {done ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
      {done ? "Salvo!" : "Salvar alterações"}
    </button>
  );
}

function ProfileTab() {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState("(11) 99999-9999");
  const [role, setRole] = useState("Proprietário");

  return (
    <Card
      title="Perfil"
      icon={<User className="w-4 h-4 text-indigo-600" />}
      footer={<SaveBtn />}
    >
      <div className="space-y-5">
        <div className="flex items-center gap-5">
          <Image
            src={currentUser.avatar}
            alt={currentUser.name}
            width={72}
            height={72}
            className="rounded-full w-[72px] h-[72px]"
          />
          <div>
            <button className="text-sm font-semibold px-3 py-1.5 rounded-lg border hover:bg-slate-50">
              Trocar foto
            </button>
            <p className="mt-1 text-xs text-slate-500">PNG ou JPG até 5MB.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nome completo" value={name} onChange={setName} icon={<User className="w-4 h-4" />} />
          <Field label="Email" type="email" value={email} onChange={setEmail} icon={<Mail className="w-4 h-4" />} />
          <Field label="Telefone" value={phone} onChange={setPhone} />
          <Field label="Cargo" value={role} onChange={setRole} />
        </div>
      </div>
    </Card>
  );
}

function CompanyTab() {
  const { establishments } = useData();
  const [companyName, setCompanyName] = useState("OneTime Estúdios");
  const [cnpj, setCnpj] = useState("12.345.678/0001-90");

  return (
    <>
      <Card
        title="Dados da empresa"
        icon={<Building2 className="w-4 h-4 text-indigo-600" />}
        footer={<SaveBtn />}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Razão social" value={companyName} onChange={setCompanyName} />
          <Field label="CNPJ" value={cnpj} onChange={setCnpj} />
        </div>
      </Card>

      <Card title={`Estabelecimentos (${establishments.length})`}>
        <div className="space-y-3">
          {establishments.map((e) => (
            <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
              <Image src={e.logo} alt={e.name} width={36} height={36} className="rounded-lg w-9 h-9 object-cover" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{e.name}</div>
                <div className="text-xs text-slate-500 truncate">{e.address}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function BillingTab() {
  return (
    <>
      <Card title="Plano atual" icon={<CreditCard className="w-4 h-4 text-indigo-600" />}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">Profissional</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                ATIVO
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">R$ 99/mês • próxima cobrança em 15/06/2026</p>
          </div>
          <div className="flex gap-2">
            <button className="text-sm font-semibold px-3 py-2 rounded-lg border hover:bg-slate-50">
              Histórico
            </button>
            <button className="text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
              Fazer upgrade
            </button>
          </div>
        </div>
      </Card>

      <Card title="Forma de pagamento">
        <div className="flex items-center gap-4">
          <div className="w-14 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold text-xs">
            VISA
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">•••• •••• •••• 4242</div>
            <div className="text-xs text-slate-500">Expira em 12/2028</div>
          </div>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            Alterar
          </button>
        </div>
      </Card>

      <Card title="Últimas faturas">
        <div className="divide-y">
          {[
            { date: "15/04/2026", value: "R$ 99,00", status: "Paga" },
            { date: "15/03/2026", value: "R$ 99,00", status: "Paga" },
            { date: "15/02/2026", value: "R$ 99,00", status: "Paga" },
          ].map((f, i) => (
            <div key={i} className="py-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{f.date}</div>
                <div className="text-xs text-slate-500">Plano Profissional</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold">{f.value}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  {f.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    newAppointment: true,
    cancellation: true,
    dailySummary: false,
    reviews: false,
    pushMobile: true,
    pushDesktop: true,
    email: true,
  });

  function toggle(key: keyof typeof prefs) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  return (
    <>
      <Card title="Eventos" icon={<Bell className="w-4 h-4 text-indigo-600" />}>
        <div className="space-y-2">
          {[
            { key: "newAppointment" as const, label: "Novo agendamento", desc: "Avise quando um cliente agendar" },
            { key: "cancellation" as const, label: "Cancelamento", desc: "Avise quando um cliente cancelar" },
            { key: "dailySummary" as const, label: "Resumo diário", desc: "Receba um email com a agenda do dia" },
            { key: "reviews" as const, label: "Avaliações", desc: "Avise quando um cliente avaliar" },
          ].map((n) => (
            <Toggle
              key={n.key}
              label={n.label}
              desc={n.desc}
              checked={prefs[n.key]}
              onChange={() => toggle(n.key)}
            />
          ))}
        </div>
      </Card>

      <Card title="Canais">
        <div className="space-y-2">
          <Toggle label="Push no celular" desc="Notificações no app" checked={prefs.pushMobile} onChange={() => toggle("pushMobile")} />
          <Toggle label="Push no navegador" desc="Notificações no desktop" checked={prefs.pushDesktop} onChange={() => toggle("pushDesktop")} />
          <Toggle label="Email" desc="Resumos e alertas por email" checked={prefs.email} onChange={() => toggle("email")} />
        </div>
      </Card>
    </>
  );
}

function SecurityTab() {
  const [showPwd, setShowPwd] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <>
      <Card title="Alterar senha" icon={<Lock className="w-4 h-4 text-indigo-600" />} footer={<SaveBtn />}>
        <div className="space-y-3 max-w-md">
          <Field label="Senha atual" type={showPwd ? "text" : "password"} value={current} onChange={setCurrent} />
          <Field label="Nova senha" type={showPwd ? "text" : "password"} value={next} onChange={setNext} />
          <Field label="Confirmar nova senha" type={showPwd ? "text" : "password"} value={confirm} onChange={setConfirm} />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
          >
            {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPwd ? "Ocultar" : "Mostrar"} senhas
          </button>
        </div>
      </Card>

      <Card title="Autenticação em duas etapas">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold">2FA por app autenticador</p>
            <p className="text-xs text-slate-500 mt-0.5">Use Google Authenticator, Authy ou 1Password.</p>
          </div>
          <button className="text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
            Ativar 2FA
          </button>
        </div>
      </Card>

      <Card title="Sessões ativas">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="text-sm font-semibold">Windows • Chrome</p>
              <p className="text-xs text-slate-500">São Paulo, BR • agora mesmo</p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              ATUAL
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="text-sm font-semibold">iPhone • Safari</p>
              <p className="text-xs text-slate-500">São Paulo, BR • há 2 dias</p>
            </div>
            <button className="text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1">
              <Trash2 className="w-3 h-3" />
              Encerrar
            </button>
          </div>
        </div>
      </Card>
    </>
  );
}

function DomainTab() {
  const [domain, setDomain] = useState("");
  return (
    <>
      <Card title="Domínio personalizado" icon={<Globe className="w-4 h-4 text-indigo-600" />} footer={<SaveBtn />}>
        <p className="text-sm text-slate-600 mb-4">
          Use seu próprio endereço (ex: <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">agendar.suamarca.com.br</code>) no lugar do nosso.
          Disponível no plano <strong>Empresarial</strong>.
        </p>
        <Field label="Seu domínio" value={domain} onChange={setDomain} placeholder="agendar.suamarca.com.br" icon={<Globe className="w-4 h-4" />} />
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Configuração DNS necessária</p>
          <p className="text-xs mt-1">Após salvar, configure um registro CNAME apontando para <code className="bg-amber-100 px-1 rounded">cname.onetime.app</code>.</p>
        </div>
      </Card>
    </>
  );
}

function Toggle({ label, desc, checked, onChange }: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 relative transition shrink-0">
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${checked ? "translate-x-5" : ""}`} />
      </div>
    </label>
  );
}

function Field({
  label, value, onChange, type = "text", icon, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon?: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-1 relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${icon ? "pl-10" : "pl-3"} pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm`}
        />
      </div>
    </div>
  );
}
