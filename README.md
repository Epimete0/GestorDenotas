GestorDenotas: Plataforma de Gestión Escolar
GestorDenotas es una solución de código abierto diseñada para facilitar la administración integral de establecimientos educativos: estudiantes, cursos, asignaturas, calificaciones, asistencia y reportes.

📁 Estructura del proyecto
graphql
Copiar
Editar
GestorDenotas/
├── Arquidiseño.md            # Documentación de diseño de arquitectura
├── .gitignore                # Archivos ignorados por Git
├── backend/                  # API y lógica de negocio (Node.js + Express)
│   ├── prisma/               # Esquema, migraciones y seed de la BD
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.ts     # Singleton de Prisma Client
│   │   ├── controllers/      # Rutas Express (courses, grades, estudiantes, summary…)
│   │   ├── repositories/     # CRUD con Prisma
│   │   ├── services/         # Lógica de negocio
│   │   └── app.ts            # Configuración del servidor y montaje de rutas
│   └── package.json          # Dependencias y scripts del backend
├── frontend/                 # Cliente web (React + Vite + TypeScript)
│   ├── public/               # Archivos estáticos
│   ├── src/
│   │   ├── assets/           # Imágenes, SVGs
│   │   ├── components/       # Layout, Nav, Cards…
│   │   ├── pages/            # Vistas: Dashboard, Cursos, Inscripción…
│   │   ├── services/         # Cliente HTTP (api.ts)
│   │   ├── App.tsx           # Rutas y componente raíz
│   │   ├── index.css         # Reset y estilos base
│   │   └── main.tsx          # Montaje del `<App/>`
│   └── package.json          # Dependencias y scripts del frontend
└── docker-compose.yml        # (Opcional) Despliegue con Docker
🏛️ Arquitectura
Capas (N-Tier)
Presentación

React + Vite (UI minimalista, React Router).

API / Servicio

Node.js + Express + TypeScript. Rutas REST en controllers/.

Negocio

Servicios en services/ que orquestan repositorios.

Persistencia

Repositorios en repositories/ usan Prisma Client.

Modelo 4+1 Vistas
Lógica: Diagramas UML de entidades (Estudiante, Curso, Asignatura, Calificación, Asistencia, Observación).

Desarrollo: Estructura de módulos y carpetas (descrita arriba).

Procesos: Flujo de peticiones HTTP, middlewares (CORS, JSON, manejo de errores).

Física: Diseño de despliegue con Docker Compose.

Escenarios: Secuencias de uso (inscripción, registrar nota, reportes).

🛠️ Patrones de Diseño
Repository: CRUD encapsulado en repositories/.

Service: Lógica de negocio en services/.

Singleton: Prisma Client en config/prisma.ts.

Factory Method: (Futuro) generación de reportes PDF/Excel.

Strategy: Cálculo de métricas intercambiables.

Observer: (Futuro) notificaciones ante eventos.

🚀 Tecnologías Principales
Capa	Herramientas
Frontend	React, Vite, TypeScript, React Router
Backend	Node.js, Express, TypeScript, Prisma
DB	SQLite (desarrollo) / PostgreSQL (prod)
Testing	Jest, Supertest, React Testing Library
DevOps	Docker, Docker Compose, GitHub Actions

⚙️ Guía de Inicio Rápido
Clonar el repositorio

bash
Copiar
Editar
git clone https://github.com/Epimete0/GestorDenotas.git
cd GestorDenotas
Backend

bash
Copiar
Editar
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init_esquema
npx prisma db seed
npm run dev   # Servidor en http://localhost:4000
Frontend

bash
Copiar
Editar
cd ../frontend
npm install
npm run dev   # Cliente en http://localhost:5173
Pruebas

bash
Copiar
Editar
# Backend
cd backend && npm test

# Frontend
cd ../frontend && npm test
Despliegue con Docker (opcional)

bash
Copiar
Editar
docker-compose up --build
🔄 Flujo de Trabajo Git
Crear rama nueva

bash
Copiar
Editar
git checkout -b feature/mi-feature
Commits atómicos

bash
Copiar
Editar
git add . && git commit -m "feat: descripción breve"
Push & Pull Request a main/master

📄 Licencia
Este proyecto está bajo la licencia MIT. Consulta LICENSE.md para más detalles.

Creado con ♥ por Epimete0







