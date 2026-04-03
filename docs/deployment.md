# Despliegue

## Requisitos del Servidor

- Docker Engine 24+
- Docker Compose v2
- 8 GB RAM mínimo (16 GB recomendado)
- 50 GB almacenamiento SSD

## Variables de Entorno en Producción

Configurar en el servidor (NO en el repositorio):

```bash
# Base de datos
POSTGRES_USER=<usuario-seguro>
POSTGRES_PASSWORD=<contraseña-segura>

# MinIO
MINIO_ROOT_USER=<usuario-seguro>
MINIO_ROOT_PASSWORD=<contraseña-segura>

# App
SECRET_KEY=<clave-generada-con-openssl>
GEMINI_API_KEY=<api-key-de-google>
```

## Despliegue

```bash
# Construir y levantar
docker compose -f infra/docker/docker-compose.yml up -d --build

# Ejecutar migraciones
docker compose -f infra/docker/docker-compose.yml exec backend alembic upgrade head

# Verificar
curl http://localhost:8000/health
```

## Backups

```bash
# PostgreSQL
docker compose exec postgres pg_dump -U eval_user evaluaciones_docentes > backup.sql

# MinIO
# Los datos están en el volumen Docker `minio_data`
```
