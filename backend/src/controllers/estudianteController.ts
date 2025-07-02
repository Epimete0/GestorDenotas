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
import { prisma } from "../config/prisma";
import { createError } from "../config/errors";

const router = Router();

// GET /api/estudiantes - Obtener todos los estudiantes
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const estudiantes = await getAllEstudiantes();
    res.json({ 
      success: true,
      data: { estudiantes } 
    });
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
    res.json({ 
      success: true,
      data: { estudiantes: estudiantesDelCurso } 
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/estudiantes/enrollments - Inscribir estudiante en curso
router.post("/enrollments", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId, courseId } = req.body;
    if (!studentId || !courseId) {
      next(createError.validation('studentId y courseId son requeridos'));
      return;
    }
    // Actualizar el cursoId del estudiante
    const actualizado = await updateEstudiante(studentId, { cursoId: courseId });
    res.status(200).json({ 
      success: true,
      data: { 
        enrollment: { studentId, courseId }, 
        estudiante: actualizado 
      }
    });
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
    res.status(201).json({ 
      success: true,
      data: { estudiante: nuevoEstudiante } 
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/estudiantes/:id/cursos - Obtener cursos de un estudiante
router.get("/:id/cursos", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const estudianteId = Number(req.params.id);
    
    const estudiante = await prisma.estudiante.findUnique({
      where: { id: estudianteId },
      include: {
        curso: {
          include: {
            jefeDeCurso: true
          }
        }
      }
    });

    if (!estudiante) {
      next(createError.notFound('Estudiante no encontrado'));
      return;
    }

    // Para este ejemplo, el estudiante solo tiene un curso
    const cursos = [estudiante.curso];
    
    res.json({ 
      success: true,
      data: { cursos } 
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/estudiantes/:id/calificaciones - Obtener calificaciones de un estudiante
router.get("/:id/calificaciones", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const estudianteId = Number(req.params.id);
    
    const calificaciones = await prisma.calificacion.findMany({
      where: { estudianteId },
      include: {
        asignatura: true,
        profesor: true
      }
    });
    
    res.json({ 
      success: true,
      data: { calificaciones } 
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/estudiantes/:id - Obtener estudiante por ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const estudiante = await getEstudianteById(id);
    res.json({ 
      success: true,
      data: { estudiante } 
    });
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
    res.json({ 
      success: true,
      data: { estudiante: estudianteActualizado } 
    });
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
