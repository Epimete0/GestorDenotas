// backend/src/repositories/courseRepository.ts
import { prisma } from "../config/prisma";

export const courseRepository = {
  findAll: () =>
    prisma.curso.findMany({
      include: {
        jefeDeCurso: true,
        estudiantes: true,
        planDeEstudio: {
          include: {
            asignatura: true,
          },
        },
      },
    }),

  findById: (id: number) =>
    prisma.curso.findUnique({
      where: { id },
      include: {
        jefeDeCurso: true,
        estudiantes: true,
        planDeEstudio: {
          include: {
            asignatura: true,
          },
        },
      },
    }),

  create: (data: {
    nombre: string;
    jefeId: number;
  }) =>
    prisma.curso.create({
      data,
      include: {
        jefeDeCurso: true,
      },
    }),

  update: (
    id: number,
    data: {
      nombre?: string;
      jefeId?: number;
    }
  ) =>
    prisma.curso.update({
      where: { id },
      data,
      include: {
        jefeDeCurso: true,
      },
    }),

  delete: (id: number) =>
    prisma.curso.delete({
      where: { id },
    }),

  addAsignatura: (cursoId: number, asignaturaId: number) =>
    prisma.cursoAsignatura.create({
      data: {
        cursoId,
        asignaturaId,
      },
    }),

  removeAsignatura: (cursoId: number, asignaturaId: number) =>
    prisma.cursoAsignatura.delete({
      where: {
        cursoId_asignaturaId: {
          cursoId,
          asignaturaId,
        },
      },
    }),

  findByProfesor: (profesorId: number) =>
    prisma.curso.findMany({
      where: {
        OR: [
          { jefeId: profesorId },
          {
            planDeEstudio: {
              some: {
                asignatura: {
                  profesores: {
                    some: { profesorId },
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        jefeDeCurso: true,
        estudiantes: true,
        planDeEstudio: {
          include: {
            asignatura: true,
          },
        },
      },
    }),

  findByEstudiante: (estudianteId: number) =>
    prisma.curso.findMany({
      where: {
        estudiantes: {
          some: { id: estudianteId },
        },
      },
      include: {
        jefeDeCurso: true,
        estudiantes: true,
        planDeEstudio: {
          include: {
            asignatura: true,
          },
        },
      },
    }),
};
