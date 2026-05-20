"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  establishments as seedEstablishments,
  professionals as seedProfessionals,
  services as seedServices,
  appointments as seedAppointments,
  defaultHours,
  type Establishment,
  type Professional,
  type Service,
  type Appointment,
  type DayHours,
} from "./mock-data";

const STORAGE_KEY = "onetime:data:v1";

export type WhatsAppTemplate = {
  id: string;
  title: string;
  trigger: string;
  message: string;
  enabled: boolean;
};

export type WhatsAppConfig = {
  apiUrl: string;
  apiKey: string;
  instance: string;
  webhookUrl: string;
  connected: boolean;
  templates: WhatsAppTemplate[];
};

const defaultTemplates: WhatsAppTemplate[] = [
  { id: "t1", title: "Confirmação de agendamento", trigger: "Ao criar agendamento", message: "Olá {nome}! Seu horário para {servico} com {profissional} foi marcado para {data} às {hora}. Confirma?", enabled: true },
  { id: "t2", title: "Lembrete (24h antes)", trigger: "24h antes do horário", message: "Oi {nome}! Lembrando do seu {servico} amanhã às {hora} em {estabelecimento}. Até lá!", enabled: true },
  { id: "t3", title: "Lembrete (1h antes)", trigger: "1h antes do horário", message: "{nome}, te esperamos em 1 hora para o seu {servico}. Endereço: {endereco}", enabled: true },
  { id: "t4", title: "Agradecimento pós-atendimento", trigger: "Após conclusão", message: "Obrigado pela visita, {nome}! Que tal avaliar o atendimento? Volte sempre!", enabled: false },
];

const defaultWhatsApp: WhatsAppConfig = {
  apiUrl: "https://evolution.seudominio.com",
  apiKey: "",
  instance: "onetime-prod",
  webhookUrl: "https://onetime.app/api/webhook",
  connected: true,
  templates: defaultTemplates,
};

type State = {
  establishments: Establishment[];
  professionals: Professional[];
  services: Service[];
  appointments: Appointment[];
  hoursByEst: Record<string, DayHours[]>;
  whatsapp: WhatsAppConfig;
};

type Actions = {
  addEstablishment: (e: Omit<Establishment, "id">) => Establishment;
  updateEstablishment: (e: Establishment) => void;
  deleteEstablishment: (id: string) => void;

  addProfessional: (p: Omit<Professional, "id">) => Professional;
  updateProfessional: (p: Professional) => void;
  deleteProfessional: (id: string) => void;

  addService: (s: Omit<Service, "id">) => Service;
  updateService: (s: Service) => void;
  deleteService: (id: string) => void;

  addAppointment: (a: Omit<Appointment, "id">) => Appointment;
  updateAppointment: (a: Appointment) => void;
  deleteAppointment: (id: string) => void;

  setHours: (estId: string, hours: DayHours[]) => void;

  updateWhatsApp: (patch: Partial<Omit<WhatsAppConfig, "templates">>) => void;
  updateTemplate: (t: WhatsAppTemplate) => void;
  addTemplate: (t: Omit<WhatsAppTemplate, "id">) => WhatsAppTemplate;
  deleteTemplate: (id: string) => void;

  resetAll: () => void;
};

type StoreContext = State & Actions & { hydrated: boolean };

const Ctx = createContext<StoreContext | null>(null);

function buildSeed(): State {
  const hoursByEst: Record<string, DayHours[]> = {};
  seedEstablishments.forEach((e) => {
    hoursByEst[e.id] = defaultHours;
  });
  return {
    establishments: seedEstablishments,
    professionals: seedProfessionals,
    services: seedServices,
    appointments: seedAppointments,
    hoursByEst,
    whatsapp: defaultWhatsApp,
  };
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(() => buildSeed());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        setState((seed) => ({
          establishments: parsed.establishments ?? seed.establishments,
          professionals: parsed.professionals ?? seed.professionals,
          services: parsed.services ?? seed.services,
          appointments: parsed.appointments ?? seed.appointments,
          hoursByEst: parsed.hoursByEst ?? seed.hoursByEst,
          whatsapp: {
            ...seed.whatsapp,
            ...(parsed.whatsapp ?? {}),
            templates: parsed.whatsapp?.templates ?? seed.whatsapp.templates,
          },
        }));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, hydrated]);

  const addEstablishment = useCallback((e: Omit<Establishment, "id">) => {
    const created: Establishment = { ...e, id: uid("e") };
    setState((s) => ({
      ...s,
      establishments: [...s.establishments, created],
      hoursByEst: { ...s.hoursByEst, [created.id]: defaultHours },
    }));
    return created;
  }, []);

  const updateEstablishment = useCallback((e: Establishment) => {
    setState((s) => ({
      ...s,
      establishments: s.establishments.map((x) => (x.id === e.id ? e : x)),
    }));
  }, []);

  const deleteEstablishment = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      establishments: s.establishments.filter((x) => x.id !== id),
      professionals: s.professionals.filter((x) => x.establishmentId !== id),
      services: s.services.filter((x) => x.establishmentId !== id),
      appointments: s.appointments.filter((x) => x.establishmentId !== id),
    }));
  }, []);

  const addProfessional = useCallback((p: Omit<Professional, "id">) => {
    const created: Professional = { ...p, id: uid("p") };
    setState((s) => ({ ...s, professionals: [...s.professionals, created] }));
    return created;
  }, []);

  const updateProfessional = useCallback((p: Professional) => {
    setState((s) => ({
      ...s,
      professionals: s.professionals.map((x) => (x.id === p.id ? p : x)),
    }));
  }, []);

  const deleteProfessional = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      professionals: s.professionals.filter((x) => x.id !== id),
    }));
  }, []);

  const addService = useCallback((sv: Omit<Service, "id">) => {
    const created: Service = { ...sv, id: uid("s") };
    setState((s) => ({ ...s, services: [...s.services, created] }));
    return created;
  }, []);

  const updateService = useCallback((sv: Service) => {
    setState((s) => ({
      ...s,
      services: s.services.map((x) => (x.id === sv.id ? sv : x)),
    }));
  }, []);

  const deleteService = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      services: s.services.filter((x) => x.id !== id),
      professionals: s.professionals.map((p) => ({
        ...p,
        serviceIds: p.serviceIds.filter((x) => x !== id),
      })),
    }));
  }, []);

  const addAppointment = useCallback((a: Omit<Appointment, "id">) => {
    const created: Appointment = { ...a, id: uid("a") };
    setState((s) => ({ ...s, appointments: [...s.appointments, created] }));
    return created;
  }, []);

  const updateAppointment = useCallback((a: Appointment) => {
    setState((s) => ({
      ...s,
      appointments: s.appointments.map((x) => (x.id === a.id ? a : x)),
    }));
  }, []);

  const deleteAppointment = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      appointments: s.appointments.filter((x) => x.id !== id),
    }));
  }, []);

  const setHours = useCallback((estId: string, hours: DayHours[]) => {
    setState((s) => ({ ...s, hoursByEst: { ...s.hoursByEst, [estId]: hours } }));
  }, []);

  const updateWhatsApp = useCallback((patch: Partial<Omit<WhatsAppConfig, "templates">>) => {
    setState((s) => ({ ...s, whatsapp: { ...s.whatsapp, ...patch } }));
  }, []);

  const updateTemplate = useCallback((t: WhatsAppTemplate) => {
    setState((s) => ({
      ...s,
      whatsapp: {
        ...s.whatsapp,
        templates: s.whatsapp.templates.map((x) => (x.id === t.id ? t : x)),
      },
    }));
  }, []);

  const addTemplate = useCallback((t: Omit<WhatsAppTemplate, "id">) => {
    const created: WhatsAppTemplate = { ...t, id: uid("t") };
    setState((s) => ({
      ...s,
      whatsapp: { ...s.whatsapp, templates: [...s.whatsapp.templates, created] },
    }));
    return created;
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      whatsapp: { ...s.whatsapp, templates: s.whatsapp.templates.filter((x) => x.id !== id) },
    }));
  }, []);

  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setState(buildSeed());
  }, []);

  const value: StoreContext = {
    ...state,
    hydrated,
    addEstablishment,
    updateEstablishment,
    deleteEstablishment,
    addProfessional,
    updateProfessional,
    deleteProfessional,
    addService,
    updateService,
    deleteService,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    setHours,
    updateWhatsApp,
    updateTemplate,
    addTemplate,
    deleteTemplate,
    resetAll,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
