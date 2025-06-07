# GestorDenotas: Plataforma de Gestión Escolar

**GestorDenotas** es una solución de código abierto diseñada para facilitar la administración integral de establecimientos educativos: estudiantes, cursos, calificaciones, asistencia y reportes.

---

## 📁 Estructura del proyecto

```plaintext
GestorDenotas/
├── Arquidiseño.md              # Documentación de arquitectura y diseño UML
├── .gitignore                  # Configuración de archivos ignorados por Git
├── backend/                    # API y lógica de negocio (Node.js + Express + TypeScript)
│   ├── prisma/                 # ORM Prisma: esquema, migraciones y seeds
│   │   ├── migrations/         # Archivos de migración (Prisma Migrate)
│   │   ├── dev.db              # Base de datos SQLite para desarrollo
│   │   ├── schema.prisma       # Modelos y relaciones del dominio
│   │   └── seed.ts             # Script para poblar datos de prueba
│   ├── src/                    # Fuente del servidor
│   │   ├── config/             # Variables de entorno y cliente Prisma (Singleton)
│   │   │   ├── env.ts          # Validación y carga de .env
│   │   │   └── prisma.ts       # Exportación de instancia Prisma Client
│   │   ├── controllers/        # Rutas y controladores HTTP
│   │   ├── models/             # Interfaces y tipos de dominio
│   │   ├── repositories/       # Acceso a datos (Repository Pattern)
│   │   ├── services/           # Lógica de negocio (Service Layer)
│   │   └── app.ts              # Configuración de Express y middlewares
│   ├── .env                    # Variables sensibles (no versionar)
│   ├── .gitignore              # Ignorar node_modules, logs, .env
│   ├── package.json            # Dependencias y scripts del backend
│   └── tsconfig.json           # Configuración de TypeScript backend

├── database/                   # Scripts SQL para otros motores (opcionales)
│   ├── schema.sql              # Definición de tablas y relaciones
│   └── seeds.sql               # Población de datos de prueba

├── frontend/                   # Cliente web (React + Vite + TypeScript)
│   ├── public/                 # HTML y recursos estáticos
│   │   └── index.html          # Plantilla base
│   ├── src/                    # Código de la aplicación
│   │   ├── assets/             # Imágenes, SVGs y fuentes
│   │   ├── components/         # Componentes UI reutilizables
│   │   ├── pages/              # Vistas principales (Dashboard, Estudiantes,...)
│   │   ├── services/           # Cliente HTTP (axios/fetch) para la API
│   │   ├── App.tsx             # Componente raíz con rutas
│   │   └── main.tsx            # Bootstrap de React y Vite
│   ├── .gitignore              # Ignorar node_modules y artefactos de build
│   ├── package.json            # Dependencias y scripts del frontend
│   ├── tsconfig.json           # Configuración de TypeScript frontend
│   └── vite.config.ts          # Configuración de bundling y alias

├── deploy/                     # Docker y despliegue
│   ├── docker-compose.yml      # Definición de servicios (frontend, backend, DB)
│   ├── Dockerfile.backend      # Imagen Docker para API
│   └── Dockerfile.frontend     # Imagen Docker para cliente

├── tests/                      # Pruebas automatizadas
│   ├── backend/                # Jest + Supertest (servicios y controladores)
│   └── frontend/               # React Testing Library (componentes)

└── docs/                       # Documentación adicional
    ├── requisitos.md          # Requisitos funcionales y no funcionales
    ├── arquitectura_4plus1.md  # Modelo 4+1: Lógica, Desarrollo, Procesos, Física, Escenarios
    └── diseño_uml/             # Diagramas PlantUML (casos de uso, clases, secuencia)
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
| Frontend | React, Vite, TypeScript, Axios, React Router |
| Backend  | Node.js, Express, TypeScript, Prisma, Zod    |
| DB       | SQLite (dev) / PostgreSQL (prod)             |
| Testing  | Jest, Supertest, React Testing Library       |
| DevOps   | Docker, Docker Compose, GitHub Actions (CI)  |

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
4. **Tests**:

   ```bash
   # Backend
   cd backend && npm test
   # Frontend
   cd ../frontend && npm test
   ```
5. **Despliegue Docker**:

   ```bash
   docker-compose up --build
   ```

---

## 🔄 Flujo de Trabajo Git

1. Nueva rama: `git checkout -b feature/mi-feature`
2. Commit: `git add . && git commit -m "feat: descripción concisa"`
3. Push & PR: `git push -u origin feature/mi-feature`

---

## 🤝 Contribuciones

¡Tus aportes son bienvenidos! Sigue estas pautas:

1. Abre un *Issue* describiendo tu propuesta.
2. Crea un *branch* específico.
3. Realiza commits atómicos y claros.
4. Abre *Pull Request* apuntando a la rama `master` (o `main`).

---

## 📄 Licencia

Este proyecto está licenciado bajo MIT. Consulta el archivo `LICENSE.md` para detalles.

---

> *Creado con ♥ por Epimete0*.
