#!/usr/bin/env bash
set -euo pipefail
echo "[hook] Prisma schema changed."
echo "[hook] Next steps:"
echo "  1) npm run prisma:migrate:dev --prefix apps/backend"
echo "  2) npm run prisma:generate --prefix apps/backend"
echo "  3) Update README if migration process changed."
