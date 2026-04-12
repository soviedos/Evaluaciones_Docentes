# Frontend — Gestión Académica

> Aplicación web construida con Next.js 16 y TypeScript, usando App Router en formato MPA. Cada módulo académico se organiza como feature en `src/features/<nombre>/` con componentes, hooks, utilidades y tipos propios.

---

## Stack

| Tecnología                                      | Uso                               |
| ----------------------------------------------- | --------------------------------- |
| [Next.js 16](https://nextjs.org/)               | Framework React 19 con App Router |
| [TypeScript 6](https://www.typescriptlang.org/) | Tipado estático                   |
| [Tailwind CSS 4](https://tailwindcss.com/)      | Estilos utilitarios               |
| [ESLint 9](https://eslint.org/)                 | Linting (flat config)             |
| [Vitest](https://vitest.dev/)                   | Tests unitarios                   |
| [PostCSS](https://postcss.org/)                 | Procesamiento de CSS              |

---

## Estructura de Carpetas

```
frontend/
├── public/                          → Archivos estáticos
├── src/
│   ├── app/                         → App Router (páginas MPA)
│   │   ├── (platform)/              → Grupo: plataforma principal
│   │   │   ├── dashboard/page.tsx   → Dashboard de plataforma
│   │   │   ├── evaluacion-docente/  → Módulo evaluación docente
│   │   │   │   ├── inicio/page.tsx  → Dashboard ejecutivo
│   │   │   │   ├── carga/page.tsx   → Subida de PDFs
│   │   │   │   ├── biblioteca/     → Biblioteca de documentos
│   │   │   │   ├── estadisticas/   → Analytics
│   │   │   │   ├── sentimiento/    → Análisis cualitativo
│   │   │   │   ├── consultas-ia/   → Consultas IA (RAG)
│   │   │   │   └── ...
│   │   │   └── layout.tsx           → Layout compartido (sidebar)
│   │   ├── login/page.tsx           → Página de login
│   │   ├── layout.tsx               → Layout raíz
│   │   └── page.tsx                 → Redirect a /dashboard
│   ├── features/
│   │   └── evaluacion-docente/      → Módulo: evaluación docente
│   │       ├── components/          → Componentes del módulo
│   │       ├── hooks/               → Hooks del módulo
│   │       ├── lib/                 → API clients y reglas de negocio
│   │       └── types/               → Tipos del módulo
│   ├── components/
│   │   ├── ui/                      → Componentes base (Button, Input, Card)
│   │   └── layout/                  → Navbar, Sidebar, Footer
│   ├── hooks/                       → Custom hooks compartidos
│   ├── lib/
│   │   ├── api-client.ts            → Wrapper HTTP para el backend
│   │   └── utils.ts                 → Funciones utilitarias
│   └── styles/
│       └── globals.css              → Estilos globales + Tailwind
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── package.json
├── Dockerfile
└── .env.local.example
```

---

## Desarrollo Local

### Requisitos

- Node.js 20+
- npm 10+ (o pnpm)

### Instalación

```bash
cd frontend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.local.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:3000`.

### Variables de Entorno

| Variable              | Descripción                    | Ejemplo                 |
| --------------------- | ------------------------------ | ----------------------- |
| `NEXT_PUBLIC_API_URL` | URL base de la API del backend | `http://localhost:8000` |

---

## Scripts Disponibles

```bash
npm run dev       # Servidor de desarrollo con hot reload
npm run build     # Build de producción
npm run start     # Servir build de producción
npm run lint      # ESLint
npm run type-check# Verificación de tipos TypeScript
```

---

## Convenciones

- **Páginas**: Archivo `page.tsx` dentro de carpeta con nombre de ruta
- **Componentes**: `PascalCase` para archivos y exportaciones (`EvaluacionCard.tsx`)
- **Hooks**: Prefijo `use` en `camelCase` (`useEvaluaciones.ts`)
- **Tipos**: Definidos en `src/types/` e importados por alias
- **Estilos**: Tailwind CSS inline, sin archivos CSS por componente
- **Fetching**: Server Components donde sea posible; `api-client.ts` para Client Components
