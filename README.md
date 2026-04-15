# Signal Lab

Signal Lab is an observability playground: run scenarios from UI and inspect metrics, logs, and errors in Prometheus, Loki, Grafana, and Sentry.

## Prerequisites

- Docker + Docker Compose
- Node.js 22+ (for local non-docker runs)

## Run

```bash
docker compose up -d --build
```

## Verify

> **Port note:** Grafana runs on `3101` (not `3000`), to avoid a conflict with the frontend.
> Loki's API is on `3100`; access logs via Grafana Explore, not directly.

1. Open `http://localhost:3000` — Signal Lab UI.
2. Run scenario `success`, then `system_error`.
3. Check backend health:
   - `curl http://localhost:3001/api/health`
4. Check metrics:
   - `http://localhost:3001/metrics` — look for `scenario_runs_total`
5. Check Grafana:
   - `http://localhost:3101` (admin / admin) → open `Signal Lab Dashboard`
6. Check Loki logs:
   - Grafana → Explore, data source `Loki`, query `{app="signal-lab"}`
7. Check Sentry:
   - `system_error` scenario triggers `Sentry.captureException` — verify in your Sentry project.
8. Check Swagger:
   - `http://localhost:3001/api/docs`

## Stop

```bash
docker compose down
```

## Project Structure

- `apps/frontend` — Next.js UI (RHF, TanStack Query, Tailwind, shadcn-style components).
- `apps/backend` — NestJS API (scenarios, metrics, logs, swagger, sentry).
- `prisma` — Prisma schema and migrations.
- `infra` — Prometheus, Loki, Promtail, Grafana provisioning.
- `.cursor` — AI layer (rules, skills, commands, hooks).

## AI Layer

### Rules

- `stack-constraints.mdc`: enforce required stack.
- `observability-conventions.mdc`: metrics/log/sentry conventions.
- `prisma-patterns.mdc`: schema/migration/ORM constraints.
- `frontend-patterns.mdc`: RHF + TanStack Query + UI reuse.
- `error-handling.mdc`: backend/frontend error standards.

### Custom Skills

- `observability-endpoint`: add metrics/log/sentry to endpoint changes.
- `nest-endpoint-scaffold`: DTO/controller/service module wiring.
- `frontend-form-query`: RHF form + mutation + list query pattern.
- `signal-lab-orchestrator`: PRD execution with phase state in `.execution`.

### Commands

- `/add-endpoint`
- `/check-obs`
- `/run-prd`

### Hooks

- `after-schema-change`: reminds to run migration + prisma generate.
- `after-endpoint-change`: reminds to verify observability contract.

Config file: `.cursor/hooks/hooks.json`.

### Marketplace Skills (recommended set)

Use these marketplace skills in Cursor settings/workspace:

1. `next-best-practices` — Next.js structure and app router decisions.
2. `shadcn-ui` — UI composition conventions.
3. `tailwind-design-system` — utility-class consistency and scale.
4. `nestjs-best-practices` — modular backend patterns.
5. `prisma-orm` — schema/migration and querying best practices.
6. `docker-expert` — compose and container troubleshooting.

Custom skills in this repo cover project-specific observability conventions and orchestrator workflow that marketplace skills do not encode.

## Demo Script

1. Open Signal Lab UI.
2. Run `success` -> green status in history.
3. Run `slow_request` -> delayed completion and latency increase.
4. Run `system_error` -> error toast + red status.
5. Open `metrics` and confirm `scenario_runs_total`.
6. Open Grafana dashboard and verify panels update.
7. Open Loki logs via Explore and run `{app="signal-lab"}`.
8. Confirm Sentry event for `system_error`.
