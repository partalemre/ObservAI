# ObservAI Monorepo

Cafe-odaklı SaaS: QR Menü, POS entegrasyonu, Envanter, Kamera Analitiği, Kampanya Öneri Motoru.

## Stack

- Frontend: Next.js 14 + TS
- Backend API: NestJS + TS (Prisma, Swagger, WS)
- AI Camera: Python CLI (Ultralytics YOLOv8, InsightFace, OpenCV)
- DB: PostgreSQL
- Cache/Queue: Redis
- Monorepo: pnpm + turborepo

## Hızlı Başlangıç

1. `cp .env.example .env`
2. `pnpm i` (root)
3. `docker compose -f infra/docker/compose.dev.yml up -d` (postgres, redis)
4. `pnpm dev` (web + api)
5. `cd packages/camera-analytics && python -m venv .venv && source .venv/bin/activate && pip install -e .` (kamera analitiği için bir defalık kurulum)
6. `python -m camera_analytics.run --display` (MacBook kamerasından metrik üretimi)
7. Postman koleksiyonunu `infra/postman/ObservAI.postman_collection.json` içinden import edin.

## Kamera Analitiğini Çalıştırma

- Varsayılan metrik çıktısı `data/camera/latest_metrics.json` dosyasına yazılır. NestJS API bu dosyayı `CameraService` üzerinden okuyarak `/camera/people-count` endpointine sunar.
- Çıktı konumunu değiştirmek için `python -m camera_analytics.run --output /path/to/metrics.json` veya API tarafında `CAMERA_METRICS_PATH=/path/to/metrics.json` kullanın.
- Kamera bölgelerini (`entrance`, `queue`, masa poligonları) `packages/camera-analytics/config/default_zones.yaml` dosyasında normalize koordinatlar ile güncelleyebilirsiniz.

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
