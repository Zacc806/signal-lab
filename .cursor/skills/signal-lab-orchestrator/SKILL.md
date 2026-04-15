---
name: signal-lab-orchestrator
description: Execute a PRD in phases using context economy and small-model delegation.
---

## When to Use

- User asks to implement a PRD end-to-end.
- You need resumable execution with minimal main-chat context.

## Input

- `prdPath` or pasted PRD text.

## Workflow

1. Create `.execution/<timestamp>/context.json` from template in `COORDINATION.md`.
2. Run phases in order: analysis -> codebase -> planning -> decomposition -> implementation -> review -> report.
3. Mark each task with `complexity` and `model` (`fast` for 80%+ tasks).
4. For implementation, execute atomic tasks (5-10 min each) by dependency groups.
5. For review, run domain loops (database/backend/frontend) up to 3 retries each.
6. Persist progress in `context.json` after every phase and retry.
7. On rerun, load context and continue from `currentPhase` without replaying completed phases.

## Output

- Final report with completed/failed tasks, retries, model usage, and next steps.
