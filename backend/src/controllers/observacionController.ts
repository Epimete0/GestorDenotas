import { Router, Request, Response, NextFunction } from "express";
import { observacionService } from "../services/observacionService";

const router = Router();

// GET /api/observaciones - Listar todas
router.get("/", async (_req, res, next) => {
  try {
    const observaciones = await observacionService.findAll();
    res.json({ observaciones });
  } catch (err) {
    next(err);
  }
});

// GET /api/observaciones/:id - Buscar por id
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const observacion = await observacionService.findById(id);
    res.json({ observacion });
  } catch (err) {
    next(err);
  }
});

// GET /api/observaciones/estudiante/:estudianteId - Buscar por estudiante
router.get("/estudiante/:estudianteId", async (req, res, next) => {
  try {
    const estudianteId = Number(req.params.estudianteId);
    const observaciones = await observacionService.findByEstudiante(estudianteId);
    res.json({ observaciones });
  } catch (err) {
    next(err);
  }
});

// POST /api/observaciones - Crear
router.post("/", async (req, res, next) => {
  try {
    const { estudianteId, profesorId, texto, estado } = req.body;
    const nueva = await observacionService.create({ estudianteId, profesorId, texto, estado });
    res.status(201).json({ observacion: nueva });
  } catch (err) {
    next(err);
  }
});

// PUT /api/observaciones/:id - Actualizar
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { texto, estado } = req.body;
    const actualizada = await observacionService.update(id, { texto, estado });
    res.json({ observacion: actualizada });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/observaciones/:id - Eliminar
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await observacionService.delete(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router; 