// src/controllers/summaryController.ts
import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

const router = Router();

// GET /api/summary - Obtener resumen general del sistema
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener estadísticas generales
    const [
      totalEstudiantes,
      totalProfesores,
      totalCursos,
      totalAsignaturas,
      totalCalificaciones,
      totalAsistencias,
      totalObservaciones
    ] = await Promise.all([
      prisma.estudiante.count(),
      prisma.profesor.count(),
      prisma.curso.count(),
      prisma.asignatura.count(),
      prisma.calificacion.count(),
      prisma.asistencia.count(),
      prisma.observacion.count()
    ]);

    // Obtener promedio de calificaciones
    const calificaciones = await prisma.calificacion.findMany({
      select: { valor: true }
    });
    
    const promedioGeneral = calificaciones.length > 0 
      ? calificaciones.reduce((sum, cal) => sum + cal.valor, 0) / calificaciones.length 
      : 0;

    // Obtener estadísticas de asistencia
    const asistencias = await prisma.asistencia.findMany({
      select: { estado: true }
    });
    
    const totalAsistenciasCount = asistencias.length;
    const asistenciasPresentes = asistencias.filter(a => a.estado === 'presente').length;
    const asistenciasAusentes = asistencias.filter(a => a.estado === 'ausente').length;
    const asistenciasTardes = asistencias.filter(a => a.estado === 'tarde').length;

    const tasaAsistencia = totalAsistenciasCount > 0 
      ? ((asistenciasPresentes + asistenciasTardes) / totalAsistenciasCount) * 100 
      : 0;

    // Obtener top 5 asignaturas por promedio
    const topAsignaturas = await prisma.$queryRaw`
      SELECT 
        a.nombre,
        AVG(c.valor) as promedio
      FROM asignatura a
      LEFT JOIN calificacion c ON a.id = c.asignaturaId
      GROUP BY a.id, a.nombre
      HAVING AVG(c.valor) IS NOT NULL
      ORDER BY promedio DESC
      LIMIT 5
    `;

    // Formatear topAsignaturas para que coincida con la interfaz del frontend
    const formattedTopAsignaturas = (topAsignaturas as any[]).map(item => ({
      nombre: item.nombre,
      promedio: Number(item.promedio)
    }));

    // Respuesta que coincide exactamente con lo que espera el frontend
    const summary = {
      totalEstudiantes,
      totalCursos,
      promedioGeneral,
      tasaAsistencia,
      topAsignaturas: formattedTopAsignaturas
    };

    res.json(summary);
  } catch (err) {
    next(err);
  }
});

export default router;
