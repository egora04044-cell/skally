#!/usr/bin/env bash
# Запускать на сервере из каталога проекта: chmod +x deploy.sh && ./deploy.sh

set -euo pipefail
cd "$(dirname "$0")"

echo "=== npm ci ==="
npm ci

echo "=== npm run build ==="
npm run build

echo "=== PM2 ==="
if pm2 describe scally >/dev/null 2>&1; then
  pm2 restart scally
else
  pm2 start ecosystem.config.cjs
fi

pm2 save
echo "=== Готово ==="
