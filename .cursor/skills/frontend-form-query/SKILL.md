---
name: frontend-form-query
description: Build a form + query list flow with RHF and TanStack Query.
---

## When to Use

- You need a user form plus server-backed list/history.
- A page requires mutation success/error UX and auto-refresh.

## Steps

1. Build form with React Hook Form and explicit default values.
2. Add `useMutation` for submit; show toast feedback.
3. Add `useQuery` for list/history and polling or invalidation.
4. Render with shared UI components and concise loading/empty states.
5. Keep API utilities in `src/lib/api.ts`.
