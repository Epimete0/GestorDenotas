# GestorDenotas: Plataforma de Gestión Escolar

**GestorDenotas** es una solución de código abierto diseñada para facilitar la administración integral de establecimientos educativos: estudiantes, cursos, calificaciones, asistencia y reportes.

---

## 📁 Estructura del proyecto

```plaintext
GestorDenotas/
├── Arquidiseño.md            # Documentación de diseño de arquitectura
├── .gitignore                # Archivos ignorados por Git
├── backend/                  # API y lógica de negocio (Node.js + Express)
├── database/                 # Scripts SQL (schema.sql, seeds.sql)
├── frontend/                 # Cliente web (React + Vite + TypeScript)
│   ├── package.json          # Dependencias y scripts del frontend
│   ├── package-lock.json     # Lock de versiones de npm
│   ├── public/               # Archivos estáticos (vite.svg, etc.)
│   ├── README.md             # Guía específica de frontend
│   ├── tsconfig.app.json     # Configuración TypeScript para app
│   ├── tsconfig.json         # Configuración general TypeScript
│   ├── tsconfig.node.json    # Configuración TypeScript para Node tooling
│   ├── vite.config.ts        # Configuración de Vite
│   └── src/                  # Código fuente
│       ├── App.css           # Estilos globales
│       ├── App.tsx           # Componente raíz
│       ├── assets/           # Imágenes y SVGs
│       │   └── react.svg     # Logo React
│       ├── components/       # Componentes UI
│       │   ├── Layout.css    # Estilos de Layout
│       │   └── Layout.tsx    # Componente Layout
│       ├── index.css         # Estilos de entrypoint
│       ├── main.tsx          # Punto de entrada React
│       ├── pages/            # Vistas principales
│       │   ├── Asistencia.tsx/.css
│       │   ├── Calendar.tsx/.css
│       │   ├── Calificaciones.tsx/.css
│       │   ├── Cursos.tsx/.css
│       │   ├── Dashboard.tsx/.css
│       │   ├── Estudiantes.tsx/.css
│       │   ├── Home.tsx
│       │   ├── Inscripcion.tsx/.css
│       │   └── Resumen.tsx/.css
│       └── services/         # Cliente HTTP (api.ts)
└── deploy/                   # Docker y despliegue (opcional)
```

---

## 🏛️ Arquitectura

### Capas (N-Tier)

1. **Presentación**: Cliente React (`frontend/`)
2. **Servicio**: API Express (`backend/src/controllers` → expone rutas REST)
3. **Negocio**: Lógica central en `backend/src/services`
4. **Persistencia**: Repositorios (`backend/src/repositories`) y Prisma Client

### Modelo 4+1 Vistas (PlantUML en `docs/arquitectura_4plus1.md`)

* **Vista Lógica**: Diagrama de clases UML de entidades: `Estudiante`, `Curso`, `Calificación`, `Asistencia`.
* **Vista de Desarrollo**: Estructura de carpetas y módulos (como se describe en este README).
* **Vista de Procesos**: Flujo de peticiones HTTP, middlewares (autenticación, logging), y manejo de concurrencia.
* **Vista Física**: Diseño de despliegue con Docker Compose: contenedores separados para frontend, backend y DB.
* **Vista de Escenarios**: Diagramas de secuencia para casos de uso clave: inscripción de estudiante, generación de reporte.

---

## 🛠️ Patrones de Diseño

* **Repository**: Encapsula operaciones CRUD en carpetas `repositories/`.
* **Service**: Capa intermedia en `services/` que orquesta reglas de negocio.
* **Singleton**: Prisma Client instanciado una vez en `config/prisma.ts`.
* **Factory Method**: Generación de reportes (`ReportePDF`, `ReporteExcel`) que implementan una interfaz común.
* **Strategy**: Algoritmos de cálculo de estadísticas (promedio, mediana) intercambiables.
* **Observer**: Notificaciones ante eventos importantes (nuevo registro, ausencia crítica).

---

## 🚀 Tecnologías Principales

| Capa     | Herramientas                                 |
| -------- | -------------------------------------------- |
| Frontend | React, Vite, TypeScript, React Router        |
| Backend  | Node.js, Express, TypeScript, Prisma         |
| DB       | SQLite (dev)                                 |

---

## ⚙️ Guía de Inicio Rápido

1. **Clonar**:

   ```bash
   git clone https://github.com/Epimete0/GestorDenotas.git
   cd GestorDenotas
   ```
2. **Backend**:

   ```bash
   cd backend
   npm install
   cp .env.example .env
   npx prisma migrate dev
   npx prisma db seed
   npm run dev  # http://localhost:4000
   ```
3. **Frontend**:

   ```bash
   cd ../frontend
   npm install
   npm run dev  # http://localhost:3000
   ```

---

## 🔄 Flujo de Trabajo Git

1. Nueva rama: `git checkout -b feature/mi-feature`
2. Commit: `git add . && git commit -m "feat: descripción concisa"`
3. Push & PR: `git push -u origin feature/mi-feature`

---
---

> *Creado por Epimete0*.
