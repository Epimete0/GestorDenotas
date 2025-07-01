import { prisma } from "../config/prisma";

export const asistenciaRepository = {
  findAll: () =>
    prisma.asistencia.findMany({
      include: {
        estudiante: {
          include: {
            curso: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
    }),

  findById: (id: number) =>
    prisma.asistencia.findUnique({
      where: { id },
      include: {
        estudiante: {
          include: {
            curso: true,
          },
        },
      },
    }),

  findByEstudiante: (estudianteId: number) =>
    prisma.asistencia.findMany({
      where: { estudianteId },
      include: {
        estudiante: {
          include: {
            curso: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
    }),

  findByFecha: (fecha: Date) =>
    prisma.asistencia.findMany({
      where: {
        fecha: {
          gte: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()),
          lt: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + 1),
        },
      },
      include: {
        estudiante: {
          include: {
            curso: true,
          },
        },
      },
    }),

  create: (data: {
    estudianteId: number;
    fecha: Date;
    estado: "presente" | "ausente" | "tarde";
  }) =>
    prisma.asistencia.create({
      data,
      include: {
        estudiante: {
          include: {
            curso: true,
          },
        },
      },
    }),

  update: (
    id: number,
    data: {
      fecha?: Date;
      estado?: "presente" | "ausente" | "tarde";
    }
  ) =>
    prisma.asistencia.update({
      where: { id },
      data,
      include: {
        estudiante: {
          include: {
            curso: true,
          },
        },
      },
    }),

  delete: (id: number) =>
    prisma.asistencia.delete({
      where: { id },
    }),

  // Verificar si ya existe asistencia para un estudiante en una fecha específica
  findByEstudianteAndFecha: (estudianteId: number, fecha: Date) =>
    prisma.asistencia.findFirst({
      where: {
        estudianteId,
        fecha: {
          gte: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()),
          lt: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + 1),
        },
      },
    }),
}; 