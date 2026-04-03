# ADR-001: Monorepo

## Estado

Aceptado

## Contexto

Necesitamos decidir si el frontend (Next.js) y el backend (FastAPI) viven en un solo repositorio o en repos separados.

## Decisión

Usar un monorepo con carpetas `frontend/` y `backend/` en la raíz.

## Consecuencias

### Positivas

- Un solo PR puede incluir cambios coordinados frontend + backend
- Docker Compose referencia ambos servicios desde un contexto común
- CI/CD se simplifica con un solo pipeline
- Compartir tipos/contratos es más natural

### Negativas

- El repositorio crecerá más rápido
- CI debe ser inteligente para no correr todos los tests si solo cambia un lado

### Mitigación

- Usar paths filter en la CI para ejecutar solo los jobs afectados
- Mantener cada lado con su propio `package.json` / `pyproject.toml` independiente
