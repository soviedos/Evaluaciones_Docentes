# Backend — Gestión Académica

> API REST construida con FastAPI y Python 3.12 como **monolito modular**. Cada módulo académico vive en `app/modules/<nombre>/` con capas propias (api, application, domain, infrastructure). El shared kernel en `app/shared/` provee configuración, entidades base e infraestructura común.

---

## Stack

| Tecnología                                       | Uso                                        |
| ------------------------------------------------ | ------------------------------------------ |
| [FastAPI](https://fastapi.tiangolo.com/)         | Framework web async con OpenAPI automático |
| [SQLAlchemy 2.0](https://www.sqlalchemy.org/)    | ORM con soporte async                      |
| [Alembic](https://alembic.sqlalchemy.org/)       | Migraciones de base de datos               |
| [Pydantic v2](https://docs.pydantic.dev/)        | Validación de datos y settings             |
| [Redis](https://redis.io/)                       | Cache y rate-limiting                      |
| [MinIO](https://min.io/)                         | Almacenamiento de objetos (PDFs)           |
| [pgvector](https://github.com/pgvector/pgvector) | Embeddings y búsqueda semántica            |
| [PyMuPDF](https://pymupdf.readthedocs.io/)       | Extracción de texto de PDFs                |
| [Gemini API](https://ai.google.dev/)             | Análisis con IA generativa                 |

---

## Estructura de Carpetas

```
backend/
├── app/
│   ├── main.py                           → Punto de entrada FastAPI
│   ├── api/                              → Capa API compartida
│   │   ├── deps.py                       → Dependencias inyectables (DB, MinIO)
│   │   ├── rate_limit.py                 → Rate limiter
│   │   └── v1/router.py                 → Agregador de routers de módulos
│   │
│   ├── modules/                          → ─── Bounded Contexts ───
│   │   ├── evaluacion_docente/           → Módulo implementado
│   │   │   ├── api/                      → Routers (alertas, analytics, dashboard…)
│   │   │   ├── application/              → Servicios, parsing, clasificación
│   │   │   ├── domain/                   → Entidades, schemas, reglas de negocio
│   │   │   └── infrastructure/           → Repositorios SQL, cliente Gemini
│   │   └── auth/                         → Módulo transversal
│   │       ├── api/                      → Endpoints de autenticación
│   │       ├── application/              → Servicios de auth
│   │       ├── domain/                   → Entidades y schemas de usuario
│   │       └── infrastructure/           → Repositorios de usuario
│   │
│   └── shared/                           → ─── Shared Kernel ───
│       ├── core/                         → config.py, logging.py, cache.py
│       ├── domain/                       → Entidades base, excepciones, schemas
│       └── infrastructure/               → DB engine, session, MinIO, Celery
│
├── scripts/                              → Scripts de backfill y mantenimiento
├── tests/
│   ├── conftest.py                       → Fixtures compartidos
│   ├── api/                              → Tests de endpoints
│   ├── unit/                             → Tests unitarios
│   ├── integration/                      → Tests de integración
│   └── fixtures/                         → PDFs de prueba y datos mock
├── pyproject.toml
└── Dockerfile
```

> **Nota**: Los directorios `app/core/`, `app/domain/`, `app/infrastructure/` y `app/application/` aún existen como shims de compatibilidad que re-exportan desde `app/shared/` y `app/modules/`.

---

## Desarrollo Local

### Requisitos

- Python 3.12+
- [uv](https://docs.astral.sh/uv/) (recomendado) o pip

### Instalación

```bash
cd backend

# Crear entorno virtual e instalar dependencias
uv venv
source .venv/bin/activate
uv pip install -e ".[dev]"

# Copiar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
uvicorn app.main:app --reload --port 8000
```

La API estará disponible en `http://localhost:8000`.  
Documentación interactiva en `http://localhost:8000/docs`.

### Variables de Entorno

| Variable           | Descripción                     | Ejemplo                                                      |
| ------------------ | ------------------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`     | Cadena de conexión a PostgreSQL | `postgresql+asyncpg://user:pass@localhost:5432/evaluaciones` |
| `REDIS_URL`        | URL del broker Redis            | `redis://localhost:6379/0`                                   |
| `MINIO_ENDPOINT`   | Host y puerto de MinIO          | `localhost:9000`                                             |
| `MINIO_ACCESS_KEY` | Clave de acceso MinIO           | `minioadmin`                                                 |
| `MINIO_SECRET_KEY` | Clave secreta MinIO             | `minioadmin`                                                 |
| `GEMINI_API_KEY`   | API key de Google Gemini        | `AIza...`                                                    |

---

## Scripts y Comandos

```bash
# Servidor de desarrollo
uvicorn app.main:app --reload --port 8000

# Ejecutar tests
pytest

# Tests con cobertura
pytest --cov=app --cov-report=html

# Lint
ruff check .

# Formato automático
ruff format .

# Crear migración
alembic -c app/shared/infrastructure/database/migrations/alembic.ini revision --autogenerate -m "descripcion"

# Aplicar migraciones
alembic -c app/shared/infrastructure/database/migrations/alembic.ini upgrade head

# Iniciar worker Celery (opcional, no requerido en modo BackgroundTasks)
# celery -A app.infrastructure.tasks.celery_app worker --loglevel=info
```

---

## Convenciones

- **Archivos**: `snake_case` (`pdf_parser.py`, `gemini_analyzer.py`)
- **Clases**: `PascalCase` (`Evaluacion`, `DocumentoCreate`)
- **Endpoints**: `kebab-case` plural (`/api/v1/evaluaciones`)
- **Modelos SQLAlchemy**: singular (`Evaluacion`), tabla plural (`evaluaciones`)
- **Schemas Pydantic**: sufijo según uso (`EvaluacionCreate`, `EvaluacionResponse`)
- **Services**: lógica de negocio pura, sin dependencia de FastAPI
- **Tasks**: solo orquestación; delegan al service correspondiente

---

## Versionado de API

La API se versiona con prefijo en la URL: `/api/v1/`. Cuando se requiera un cambio incompatible, se creará `/api/v2/` sin remover la versión anterior hasta que todos los clientes migren.
