## context.json template

```json
{
  "executionId": "YYYY-MM-DD-HH-mm",
  "prdPath": "prds/002_prd-observability-demo.md",
  "status": "in_progress",
  "currentPhase": "analysis",
  "phases": {
    "analysis": { "status": "pending" },
    "codebase": { "status": "pending" },
    "planning": { "status": "pending" },
    "decomposition": { "status": "pending" },
    "implementation": { "status": "pending", "completedTasks": 0, "totalTasks": 0 },
    "review": { "status": "pending" },
    "report": { "status": "pending" }
  },
  "signal": 42,
  "tasks": []
}
```

## Subagent prompt skeleton

- Analysis (fast): extract requirements, constraints, acceptance checks.
- Codebase scan (fast explore): map files/modules impacted by PRD.
- Planning (default): implementation strategy with risks and sequencing.
- Decomposition (default): 5-10 minute tasks with dependencies and model labels.
- Implementation (fast/default): execute tasks in dependency order.
- Review (fast readonly): domain checks and retry feedback loops.
- Report (fast): concise completion report + pending manual steps.
