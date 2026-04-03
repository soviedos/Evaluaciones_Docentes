# Evaluaciones Docentes

Plataforma web interna para el análisis automatizado de evaluaciones docentes a partir de PDFs, con inteligencia artificial.

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 + TypeScript |
| Backend | FastAPI + Python 3.12 |
| Base de datos | PostgreSQL 16 + pgvector |
| Cola de tareas | Redis + Celery |
| Almacenamiento | MinIO |
| IA | Gemini API |
| Infraestructura | Docker Compose (on-prem) |

## Requisitos Previos

- Docker y Docker Compose v2
- Node.js 20+ (para desarrollo local del frontend)
- Python 3.12+ (para desarrollo local del backend)
- Make

## Inicio Rápido

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd evaluaciones-docentes

# 2. Copiar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# 3. Levantar toda la stack
make dev

# 4. Verificar
# Backend:  http://localhost:8000/health
# Frontend: http://localhost:3000
# MinIO:    http://localhost:9001
```

## Comandos Útiles

```bash
make dev          # Levantar todos los servicios en modo desarrollo
make down         # Detener todos los servicios
make test         # Ejecutar todos los tests
make test-back    # Tests del backend
make test-front   # Tests del frontend
make lint         # Lint de todo el proyecto
make migrate      # Ejecutar migraciones de base de datos
make logs         # Ver logs de todos los servicios
```

## Estructura del Proyecto

```
├── frontend/     # Next.js + TypeScript
├── backend/      # FastAPI + Python
├── infra/        # Docker Compose, nginx, scripts
└── docs/         # Documentación técnica
```

## Documentación

- [Arquitectura](docs/architecture.md)
- [Contratos de API](docs/api-contracts.md)
- [Despliegue](docs/deployment.md)
