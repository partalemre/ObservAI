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

1. pnpm i
2. cp apps/api/.env.example apps/api/.env && cp apps/web/.env.example apps/web/.env
3. docker compose -f infra/docker/compose.dev.yml up -d
4. pnpm --filter @observai/api dev # http://localhost:4000/health
5. pnpm --filter @observai/web dev # http://localhost:3000
