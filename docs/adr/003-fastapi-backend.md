# ADR-003: FastAPI como Framework Backend

## Estado

Aceptado

## Fecha

2026-04-02

## Contexto

Se necesita un framework para construir la API REST del backend. Los candidatos evaluados fueron **FastAPI**, **Django REST Framework** y **Flask**.

El backend debe manejar endpoints CRUD, upload de archivos, integración con servicios externos (Gemini API, MinIO) y orquestación de tareas asíncronas (Celery).

## Decisión

Usar **FastAPI** con Python 3.12 como framework del backend.

## Alternativas descartadas

### Django REST Framework

- Incluye ORM, admin, auth y migraciones out-of-the-box, pero esa conveniencia viene con acoplamiento y overhead que no necesitamos
- El ORM de Django no soporta async de forma nativa (asyncio está en evolución)
- La generación de OpenAPI es un add-on, no es nativa
- Para un proyecto que usa SQLAlchemy + Alembic + Pydantic de forma explícita, Django añade capas redundantes

### Flask

- Minimalista pero requiere ensamblar cada pieza manualmente (validación, serialización, docs)
- No tiene soporte async nativo sin extensiones
- La documentación OpenAPI requiere librerías externas (flasgger, apispec)

## Consecuencias

### Positivas

- **Async nativo**: `async def` en endpoints, ideal para I/O con MinIO, Gemini y PostgreSQL
- **Pydantic integrado**: validación de entrada y serialización de salida con un solo schema
- **OpenAPI automática**: documentación interactiva en `/docs` sin configuración adicional
- **Dependency Injection**: sistema de dependencias limpio para DB session, auth, config
- **Rendimiento**: uno de los frameworks Python más rápidos (basado en Starlette + Uvicorn)
- **Tipado**: 100% compatible con type hints de Python, excelente integración con IDEs y Copilot

### Negativas

- No incluye ORM ni migraciones (se resuelve con SQLAlchemy + Alembic)
- No incluye sistema de auth (se implementa con dependencias + JWT)
- Ecosistema más joven que Django

### Mitigación

- SQLAlchemy 2.0 + Alembic para persistencia y migraciones
- Estructura explícita en `api/`, `services/`, `models/`, `schemas/` para mantener orden
- Pydantic Settings para configuración tipada
