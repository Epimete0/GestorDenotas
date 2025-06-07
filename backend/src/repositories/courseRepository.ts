// backend/src/repositories/courseRepository.ts
import { prisma } from "../config/prisma";

export const courseRepository = {
  findAll: () => prisma.curso.findMany(),
  findById: (id: number) => prisma.curso.findUnique({ where: { id } }),
  // puedes añadir más métodos según lo necesites
};
