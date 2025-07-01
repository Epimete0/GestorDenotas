import { prisma } from "../config/prisma";

export const observacionRepository = {
  findAll: () =>
    prisma.observacion.findMany({
      include: {
        estudiante: true,
        profesor: true,
      },
      orderBy: { id: "desc" },
    }),

  findById: (id: number) =>
    prisma.observacion.findUnique({
      where: { id },
      include: {
        estudiante: true,
        profesor: true,
      },
    }),

  findByEstudiante: (estudianteId: number) =>
    prisma.observacion.findMany({
      where: { estudianteId },
      include: {
        estudiante: true,
        profesor: true,
      },
      orderBy: { id: "desc" },
    }),

  findByProfesor: (profesorId: number) =>
    prisma.observacion.findMany({
      where: { profesorId },
      include: {
        estudiante: true,
        profesor: true,
      },
      orderBy: { id: "desc" },
    }),

  create: (data: {
    estudianteId: number;
    profesorId: number;
    texto: string;
    estado?: "negativa" | "neutro" | "positiva";
  }) =>
    prisma.observacion.create({
      data,
      include: {
        estudiante: true,
        profesor: true,
      },
    }),

  update: (id: number, data: { texto?: string; estado?: "negativa" | "neutro" | "positiva" }) =>
    prisma.observacion.update({
      where: { id },
      data,
      include: {
        estudiante: true,
        profesor: true,
      },
    }),

  delete: (id: number) =>
    prisma.observacion.delete({
      where: { id },
    }),
}; 