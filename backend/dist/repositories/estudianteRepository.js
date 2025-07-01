"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estudianteRepository = void 0;
// backend/src/repositories/estudianteRepository.ts
const prisma_1 = require("../config/prisma");
exports.estudianteRepository = {
    findAll: () => prisma_1.prisma.estudiante.findMany({
        include: {
            curso: true,
            calificaciones: {
                include: { asignatura: true },
            },
            observaciones: true,
            asistencias: true,
        },
    }),
    findById: (id) => prisma_1.prisma.estudiante.findUnique({
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
    create: (data) => prisma_1.prisma.estudiante.create({
        data,
        include: {
            curso: true,
        },
    }),
    update: (id, data) => prisma_1.prisma.estudiante.update({
        where: { id },
        data,
        include: {
            curso: true,
        },
    }),
    delete: (id) => prisma_1.prisma.estudiante.delete({
        where: { id },
    }),
};
