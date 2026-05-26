"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  establishments as seedEstablishments,
  professionals as seedProfessionals,
  services as seedServices,
  appointments as seedAppointments,
  clients as seedClients,
  waitlist as seedWaitlist,
  blocks as seedBlocks,
  resources as seedResources,
  referralRedemptions as seedReferrals,
  defaultLoyaltyConfigs,
  defaultReferralPrograms,
  defaultHours,
  genReferralCode,
  type Establishment,
  type Professional,
  type Service,
  type Appointment,
  type DayHours,
  type Client,
  type LoyaltyConfig,
  type ReferralProgram,
  type ReferralRedemption,
  type WaitlistEntry,
  type Block,
  type Resource,
} from "./mock-data";

const STORAGE_KEY = "onetime:data:v2";

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
  { id: "t5", title: "Vaga disponível (lista de espera)", trigger: "Quando vaga abrir", message: "Boa notícia, {nome}! Abriu uma vaga para {servico} em {data} às {hora}. Quer confirmar? Responda SIM em até 30min.", enabled: true },
  { id: "t6", title: "Cobrança Pix (sinal)", trigger: "Pré-pagamento pendente", message: "Olá {nome}! Para confirmar seu {servico}, finalize o sinal de {valor} via Pix. Link: {pix_link}. Expira em 30min.", enabled: true },
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
  clients: Client[];
  loyaltyConfigs: LoyaltyConfig[];
  referralPrograms: ReferralProgram[];
  referralRedemptions: ReferralRedemption[];
  waitlist: WaitlistEntry[];
  blocks: Block[];
  resources: Resource[];
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
  cancelAppointment: (id: string) => WaitlistEntry | null;
  markDepositPaid: (id: string) => void;

  setHours: (estId: string, hours: DayHours[]) => void;

  updateWhatsApp: (patch: Partial<Omit<WhatsAppConfig, "templates">>) => void;
  updateTemplate: (t: WhatsAppTemplate) => void;
  addTemplate: (t: Omit<WhatsAppTemplate, "id">) => WhatsAppTemplate;
  deleteTemplate: (id: string) => void;

  addClient: (c: Omit<Client, "id" | "referralCode" | "loyaltyPoints" | "createdAt">) => Client;
  updateClient: (c: Client) => void;
  deleteClient: (id: string) => void;
  addLoyaltyPoints: (clientId: string, points: number) => void;
  redeemLoyaltyReward: (clientId: string) => boolean;

  updateLoyaltyConfig: (c: LoyaltyConfig) => void;
  updateReferralProgram: (p: ReferralProgram) => void;
  redeemReferral: (id: string, status: ReferralRedemption["status"]) => void;
  addReferral: (r: Omit<ReferralRedemption, "id" | "createdAt">) => ReferralRedemption;

  addWaitlist: (w: Omit<WaitlistEntry, "id" | "createdAt" | "status">) => WaitlistEntry;
  updateWaitlist: (w: WaitlistEntry) => void;
  removeWaitlist: (id: string) => void;
  promoteWaitlist: (id: string, date: string, time: string, professionalId: string) => Appointment | null;

  addBlock: (b: Omit<Block, "id">) => Block;
  updateBlock: (b: Block) => void;
  deleteBlock: (id: string) => void;

  addResource: (r: Omit<Resource, "id">) => Resource;
  updateResource: (r: Resource) => void;
  deleteResource: (id: string) => void;

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
    clients: seedClients,
    loyaltyConfigs: defaultLoyaltyConfigs,
    referralPrograms: defaultReferralPrograms,
    referralRedemptions: seedReferrals,
    waitlist: seedWaitlist,
    blocks: seedBlocks,
    resources: seedResources,
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
          clients: parsed.clients ?? seed.clients,
          loyaltyConfigs: parsed.loyaltyConfigs ?? seed.loyaltyConfigs,
          referralPrograms: parsed.referralPrograms ?? seed.referralPrograms,
          referralRedemptions: parsed.referralRedemptions ?? seed.referralRedemptions,
          waitlist: parsed.waitlist ?? seed.waitlist,
          blocks: parsed.blocks ?? seed.blocks,
          resources: parsed.resources ?? seed.resources,
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
    setState((s) => ({ ...s, establishments: s.establishments.map((x) => (x.id === e.id ? e : x)) }));
  }, []);

  const deleteEstablishment = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      establishments: s.establishments.filter((x) => x.id !== id),
      professionals: s.professionals.filter((x) => x.establishmentId !== id),
      services: s.services.filter((x) => x.establishmentId !== id),
      appointments: s.appointments.filter((x) => x.establishmentId !== id),
      clients: s.clients.filter((x) => x.establishmentId !== id),
      waitlist: s.waitlist.filter((x) => x.establishmentId !== id),
      blocks: s.blocks.filter((x) => x.establishmentId !== id),
      resources: s.resources.filter((x) => x.establishmentId !== id),
    }));
  }, []);

  const addProfessional = useCallback((p: Omit<Professional, "id">) => {
    const created: Professional = { ...p, id: uid("p") };
    setState((s) => ({ ...s, professionals: [...s.professionals, created] }));
    return created;
  }, []);

  const updateProfessional = useCallback((p: Professional) => {
    setState((s) => ({ ...s, professionals: s.professionals.map((x) => (x.id === p.id ? p : x)) }));
  }, []);

  const deleteProfessional = useCallback((id: string) => {
    setState((s) => ({ ...s, professionals: s.professionals.filter((x) => x.id !== id) }));
  }, []);

  const addService = useCallback((sv: Omit<Service, "id">) => {
    const created: Service = { ...sv, id: uid("s") };
    setState((s) => ({ ...s, services: [...s.services, created] }));
    return created;
  }, []);

  const updateService = useCallback((sv: Service) => {
    setState((s) => ({ ...s, services: s.services.map((x) => (x.id === sv.id ? sv : x)) }));
  }, []);

  const deleteService = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      services: s.services.filter((x) => x.id !== id),
      professionals: s.professionals.map((p) => ({ ...p, serviceIds: p.serviceIds.filter((x) => x !== id) })),
    }));
  }, []);

  const addAppointment = useCallback((a: Omit<Appointment, "id">) => {
    const created: Appointment = { ...a, id: uid("a") };
    setState((s) => ({ ...s, appointments: [...s.appointments, created] }));
    return created;
  }, []);

  const updateAppointment = useCallback((a: Appointment) => {
    setState((s) => ({ ...s, appointments: s.appointments.map((x) => (x.id === a.id ? a : x)) }));
  }, []);

  const deleteAppointment = useCallback((id: string) => {
    setState((s) => ({ ...s, appointments: s.appointments.filter((x) => x.id !== id) }));
  }, []);

  const cancelAppointment = useCallback((id: string): WaitlistEntry | null => {
    let promoted: WaitlistEntry | null = null;
    setState((s) => {
      const appt = s.appointments.find((x) => x.id === id);
      if (!appt) return s;
      const match = s.waitlist.find(
        (w) =>
          w.establishmentId === appt.establishmentId &&
          w.serviceId === appt.serviceId &&
          w.status === "aguardando" &&
          (!w.professionalId || w.professionalId === appt.professionalId)
      );
      const next: State = {
        ...s,
        appointments: s.appointments.map((x) => (x.id === id ? { ...x, status: "cancelado" as const } : x)),
      };
      if (match) {
        promoted = { ...match, status: "notificado" };
        next.waitlist = s.waitlist.map((w) => (w.id === match.id ? promoted! : w));
      }
      return next;
    });
    return promoted;
  }, []);

  const markDepositPaid = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      appointments: s.appointments.map((x) =>
        x.id === id ? { ...x, depositPaid: true, status: "confirmado" as const } : x
      ),
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
      whatsapp: { ...s.whatsapp, templates: s.whatsapp.templates.map((x) => (x.id === t.id ? t : x)) },
    }));
  }, []);

  const addTemplate = useCallback((t: Omit<WhatsAppTemplate, "id">) => {
    const created: WhatsAppTemplate = { ...t, id: uid("t") };
    setState((s) => ({ ...s, whatsapp: { ...s.whatsapp, templates: [...s.whatsapp.templates, created] } }));
    return created;
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setState((s) => ({ ...s, whatsapp: { ...s.whatsapp, templates: s.whatsapp.templates.filter((x) => x.id !== id) } }));
  }, []);

  const addClient = useCallback((c: Omit<Client, "id" | "referralCode" | "loyaltyPoints" | "createdAt">) => {
    const created: Client = {
      ...c,
      id: uid("c"),
      referralCode: genReferralCode(c.name),
      loyaltyPoints: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setState((s) => ({ ...s, clients: [...s.clients, created] }));
    return created;
  }, []);

  const updateClient = useCallback((c: Client) => {
    setState((s) => ({ ...s, clients: s.clients.map((x) => (x.id === c.id ? c : x)) }));
  }, []);

  const deleteClient = useCallback((id: string) => {
    setState((s) => ({ ...s, clients: s.clients.filter((x) => x.id !== id) }));
  }, []);

  const addLoyaltyPoints = useCallback((clientId: string, points: number) => {
    setState((s) => ({
      ...s,
      clients: s.clients.map((x) => (x.id === clientId ? { ...x, loyaltyPoints: x.loyaltyPoints + points } : x)),
    }));
  }, []);

  const redeemLoyaltyReward = useCallback((clientId: string) => {
    let ok = false;
    setState((s) => {
      const client = s.clients.find((c) => c.id === clientId);
      if (!client) return s;
      const cfg = s.loyaltyConfigs.find((l) => l.establishmentId === client.establishmentId);
      if (!cfg || client.loyaltyPoints < cfg.rewardThreshold) return s;
      ok = true;
      return {
        ...s,
        clients: s.clients.map((x) =>
          x.id === clientId ? { ...x, loyaltyPoints: x.loyaltyPoints - cfg.rewardThreshold } : x
        ),
      };
    });
    return ok;
  }, []);

  const updateLoyaltyConfig = useCallback((c: LoyaltyConfig) => {
    setState((s) => {
      const exists = s.loyaltyConfigs.some((x) => x.establishmentId === c.establishmentId);
      return {
        ...s,
        loyaltyConfigs: exists
          ? s.loyaltyConfigs.map((x) => (x.establishmentId === c.establishmentId ? c : x))
          : [...s.loyaltyConfigs, c],
      };
    });
  }, []);

  const updateReferralProgram = useCallback((p: ReferralProgram) => {
    setState((s) => {
      const exists = s.referralPrograms.some((x) => x.establishmentId === p.establishmentId);
      return {
        ...s,
        referralPrograms: exists
          ? s.referralPrograms.map((x) => (x.establishmentId === p.establishmentId ? p : x))
          : [...s.referralPrograms, p],
      };
    });
  }, []);

  const redeemReferral = useCallback((id: string, status: ReferralRedemption["status"]) => {
    setState((s) => ({
      ...s,
      referralRedemptions: s.referralRedemptions.map((x) => (x.id === id ? { ...x, status } : x)),
    }));
  }, []);

  const addReferral = useCallback((r: Omit<ReferralRedemption, "id" | "createdAt">) => {
    const created: ReferralRedemption = { ...r, id: uid("r"), createdAt: new Date().toISOString().slice(0, 10) };
    setState((s) => ({ ...s, referralRedemptions: [...s.referralRedemptions, created] }));
    return created;
  }, []);

  const addWaitlist = useCallback((w: Omit<WaitlistEntry, "id" | "createdAt" | "status">) => {
    const created: WaitlistEntry = {
      ...w,
      id: uid("w"),
      status: "aguardando",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setState((s) => ({ ...s, waitlist: [...s.waitlist, created] }));
    return created;
  }, []);

  const updateWaitlist = useCallback((w: WaitlistEntry) => {
    setState((s) => ({ ...s, waitlist: s.waitlist.map((x) => (x.id === w.id ? w : x)) }));
  }, []);

  const removeWaitlist = useCallback((id: string) => {
    setState((s) => ({ ...s, waitlist: s.waitlist.filter((x) => x.id !== id) }));
  }, []);

  const promoteWaitlist = useCallback((id: string, date: string, time: string, professionalId: string) => {
    let appt: Appointment | null = null;
    setState((s) => {
      const w = s.waitlist.find((x) => x.id === id);
      if (!w) return s;
      appt = {
        id: uid("a"),
        establishmentId: w.establishmentId,
        serviceId: w.serviceId,
        professionalId,
        clientName: w.clientName,
        clientPhone: w.clientPhone,
        date,
        time,
        status: "confirmado",
      };
      return {
        ...s,
        appointments: [...s.appointments, appt],
        waitlist: s.waitlist.map((x) => (x.id === id ? { ...x, status: "convertido" } : x)),
      };
    });
    return appt;
  }, []);

  const addBlock = useCallback((b: Omit<Block, "id">) => {
    const created: Block = { ...b, id: uid("b") };
    setState((s) => ({ ...s, blocks: [...s.blocks, created] }));
    return created;
  }, []);

  const updateBlock = useCallback((b: Block) => {
    setState((s) => ({ ...s, blocks: s.blocks.map((x) => (x.id === b.id ? b : x)) }));
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setState((s) => ({ ...s, blocks: s.blocks.filter((x) => x.id !== id) }));
  }, []);

  const addResource = useCallback((r: Omit<Resource, "id">) => {
    const created: Resource = { ...r, id: uid("rs") };
    setState((s) => ({ ...s, resources: [...s.resources, created] }));
    return created;
  }, []);

  const updateResource = useCallback((r: Resource) => {
    setState((s) => ({ ...s, resources: s.resources.map((x) => (x.id === r.id ? r : x)) }));
  }, []);

  const deleteResource = useCallback((id: string) => {
    setState((s) => ({ ...s, resources: s.resources.filter((x) => x.id !== id) }));
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
    cancelAppointment,
    markDepositPaid,
    setHours,
    updateWhatsApp,
    updateTemplate,
    addTemplate,
    deleteTemplate,
    addClient,
    updateClient,
    deleteClient,
    addLoyaltyPoints,
    redeemLoyaltyReward,
    updateLoyaltyConfig,
    updateReferralProgram,
    redeemReferral,
    addReferral,
    addWaitlist,
    updateWaitlist,
    removeWaitlist,
    promoteWaitlist,
    addBlock,
    updateBlock,
    deleteBlock,
    addResource,
    updateResource,
    deleteResource,
    resetAll,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
