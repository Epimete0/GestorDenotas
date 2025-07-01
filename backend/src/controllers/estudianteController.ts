// backend/src/controllers/estudianteController.ts
import { Router, Request, Response, NextFunction } from "express";
import {
  getAllEstudiantes,
  getEstudianteById,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
} from "../services/estudianteService";
import { courseRepository } from "../repositories/courseRepository";

const router = Router();

// GET /api/estudiantes - Obtener todos los estudiantes
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const estudiantes = await getAllEstudiantes();
    res.json({ estudiantes });
  } catch (err) {
    next(err);
  }
});

// GET /api/estudiantes/curso/:cursoId - Obtener estudiantes por curso
router.get("/curso/:cursoId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cursoId = Number(req.params.cursoId);
    const estudiantes = await getAllEstudiantes();
    const estudiantesDelCurso = estudiantes.filter(estudiante => estudiante.cursoId === cursoId);
    res.json({ estudiantes: estudiantesDelCurso });
  } catch (err) {
    next(err);
  }
});

// POST /api/estudiantes/enrollments - Inscribir estudiante en curso
router.post("/enrollments", async (req: any, res: any, next: any) => {
  try {
    const { studentId, courseId } = req.body;
    if (!studentId || !courseId) {
      return res.status(400).json({ error: "studentId y courseId son requeridos" });
    }
    // Actualizar el cursoId del estudiante
    const actualizado = await updateEstudiante(studentId, { cursoId: courseId });
    res.status(200).json({ enrollment: { studentId, courseId }, estudiante: actualizado });
  } catch (err) {
    next(err);
  }
});

// GET /api/estudiantes/:id - Obtener estudiante por ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const estudiante = await getEstudianteById(id);
    res.json({ estudiante });
  } catch (err) {
    next(err);
  }
});

// POST /api/estudiantes - Crear nuevo estudiante
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, apellido, edad, sexo, cursoId } = req.body;
    const nuevoEstudiante = await createEstudiante({
      nombre,
      apellido,
      edad: Number(edad),
      sexo,
      cursoId: Number(cursoId),
    });
    res.status(201).json({ estudiante: nuevoEstudiante });
  } catch (err) {
    next(err);
  }
});

// PUT /api/estudiantes/:id - Actualizar estudiante
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { nombre, apellido, edad, sexo, cursoId } = req.body;
    const estudianteActualizado = await updateEstudiante(id, {
      nombre,
      apellido,
      edad: edad ? Number(edad) : undefined,
      sexo,
      cursoId: cursoId ? Number(cursoId) : undefined,
    });
    res.json({ estudiante: estudianteActualizado });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/estudiantes/:id - Eliminar estudiante
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await deleteEstudiante(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
