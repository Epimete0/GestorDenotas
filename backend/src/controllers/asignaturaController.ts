import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

const router = Router();

// GET /api/asignaturas
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const asignaturas = await prisma.asignatura.findMany();
    res.json({ asignaturas });
  } catch (err) {
    next(err);
  }
});

export default router;
