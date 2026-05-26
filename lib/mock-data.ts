export type Establishment = {
  id: string;
  slug: string;
  name: string;
  category: "Petshop" | "Barbearia" | "Salão de Beleza" | "Clínica" | "Estética";
  address: string;
  phone: string;
  logo: string;
  cover: string;
  active: boolean;
};

export type Professional = {
  id: string;
  establishmentId: string;
  name: string;
  role: string;
  avatar: string;
  serviceIds: string[];
  active: boolean;
  hours?: DayHours[];
};

export type Service = {
  id: string;
  establishmentId: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
  category: string;
  depositRequired: boolean;
  depositMode: "fixed" | "percent";
  depositValue: number;
  capacity: number;
  resourceId?: string;
};

export type Appointment = {
  id: string;
  establishmentId: string;
  serviceId: string;
  professionalId: string;
  clientId?: string;
  clientName: string;
  clientPhone: string;
  date: string;
  time: string;
  status: "confirmado" | "pendente" | "concluído" | "cancelado" | "aguardando_pagamento";
  depositRequired?: boolean;
  depositAmount?: number;
  depositPaid?: boolean;
  pixTxId?: string;
  loyaltyPointsAwarded?: number;
  referralCodeUsed?: string;
};

export type DayHours = {
  day: "Seg" | "Ter" | "Qua" | "Qui" | "Sex" | "Sáb" | "Dom";
  open: boolean;
  from: string;
  to: string;
};

export type Client = {
  id: string;
  establishmentId: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints: number;
  referralCode: string;
  referredBy?: string;
  notes?: string;
  createdAt: string;
};

export type LoyaltyConfig = {
  establishmentId: string;
  enabled: boolean;
  pointsPerReal: number;
  rewardThreshold: number;
  rewardDescription: string;
};

export type ReferralProgram = {
  establishmentId: string;
  enabled: boolean;
  referrerReward: number;
  referredReward: number;
  rewardType: "discount_percent" | "discount_fixed" | "free_service";
  minRedemption: number;
};

export type ReferralRedemption = {
  id: string;
  establishmentId: string;
  code: string;
  referrerClientId: string;
  referredClientId?: string;
  referredName: string;
  appointmentId?: string;
  status: "pendente" | "concluído" | "expirado";
  createdAt: string;
};

export type WaitlistEntry = {
  id: string;
  establishmentId: string;
  serviceId: string;
  professionalId?: string;
  clientName: string;
  clientPhone: string;
  preferredDate?: string;
  preferredPeriod?: "manhã" | "tarde" | "noite" | "qualquer";
  status: "aguardando" | "notificado" | "convertido" | "expirado";
  createdAt: string;
};

export type Block = {
  id: string;
  establishmentId: string;
  professionalId?: string;
  date: string;
  fromTime?: string;
  toTime?: string;
  allDay: boolean;
  reason: string;
  type: "folga" | "feriado" | "almoço" | "evento" | "manutenção";
};

export type Resource = {
  id: string;
  establishmentId: string;
  name: string;
  type: "sala" | "cadeira" | "equipamento" | "box";
  capacity: number;
};

export const establishments: Establishment[] = [
  {
    id: "e1",
    slug: "pet-amigo",
    name: "Pet Amigo",
    category: "Petshop",
    address: "Rua das Flores, 123 — Centro",
    phone: "(11) 99876-5432",
    logo: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop",
    cover: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&h=400&fit=crop",
    active: true,
  },
  {
    id: "e2",
    slug: "barbearia-vintage",
    name: "Barbearia Vintage",
    category: "Barbearia",
    address: "Av. Paulista, 1500 — Bela Vista",
    phone: "(11) 91234-5678",
    logo: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop",
    cover: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&h=400&fit=crop",
    active: true,
  },
  {
    id: "e3",
    slug: "studio-bella",
    name: "Studio Bella",
    category: "Salão de Beleza",
    address: "Rua Augusta, 870 — Consolação",
    phone: "(11) 98888-1111",
    logo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop",
    cover: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&h=400&fit=crop",
    active: true,
  },
];

export const services: Service[] = [
  { id: "s1", establishmentId: "e1", name: "Banho", description: "Banho completo com produtos hipoalergênicos", durationMin: 60, price: 70, category: "Higiene", depositRequired: false, depositMode: "percent", depositValue: 0, capacity: 2 },
  { id: "s2", establishmentId: "e1", name: "Tosa", description: "Tosa higiênica ou na tesoura", durationMin: 90, price: 110, category: "Higiene", depositRequired: false, depositMode: "percent", depositValue: 0, capacity: 1 },
  { id: "s3", establishmentId: "e1", name: "Banho + Tosa", description: "Combo banho e tosa", durationMin: 120, price: 160, category: "Combos", depositRequired: true, depositMode: "percent", depositValue: 30, capacity: 1 },
  { id: "s4", establishmentId: "e1", name: "Consulta Veterinária", description: "Consulta clínica geral", durationMin: 45, price: 180, category: "Saúde", depositRequired: true, depositMode: "fixed", depositValue: 50, capacity: 1 },
  { id: "s5", establishmentId: "e2", name: "Corte de Cabelo", description: "Corte masculino com acabamento na navalha", durationMin: 40, price: 60, category: "Cabelo", depositRequired: false, depositMode: "percent", depositValue: 0, capacity: 1 },
  { id: "s6", establishmentId: "e2", name: "Barba", description: "Barba terapia completa", durationMin: 30, price: 45, category: "Barba", depositRequired: false, depositMode: "percent", depositValue: 0, capacity: 1 },
  { id: "s7", establishmentId: "e2", name: "Corte + Barba", description: "Combo barba e cabelo", durationMin: 70, price: 95, category: "Combos", depositRequired: true, depositMode: "percent", depositValue: 50, capacity: 1 },
  { id: "s8", establishmentId: "e3", name: "Escova", description: "Escova modeladora", durationMin: 50, price: 80, category: "Cabelo", depositRequired: false, depositMode: "percent", depositValue: 0, capacity: 1 },
  { id: "s9", establishmentId: "e3", name: "Manicure", description: "Manicure completa", durationMin: 45, price: 50, category: "Unhas", depositRequired: false, depositMode: "percent", depositValue: 0, capacity: 1 },
  { id: "s10", establishmentId: "e3", name: "Design de Sobrancelha", description: "Design com henna", durationMin: 30, price: 55, category: "Sobrancelha", depositRequired: true, depositMode: "fixed", depositValue: 20, capacity: 1 },
];

export const professionals: Professional[] = [
  { id: "p1", establishmentId: "e1", name: "Dra. Camila Souza", role: "Veterinária", avatar: "https://i.pravatar.cc/200?img=47", serviceIds: ["s4"], active: true },
  { id: "p2", establishmentId: "e1", name: "Ricardo Lima", role: "Tosador", avatar: "https://i.pravatar.cc/200?img=12", serviceIds: ["s1", "s2", "s3"], active: true },
  { id: "p3", establishmentId: "e1", name: "Bianca Reis", role: "Banhista", avatar: "https://i.pravatar.cc/200?img=44", serviceIds: ["s1", "s3"], active: true },
  { id: "p4", establishmentId: "e2", name: "Marcos Vinícius", role: "Barbeiro Master", avatar: "https://i.pravatar.cc/200?img=13", serviceIds: ["s5", "s6", "s7"], active: true },
  { id: "p5", establishmentId: "e2", name: "Diego Santos", role: "Barbeiro", avatar: "https://i.pravatar.cc/200?img=15", serviceIds: ["s5", "s7"], active: true },
  { id: "p6", establishmentId: "e3", name: "Juliana Mendes", role: "Cabeleireira", avatar: "https://i.pravatar.cc/200?img=48", serviceIds: ["s8"], active: true },
  { id: "p7", establishmentId: "e3", name: "Patrícia Alves", role: "Manicure", avatar: "https://i.pravatar.cc/200?img=49", serviceIds: ["s9"], active: true },
  { id: "p8", establishmentId: "e3", name: "Larissa Pinto", role: "Designer de Sobrancelhas", avatar: "https://i.pravatar.cc/200?img=45", serviceIds: ["s10"], active: true },
];

const today = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return fmt(d);
};

export const appointments: Appointment[] = [
  { id: "a1", establishmentId: "e2", serviceId: "s5", professionalId: "p4", clientName: "João Pedro", clientPhone: "(11) 99111-2222", date: addDays(0), time: "09:00", status: "confirmado" },
  { id: "a2", establishmentId: "e2", serviceId: "s7", professionalId: "p5", clientName: "Carlos Eduardo", clientPhone: "(11) 99111-3333", date: addDays(0), time: "10:30", status: "confirmado", depositRequired: true, depositAmount: 47.5, depositPaid: true, pixTxId: "PIX-MOCK-7A3F" },
  { id: "a3", establishmentId: "e1", serviceId: "s3", professionalId: "p2", clientName: "Maria Helena (Toby)", clientPhone: "(11) 98765-4321", date: addDays(0), time: "14:00", status: "aguardando_pagamento", depositRequired: true, depositAmount: 48, depositPaid: false, pixTxId: "PIX-MOCK-2B1C" },
  { id: "a4", establishmentId: "e3", serviceId: "s8", professionalId: "p6", clientName: "Ana Clara", clientPhone: "(11) 97777-1234", date: addDays(1), time: "11:00", status: "confirmado" },
  { id: "a5", establishmentId: "e3", serviceId: "s9", professionalId: "p7", clientName: "Renata Lopes", clientPhone: "(11) 98888-4444", date: addDays(1), time: "15:30", status: "confirmado" },
  { id: "a6", establishmentId: "e2", serviceId: "s6", professionalId: "p4", clientName: "Felipe Andrade", clientPhone: "(11) 98765-9999", date: addDays(2), time: "16:00", status: "pendente" },
  { id: "a7", establishmentId: "e1", serviceId: "s4", professionalId: "p1", clientName: "Lucas (Mel)", clientPhone: "(11) 91234-7777", date: addDays(-1), time: "10:00", status: "concluído", loyaltyPointsAwarded: 180 },
  { id: "a8", establishmentId: "e2", serviceId: "s5", professionalId: "p5", clientName: "Bruno Costa", clientPhone: "(11) 95555-1111", date: addDays(-2), time: "13:00", status: "cancelado" },
];

export const defaultHours: DayHours[] = [
  { day: "Seg", open: true, from: "09:00", to: "19:00" },
  { day: "Ter", open: true, from: "09:00", to: "19:00" },
  { day: "Qua", open: true, from: "09:00", to: "19:00" },
  { day: "Qui", open: true, from: "09:00", to: "19:00" },
  { day: "Sex", open: true, from: "09:00", to: "20:00" },
  { day: "Sáb", open: true, from: "09:00", to: "16:00" },
  { day: "Dom", open: false, from: "00:00", to: "00:00" },
];

export const clients: Client[] = [
  { id: "c1", establishmentId: "e2", name: "João Pedro", phone: "(11) 99111-2222", email: "joao@example.com", loyaltyPoints: 320, referralCode: "JOAO-X7K2", createdAt: addDays(-90) },
  { id: "c2", establishmentId: "e2", name: "Carlos Eduardo", phone: "(11) 99111-3333", loyaltyPoints: 145, referralCode: "CARLOS-9F1A", referredBy: "JOAO-X7K2", createdAt: addDays(-60) },
  { id: "c3", establishmentId: "e1", name: "Maria Helena", phone: "(11) 98765-4321", loyaltyPoints: 480, referralCode: "MARIA-3D8E", createdAt: addDays(-120) },
  { id: "c4", establishmentId: "e3", name: "Ana Clara", phone: "(11) 97777-1234", loyaltyPoints: 80, referralCode: "ANA-K4M2", createdAt: addDays(-30) },
  { id: "c5", establishmentId: "e3", name: "Renata Lopes", phone: "(11) 98888-4444", loyaltyPoints: 210, referralCode: "RENATA-P9N3", createdAt: addDays(-45) },
];

export const defaultLoyaltyConfigs: LoyaltyConfig[] = [
  { establishmentId: "e1", enabled: true, pointsPerReal: 1, rewardThreshold: 500, rewardDescription: "Banho grátis" },
  { establishmentId: "e2", enabled: true, pointsPerReal: 2, rewardThreshold: 600, rewardDescription: "Corte grátis no 10º atendimento" },
  { establishmentId: "e3", enabled: true, pointsPerReal: 1, rewardThreshold: 400, rewardDescription: "Manicure grátis" },
];

export const defaultReferralPrograms: ReferralProgram[] = [
  { establishmentId: "e1", enabled: true, referrerReward: 20, referredReward: 15, rewardType: "discount_percent", minRedemption: 1 },
  { establishmentId: "e2", enabled: true, referrerReward: 25, referredReward: 20, rewardType: "discount_percent", minRedemption: 1 },
  { establishmentId: "e3", enabled: true, referrerReward: 30, referredReward: 20, rewardType: "discount_percent", minRedemption: 1 },
];

export const referralRedemptions: ReferralRedemption[] = [
  { id: "r1", establishmentId: "e2", code: "JOAO-X7K2", referrerClientId: "c1", referredClientId: "c2", referredName: "Carlos Eduardo", appointmentId: "a2", status: "concluído", createdAt: addDays(-60) },
];

export const waitlist: WaitlistEntry[] = [
  { id: "w1", establishmentId: "e2", serviceId: "s5", professionalId: "p4", clientName: "Pedro Henrique", clientPhone: "(11) 95555-7777", preferredDate: addDays(0), preferredPeriod: "tarde", status: "aguardando", createdAt: addDays(0) },
  { id: "w2", establishmentId: "e1", serviceId: "s3", clientName: "Sofia Almeida (Luna)", clientPhone: "(11) 94444-8888", preferredPeriod: "qualquer", status: "aguardando", createdAt: addDays(-1) },
  { id: "w3", establishmentId: "e3", serviceId: "s8", professionalId: "p6", clientName: "Beatriz Souza", clientPhone: "(11) 93333-1212", preferredDate: addDays(1), preferredPeriod: "manhã", status: "notificado", createdAt: addDays(-1) },
];

export const blocks: Block[] = [
  { id: "b1", establishmentId: "e2", professionalId: "p4", date: addDays(3), allDay: true, reason: "Folga semanal", type: "folga" },
  { id: "b2", establishmentId: "e1", date: addDays(5), allDay: true, reason: "Feriado nacional", type: "feriado" },
  { id: "b3", establishmentId: "e3", professionalId: "p7", date: addDays(1), fromTime: "12:00", toTime: "13:00", allDay: false, reason: "Almoço", type: "almoço" },
];

export const resources: Resource[] = [
  { id: "rs1", establishmentId: "e1", name: "Box de banho 1", type: "box", capacity: 1 },
  { id: "rs2", establishmentId: "e1", name: "Box de banho 2", type: "box", capacity: 1 },
  { id: "rs3", establishmentId: "e2", name: "Cadeira 1", type: "cadeira", capacity: 1 },
  { id: "rs4", establishmentId: "e2", name: "Cadeira 2", type: "cadeira", capacity: 1 },
  { id: "rs5", establishmentId: "e3", name: "Sala de manicure", type: "sala", capacity: 2 },
];

export const currentUser = {
  name: "Christofer Henrique",
  email: "bluetechfilms.ia@gmail.com",
  plan: "Profissional",
  avatar: "https://ui-avatars.com/api/?name=Christofer+Henrique&background=6366f1&color=fff",
};

export function getEstablishmentBySlug(slug: string) {
  return establishments.find((e) => e.slug === slug);
}

export function getServicesByEstablishment(estId: string) {
  return services.filter((s) => s.establishmentId === estId);
}

export function getProfessionalsByEstablishment(estId: string) {
  return professionals.filter((p) => p.establishmentId === estId);
}

export function getProfessionalsByService(estId: string, serviceId: string) {
  return professionals.filter(
    (p) => p.establishmentId === estId && p.serviceIds.includes(serviceId)
  );
}

export function getAppointmentsByEstablishment(estId: string) {
  return appointments.filter((a) => a.establishmentId === estId);
}

export function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function computeDeposit(svc: Service): number {
  if (!svc.depositRequired) return 0;
  if (svc.depositMode === "fixed") return svc.depositValue;
  return Math.round((svc.price * svc.depositValue) / 100 * 100) / 100;
}

export function genReferralCode(name: string): string {
  const base = name.split(" ")[0].toUpperCase().slice(0, 8);
  const tail = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}-${tail}`;
}
