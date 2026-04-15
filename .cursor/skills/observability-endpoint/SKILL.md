---
name: observability-endpoint
description: Add metrics, logs, and Sentry to backend endpoint changes.
---

## When to Use

- You added or changed a NestJS endpoint.
- You need to guarantee endpoint-level observability parity.

## Steps

1. Add or update one counter and one duration metric in `MetricsService`.
2. Emit a structured log with stable keys (`scenarioType`, `scenarioId`, `duration`, `error`).
3. Ensure 5xx errors are captured in Sentry, with useful context/breadcrumb.
4. Verify Prometheus labels are low-cardinality.
5. Add a short manual verification note (metrics, logs, sentry).
