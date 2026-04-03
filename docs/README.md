# Documentación — Evaluaciones Docentes

> Índice centralizado de toda la documentación técnica del proyecto.

---

## Documentos Disponibles

| Documento                            | Descripción                                                             | Audiencia                          |
| ------------------------------------ | ----------------------------------------------------------------------- | ---------------------------------- |
| [architecture.md](architecture.md)   | Arquitectura del sistema, diagrama de componentes y decisiones técnicas | Desarrolladores, Arquitectos       |
| [api-contracts.md](api-contracts.md) | Especificación de endpoints de la API REST (request/response)           | Desarrolladores Frontend y Backend |
| [deployment.md](deployment.md)       | Guía de despliegue on-premise con Docker Compose                        | DevOps, Administradores            |
| [adr/](adr/)                         | Registros de decisiones arquitectónicas (ADR)                           | Todo el equipo                     |

---

## Architecture Decision Records (ADR)

Los ADR documentan el **porqué** de cada decisión técnica significativa. Seguimos el formato [MADR](https://adr.github.io/madr/).

| ADR                        | Título                                | Estado   |
| -------------------------- | ------------------------------------- | -------- |
| [001](adr/001-monorepo.md) | Usar monorepo para frontend + backend | Aceptada |

Para crear un nuevo ADR, copiar la plantilla y usar el siguiente número consecutivo:

```bash
cp docs/adr/001-monorepo.md docs/adr/NNN-titulo-descriptivo.md
```

---

## Convenciones de Documentación

- Escribir en **español** (código y variables en inglés)
- Usar Markdown estándar compatible con GitHub
- Incluir diagramas en formato ASCII o Mermaid cuando sea posible
- Actualizar este índice al agregar nuevos documentos
- Los documentos deben incluir fecha de última actualización

---

## Pendientes de Documentación

- [ ] Guía de onboarding para nuevos desarrolladores
- [ ] Modelo de datos y diagrama ER
- [ ] Guía de integración con Gemini API
- [ ] Runbook de operaciones y troubleshooting
