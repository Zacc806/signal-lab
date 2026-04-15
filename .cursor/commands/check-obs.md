Run an observability completeness check for recent backend changes.

Checklist:
- Endpoint emits structured log.
- Metrics updated (`scenario_runs_total`, duration histogram, or relevant endpoint metric).
- Sentry captures 5xx failure paths.
- `/metrics` exposes expected series.
- Grafana dashboard still reflects changed metrics.

Return missing items with exact file-level fix suggestions.
