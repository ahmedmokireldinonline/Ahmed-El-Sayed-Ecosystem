# Ahmed El Sayed Platform

A premium personal brand and business ecosystem website connecting opportunities, growth systems, digital products, education, and consulting.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/ahmed-el-sayed-platform/src/App.tsx` — single-page brand experience, real Arabic/RTL content, integration marquee, social channel slots, social templates, video-catalog slots, consultation interaction, and WhatsApp CTA.
- `artifacts/ahmed-el-sayed-platform/src/index.css` — shared brand tokens, Arabic font rules, responsive layout styles, scroll reveals, marquee motion, social template styling, and reduced-motion support.
- `artifacts/ahmed-el-sayed-platform/.replit-artifact/artifact.toml` — artifact routing and web workflow configuration.
- `attached_assets/Pasted-MASTER-PROMPT-Build-a-Premium-Personal-Brand-Growth-Tec_1789753094766.txt` — source product and brand brief.

## Architecture decisions

- The first release is presentation-first and frontend-only; backend-backed CRM, bookings, courses, and marketplace capabilities can be added behind the same brand surface later.
- Trust-critical business claims remain capability-oriented or configurable; no credentials, clients, metrics, prices, property details, or partnerships are fabricated.
- The visual language uses a bespoke ecosystem/orbit motif rather than stock photography to communicate connected systems and long-term platform scope.
- WhatsApp configuration is client-side through `VITE_WHATSAPP_NUMBER`; if it is absent, the CTA routes visitors to the contact flow instead of using an invented number.

## Product

- Executive personal brand homepage for Ahmed El Sayed.
- Service ecosystem spanning real estate, investment, growth, marketing, automation, technology, SaaS, AI, education, and consulting.
- In-page navigation, responsive mobile navigation, Arabic/English/Russian language controls, reduced-motion support, and a presentation-only consultation request modal.
- Dedicated integrations, social studio, channel-link, template, and future video-catalog surfaces ready for supplied assets.
- Conversion paths for exploring the ecosystem, requesting a growth system, booking a conversation, and contacting WhatsApp.

## User preferences

- Keep the brand premium, strategic, intelligent, modern, international, and scalable.
- Avoid generic CV, broker, agency, freelancer, cheap gradients, neon, excessive glassmorphism, stock photography, and invented claims.

## Gotchas

- The web artifact workflow provides `PORT` and `BASE_PATH`; direct Vite builds outside the workflow need those environment variables.
- Keep all prices, dates, property availability, integrations, and verified outcomes configurable until real source data is supplied.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
