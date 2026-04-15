Execute a PRD using `signal-lab-orchestrator` skill.

Flow:
1. Parse PRD requirements and constraints.
2. Create `.execution/<timestamp>/context.json`.
3. Decompose into 5-10 minute tasks with model labels.
4. Implement tasks in dependency order.
5. Run review loop and produce final report.

Keep main chat concise and persist phase state after each step.
