# GestorDeNotas: Plataforma de Gestión Escolar

**GestorDeNotas** es una solución integral para la administración escolar, permitiendo gestionar estudiantes, cursos, profesores, calificaciones, asistencia, observaciones y reportes. Incluye frontend minimalista en React + TypeScript y backend robusto en Node.js + Express + Prisma + SQLite.

---

## 📦 Estructura del Proyecto

```
GestorDenotas-master/
├── backend/         # API REST, lógica de negocio y base de datos
│   ├── src/        # Código fuente (Express, Prisma, controladores, servicios, repositorios)
│   ├── prisma/     # Esquema, migraciones y seed de la base de datos
│   └── ...         # Configuración y dependencias
├── frontend/        # Cliente web (React + Vite + TypeScript)
│   ├── src/        # Componentes, páginas, servicios, contextos y tests
│   └── ...         # Configuración y dependencias
└── README.md        # Esta guía
```

---

## 🏗️ Arquitectura y Lógica de Roles

- **Frontend:** React (SPA), Vite, TypeScript, React Router, Context API para autenticación y roles.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, SQLite.
- **Roles:**
  - **Administrador:** Acceso total a gestión de cursos, inscripciones, estudiantes, reportes y usuarios.
  - **Profesor:** Acceso solo a sus cursos, estudiantes, calificaciones, asistencias y observaciones.
- **Autenticación:** Basada en tokens simples, gestionada en el backend y almacenada en localStorage en el frontend.
- **Patrones:** Repository, Service, Singleton, Factory, Strategy, Observer.

---

## 🚀 Frameworks y Librerías Usadas

### Frontend
- **React:** Construcción de interfaces de usuario reactivas y componentes reutilizables.
- **Vite:** Bundler ultrarrápido para desarrollo y producción.
- **TypeScript:** Tipado estático para mayor robustez y mantenibilidad.
- **React Router:** Navegación SPA y protección de rutas según rol.
- **jsPDF, jspdf-autotable:** Exportación de reportes y fichas a PDF.
- **xlsx:** Exportación de reportes a Excel.
- **Vitest:** Testing unitario y de integración.

### Backend
- **Express:** API RESTful, middlewares y control de rutas.
- **Prisma ORM:** Acceso y migración de base de datos relacional (SQLite).
- **TypeScript:** Seguridad de tipos y mejor DX.
- **dotenv:** Gestión de variables de entorno.

---

## 🧪 Testing: Cómo se hicieron y cómo probar

### Pruebas Automáticas
- **Vitest** en frontend (`src/tests/`):
  - Ejemplo: test unitario de servicios API y test de integración de exportación de ficha.
  - Ejecuta: `npx vitest run`
  - Resultado esperado: todos los tests pasan.

### Pruebas Manuales
- **Checklist** (ver sección anterior):
  - Login/logout, rutas protegidas, CRUD, exportaciones, feedback de errores, modo oscuro, etc.
- **Cómo se identifican errores:**
  - El frontend muestra mensajes claros y minimalistas ante errores de login, inscripción, formularios y acciones fallidas.
  - El backend retorna errores HTTP con mensajes descriptivos (ej: campos requeridos, duplicados, no encontrado).
  - Se recomienda revisar la consola del navegador y del backend para detalles técnicos.

---

## 👤 Guía de Usuario: ¿Cómo usar la app?

1. **Login:**
   - Ingresa con las credenciales demo (ver abajo) o con un usuario real.
   - El sistema detecta tu rol y muestra solo las opciones relevantes.

2. **Navegación:**
   - El menú lateral te permite acceder a Dashboard, Estudiantes, Calificaciones, Asistencia, Resumen, Cursos (admin), Inscripción (admin) y Calendario.
   - El modo oscuro se activa/desactiva desde el menú.

3. **Dashboard:**
   - Visualiza un resumen de tus cursos, estudiantes, asistencias y calificaciones.
   - Acceso rápido a las principales acciones según tu rol.

4. **Estudiantes:**
   - Lista de estudiantes con búsqueda y acceso a la ficha completa.
   - Desde la ficha puedes ver calificaciones, asistencias, observaciones y exportar todo a PDF.
   - Los profesores pueden agregar, editar y eliminar observaciones.

5. **Cursos y Asignaturas:**
   - Solo el admin puede gestionar cursos y asignaturas.
   - Visualiza detalles y estudiantes inscritos.

6. **Calificaciones y Asistencia:**
   - Gestiona y visualiza calificaciones y asistencias de tus estudiantes.
   - Exporta reportes a PDF o Excel.

7. **Inscripción:**
   - Solo el admin puede inscribir estudiantes en cursos.
   - El sistema valida y muestra feedback inmediato.

8. **Resumen Académico:**
   - Consulta estadísticas globales y top de asignaturas.
   - Exporta el resumen a PDF o Excel.

9. **Errores y Feedback:**
   - Todos los formularios y acciones muestran mensajes claros en caso de error o éxito.
   - El diseño es minimalista y enfocado en la usabilidad.

---

## 👤 Credenciales Demo

- **Administrador**
  - Email: `admin@demo.com`
  - Contraseña: `123456`
- **Profesor 1**
  - Email: `profesor1@demo.com`
  - Contraseña: `123456`
- **Profesor 2**
  - Email: `profesor2@demo.com`
  - Contraseña: `123456`

---

## 🛠️ Troubleshooting y Buenas Prácticas
- Si tienes errores de Prisma, ejecuta:
  - `npx prisma generate`
  - `npx prisma migrate dev`
- Si el frontend no compila, revisa las importaciones y ejecuta `npm run build` para ver detalles.
- Si algún endpoint falla, revisa la consola del backend para mensajes de error.
- El código sigue buenas prácticas de TypeScript, Express y React.

---

## 📄 Documentación y Arquitectura
- Consulta `Arquidiseño.md` para detalles de arquitectura y decisiones de diseño.
- El código está documentado y sigue buenas prácticas de TypeScript y Express.

---

> Proyecto desarrollado por Epimete0 y colaboradores. ¡Contribuciones bienvenidas!
