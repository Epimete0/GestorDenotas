import { Router, Request, Response, NextFunction } from "express";
import {
  getAllAsignaturas,
  getAsignaturaById,
  createAsignatura,
  updateAsignatura,
  deleteAsignatura,
  addProfesorToAsignatura,
  removeProfesorFromAsignatura,
} from "../services/asignaturaService";

const router = Router();

// GET /api/asignaturas - Obtener todas las asignaturas
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const asignaturas = await getAllAsignaturas();
    res.json({ 
      success: true,
      data: { asignaturas } 
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/asignaturas/:id - Obtener asignatura por ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const asignatura = await getAsignaturaById(id);
    res.json({ 
      success: true,
      data: { asignatura } 
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/asignaturas - Crear nueva asignatura
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre } = req.body;
    const nuevaAsignatura = await createAsignatura({ nombre });
    res.status(201).json({ 
      success: true,
      data: { asignatura: nuevaAsignatura } 
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/asignaturas/:id - Actualizar asignatura
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { nombre } = req.body;
    const asignaturaActualizada = await updateAsignatura(id, { nombre });
    res.json({ 
      success: true,
      data: { asignatura: asignaturaActualizada } 
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/asignaturas/:id - Eliminar asignatura
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await deleteAsignatura(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// POST /api/asignaturas/:id/profesores - Agregar profesor a asignatura
router.post("/:id/profesores", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const asignaturaId = Number(req.params.id);
    const { profesorId } = req.body;
    await addProfesorToAsignatura(asignaturaId, profesorId);
    res.status(201).json({ 
      success: true,
      data: { message: "Profesor agregado a la asignatura" } 
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/asignaturas/:id/profesores/:profesorId - Remover profesor de asignatura
router.delete("/:id/profesores/:profesorId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const asignaturaId = Number(req.params.id);
    const profesorId = Number(req.params.profesorId);
    await removeProfesorFromAsignatura(asignaturaId, profesorId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
