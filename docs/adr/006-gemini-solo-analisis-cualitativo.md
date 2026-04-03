# ADR-006: Gemini API Solo para Análisis Cualitativo

## Estado

Aceptado

## Fecha

2026-04-02

## Contexto

El sistema integra Gemini API como componente de inteligencia artificial. Es necesario definir con precisión **qué tareas se delegan al LLM y cuáles no**, para controlar costos, latencia, determinismo y exposición de datos.

La extracción de datos estructurados de los PDFs se resuelve con un parser determinístico (ver ADR-005). Esta decisión define el alcance de Gemini.

## Decisión

Usar **Gemini API exclusivamente** para las siguientes tareas de análisis cualitativo:

1. **Resumen de evaluaciones**: generar síntesis narrativa de los comentarios cualitativos de una evaluación
2. **Análisis de sentimiento y temas**: identificar temas recurrentes, fortalezas y áreas de mejora en los comentarios
3. **Generación de embeddings**: crear representaciones vectoriales de las evaluaciones para búsqueda semántica
4. **Consultas inteligentes**: responder preguntas en lenguaje natural sobre el corpus de evaluaciones (e.g., "¿Cuáles son las quejas más comunes en el departamento de Matemáticas?")

Gemini **NO** se usa para:

- Extracción de datos estructurados de PDFs (parser determinístico)
- Validación de datos (Pydantic schemas)
- Generación de reportes numéricos (SQL aggregations)
- Toma de decisiones sobre docentes

## Justificación

| Criterio                                       | Parser determinístico                   | Gemini API                                     |
| ---------------------------------------------- | --------------------------------------- | ---------------------------------------------- |
| Datos estructurados (nombre, puntaje, materia) | Ideal: rápido, determinístico, gratuito | Innecesario y riesgoso (no determinístico)     |
| Comentarios cualitativos (resumen, temas)      | No aplica: texto libre sin estructura   | Ideal: comprensión de lenguaje natural         |
| Embeddings para búsqueda semántica             | No aplica                               | Ideal: representación vectorial de significado |
| Consultas en lenguaje natural                  | No aplica                               | Ideal: interpretación de intent del usuario    |

Esta separación sigue el principio: **usar la herramienta correcta para cada tarea**.

## Consecuencias

### Positivas

- **Costos controlados**: Gemini se invoca solo para análisis, no para cada PDF. Ratio estimado: 1 llamada por evaluación (análisis) + 1 por consulta del usuario
- **Fallo graceful**: si Gemini no está disponible, el sistema sigue funcionando para carga, listado y reportes numéricos. Solo el análisis cualitativo se encola para después
- **Datos mínimos expuestos**: solo se envía texto de comentarios cualitativos a Gemini, nunca el PDF completo ni datos personales de docentes
- **Resultados cacheables**: el análisis de una evaluación se guarda en PostgreSQL. No se re-invoca Gemini para la misma evaluación
- **Pipeline desacoplado**: el análisis con Gemini es una tarea Celery independiente. Puede fallar y reintentarse sin afectar el parseo

### Negativas

- Requiere diseño cuidadoso de prompts para obtener respuestas estructuradas (JSON)
- Las respuestas de Gemini pueden variar entre invocaciones para la misma entrada
- Dependencia de un servicio externo para features de IA

### Mitigación

- **Prompts versionados**: los prompts se definen como templates en código, no inline. Se versionan junto con el código
- **Schema de salida estricto**: la respuesta de Gemini se valida con un Pydantic schema. Si no cumple, se reintenta o se marca como fallida
- **Modelo fijo**: usar un modelo específico (e.g., `gemini-2.0-flash`) en la configuración, no "latest"
- **Tests de integración**: un test verifica que la respuesta de Gemini para un input conocido cumple el schema esperado
- **Caché en PostgreSQL**: una evaluación analizada no se re-procesa. El resultado persiste en la tabla `evaluaciones`
