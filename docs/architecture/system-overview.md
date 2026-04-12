# Visión General del Sistema

> Arquitectura de alto nivel de la plataforma `cenfotec-gestion-academica`.

---

## 1. Contexto

La plataforma de Gestión Académica es un sistema on-premise diseñado como **monolito modular**. Cada módulo encapsula un dominio académico completo y se despliega dentro del mismo proceso, pero mantiene aislamiento lógico estricto: entidades, servicios, API y UI propios.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Gestión Académica                            │
│                                                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────┐ │
│  │ Evaluación │  │  Control   │  │Convalida-  │  │Planificación │ │
│  │  Docente   │  │  Docente   │  │  ciones    │  │ (C/M/B2B)    │ │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └──────┬───────┘ │
│        │               │               │                │          │
│  ┌─────┴───────────────┴───────────────┴────────────────┴───────┐  │
│  │                      Shared Kernel                            │  │
│  │   Config · Logging · Cache · Base Entities · DB Engine        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Auth (transversal)                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Mapa de Módulos

| Módulo                          | Backend                                            | Frontend                                             | Estado       |
| ------------------------------- | -------------------------------------------------- | ---------------------------------------------------- | ------------ |
| **Evaluación Docente**          | `backend/app/modules/evaluacion_docente/`          | `frontend/src/features/evaluacion-docente/`          | Implementado |
| **Auth**                        | `backend/app/modules/auth/`                        | `frontend/src/features/auth/`                        | Transversal  |
| **Control Docente**             | `backend/app/modules/control_docente/`             | `frontend/src/features/control-docente/`             | Planificado  |
| **Convalidaciones**             | `backend/app/modules/convalidaciones/`             | `frontend/src/features/convalidaciones/`             | Planificado  |
| **Planificación Cuatrimestral** | `backend/app/modules/planificacion_cuatrimestral/` | `frontend/src/features/planificacion-cuatrimestral/` | Planificado  |
| **Planificación Mensual**       | `backend/app/modules/planificacion_mensual/`       | `frontend/src/features/planificacion-mensual/`       | Planificado  |
| **Planificación B2B**           | `backend/app/modules/planificacion_b2b/`           | `frontend/src/features/planificacion-b2b/`           | Planificado  |

### Shared Kernel

Código transversal reutilizado por todos los módulos:

| Capa            | Ubicación                            | Contenido                                               |
| --------------- | ------------------------------------ | ------------------------------------------------------- |
| Core            | `backend/app/shared/core/`           | Settings, logging, cache (Redis + fallback)             |
| Domain base     | `backend/app/shared/domain/`         | Base entities, base exceptions, common schemas          |
| Infrastructure  | `backend/app/shared/infrastructure/` | DB engine, session factory, MinIO client, Celery config |
| Frontend shared | `frontend/src/lib/`                  | API client HTTP, utilidades (`cn()`)                    |
| Frontend UI     | `frontend/src/components/ui/`        | Componentes headless (Button, Card, Dialog, etc.)       |
| Frontend layout | `frontend/src/components/layout/`    | Sidebar, Navbar, Footer, DashboardShell                 |

---

## 3. Stack Tecnológico

| Capa                   | Tecnología                | Versión    |
| ---------------------- | ------------------------- | ---------- |
| Frontend               | Next.js + TypeScript      | 16.x       |
| UI Components          | shadcn/ui + Tailwind v4   | 4.x        |
| Backend                | FastAPI + Python          | 3.12       |
| ORM                    | SQLAlchemy 2.0 (async)    | 2.x        |
| Base de datos          | PostgreSQL + pgvector     | 16         |
| Cache / Rate-limit     | Redis                     | 7.x        |
| Almacenamiento objetos | MinIO                     | latest     |
| IA                     | Gemini API (google-genai) | 2.5-flash  |
| Contenedores           | Docker + Docker Compose   | 24.x / 2.x |
| Proxy reverso          | Nginx                     | 1.25       |

---

## 4. Principios Arquitectónicos

1. **Un módulo = un bounded context.** Cada módulo tiene su propia API, servicios, entidades, schemas y repositorios. No hay imports cruzados entre módulos.

2. **Comunicación solo vía shared kernel.** Los módulos comparten infraestructura (DB, cache, storage) a través del shared kernel, nunca directamente entre sí.

3. **Backend como fuente de verdad.** Toda validación de dominio se ejecuta en el backend. El frontend consume valores pre-calculados sin duplicar lógica de negocio.

4. **Shims para backward compatibility.** Los directorios legacy (`app/core/`, `app/domain/`, `app/infrastructure/`) funcionan como re-exportaciones hacia las ubicaciones canónicas en `app/shared/` y `app/modules/`.

5. **Módulos planificados no bloquean.** La estructura modular permite agregar nuevos módulos sin modificar los existentes.

---

## 5. Flujo de Datos (Evaluación Docente)

```
PDF Upload → SHA-256 dedup → Parser (PyMuPDF) → Clasificación (local)
                                     │
                                     ├─ Datos cuantitativos → PostgreSQL
                                     ├─ Comentarios → Gemini API → Clasificación IA → PostgreSQL
                                     └─ PDF original → MinIO

Motor de Alertas (4 detectores) → Alertas → PostgreSQL

Consulta IA → Retrieval (métricas + comentarios) → Gemini RAG → Respuesta
```

---

## 6. Infraestructura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Nginx     │────▶│   Next.js   │     │   FastAPI   │
│  (reverse   │     │  (frontend) │     │  (backend)  │
│   proxy)    │────▶│  :3000      │     │  :8000      │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌──────────────────────────┬┴──────────────┐
                    │                          │               │
              ┌─────▼─────┐            ┌───────▼──────┐ ┌─────▼─────┐
              │ PostgreSQL │            │    Redis     │ │   MinIO   │
              │  + pgvector│            │   (cache)    │ │  (files)  │
              │  :5432     │            │   :6379      │ │  :9000    │
              └────────────┘            └──────────────┘ └───────────┘
```

Todo se ejecuta on-premise con Docker Compose. La única dependencia externa es Gemini API para análisis cualitativo.
