# ADR-005: Parser Determinístico para Extracción de PDFs

## Estado

Aceptado

## Fecha

2026-04-02

## Contexto

Los PDFs de evaluaciones docentes tienen un **formato homogéneo y conocido**: misma estructura, mismos campos, misma disposición visual. Se necesita extraer datos estructurados (nombre del docente, materia, periodo, puntajes, comentarios) de estos documentos.

Las opciones evaluadas fueron:

1. **Parser determinístico** (PyMuPDF/fitz): extraer texto por posición y estructura conocida
2. **LLM para extracción** (Gemini): enviar el texto crudo a un LLM y pedirle que extraiga campos

## Decisión

Usar un **parser determinístico con PyMuPDF (fitz)** como método primario de extracción de datos de los PDFs. El LLM (Gemini) se reserva exclusivamente para análisis cualitativo (ver ADR-006).

## Alternativa descartada: LLM para extracción

Usar Gemini para extraer campos estructurados de cada PDF presenta problemas serios:

- **No determinístico**: la misma entrada puede producir salidas ligeramente distintas entre invocaciones. Un campo "Juan Pérez" podría volver como "Pérez, Juan" o "Prof. Juan Pérez" sin control
- **Costo por documento**: cada PDF requeriría una llamada a la API. Con miles de evaluaciones por periodo, el costo y latencia se multiplican innecesariamente
- **Dependencia externa para operación crítica**: si Gemini tiene downtime, no se puede ni siquiera registrar los datos básicos de una evaluación
- **Overhead innecesario**: para campos con posición fija en un formato homogéneo, un parser regla-por-regla es más rápido, barato y confiable

## Consecuencias

### Positivas

- **Determinismo**: la misma entrada siempre produce la misma salida. Los datos extraídos son verificables y reproducibles
- **Velocidad**: PyMuPDF procesa un PDF en milisegundos vs. segundos de una llamada a LLM
- **Costo cero por documento**: sin llamadas a API externa para la extracción
- **Sin dependencia de red**: funciona 100% offline, ideal para on-prem
- **Testeable**: se puede escribir un test unitario que verifique campo por campo con un PDF fixture
- **Auditabilidad**: cada regla de extracción es explícita y revisable en código

### Negativas

- Requiere desarrollo inicial del parser con reglas específicas para el formato actual
- Si el formato del PDF cambia, el parser debe actualizarse manualmente
- No maneja variaciones inesperadas en la estructura

### Mitigación

- Validación post-extracción con Pydantic: si un campo obligatorio falta, el documento se marca como "requiere revisión"
- Log detallado de campos no encontrados para detectar cambios de formato tempranamente
- El parser se diseña con el formato como configuración (no hardcoded), facilitando ajustes
- Versionado del parser alineado con versiones del formato de PDF
