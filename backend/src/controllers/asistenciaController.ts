import { Router, Request, Response, NextFunction } from "express";
import {
  getAllAsistencias,
  getAsistenciaById,
  getAsistenciasByEstudiante,
  getAsistenciasByFecha,
  createAsistencia,
  updateAsistencia,
  deleteAsistencia,
  getEstadisticasAsistencia,
} from "../services/asistenciaService";

const router = Router();

// GET /api/asistencias - Obtener todas las asistencias
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const asistencias = await getAllAsistencias();
    res.json({ 
      success: true,
      data: { asistencias } 
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/asistencias/estadisticas - Obtener estadísticas de asistencia
router.get("/estadisticas", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const estadisticas = await getEstadisticasAsistencia();
    res.json({ estadisticas });
  } catch (err) {
    next(err);
  }
});

// GET /api/asistencias/:id - Obtener asistencia por ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const asistencia = await getAsistenciaById(id);
    res.json({ 
      success: true,
      data: { asistencia } 
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/asistencias/estudiante/:estudianteId - Obtener asistencias por estudiante
router.get("/estudiante/:estudianteId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const estudianteId = Number(req.params.estudianteId);
    const asistencias = await getAsistenciasByEstudiante(estudianteId);
    res.json({ 
      success: true,
      data: { asistencias } 
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/asistencias/fecha/:fecha - Obtener asistencias por fecha
router.get("/fecha/:fecha", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fecha = new Date(req.params.fecha);
    const asistencias = await getAsistenciasByFecha(fecha);
    res.json({ 
      success: true,
      data: { asistencias } 
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/asistencias - Crear nueva asistencia
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { estudianteId, fecha, estado } = req.body;
    const nuevaAsistencia = await createAsistencia({
      estudianteId: Number(estudianteId),
      fecha: new Date(fecha),
      estado,
    });
    res.status(201).json({ 
      success: true,
      data: { asistencia: nuevaAsistencia } 
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/asistencias/:id - Actualizar asistencia
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { fecha, estado } = req.body;
    const asistenciaActualizada = await updateAsistencia(id, {
      fecha: fecha ? new Date(fecha) : undefined,
      estado,
    });
    res.json({ 
      success: true,
      data: { asistencia: asistenciaActualizada } 
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/asistencias/:id - Eliminar asistencia
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await deleteAsistencia(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router; 