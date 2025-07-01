// backend/src/app.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./config/prisma";

// Importa TODOS tus controllers:
import courseController from "./controllers/courseController";
import gradeController from "./controllers/gradeController";
import estudianteController from "./controllers/estudianteController";
import summaryController from "./controllers/summaryController";
import asignaturaController from "./controllers/asignaturaController";
import profesorController from "./controllers/profesorController";
import asistenciaController from "./controllers/asistenciaController";
import authRoutes from "./routes/authRoutes";
import observacionController from "./controllers/observacionController";
import { updateEstudiante } from "./services/estudianteService";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Bienvenido al Backend del Sistema de Gestión Escolar");
});

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "OK" });
});

// Test de Prisma (lista de estudiantes)
app.get(
  "/api/test",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const estudiantes = await prisma.estudiante.findMany();
      res.json({ estudiantes });
    } catch (err) {
      next(err);
    }
  }
);

// Rutas de autenticación (públicas)
app.use("/api/auth", authRoutes);

// Rutas sin autenticación para pruebas
app.use("/api/courses", courseController);
app.use("/api/grades", gradeController);
app.use("/api/estudiantes", estudianteController);
app.use("/api/asignaturas", asignaturaController);
app.use("/api/profesores", profesorController);
app.use("/api/asistencias", asistenciaController);
app.use("/api/summary", summaryController);
app.use("/api/observaciones", observacionController);

// Manejador de errores
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("💥 Error en el servidor:", err);
  
  // En desarrollo, mostrar más detalles del error
  if (process.env.NODE_ENV === 'development') {
    res.status(500).json({ 
      error: "Internal server error",
      message: err.message,
      stack: err.stack
    });
  } else {
  res.status(500).json({ error: "Internal server error" });
  }
});

// Arranque del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
