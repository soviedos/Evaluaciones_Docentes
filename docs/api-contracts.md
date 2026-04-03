# Contratos de API

Base URL: `http://localhost:8000/api/v1`

## Health Check

```
GET /health
Response: { "status": "ok", "version": "0.1.0" }
```

## Documentos

```
GET    /api/v1/documentos/          Lista documentos
POST   /api/v1/documentos/          Sube un PDF (multipart/form-data)
GET    /api/v1/documentos/{id}      Detalle de documento
DELETE /api/v1/documentos/{id}      Elimina documento
```

## Evaluaciones

```
GET    /api/v1/evaluaciones/                Lista evaluaciones (paginado, filtros)
GET    /api/v1/evaluaciones/{id}            Detalle de evaluación
GET    /api/v1/evaluaciones/{id}/analisis   Resultado del análisis IA
```

## Reportes

```
GET    /api/v1/reportes/resumen             Métricas generales
GET    /api/v1/reportes/por-docente         Agregado por docente
GET    /api/v1/reportes/por-periodo         Agregado por periodo
```

> **Nota**: Estos contratos son preliminares y se irán definiendo conforme avance la implementación.
