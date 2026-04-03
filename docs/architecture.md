# Arquitectura

## Visión General

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │────▶│   Next.js    │────▶│   FastAPI    │
│   (MPA)      │     │   Frontend   │     │   Backend    │
└─────────────┘     └──────────────┘     └──────┬───────┘
                                                │
                          ┌─────────────────────┼─────────────────────┐
                          │                     │                     │
                    ┌─────▼─────┐        ┌─────▼─────┐        ┌─────▼─────┐
                    │ PostgreSQL │        │   Redis   │        │   MinIO   │
                    │ + pgvector │        │ (Celery)  │        │  (PDFs)   │
                    └───────────┘        └─────┬─────┘        └───────────┘
                                               │
                                        ┌──────▼──────┐
                                        │   Celery    │
                                        │   Worker    │
                                        └──────┬──────┘
                                               │
                                        ┌──────▼──────┐
                                        │  Gemini API │
                                        └─────────────┘
```

## Flujo Principal

1. **Carga de PDF**: El usuario sube un PDF → se almacena en MinIO → se crea registro en PostgreSQL
2. **Procesamiento**: Celery toma la tarea → extrae texto del PDF (PyMuPDF) → envía a Gemini para análisis
3. **Almacenamiento**: Los resultados estructurados se guardan en PostgreSQL, los embeddings en pgvector
4. **Consulta**: El frontend consulta evaluaciones, reportes y permite búsqueda semántica vía pgvector

## Decisiones Técnicas

| Decisión           | Alternativa descartada | Razón                                                             |
| ------------------ | ---------------------- | ----------------------------------------------------------------- |
| Monorepo           | Repos separados        | Un equipo, un producto. Co-versionado simplifica PRs y deploys    |
| FastAPI async      | Django/Flask           | Rendimiento async nativo, tipado con Pydantic, OpenAPI automático |
| Next.js App Router | Pages Router           | Layouts compartidos por sección, Server Components, streaming     |
| pgvector           | Pinecone/Weaviate      | On-prem, sin dependencia externa, integrado en PostgreSQL         |
| MinIO              | S3/filesystem          | API compatible S3, UI de admin, replicable, migratable a S3       |
| Celery + Redis     | Dramatiq, RQ           | Ecosistema maduro, retry policies, monitoreo con Flower           |
| PyMuPDF (fitz)     | pdfplumber, Tabula     | Rápido, soporte completo de texto + layout, mantenido activamente |

## Componentes

### Backend (`/backend`)

- **API Layer** (`api/v1/`): Endpoints REST versionados
- **Services** (`services/`): Lógica de negocio reutilizable
- **Tasks** (`tasks/`): Procesamiento asíncrono con Celery
- **Models** (`models/`): SQLAlchemy ORM models
- **Schemas** (`schemas/`): Pydantic validation/serialization

### Frontend (`/frontend`)

- **App Router**: Páginas MPA organizadas por route groups
- **Components**: UI base + componentes de dominio
- **Lib**: API client, utilidades compartidas
