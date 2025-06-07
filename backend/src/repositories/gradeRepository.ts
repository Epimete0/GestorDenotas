// backend/src/repositories/gradeRepository.ts
import { prisma } from "../config/prisma";

export const gradeRepository = {
  /**
   * Crea una nueva calificación para un estudiante en una asignatura,
   * especificando también el profesor que la registra.
   */
  create: (
    estudianteId: number,
    asignaturaId: number,
    profesorId: number,
    valor: number
  ) =>
    prisma.calificacion.create({
      data: {
        estudianteId,
        asignaturaId,
        profesorId,
        valor,
      },
    }),

  /**
   * Obtiene todas las calificaciones de un estudiante dado,
   * incluyendo el nombre de la asignatura y del profesor.
   */
  findByEstudiante: (estudianteId: number) =>
    prisma.calificacion.findMany({
      where: { estudianteId },
      orderBy: { fecha: "asc" },
      include: {
        asignatura: { select: { nombre: true } },
        profesor: { select: { nombre: true, apellido: true } },
      },
    }),
};
