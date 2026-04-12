# Shared Kernel

Código transversal reutilizado por todos los módulos de la plataforma.

## Contenido

| Carpeta                    | Responsabilidad                                          |
| -------------------------- | -------------------------------------------------------- |
| `core/`                    | Settings, cache, logging                                 |
| `domain/entities/`         | `Base`, `UUIDMixin`, `TimestampMixin`, enums compartidos |
| `domain/`                  | Exceptions base, invariants, periodo                     |
| `infrastructure/database/` | Engine async, session factory, migraciones Alembic       |

## Estado

Migración completada. Los directorios originales (`app/core/`, `app/domain/`, `app/infrastructure/`) funcionan como shims de compatibilidad que redirigen a las ubicaciones canónicas en `app/shared/`.
