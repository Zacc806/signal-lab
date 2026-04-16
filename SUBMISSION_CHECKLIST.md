# Signal Lab — Submission Checklist

Заполни этот файл перед сдачей. Он поможет интервьюеру быстро проверить решение.

---

## Репозиторий

- **URL**: `https://github.com/Zacc806/signal-lab`
- **Ветка**: `main`
- **Время работы** (приблизительно): `2` часа

---

## Запуск

```bash
# Команда запуска:
docker compose up -d --build

# Команда проверки:
curl http://localhost:3001/api/health
curl http://localhost:3001/metrics
# UI:      http://localhost:3000
# Grafana: http://localhost:3101  (admin/admin) — порт 3101, не 3000
# Loki:    Grafana Explore → {app="signal-lab"}
# Swagger: http://localhost:3001/api/docs

# Команда остановки:
docker compose down

```

**Предусловия**: Docker Desktop (Compose v2), свободные порты `3000`, `3001`, `3100`, `3101`, `5433`, `9090`, корректный `SENTRY_DSN` для реальной проверки Sentry.

> **Примечание по портам**: Grafana доступна на порту `3101` (а не `3000`), чтобы не конфликтовать с frontend. Loki API на `3100`, но логи смотреть через Grafana Explore.

---

## Стек — подтверждение использования

| Технология | Используется? | Где посмотреть |
|-----------|:------------:|----------------|
| Next.js (App Router) | ☑ | `apps/frontend/src/app/page.tsx` |
| shadcn/ui | ☑ | `apps/frontend/src/components/ui` |
| Tailwind CSS | ☑ | `apps/frontend/src/app/globals.css` |
| TanStack Query | ☑ | `apps/frontend/src/app/page.tsx` |
| React Hook Form | ☑ | `apps/frontend/src/app/page.tsx` |
| NestJS | ☑ | `apps/backend/src/main.ts` |
| PostgreSQL | ☑ | `docker-compose.yml` (`postgres`) |
| Prisma | ☑ | `prisma/schema.prisma`, `prisma/migrations` |
| Sentry | ☑ | `apps/backend/src/main.ts`, `apps/backend/src/shared/http-exception.filter.ts` |
| Prometheus | ☑ | `infra/prometheus/prometheus.yml` |
| Grafana | ☑ | `infra/grafana/*`, `docker-compose.yml` |
| Loki | ☑ | `infra/loki/loki-config.yml`, `infra/promtail/promtail.yml` |

---

## Observability Verification

Опиши, как интервьюер может проверить каждый сигнал:

| Сигнал | Как воспроизвести | Где посмотреть результат |
|--------|-------------------|------------------------|
| Prometheus metric | В UI запустить `success` и `slow_request` | `http://localhost:3001/metrics` (`scenario_runs_total`, `scenario_run_duration_seconds`) |
| Grafana dashboard | После запусков открыть dashboard | `http://localhost:3101` -> `Signal Lab Dashboard` |
| Loki log | Запустить любой сценарий | Grafana Explore, query `{app="signal-lab"}` |
| Sentry exception | В UI запустить `system_error` | Sentry project dashboard / Issues |

---

## Cursor AI Layer

### Custom Skills

| # | Skill name | Назначение |
|---|-----------|-----------|
| 1 | `observability-endpoint` | Добавление метрик/логов/Sentry в endpoint |
| 2 | `nest-endpoint-scaffold` | Быстрый шаблон DTO+controller+service для Nest |
| 3 | `frontend-form-query` | Форма RHF + TanStack Query list/mutation |
| 4 | `signal-lab-orchestrator` | Оркестрация PRD по фазам с state file |

### Commands

| # | Command | Что делает |
|---|---------|-----------|
| 1 | `/add-endpoint` | Создаёт endpoint с observability-требованиями |
| 2 | `/check-obs` | Проверяет observability completeness |
| 3 | `/run-prd` | Запускает реализацию PRD через orchestrator |

### Hooks

| # | Hook | Какую проблему решает |
|---|------|----------------------|
| 1 | `after-schema-change` | Напоминает про миграции и prisma generate |
| 2 | `after-endpoint-change` | Напоминает проверить метрики/логи/Sentry |

### Rules

| # | Rule file | Что фиксирует |
|---|----------|---------------|
| 1 | `stack-constraints.mdc` | Ограничения стека и запрет альтернатив |
| 2 | `observability-conventions.mdc` | Конвенции для metrics/logging/Sentry |
| 3 | `prisma-patterns.mdc` | ORM/миграции/паттерны работы с Prisma |
| 4 | `frontend-patterns.mdc` | RHF + TanStack Query + UI-паттерны |
| 5 | `error-handling.mdc` | Backend/frontend стратегия обработки ошибок |

### Marketplace Skills

| # | Skill | Зачем подключён |
|---|-------|----------------|
| 1 | `next-best-practices` | Best practices для Next.js App Router |
| 2 | `shadcn-ui` | Быстрая и консистентная UI-сборка |
| 3 | `tailwind-design-system` | Согласованные utility-стили |
| 4 | `nestjs-best-practices` | Паттерны модульного backend |
| 5 | `prisma-orm` | Правильные schema/query/migration практики |
| 6 | `docker-expert` | Troubleshooting compose/containers |

**Что закрыли custom skills, чего нет в marketplace:**
- Проектно-специфичные observability conventions для Signal Lab.
- PRD orchestrator с `.execution/<timestamp>/context.json`, фазами, resume и model-split.

---

## Orchestrator

- **Путь к skill**: `.cursor/skills/signal-lab-orchestrator/SKILL.md`
- **Путь к context file** (пример): `.execution/<timestamp>/context.json`
- **Сколько фаз**: `7` (analysis, codebase, planning, decomposition, implementation, review, report)
- **Какие задачи для fast model**: atomic implementation tasks (DTO/endpoint/UI components/metrics/logging)
- **Поддерживает resume**: да

---

## Скриншоты / видео

- [Screenshot 2026-04-15 at 19.42.30.png] UI приложения
- [Screenshot 2026-04-15 at 19.53.51] Grafana dashboard с данными
- [Screenshot 2026-04-15 at 19.54.36.png] Loki logs
- [ ] Sentry error

(Приложи файлы или ссылки ниже)

---

## Что не успел и что сделал бы первым при +4 часах

- Привести все публичные порты к reference-flow из assignment без компромиссов (`5432`, `3000/grafana` reverse-proxy path).
- Добавить e2e тесты на сценарии и smoke-check script для одной команды проверки.
- Подготовить короткий demo-video и автозаполняемый verification report.
---

## Вопросы для защиты (подготовься)

1. Почему именно такая декомпозиция skills?
2. Какие задачи подходят для малой модели и почему?
3. Какие marketplace skills подключил, а какие заменил custom — и почему?
4. Какие hooks реально снижают ошибки в повседневной работе?
5. Как orchestrator экономит контекст по сравнению с одним большим промптом?
