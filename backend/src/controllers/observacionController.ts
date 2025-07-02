import { Router, Request, Response, NextFunction } from "express";
import { observacionService } from "../services/observacionService";

const router = Router();

// GET /api/observaciones - Obtener todas las observaciones
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const observaciones = await observacionService.findAll();
    res.json({ 
      success: true,
      data: { observaciones } 
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/observaciones/:id - Obtener observación por ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const observacion = await observacionService.findById(id);
    res.json({ 
      success: true,
      data: { observacion } 
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/observaciones - Crear nueva observación
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { estudianteId, profesorId, texto, estado } = req.body;
    const nueva = await observacionService.create({
      estudianteId: Number(estudianteId),
      profesorId: Number(profesorId),
      texto,
      estado,
    });
    res.status(201).json({ 
      success: true,
      data: { observacion: nueva } 
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/observaciones/:id - Actualizar observación
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { texto, estado } = req.body;
    const observacionActualizada = await observacionService.update(id, {
      texto,
      estado,
    });
    res.json({ 
      success: true,
      data: { observacion: observacionActualizada } 
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/observaciones/:id - Eliminar observación
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await observacionService.delete(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// GET /api/observaciones/estudiante/:estudianteId - Obtener observaciones por estudiante
router.get("/estudiante/:estudianteId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const estudianteId = Number(req.params.estudianteId);
    const observaciones = await observacionService.findByEstudiante(estudianteId);
    res.json({ 
      success: true,
      data: { observaciones } 
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/observaciones/profesor/:profesorId - Obtener observaciones por profesor
router.get("/profesor/:profesorId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profesorId = Number(req.params.profesorId);
    const observaciones = await observacionService.findByProfesor(profesorId);
    res.json({ 
      success: true,
      data: { observaciones } 
    });
  } catch (err) {
    next(err);
  }
});

export default router; 