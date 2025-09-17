# ObservAI Monorepo

Cafe-odaklı SaaS: QR Menü, POS entegrasyonu, Envanter, Kamera Analitiği, Kampanya Öneri Motoru.

## Stack

- Frontend: Next.js 14 + TS
- Backend API: NestJS + TS (Prisma, Swagger, WS)
- AI Camera: FastAPI (Python, OpenCV)
- DB: PostgreSQL
- Cache/Queue: Redis
- Monorepo: pnpm + turborepo

## Hızlı Başlangıç

1. `cp .env.example .env`
2. `pnpm i` (root)
3. `docker compose -f infra/docker/compose.dev.yml up -d` (postgres, redis)
4. `pnpm dev` (web, api, ai-camera eşzamanlı)
5. Postman koleksiyonunu `infra/postman/ObservAI.postman_collection.json` içinden import edin.

## Klasörler

- `apps/web`: Next.js (i18n, PWA)
- `apps/api`: NestJS (Auth, POS, Inventory, Campaign, Camera)
- `apps/ai-camera`: FastAPI (people-count, age/gender est.)
- `infra/db`: Prisma schema + migration
- `infra/postman`: Postman collection/env
- `packages/ui`: ortak React bileşenleri (Tailwind, shadcn)
- `packages/types`: paylaşılan tipler ve DTOlar
- `packages/config`: eslint/prettier/tsconfig paylaşımları

## Geliştirme Kuralları

- Branch stratejisi: `main` (stabil), `dev` (entegrasyon), feature branch `feat/<kısa-ad>`
- PR zorunlu, en az 1 review
- Lint + typecheck zorunlu (`pnpm lint`, `pnpm -w typecheck`)
- Commit mesajları: Conventional Commits
