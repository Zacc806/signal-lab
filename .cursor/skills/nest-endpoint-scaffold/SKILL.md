---
name: nest-endpoint-scaffold
description: Scaffold a NestJS endpoint with DTO, service, and controller wiring.
---

## When to Use

- A new API endpoint is requested.
- A PRD asks for a backend flow with validation and persistence.

## Steps

1. Add DTO in `src/<domain>/dto` with class-validator rules.
2. Add service method with business flow and Prisma calls.
3. Add controller handler with route and typed input.
4. Update `AppModule` with controllers/providers.
5. Add basic smoke command examples to README or API docs.
