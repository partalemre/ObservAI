#!/usr/bin/env bash
set -euo pipefail

echo ">> Creating folders..."
mkdir -p \
  apps/web/app \
  apps/web/public \
  apps/web/styles \
  apps/web/components \
  apps/api/src/routes \
  packages/types/src \
  packages/ui/src \
  infra/docker \
  .vscode

echo ">> Root files..."
cat > .gitignore <<'GIT'
node_modules
.pnp*
.next
dist
.env
.env.local
.DS_Store
GIT

cat > README.md <<'MD'
# ObservAI (Cafe Edition)

Monorepo: Web (Next.js), API (Express), shared packages (types, UI).
- **IDE**: Cursor
- **DB Tool**: DataGrip
- **API Test**: Postman
- **Package Manager**: pnpm

## Quick Start
1. `pnpm i`
2. `cp .env.example .env` (root ve /apps/api için)
3. Docker altyapısı (opsiyonel):  
   `docker compose -f infra/docker/compose.dev.yml up -d`
4. Geliştirme:
   - API: `pnpm --filter @observai/api dev`
   - Web: `pnpm --filter @observai/web dev`
MD

cat > .cursorrules <<'CUR'
You are the assistant for ObservAI (Cafe Edition).
- Prefer clear, typed APIs and small, testable modules.
- Frontend: Next.js (App Router) + Tailwind; Backend: Express + Zod + Mongoose.
- Generate minimal, production-friendly boilerplate; avoid overengineering.
- Keep .env out of source control; never print secrets.
- Write docs/comments when adding non-obvious logic.
CUR

cat > pnpm-workspace.yaml <<'WS'
packages:
  - "apps/*"
  - "packages/*"
WS

cat > package.json <<'PKG'
{
  "name": "observai",
  "private": true,
  "version": "0.1.0",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "pnpm -r build",
    "dev": "echo Run web and api separately: pnpm --filter @observai/web dev && pnpm --filter @observai/api dev",
    "lint": "pnpm -r lint",
    "format": "pnpm -r format"
  }
}
PKG

cat > .editorconfig <<'EC'
root = true
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
max_line_length = 120
EC

cat > .vscode/settings.json <<'VSC'
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
VSC

cat > .prettierrc.json <<'PRETTIER'
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "es5",
  "printWidth": 100
}
PRETTIER

cat > .eslintrc.json <<'ESLINT'
{
  "root": true,
  "extends": ["next/core-web-vitals"],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
ESLINT

cat > .env.example <<'ENV'
# Root-level shared
NODE_ENV=development
JWT_SECRET=changeme
MONGO_URL=mongodb://localhost:27017/observai
REDIS_URL=redis://localhost:6379
ENV

echo ">> packages/types..."
cat > packages/types/package.json <<'PKG'
{
  "name": "@observai/types",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "lint": "echo (no lint in types yet)",
    "format": "prettier -w ."
  },
  "devDependencies": {
    "typescript": "^5.5.4",
    "prettier": "^3.3.3"
  }
}
PKG

cat > packages/types/tsconfig.json <<'TS'
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "declaration": true,
    "outDir": "dist",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
TS

cat > packages/types/src/index.ts <<'TS'
export type Role = 'owner' | 'manager' | 'staff';
export interface User {
  _id: string;
  email: string;
  name: string;
  role: Role;
}
export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  priceTL: number;
  category: string;
  inStock: boolean;
}
export interface InventoryItem {
  _id: string;
  name: string;
  unit: 'kg' | 'lt' | 'unit' | 'g' | 'ml';
  quantity: number;
  parLevel: number;
}
export interface SaleLine {
  itemId: string;
  name: string;
  qty: number;
  unitPriceTL: number;
}
export interface Sale {
  _id: string;
  at: string;
  table?: string;
  cashierId?: string;
  lines: SaleLine[];
  totalTL: number;
}
TS

echo ">> packages/ui..."
cat > packages/ui/package.json <<'PKG'
{
  "name": "@observai/ui",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "echo UI is source-only for now",
    "lint": "echo (no lint in ui yet)",
    "format": "prettier -w ."
  },
  "devDependencies": {
    "prettier": "^3.3.3"
  }
}
PKG

cat > packages/ui/src/index.ts <<'TS'
export const cx = (...cls: (string | false | undefined)[]) => cls.filter(Boolean).join(' ');
TS

echo ">> apps/api..."
cat > apps/api/package.json <<'PKG'
{
  "name": "@observai/api",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "lint": "eslint . --ext .ts",
    "format": "prettier -w ."
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.5.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6",
    "eslint": "^9.9.0",
    "prettier": "^3.3.3",
    "tsx": "^4.16.2",
    "typescript": "^5.5.4"
  }
}
PKG

cat > apps/api/tsconfig.json <<'TS'
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "outDir": "dist",
    "moduleResolution": "Bundler",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
TS

cat > apps/api/.env.example <<'ENV'
PORT=4000
MONGO_URL=mongodb://localhost:27017/observai
JWT_SECRET=changeme
ENV

cat > apps/api/src/index.ts <<'TS'
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { router as healthRouter } from './routes/health.js';
import { router as staffRouter } from './routes/staff.js';
import { router as ordersRouter } from './routes/orders.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/health', healthRouter);
app.use('/api/staff', staffRouter);
app.use('/api/orders', ordersRouter);

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/observai';

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Mongo connect error:', err);
    process.exit(1);
  });
TS

cat > apps/api/src/routes/health.ts <<'TS'
import { Router } from 'express';
export const router = Router();
router.get('/', (_req, res) => {
  res.json({ ok: true, service: 'api', ts: new Date().toISOString() });
});
TS

cat > apps/api/src/routes/staff.ts <<'TS'
import { Router } from 'express';
import { z } from 'zod';
export const router = Router();

const StaffSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['owner','manager','staff'])
});

const db: any[] = [];

router.get('/', (_req, res) => {
  res.json(db);
});

router.post('/', (req, res) => {
  const parsed = StaffSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const doc = { _id: String(Date.now()), ...parsed.data };
  db.push(doc);
  res.status(201).json(doc);
});
TS

cat > apps/api/src/routes/orders.ts <<'TS'
import { Router } from 'express';
import { z } from 'zod';
export const router = Router();

const Line = z.object({
  itemId: z.string(),
  name: z.string(),
  qty: z.number().int().positive(),
  unitPriceTL: z.number().nonnegative()
});
const OrderSchema = z.object({
  lines: z.array(Line).min(1),
  table: z.string().optional()
});

const orders: any[] = [];

router.get('/', (_req, res) => {
  res.json(orders);
});

router.post('/', (req, res) => {
  const parsed = OrderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const totalTL = parsed.data.lines.reduce((s, l) => s + l.qty * l.unitPriceTL, 0);
  const doc = { _id: String(Date.now()), ...parsed.data, totalTL, at: new Date().toISOString() };
  orders.push(doc);
  res.status(201).json(doc);
});
TS

echo ">> apps/web..."
cat > apps/web/package.json <<'PKG'
{
  "name": "@observai/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "format": "prettier -w ."
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "tailwindcss": "3.4.7"
  },
  "devDependencies": {
    "@types/node": "^20.14.9",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "prettier": "^3.3.3",
    "eslint": "^9.9.0",
    "eslint-config-next": "14.2.5",
    "typescript": "^5.5.4"
  }
}
PKG

cat > apps/web/tsconfig.json <<'TS'
{
  "compilerOptions": {
    "target": "ES2021",
    "lib": ["dom", "es2021"],
    "types": ["node"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
TS

cat > apps/web/next.config.mjs <<'NEXT'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true }
};
export default nextConfig;
NEXT

cat > apps/web/postcss.config.js <<'JS'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
JS

cat > apps/web/tailwind.config.js <<'JS'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: []
};
JS

cat > apps/web/styles/globals.css <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;
CSS

cat > apps/web/app/layout.tsx <<'TSX'
import './styles.css';
import '../styles/globals.css';
import React from 'react';

export const metadata = {
  title: 'ObservAI Cafe',
  description: 'Cafe management dashboard'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
TSX

# a small indirection so Tailwind works with Next app dir
cat > apps/web/app/styles.css <<'CSS'
/* keep for Next app dir style import */
CSS

cat > apps/web/app/page.tsx <<'TSX'
export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">ObservAI — Cafe Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">
        Web is up. Connect API at <code>http://localhost:4000/health</code>.
      </p>
      <ul className="mt-6 list-disc pl-6 space-y-2">
        <li>POS → Inventory auto-decrement (planned)</li>
        <li>Camera analytics (edge service, planned)</li>
        <li>Campaign recommendations (planned)</li>
      </ul>
    </main>
  );
}
TSX

echo ">> infra/docker..."
cat > infra/docker/compose.dev.yml <<'YML'
version: "3.9"
services:
  mongo:
    image: mongo:6
    container_name: observai-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
  redis:
    image: redis:7
    container_name: observai-redis
    ports:
      - "6379:6379"
volumes:
  mongo_data:
YML

echo ">> Postman collection (basic)..."
cat > observai.postman_collection.json <<'POSTMAN'
{
  "info": { "name": "ObservAI API", "_postman_id": "cafedev", "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
  "item": [
    { "name": "Health", "request": { "method": "GET", "url": "http://localhost:4000/health" } },
    { "name": "List Staff", "request": { "method": "GET", "url": "http://localhost:4000/api/staff" } },
    { "name": "Create Staff", "request": { "method": "POST", "header": [{ "key": "Content-Type", "value": "application/json" }], "body": { "mode": "raw", "raw": "{\n  \"email\": \"owner@cafe.com\",\n  \"name\": \"Cafe Owner\",\n  \"role\": \"owner\"\n}" }, "url": "http://localhost:4000/api/staff" } },
    { "name": "Create Order", "request": { "method": "POST", "header": [{ "key": "Content-Type", "value": "application/json" }], "body": { "mode": "raw", "raw": "{\n  \"table\": \"5\",\n  \"lines\": [\n    {\"itemId\":\"1\",\"name\":\"Latte\",\"qty\":2,\"unitPriceTL\":95}\n  ]\n}" }, "url": "http://localhost:4000/api/orders" } }
  ]
}
POSTMAN

echo ">> Done."
echo
echo "Next steps:"
echo "1) pnpm i"
echo "2) cp .env.example .env && cp apps/api/.env.example apps/api/.env"
echo "3) docker compose -f infra/docker/compose.dev.yml up -d   # (optional: DB'leri ayağa kaldırır)"
echo "4) pnpm --filter @observai/api dev    # http://localhost:4000/health"
echo "5) pnpm --filter @observai/web dev    # http://localhost:3000"
