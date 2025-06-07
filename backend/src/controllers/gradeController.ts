// backend/src/controllers/gradeController.ts
import { Router, Request, Response, NextFunction } from "express";
import { addGrade, getGrades } from "../services/gradeService";

const router = Router();

// POST /api/grades
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

// GET /api/grades/:estudianteId
router.get(
  "/:estudianteId",
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

export default router;
