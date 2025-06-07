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
};
