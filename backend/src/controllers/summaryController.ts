// src/controllers/summaryController.ts
import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

const router = Router();

// GET /api/summary
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Total de estudiantes y cursos
    const [totalEstudiantes, totalCursos] = await Promise.all([
      prisma.estudiante.count(),
      prisma.curso.count(),
    ]);

    // 2) Promedio general de todas las calificaciones
    const avgObj = await prisma.calificacion.aggregate({
      _avg: { valor: true },
    });
    const promedioGeneral = avgObj._avg.valor ?? 0;

    // 3) Tasa de asistencia = presencias / total asistencias
    const [presencias, totalAsist] = await Promise.all([
      prisma.asistencia.count({ where: { estado: "presente" } }),
      prisma.asistencia.count(),
    ]);
    const tasaAsistencia = totalAsist > 0 ? (presencias / totalAsist) * 100 : 0;

    // 4) Top 5 asignaturas por promedio
    const top = await prisma.calificacion.groupBy({
      by: ["asignaturaId"],
      _avg: { valor: true },
      orderBy: { _avg: { valor: "desc" } },
      take: 5,
    });

    // Carga nombres de asignaturas
    const topAsignaturas = await Promise.all(
      top.map(async (t) => {
        const asig = await prisma.asignatura.findUnique({
          where: { id: t.asignaturaId },
        });
        return {
          nombre: asig?.nombre ?? "–",
          promedio: t._avg.valor ?? 0,
        };
      })
    );

    res.json({
      totalEstudiantes,
      totalCursos,
      promedioGeneral,
      tasaAsistencia,
      topAsignaturas,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
