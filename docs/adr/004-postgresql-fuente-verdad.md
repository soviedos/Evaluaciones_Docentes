# ADR-004: PostgreSQL como Fuente de Verdad

## Estado

Aceptado

## Fecha

2026-04-02

## Contexto

Se necesita una base de datos para almacenar evaluaciones, docentes, documentos, usuarios y embeddings vectoriales. Los candidatos evaluados fueron **PostgreSQL**, **MySQL/MariaDB** y **MongoDB**.

Adicionalmente, el sistema requiere búsqueda por similitud semántica sobre embeddings generados a partir de las evaluaciones.

## Decisión

Usar **PostgreSQL 16 con la extensión pgvector** como base de datos única y fuente de verdad del sistema.

## Alternativas descartadas

### MySQL / MariaDB

- No tiene extensión nativa para vectores. Requeriría una base de datos vectorial separada (Pinecone, Weaviate), duplicando la infraestructura
- Menor soporte para tipos complejos (JSONB, arrays, rangos)
- Full-text search menos potente que `tsvector` de PostgreSQL

### MongoDB

- Modelo documental no aporta ventaja cuando la estructura de datos es relacional y conocida (docentes → evaluaciones → periodos)
- Transacciones multi-documento son más limitadas
- No hay equivalente nativo a pgvector integrado en el mismo motor

### Base vectorial separada (Pinecone, Weaviate, ChromaDB)

- Añade un servicio más a operar y mantener on-prem
- Requiere sincronización entre la base relacional y la vectorial
- pgvector resuelve el caso de uso con volúmenes esperados (< 1M registros)

## Consecuencias

### Positivas

- **Una sola base de datos** para datos estructurados y embeddings: menos infraestructura, menos sincronización
- **pgvector** permite consultas SQL + similaridad vectorial en un mismo query (`ORDER BY embedding <=> $1`)
- **JSONB** para almacenar respuestas semiestructuradas de Gemini sin rigidez de schema
- **Full-text search** nativo con `tsvector` para búsqueda por texto
- Ecosistema maduro: backups (pg_dump), monitoreo (pg_stat), replicación, particionamiento
- Compatible con SQLAlchemy 2.0 async vía `asyncpg`

### Negativas

- pgvector tiene rendimiento inferior a bases vectoriales dedicadas para volúmenes muy grandes (>10M vectores)
- Requiere tunear índices HNSW para consultas vectoriales eficientes
- La extensión pgvector debe instalarse explícitamente (se resuelve en `init.sql`)

### Mitigación

- Índice HNSW con parámetros configurables (`m`, `ef_construction`) según volumen real
- Particionamiento por periodo académico si el crecimiento lo requiere
- Monitoreo de query time en consultas vectoriales
- `init.sql` en Docker Compose instala pgvector automáticamente: `CREATE EXTENSION IF NOT EXISTS vector`
