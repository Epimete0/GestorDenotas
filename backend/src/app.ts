// backend/src/app.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./config/prisma";

// Importa TODOS tus controllers, incluido el de summary:
import courseController from "./controllers/courseController";
import gradeController from "./controllers/gradeController";
import estudianteController from "./controllers/estudianteController";
import summaryController from "./controllers/summaryController"; // ← Aquí

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

// Montaje de rutas
app.use("/api/courses", courseController);
app.use("/api/grades", gradeController);
app.use("/api/estudiantes", estudianteController);

// **Aquí montamos el nuevo resumen justo antes del handler de errores**
app.use("/api/summary", summaryController);

// Manejador de errores
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("💥 Error en el servidor:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Arranque del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
