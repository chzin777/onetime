"use client";

import { useState } from "react";
import {
  MessageCircle,
  Key,
  Link2,
  Save,
  Check,
  AlertCircle,
  Smartphone,
  QrCode,
  Webhook,
  Send,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { useData, type WhatsAppTemplate } from "@/lib/store";
import Drawer, { useDrawerState } from "../_components/drawer";

export default function WhatsAppPage() {
  const { whatsapp, updateWhatsApp, updateTemplate, addTemplate, deleteTemplate } = useData();
  const [form, setForm] = useState({
    apiUrl: whatsapp.apiUrl,
    apiKey: whatsapp.apiKey,
    instance: whatsapp.instance,
    webhookUrl: whatsapp.webhookUrl,
  });
  const [savedFlash, setSavedFlash] = useState(false);
  const drawer = useDrawerState<WhatsAppTemplate | "new">();

  function saveConfig() {
    updateWhatsApp(form);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">WhatsApp</h1>
          <p className="text-slate-500 text-sm">
            Integração com Evolution API para mensagens automáticas.
          </p>
        </div>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${
          whatsapp.connected ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {whatsapp.connected ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {whatsapp.connected ? "Conectado" : "Desconectado"}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border">
          <div className="p-5 border-b">
            <h2 className="font-semibold flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-600" />
              Credenciais Evolution API
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Preencha os dados da sua instância Evolution API.
            </p>
          </div>

          <div className="p-5 space-y-4">
            <Field
              label="URL da API"
              hint="Endpoint da sua instância Evolution"
              icon={<Link2 className="w-4 h-4" />}
              value={form.apiUrl}
              onChange={(v) => setForm({ ...form, apiUrl: v })}
              placeholder="https://evolution.exemplo.com"
            />
            <Field
              label="API Key"
              hint="Chave de autenticação global ou da instância"
              icon={<Key className="w-4 h-4" />}
              type="password"
              value={form.apiKey}
              onChange={(v) => setForm({ ...form, apiKey: v })}
              placeholder="Sua API Key"
            />
            <Field
              label="Nome da instância"
              hint="Nome configurado na Evolution"
              icon={<Smartphone className="w-4 h-4" />}
              value={form.instance}
              onChange={(v) => setForm({ ...form, instance: v })}
              placeholder="minha-instancia"
            />
            <Field
              label="Webhook URL"
              hint="Para receber respostas dos clientes"
              icon={<Webhook className="w-4 h-4" />}
              value={form.webhookUrl}
              onChange={(v) => setForm({ ...form, webhookUrl: v })}
              placeholder="https://app.exemplo.com/api/webhook"
            />

            <div className="pt-4 border-t flex items-center gap-3">
              <button
                onClick={saveConfig}
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {savedFlash ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {savedFlash ? "Salvo!" : "Salvar credenciais"}
              </button>
              <button
                onClick={() => updateWhatsApp({ connected: !whatsapp.connected })}
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border hover:bg-slate-50"
              >
                Testar conexão
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-5">
            <h3 className="font-semibold flex items-center gap-2">
              <QrCode className="w-4 h-4 text-indigo-600" />
              Conectar dispositivo
            </h3>
            <div className="mt-4 aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center">
              {whatsapp.connected ? (
                <div className="text-center text-slate-500">
                  <Check className="w-10 h-10 mx-auto text-emerald-500" />
                  <p className="mt-2 text-sm font-semibold">Dispositivo pareado</p>
                  <p className="text-xs">+55 11 98765-4321</p>
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  <QrCode className="w-12 h-12 mx-auto" />
                  <p className="mt-2 text-xs">QR Code aparecerá aqui</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
            <MessageCircle className="w-7 h-7" />
            <h3 className="mt-3 font-bold">Mensagens enviadas (mês)</h3>
            <p className="mt-2 text-3xl font-bold">1.847</p>
            <p className="text-xs text-emerald-100 mt-1">98% entregues</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border">
        <div className="p-5 border-b flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-600" />
              Templates de mensagens automáticas
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Personalize as mensagens enviadas em cada momento.
            </p>
          </div>
          <button
            onClick={() => drawer.openWith("new")}
            className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            Novo template
          </button>
        </div>

        <div className="divide-y">
          {whatsapp.templates.map((t) => (
            <div
              key={t.id}
              onClick={() => drawer.openWith(t)}
              className="p-5 flex items-start gap-4 hover:bg-indigo-50/40 cursor-pointer transition"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                t.enabled ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
              }`}>
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-sm">{t.title}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {t.trigger}
                  </span>
                  {!t.enabled && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                      Desativado
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-100">
                  {t.message}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); drawer.openWith(t); }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border hover:bg-slate-50 inline-flex items-center gap-1 shrink-0"
              >
                <Pencil className="w-3 h-3" />
                Editar
              </button>
            </div>
          ))}
          {whatsapp.templates.length === 0 && (
            <div className="p-12 text-center text-sm text-slate-500">
              Nenhum template cadastrado.
            </div>
          )}
        </div>
      </div>

      {drawer.item && (
        <TemplateDrawer
          open={drawer.open}
          initial={drawer.item === "new" ? null : drawer.item}
          onClose={drawer.close}
          onSave={(data) => {
            if (drawer.item === "new") addTemplate(data);
            else if (drawer.item) updateTemplate({ ...data, id: drawer.item.id });
            drawer.close();
          }}
          onDelete={
            drawer.item === "new"
              ? undefined
              : () => {
                  if (drawer.item && drawer.item !== "new" && confirm(`Excluir template "${drawer.item.title}"?`)) {
                    deleteTemplate(drawer.item.id);
                    drawer.close();
                  }
                }
          }
        />
      )}
    </div>
  );
}

function TemplateDrawer({
  open,
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  initial: WhatsAppTemplate | null;
  onClose: () => void;
  onSave: (t: Omit<WhatsAppTemplate, "id">) => void;
  onDelete?: () => void;
}) {
  const [form, setForm] = useState<Omit<WhatsAppTemplate, "id">>(
    initial ?? {
      title: "",
      trigger: "Ao criar agendamento",
      message: "",
      enabled: true,
    }
  );

  const placeholders = [
    "{nome}", "{servico}", "{profissional}", "{data}", "{hora}",
    "{estabelecimento}", "{endereco}", "{telefone}", "{valor}",
  ];

  function insertPlaceholder(ph: string) {
    setForm((f) => ({ ...f, message: f.message + ph }));
  }

  return (
    <Drawer
      open={open}
      title={initial?.title ?? "Novo template"}
      subtitle={initial ? "Editar template" : "Criar novo template"}
      onClose={onClose}
      footer={
        <>
          {onDelete && (
            <button
              onClick={onDelete}
              className="mr-auto inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          )}
          <button
            onClick={onClose}
            className="text-sm font-semibold px-4 py-2 rounded-lg border bg-white hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Save className="w-4 h-4" />
            Salvar
          </button>
        </>
      }
    >
      <div className="p-6 space-y-5">
        <div>
          <label className="text-xs font-medium text-slate-600">Título</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: Lembrete de agendamento"
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">Quando enviar (gatilho)</label>
          <select
            value={form.trigger}
            onChange={(e) => setForm({ ...form, trigger: e.target.value })}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm"
          >
            <option>Ao criar agendamento</option>
            <option>24h antes do horário</option>
            <option>1h antes do horário</option>
            <option>Ao cancelar agendamento</option>
            <option>Após conclusão</option>
            <option>Aniversário do cliente</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600">Mensagem</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={5}
            placeholder="Olá {nome}, seu horário para {servico}..."
            className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 text-sm resize-none"
          />
          <div className="mt-2">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Variáveis disponíveis:</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {placeholders.map((ph) => (
                <button
                  key={ph}
                  type="button"
                  onClick={() => insertPlaceholder(ph)}
                  className="text-[11px] font-mono px-2 py-1 rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                >
                  {ph}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 relative transition">
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${form.enabled ? "translate-x-5" : ""}`} />
            </div>
            <span className="text-sm">{form.enabled ? "Template ativo" : "Template desativado"}</span>
          </label>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Pré-visualização</p>
          <div className="bg-emerald-100 rounded-lg rounded-tl-none p-3 text-sm text-slate-800 max-w-sm">
            {form.message
              .replace(/{nome}/g, "Maria")
              .replace(/{servico}/g, "Corte de cabelo")
              .replace(/{profissional}/g, "Marcos")
              .replace(/{data}/g, "20/05")
              .replace(/{hora}/g, "14:30")
              .replace(/{estabelecimento}/g, "Barbearia Vintage")
              .replace(/{endereco}/g, "Av. Paulista, 1500")
              .replace(/{telefone}/g, "(11) 91234-5678")
              .replace(/{valor}/g, "R$ 60,00") || (
                <span className="italic text-slate-400">Digite a mensagem acima...</span>
              )}
          </div>
        </div>
      </div>
    </Drawer>
  );
}

function Field({
  label, hint, icon, value, onChange, placeholder, type = "text",
}: {
  label: string;
  hint: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-1 relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-mono"
        />
      </div>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}
