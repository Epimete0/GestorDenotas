// backend/src/controllers/courseController.ts
import { Router, Request, Response, NextFunction } from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addAsignaturaToCourse,
  removeAsignaturaFromCourse,
  getCoursesByProfesor,
} from "../services/courseService";

const router = Router();

// GET /api/courses - Obtener todos los cursos
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await getAllCourses();
    res.json({ courses });
  } catch (err) {
    next(err);
  }
});

// GET /api/courses/:id - Obtener curso por ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const course = await getCourseById(id);
    res.json({ course });
  } catch (err) {
    next(err);
  }
});

// POST /api/courses - Crear nuevo curso
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, jefeId } = req.body;
    const nuevoCurso = await createCourse({
      nombre,
      jefeId: Number(jefeId),
    });
    res.status(201).json({ course: nuevoCurso });
  } catch (err) {
    next(err);
  }
});

// PUT /api/courses/:id - Actualizar curso
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { nombre, jefeId } = req.body;
    const cursoActualizado = await updateCourse(id, {
      nombre,
      jefeId: jefeId ? Number(jefeId) : undefined,
    });
    res.json({ course: cursoActualizado });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/courses/:id - Eliminar curso
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await deleteCourse(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// POST /api/courses/:id/asignaturas - Agregar asignatura al curso
router.post("/:id/asignaturas", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cursoId = Number(req.params.id);
    const { asignaturaId } = req.body;
    await addAsignaturaToCourse(cursoId, Number(asignaturaId));
    res.status(201).json({ message: "Asignatura agregada al curso" });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/courses/:id/asignaturas/:asignaturaId - Remover asignatura del curso
router.delete("/:id/asignaturas/:asignaturaId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cursoId = Number(req.params.id);
    const asignaturaId = Number(req.params.asignaturaId);
    await removeAsignaturaFromCourse(cursoId, asignaturaId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// GET /api/courses/profesor/:profesorId - Obtener cursos donde el profesor es jefe
router.get("/profesor/:profesorId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profesorId = Number(req.params.profesorId);
    const cursos = await getCoursesByProfesor(profesorId);
    res.json({ cursos });
  } catch (err) {
    next(err);
  }
});

export default router;
