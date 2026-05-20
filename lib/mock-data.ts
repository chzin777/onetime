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
};

export type Appointment = {
  id: string;
  establishmentId: string;
  serviceId: string;
  professionalId: string;
  clientName: string;
  clientPhone: string;
  date: string;
  time: string;
  status: "confirmado" | "pendente" | "concluído" | "cancelado";
};

export type DayHours = {
  day: "Seg" | "Ter" | "Qua" | "Qui" | "Sex" | "Sáb" | "Dom";
  open: boolean;
  from: string;
  to: string;
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
  // Pet Amigo
  { id: "s1", establishmentId: "e1", name: "Banho", description: "Banho completo com produtos hipoalergênicos", durationMin: 60, price: 70, category: "Higiene" },
  { id: "s2", establishmentId: "e1", name: "Tosa", description: "Tosa higiênica ou na tesoura", durationMin: 90, price: 110, category: "Higiene" },
  { id: "s3", establishmentId: "e1", name: "Banho + Tosa", description: "Combo banho e tosa", durationMin: 120, price: 160, category: "Combos" },
  { id: "s4", establishmentId: "e1", name: "Consulta Veterinária", description: "Consulta clínica geral", durationMin: 45, price: 180, category: "Saúde" },
  // Barbearia Vintage
  { id: "s5", establishmentId: "e2", name: "Corte de Cabelo", description: "Corte masculino com acabamento na navalha", durationMin: 40, price: 60, category: "Cabelo" },
  { id: "s6", establishmentId: "e2", name: "Barba", description: "Barba terapia completa", durationMin: 30, price: 45, category: "Barba" },
  { id: "s7", establishmentId: "e2", name: "Corte + Barba", description: "Combo barba e cabelo", durationMin: 70, price: 95, category: "Combos" },
  // Studio Bella
  { id: "s8", establishmentId: "e3", name: "Escova", description: "Escova modeladora", durationMin: 50, price: 80, category: "Cabelo" },
  { id: "s9", establishmentId: "e3", name: "Manicure", description: "Manicure completa", durationMin: 45, price: 50, category: "Unhas" },
  { id: "s10", establishmentId: "e3", name: "Design de Sobrancelha", description: "Design com henna", durationMin: 30, price: 55, category: "Sobrancelha" },
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
  { id: "a2", establishmentId: "e2", serviceId: "s7", professionalId: "p5", clientName: "Carlos Eduardo", clientPhone: "(11) 99111-3333", date: addDays(0), time: "10:30", status: "confirmado" },
  { id: "a3", establishmentId: "e1", serviceId: "s3", professionalId: "p2", clientName: "Maria Helena (Toby)", clientPhone: "(11) 98765-4321", date: addDays(0), time: "14:00", status: "pendente" },
  { id: "a4", establishmentId: "e3", serviceId: "s8", professionalId: "p6", clientName: "Ana Clara", clientPhone: "(11) 97777-1234", date: addDays(1), time: "11:00", status: "confirmado" },
  { id: "a5", establishmentId: "e3", serviceId: "s9", professionalId: "p7", clientName: "Renata Lopes", clientPhone: "(11) 98888-4444", date: addDays(1), time: "15:30", status: "confirmado" },
  { id: "a6", establishmentId: "e2", serviceId: "s6", professionalId: "p4", clientName: "Felipe Andrade", clientPhone: "(11) 98765-9999", date: addDays(2), time: "16:00", status: "pendente" },
  { id: "a7", establishmentId: "e1", serviceId: "s4", professionalId: "p1", clientName: "Lucas (Mel)", clientPhone: "(11) 91234-7777", date: addDays(-1), time: "10:00", status: "concluído" },
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
