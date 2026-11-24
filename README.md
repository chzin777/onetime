# OneTime — Agendamento online para o seu negócio

Plataforma de agendamento para negócios de serviço (salões, barbearias, clínicas): o cliente agenda por um link público e o dono gerencia tudo em um painel — profissionais, serviços, horários, bloqueios, lista de espera, fidelidade e indicações.

**Produção (demo):** https://onetime-six.vercel.app

> **Status:** protótipo funcional sem backend. Os dados iniciais vêm de `lib/mock-data.ts` e as alterações ficam salvas no `localStorage` do navegador.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- GSAP (animações) e ícones `lucide-react`
- PWA (`app/manifest.webmanifest`)

## Como rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page do produto |
| `/login` | Acesso ao painel |
| `/b/[slug]` | Página pública de agendamento do estabelecimento |
| `/dashboard` | Visão geral do dia |
| `/dashboard/appointments` | Agendamentos |
| `/dashboard/professionals` | Profissionais |
| `/dashboard/services` | Serviços e preços |
| `/dashboard/hours` | Horários de funcionamento |
| `/dashboard/blocks` | Bloqueios de agenda |
| `/dashboard/waitlist` | Lista de espera |
| `/dashboard/loyalty` | Programa de fidelidade |
| `/dashboard/referrals` | Programa de indicação |
| `/dashboard/whatsapp` | Mensagens via WhatsApp |
| `/dashboard/establishments` | Estabelecimentos |
| `/dashboard/settings` | Configurações |
| `/termos`, `/privacidade` | Páginas legais |

## Estrutura

```
app/                 rotas (landing, login, agendamento público, dashboard)
app/_components/     componentes compartilhados
lib/mock-data.ts     dados de exemplo (estabelecimentos, serviços, clientes...)
lib/store.tsx        estado global (React Context + localStorage)
```

## Deploy

Vercel — cada push na `main` publica automaticamente.
