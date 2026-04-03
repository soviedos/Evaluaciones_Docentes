#!/usr/bin/env bash
set -euo pipefail

echo "=== Configuración de entorno de desarrollo ==="

# Backend
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "✓ backend/.env creado"
else
  echo "· backend/.env ya existe"
fi

# Frontend
if [ ! -f frontend/.env.local ]; then
  cp frontend/.env.local.example frontend/.env.local
  echo "✓ frontend/.env.local creado"
else
  echo "· frontend/.env.local ya existe"
fi

echo ""
echo "=== Levantando servicios ==="
make dev
