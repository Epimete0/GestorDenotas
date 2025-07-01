// backend/src/controllers/gradeController.ts
import { Router, Request, Response, NextFunction } from "express";
import {
  addGrade,
  getGrades,
  getAllGrades,
  getGradeById,
  updateGrade,
  deleteGrade,
  getGradesByAsignatura,
  getGradesByProfesor,
  getEstadisticasCalificaciones,
} from "../services/gradeService";

const router = Router();

// POST /api/grades - Crear nueva calificación
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { estudianteId, asignaturaId, profesorId, valor } = req.body;
    const nuevaNota = await addGrade(
      Number(estudianteId),
      Number(asignaturaId),
      Number(profesorId),
      Number(valor)
    );
    res.status(201).json({ calificacion: nuevaNota });
  } catch (err) {
    next(err);
  }
});

// GET /api/grades - Obtener todas las calificaciones
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const calificaciones = await getEstadisticasCalificaciones();
    res.json({ estadisticas: calificaciones });
  } catch (err) {
    next(err);
  }
});

// GET /api/grades/all - Obtener todas las calificaciones (lista completa)
router.get("/all", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const calificaciones = await getAllGrades();
    res.json({ calificaciones });
  } catch (err) {
    next(err);
  }
});

// GET /api/grades/:estudianteId - Obtener calificaciones por estudiante
router.get(
  "/estudiante/:estudianteId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const estudianteId = Number(req.params.estudianteId);
      const notas = await getGrades(estudianteId);
      res.json({ calificaciones: notas });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/grades/asignatura/:asignaturaId - Obtener calificaciones por asignatura
router.get(
  "/asignatura/:asignaturaId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const asignaturaId = Number(req.params.asignaturaId);
      const notas = await getGradesByAsignatura(asignaturaId);
      res.json({ calificaciones: notas });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/grades/profesor/:profesorId - Obtener calificaciones por profesor
router.get(
  "/profesor/:profesorId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profesorId = Number(req.params.profesorId);
      const notas = await getGradesByProfesor(profesorId);
      res.json({ calificaciones: notas });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/grades/id/:id - Obtener calificación por ID
router.get(
  "/id/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const calificacion = await getGradeById(id);
      res.json({ calificacion });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/grades/:id - Actualizar calificación
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { valor, asignaturaId, profesorId } = req.body;
    const calificacionActualizada = await updateGrade(id, {
      valor: valor ? Number(valor) : undefined,
      asignaturaId: asignaturaId ? Number(asignaturaId) : undefined,
      profesorId: profesorId ? Number(profesorId) : undefined,
    });
    res.json({ calificacion: calificacionActualizada });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/grades/:id - Eliminar calificación
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await deleteGrade(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
