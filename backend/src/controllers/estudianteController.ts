// backend/src/controllers/estudianteController.ts
import { Router, Request, Response, NextFunction } from "express";
import { getAllEstudiantes } from "../services/estudianteService";

const router = Router();

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const estudiantes = await getAllEstudiantes();
    res.json({ estudiantes });
  } catch (err) {
    next(err);
  }
});

export default router;
