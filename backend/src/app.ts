// backend/src/app.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./config/prisma";
import { formatErrorResponse, AppErrorClass } from "./config/errors";

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

// Manejador de errores mejorado
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("💥 Error en el servidor:", err);
  
  const errorResponse = formatErrorResponse(err);
  const statusCode = err instanceof AppErrorClass ? err.statusCode : 500;
  
  res.status(statusCode).json(errorResponse);
});

// Arranque del servidor solo si no es importado (para testing)
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
  });
}

export default app;
