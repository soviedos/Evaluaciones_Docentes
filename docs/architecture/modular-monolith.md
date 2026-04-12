# Arquitectura Modular

Documentación de la arquitectura del monolito modular `cenfotec-gestion-academica`.

## Módulos

| Módulo             | Backend                                   | Frontend                                    | Estado       |
| ------------------ | ----------------------------------------- | ------------------------------------------- | ------------ |
| Evaluación Docente | `backend/app/modules/evaluacion_docente/` | `frontend/src/features/evaluacion-docente/` | Implementado |
| Auth               | —                                         | `frontend/src/features/auth/`               | Scaffolding  |
| Dashboard          | —                                         | `frontend/src/features/dashboard/`          | Scaffolding  |

## Shared Kernel

Código transversal en `backend/app/shared/`: config, base entities, exceptions, DB engine.

## Principios

1. Cada módulo es un bounded context independiente
2. Los módulos se comunican a través del shared kernel, no entre sí directamente
3. Cada módulo tiene su propio router, servicios, entidades y repositorios
4. La base de datos es compartida pero cada módulo gestiona sus propias tablas
