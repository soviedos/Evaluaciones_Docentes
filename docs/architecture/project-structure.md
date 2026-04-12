# Estructura del Proyecto

> Guía detallada de la organización de directorios de `cenfotec-gestion-academica`.

---

## Nivel Raíz

```
cenfotec-gestion-academica/
├── backend/              # API FastAPI (Python 3.12)
├── frontend/             # App Next.js (TypeScript)
├── docs/                 # Documentación técnica y ADRs
├── infra/                # Docker Compose, Nginx, scripts de setup
├── Makefile              # Comandos de desarrollo y CI
├── LICENSE
└── README.md
```

---

## Backend

```
backend/
├── Dockerfile
├── pyproject.toml
├── app/
│   ├── main.py                         # Punto de entrada FastAPI
│   ├── api/                            # Capa API compartida (versioning)
│   │   ├── deps.py                     # Dependencias (DB session, MinIO)
│   │   ├── rate_limit.py               # Middleware rate-limiting
│   │   └── v1/                         # Router v1 (agrega routers de módulos)
│   │
│   ├── modules/                        # ─── Bounded contexts ───
│   │   ├── evaluacion_docente/         # Primer módulo implementado
│   │   │   ├── api/                    # Routers del módulo
│   │   │   │   ├── alertas.py
│   │   │   │   ├── analytics.py
│   │   │   │   ├── dashboard.py
│   │   │   │   ├── documentos.py
│   │   │   │   ├── evaluaciones.py
│   │   │   │   ├── qualitative.py
│   │   │   │   ├── query.py
│   │   │   │   └── config_routes.py
│   │   │   ├── application/            # Casos de uso
│   │   │   │   ├── classification/     # Clasificador de comentarios
│   │   │   │   ├── parsing/            # Parser de PDFs
│   │   │   │   └── services/           # Servicios de aplicación
│   │   │   ├── domain/                 # Entidades y reglas de negocio
│   │   │   │   ├── entities/           # Modelos SQLAlchemy
│   │   │   │   ├── schemas/            # Schemas Pydantic
│   │   │   │   ├── exceptions.py       # Excepciones del dominio
│   │   │   │   ├── alert_rules.py      # Motor de alertas
│   │   │   │   ├── fingerprint.py      # SHA-256 dedup
│   │   │   │   ├── invariants.py       # Validaciones de negocio
│   │   │   │   └── periodo.py          # Lógica temporal
│   │   │   └── infrastructure/         # Adaptadores externos
│   │   │       ├── repositories/       # Repositorios SQL
│   │   │       └── external/           # Clientes (Gemini API)
│   │   │
│   │   └── auth/                       # Módulo transversal
│   │       ├── api/                    # Endpoints de autenticación
│   │       ├── application/            # Servicios de auth
│   │       ├── domain/                 # Entidades y schemas de usuario
│   │       └── infrastructure/         # Repositorios de usuario
│   │
│   └── shared/                         # ─── Shared Kernel ───
│       ├── core/                       # Configuración global
│       │   ├── config.py               # Settings (Pydantic)
│       │   ├── logging.py              # Logging estructurado
│       │   └── cache.py                # Redis cache + fallback
│       ├── domain/                     # Abstracciones base
│       │   ├── entities/               # Base model, mixins
│       │   ├── schemas/                # Schemas compartidos
│       │   └── exceptions.py           # Excepciones base
│       └── infrastructure/             # Infraestructura compartida
│           ├── database/               # Engine, session, migraciones Alembic
│           ├── repositories/           # Repositorio base
│           ├── storage/                # Cliente MinIO
│           └── tasks/                  # Configuración Celery
│
├── scripts/                            # Scripts de backfill y mantenimiento
│   ├── backfill_comments.py
│   ├── backfill_escuelas.py
│   ├── backfill_modalidad.py
│   └── reanalyze_comments.py
│
└── tests/
    ├── conftest.py                     # Fixtures globales
    ├── api/                            # Tests de endpoints
    ├── unit/                           # Tests unitarios
    ├── integration/                    # Tests de integración
    └── fixtures/                       # Archivos de prueba (PDFs, CSVs)
```

### Shims de Compatibilidad (backend)

Los directorios `app/core/`, `app/domain/`, `app/infrastructure/` y `app/application/` siguen existiendo como **re-exportaciones** hacia las ubicaciones canónicas. Esto garantiza backward compatibility con imports legacy:

```python
# app/core/__init__.py → re-exporta desde app.shared.core
from app.shared.core.config import get_settings  # noqa: F401
```

> Los shims serán eliminados cuando todos los consumidores migren a las rutas canónicas.

---

## Frontend

```
frontend/
├── Dockerfile
├── package.json
├── next.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
│
├── src/
│   ├── app/                            # ─── App Router (Next.js) ───
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Landing / redirect
│   │   ├── login/                      # Página de login
│   │   └── (platform)/                # Route group autenticado
│   │       ├── layout.tsx              # Layout con sidebar + navbar
│   │       ├── dashboard/              # Dashboard general
│   │       └── evaluacion-docente/     # Rutas del módulo
│   │           ├── page.tsx
│   │           ├── documentos/
│   │           ├── evaluaciones/
│   │           ├── alertas/
│   │           ├── analytics/
│   │           └── consulta-ia/
│   │
│   ├── features/                       # ─── Módulos de dominio ───
│   │   ├── evaluacion-docente/         # Feature: Evaluación Docente
│   │   │   ├── index.ts               # Barrel export
│   │   │   ├── components/            # Componentes del módulo
│   │   │   ├── hooks/                 # Hooks del módulo
│   │   │   ├── lib/                   # Utilidades del módulo
│   │   │   └── types/                 # Tipos TypeScript
│   │   ├── auth/                       # Feature: Autenticación
│   │   │   ├── index.ts
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   └── types/
│   │   └── dashboard/                  # Feature: Dashboard general
│   │       ├── index.ts
│   │       ├── components/
│   │       ├── hooks/
│   │       └── lib/
│   │
│   ├── components/                     # ─── Componentes compartidos ───
│   │   ├── ui/                         # Primitivos (shadcn/ui)
│   │   └── layout/                     # Sidebar, Navbar, DashboardShell
│   │
│   ├── hooks/                          # Hooks globales
│   ├── lib/                            # Utilidades (API client, cn())
│   └── styles/                         # CSS global + Tailwind
│
├── tests/
│   ├── setup.ts
│   ├── components/                     # Tests de componentes
│   └── unit/                           # Tests unitarios
│
├── e2e/                                # Tests end-to-end (Playwright)
│   ├── navigation.spec.ts
│   └── results/
│
└── public/
    └── images/
```

---

## Documentación

```
docs/
├── README.md                           # Índice de documentación
├── architecture.md                     # Resumen de arquitectura
├── api-contracts.md                    # Contratos de API
├── data-model.md                       # Modelo de datos
├── deployment.md                       # Guía de despliegue
├── gemini-integration.md               # Integración con Gemini API
├── local-development.md                # Desarrollo local
├── processing-pipeline.md              # Pipeline de procesamiento
├── testing-strategy.md                 # Estrategia de testing
│
├── architecture/                       # Documentación detallada de arquitectura
│   ├── system-overview.md              # Visión general del sistema
│   ├── project-structure.md            # Este archivo
│   ├── modular-monolith.md             # Arquitectura modular
│   ├── alert-engine.md                 # Motor de alertas
│   ├── modality-handling.md            # Manejo de modalidades
│   └── temporal-ordering.md            # Ordenamiento temporal
│
├── adr/                                # Architecture Decision Records
│   ├── 001-monorepo.md
│   ├── 002-nextjs-frontend.md
│   ├── 003-fastapi-backend.md
│   ├── 004-postgresql-fuente-verdad.md
│   ├── 005-parser-deterministico-pdf.md
│   └── 006-gemini-solo-analisis-cualitativo.md
│
├── business-rules/                     # Reglas de negocio
│   ├── compliance-checklist.md
│   └── evaluation-rules.md
│
└── testing/                            # Planes de testing
    └── business-rules-test-plan.md
```

---

## Infraestructura

```
infra/
├── docker/
│   ├── docker-compose.yml              # Producción
│   ├── docker-compose.dev.yml          # Desarrollo (hot-reload)
│   ├── nginx/                          # Configuración Nginx
│   └── postgres/                       # Scripts de inicialización DB
└── scripts/
    └── setup-dev.sh                    # Setup automático del entorno
```

---

## Convenciones de Nombres

| Contexto         | Convención          | Ejemplo                       |
| ---------------- | ------------------- | ----------------------------- |
| Módulo backend   | `snake_case`        | `evaluacion_docente`          |
| Feature frontend | `kebab-case`        | `evaluacion-docente`          |
| Ruta Next.js     | `kebab-case`        | `/evaluacion-docente/alertas` |
| Endpoint API     | `kebab-case` plural | `/api/v1/evaluaciones`        |
| Entidad DB       | `PascalCase`        | `EvaluacionDocente`           |
| Tabla DB         | `snake_case` plural | `evaluacion_docentes`         |
