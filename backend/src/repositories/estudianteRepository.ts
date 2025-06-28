// backend/src/repositories/estudianteRepository.ts
import { prisma } from "../config/prisma";

export const estudianteRepository = {
  findAll: () =>
    prisma.estudiante.findMany({
      include: {
        curso: true,
        calificaciones: {
          include: { asignatura: true },
        },
        observaciones: true,
        asistencias: true,
      },
    }),

  findById: (id: number) =>
    prisma.estudiante.findUnique({
      where: { id },
      include: {
        curso: true,
        calificaciones: {
          include: { asignatura: true },
        },
        observaciones: true,
        asistencias: true,
      },
    }),

  create: (data: {
    nombre: string;
    apellido: string;
    edad: number;
    sexo: string;
    cursoId: number;
  }) =>
    prisma.estudiante.create({
      data,
      include: {
        curso: true,
      },
    }),

  update: (
    id: number,
    data: {
      nombre?: string;
      apellido?: string;
      edad?: number;
      sexo?: string;
      cursoId?: number;
    }
  ) =>
    prisma.estudiante.update({
      where: { id },
      data,
      include: {
        curso: true,
      },
    }),

  delete: (id: number) =>
    prisma.estudiante.delete({
      where: { id },
    }),
};
