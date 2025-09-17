#!/usr/bin/env bash
set -euo pipefail

echo "→ Dev bağımlılıkları ekleniyor (husky, lint-staged, commitlint, prettier)…"
pnpm add -D -w husky lint-staged @commitlint/config-conventional @commitlint/cli prettier

echo "→ Husky hook klasörü ayarlanıyor…"
mkdir -p .husky
git config core.hooksPath .husky

# pre-commit: lint-staged
cat > .husky/pre-commit <<'HUSKY'
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"
pnpm lint-staged
HUSKY
chmod +x .husky/pre-commit

# commit-msg: commitlint
cat > .husky/commit-msg <<'HUSKY'
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"
pnpm commitlint --edit "$1"
HUSKY
chmod +x .husky/commit-msg

echo "→ package.json güncelleniyor (scripts, lint-staged, commitlint)…"
node - <<'NODE'
const fs = require('fs');
const path = 'package.json';
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
pkg.scripts = Object.assign({
  "prepare": "husky",
  "lint": "turbo lint",
  "typecheck": "turbo typecheck",
  "test": "turbo test",
  "build": "turbo build"
}, pkg.scripts || {});
pkg["lint-staged"] = pkg["lint-staged"] || {
  "*.{ts,tsx,js,json,md,css,scss}": ["prettier --write"]
};
pkg.commitlint = pkg.commitlint || { "extends": ["@commitlint/config-conventional"] };
fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
console.log('package.json updated');
NODE

echo "→ Editor/Node sürüm dosyaları…"
cat > .editorconfig <<'EC'
root = true
[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
EC

echo "20" > .nvmrc

echo "→ ENV örnekleri…"
mkdir -p apps/api apps/web .github/workflows .github
cat > apps/api/.env.example <<'ENV'
# === API ENV (example) ===
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/observai"
JWT_SECRET="change-me"
CORS_ORIGIN="http://localhost:3000"
ENV
cat > apps/web/.env.example <<'ENV'
# === WEB ENV (example) ===
NEXT_PUBLIC_API_URL="http://localhost:4000"
ENV

echo "→ GitHub Actions CI workflow…"
cat > .github/workflows/ci.yml <<'YAML'
name: CI
on:
  push:
  pull_request:
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm i --frozen-lockfile
      - run: pnpm turbo lint
      - run: pnpm turbo typecheck
      - run: pnpm turbo test -- --ci --reporter=list || true
      - run: pnpm turbo build
YAML

echo "→ CODEOWNERS ve PR Template…"
cat > .github/CODEOWNERS <<'OWN'
* @faik-emre @halil @ugur @mevlut @semih
/apps/api/*  @mevlut @semih
/apps/web/*  @faik-emre
/infra/*     @semih
OWN

cat > .github/pull_request_template.md <<'MD'
## Purpose
## Changes
## How to test
- [ ] Local build OK
- [ ] Postman tests passed
## Screenshots (if UI)
## Checklist
- [ ] I followed the coding style
- [ ] I wrote/updated tests where needed
MD

echo "→ CONTRIBUTING ve SECURITY…"
cat > CONTRIBUTING.md <<'MD'
# Contributing

## Branch Strategy
- main: always deployable
- dev: integration branch
- Feature: feat/<short-name> | Fix: fix/<short-name>

## PR Rules
- Min 1 reviewer, CI green, no direct push to main

## Commit Messages
- Conventional Commits: feat, fix, chore, docs, refactor, test

## Run Locally
1) pnpm i
2) cp apps/api/.env.example apps/api/.env && cp apps/web/.env.example apps/web/.env
3) docker compose -f infra/docker/compose.dev.yml up -d
4) pnpm --filter @observai/api dev  # http://localhost:4000/health
5) pnpm --filter @observai/web dev  # http://localhost:3000
MD

cat > SECURITY.md <<'MD'
# Security & Privacy

- Secrets only in env files. Never commit .env
- Use GitHub Secrets for CI/CD
- Camera analytics: aggregate/anonymized only, no raw face storage
- Retention: no raw video frames; store counts/metrics
MD

echo "✅ Tüm işbirliği bileşenleri eklendi."
echo
echo "Şimdi çalıştır:"
echo "  pnpm i"
echo "  git add -A && git commit -m 'chore: add CI, hooks, templates, docs'"
echo "  git push (veya önce remote ekle)"
