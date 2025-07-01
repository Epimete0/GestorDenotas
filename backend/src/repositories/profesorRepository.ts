import { prisma } from "../config/prisma";

export const profesorRepository = {
  findAll: () =>
    prisma.profesor.findMany({
      include: {
        jefeDeCurso: true,
        asignaturas: {
          include: {
            asignatura: true,
          },
        },
        calificaciones: true,
        observaciones: true,
      },
    }),

  findById: (id: number) =>
    prisma.profesor.findUnique({
      where: { id },
      include: {
        jefeDeCurso: true,
        asignaturas: {
          include: {
            asignatura: true,
          },
        },
        calificaciones: true,
        observaciones: true,
      },
    }),

  create: (data: {
    nombre: string;
    apellido: string;
    edad: number;
    sexo: string;
  }) =>
    prisma.profesor.create({
      data,
    }),

  update: (
    id: number,
    data: {
      nombre?: string;
      apellido?: string;
      edad?: number;
      sexo?: string;
    }
  ) =>
    prisma.profesor.update({
      where: { id },
      data,
    }),

  delete: (id: number) =>
    prisma.profesor.delete({
      where: { id },
    }),

  addAsignatura: (profesorId: number, asignaturaId: number) =>
    prisma.profesorAsignatura.create({
      data: {
        profesorId,
        asignaturaId,
      },
    }),

  removeAsignatura: (profesorId: number, asignaturaId: number) =>
    prisma.profesorAsignatura.delete({
      where: {
        profesorId_asignaturaId: {
          profesorId,
          asignaturaId,
        },
      },
    }),
}; 