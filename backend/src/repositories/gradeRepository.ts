// backend/src/repositories/gradeRepository.ts
import { prisma } from "../config/prisma";

export const gradeRepository = {
  /**
   * Crea una nueva calificación para un estudiante en una asignatura,
   * especificando también el profesor que la registra.
   */
  create: (data: {
    estudianteId: number;
    asignaturaId: number;
    profesorId: number;
    valor: number;
  }) =>
    prisma.calificacion.create({
      data,
      include: {
        estudiante: true,
        asignatura: true,
        profesor: true,
      },
    }),

  /**
   * Obtiene todas las calificaciones de un estudiante dado,
   * incluyendo el nombre de la asignatura y del profesor.
   */
  findByEstudiante: (estudianteId: number) =>
    prisma.calificacion.findMany({
      where: { estudianteId },
      include: {
        asignatura: true,
        profesor: true,
      },
      orderBy: {
        fecha: "desc",
      },
    }),

  findById: (id: number) =>
    prisma.calificacion.findUnique({
      where: { id },
      include: {
        estudiante: true,
        asignatura: true,
        profesor: true,
      },
    }),

  update: (
    id: number,
    data: {
      valor?: number;
      asignaturaId?: number;
      profesorId?: number;
    }
  ) =>
    prisma.calificacion.update({
      where: { id },
      data,
      include: {
        estudiante: true,
        asignatura: true,
        profesor: true,
      },
    }),

  delete: (id: number) =>
    prisma.calificacion.delete({
      where: { id },
    }),

  findByAsignatura: (asignaturaId: number) =>
    prisma.calificacion.findMany({
      where: { asignaturaId },
      include: {
        estudiante: true,
        asignatura: true,
        profesor: true,
      },
      orderBy: {
        fecha: "desc",
      },
    }),

  findByProfesor: (profesorId: number) =>
    prisma.calificacion.findMany({
      where: { profesorId },
      include: {
        estudiante: true,
        asignatura: true,
        profesor: true,
      },
      orderBy: {
        fecha: "desc",
      },
    }),

  findAll: () =>
    prisma.calificacion.findMany({
      include: {
        estudiante: true,
        asignatura: true,
        profesor: true,
      },
      orderBy: {
        fecha: "desc",
      },
    }),
};
