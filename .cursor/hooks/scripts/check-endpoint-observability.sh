#!/usr/bin/env bash
set -euo pipefail
echo "[hook] Backend endpoint file changed."
echo "[hook] Verify observability:"
echo "  - structured log keys present"
echo "  - scenario/http metrics updated"
echo "  - 5xx error path captured by Sentry"
