import { prisma } from "../config/prisma";

export const asignaturaRepository = {
  findAll: () =>
    prisma.asignatura.findMany({
      include: {
        profesores: {
          include: {
            profesor: true,
          },
        },
        cursos: {
          include: {
            curso: true,
          },
        },
        calificaciones: true,
      },
    }),

  findById: (id: number) =>
    prisma.asignatura.findUnique({
      where: { id },
      include: {
        profesores: {
          include: {
            profesor: true,
          },
        },
        cursos: {
          include: {
            curso: true,
          },
        },
        calificaciones: true,
      },
    }),

  create: (data: { nombre: string }) =>
    prisma.asignatura.create({
      data,
    }),

  update: (id: number, data: { nombre?: string }) =>
    prisma.asignatura.update({
      where: { id },
      data,
    }),

  delete: (id: number) =>
    prisma.asignatura.delete({
      where: { id },
    }),

  addProfesor: (asignaturaId: number, profesorId: number) =>
    prisma.profesorAsignatura.create({
      data: {
        asignaturaId,
        profesorId,
      },
    }),

  removeProfesor: (asignaturaId: number, profesorId: number) =>
    prisma.profesorAsignatura.delete({
      where: {
        profesorId_asignaturaId: {
          profesorId,
          asignaturaId,
        },
      },
    }),
}; 