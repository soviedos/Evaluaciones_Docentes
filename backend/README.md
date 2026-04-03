# Backend — Evaluaciones Docentes

> API REST construida con FastAPI y Python 3.12, con procesamiento asíncrono vía Celery y análisis con Gemini API.

---

## Stack

| Tecnología                                       | Uso                                        |
| ------------------------------------------------ | ------------------------------------------ |
| [FastAPI](https://fastapi.tiangolo.com/)         | Framework web async con OpenAPI automático |
| [SQLAlchemy 2.0](https://www.sqlalchemy.org/)    | ORM con soporte async                      |
| [Alembic](https://alembic.sqlalchemy.org/)       | Migraciones de base de datos               |
| [Pydantic v2](https://docs.pydantic.dev/)        | Validación de datos y settings             |
| [Celery](https://docs.celeryq.dev/)              | Cola de tareas asíncronas                  |
| [Redis](https://redis.io/)                       | Broker para Celery                         |
| [MinIO](https://min.io/)                         | Almacenamiento de objetos (PDFs)           |
| [pgvector](https://github.com/pgvector/pgvector) | Embeddings y búsqueda semántica            |
| [PyMuPDF](https://pymupdf.readthedocs.io/)       | Extracción de texto de PDFs                |
| [Gemini API](https://ai.google.dev/)             | Análisis con IA generativa                 |

---

## Estructura de Carpetas

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                      → Punto de entrada FastAPI
│   ├── config.py                    → Settings con pydantic-settings
│   ├── api/
│   │   ├── deps.py                  → Dependencias inyectables (DB session, auth)
│   │   └── v1/
│   │       ├── router.py            → Agregador de routers v1
│   │       ├── evaluaciones.py      → CRUD de evaluaciones
│   │       └── documentos.py        → Upload y gestión de PDFs
│   ├── models/                      → Modelos SQLAlchemy (tablas)
│   ├── schemas/                     → Schemas Pydantic (request/response)
│   ├── services/                    → Lógica de negocio
│   │   ├── pdf_parser.py            → Extracción de texto de PDFs
│   │   ├── gemini_analyzer.py       → Integración con Gemini API
│   │   ├── embedding_service.py     → Generación de embeddings
│   │   └── reporte_generator.py     → Generación de reportes
│   ├── tasks/                       → Tareas Celery
│   │   ├── celery_app.py            → Configuración de Celery
│   │   ├── pdf_processing.py        → Tarea: procesar PDF subido
│   │   └── analysis.py              → Tarea: análisis con IA
│   ├── db/
│   │   ├── session.py               → Engine y SessionLocal
│   │   └── migrations/              → Alembic (env.py, versions/)
│   └── storage/
│       └── minio_client.py          → Cliente MinIO
├── tests/
│   ├── conftest.py                  → Fixtures compartidos (TestClient, DB)
│   ├── unit/                        → Tests unitarios
│   ├── integration/                 → Tests de integración
│   └── fixtures/                    → PDFs de prueba y datos mock
├── pyproject.toml                   → Dependencias y configuración de herramientas
├── Dockerfile
└── .env.example
```

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
alembic -c app/db/migrations/alembic.ini revision --autogenerate -m "descripcion"

# Aplicar migraciones
alembic -c app/db/migrations/alembic.ini upgrade head

# Iniciar worker Celery
celery -A app.tasks.celery_app worker --loglevel=info
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
