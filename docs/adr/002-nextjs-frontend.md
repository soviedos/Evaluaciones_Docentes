# ADR-002: Next.js como Framework Frontend

## Estado

Aceptado

## Fecha

2026-04-02

## Contexto

Se necesita un framework web para construir la interfaz de usuario de la plataforma. Los candidatos evaluados fueron **Next.js** (React) y **Astro** (multi-framework, orientado a contenido).

La plataforma es una aplicación interna de gestión con formularios de carga, tablas interactivas, filtros dinámicos y dashboards. No es un sitio de contenido estático ni un blog.

## Decisión

Usar **Next.js 14 con App Router y TypeScript** como framework frontend.

## Alternativa descartada: Astro

Astro es excelente para sitios orientados a contenido con mínimo JavaScript. Sin embargo:

- Su modelo de **islands architecture** está optimizado para páginas mayormente estáticas con interactividad aislada. Nuestra app es interactiva en su totalidad (upload con progreso, tablas con filtros, polling de estado, gráficas)
- Astro no tiene soporte nativo para layouts anidados persistentes como los route groups de Next.js (`(dashboard)/layout.tsx`)
- El ecosistema de componentes React (bibliotecas de tablas, gráficos, formularios) es significativamente más amplio y maduro
- Next.js ofrece Server Components y streaming nativos, lo que permite renderizado parcial sin sacrificar interactividad
- La comunidad y documentación de Next.js para aplicaciones tipo dashboard es vastamente superior

## Consecuencias

### Positivas

- App Router permite organización MPA natural con route groups y layouts compartidos
- Server Components reducen JavaScript enviado al cliente sin esfuerzo adicional
- Ecosistema React completo disponible (Recharts, TanStack Table, React Hook Form)
- TypeScript first-class con inferencia automática de tipos en rutas
- Amplia base de conocimiento para el equipo y para herramientas de IA (Copilot)

### Negativas

- Bundle más pesado que Astro para páginas simples
- Curva de aprendizaje del App Router y la distinción Server/Client Components
- Dependencia del ecosistema Vercel (mitigado al ser self-hosted)

### Mitigación

- Self-hosted con Docker, sin dependencia de Vercel
- Documentar convenciones de Server vs Client Components en el README del frontend
