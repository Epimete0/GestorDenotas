"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asistenciaRepository = void 0;
const prisma_1 = require("../config/prisma");
exports.asistenciaRepository = {
    findAll: () => prisma_1.prisma.asistencia.findMany({
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
    findById: (id) => prisma_1.prisma.asistencia.findUnique({
        where: { id },
        include: {
            estudiante: {
                include: {
                    curso: true,
                },
            },
        },
    }),
    findByEstudiante: (estudianteId) => prisma_1.prisma.asistencia.findMany({
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
    findByFecha: (fecha) => prisma_1.prisma.asistencia.findMany({
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
    create: (data) => prisma_1.prisma.asistencia.create({
        data,
        include: {
            estudiante: {
                include: {
                    curso: true,
                },
            },
        },
    }),
    update: (id, data) => prisma_1.prisma.asistencia.update({
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
    delete: (id) => prisma_1.prisma.asistencia.delete({
        where: { id },
    }),
    // Verificar si ya existe asistencia para un estudiante en una fecha específica
    findByEstudianteAndFecha: (estudianteId, fecha) => prisma_1.prisma.asistencia.findFirst({
        where: {
            estudianteId,
            fecha: {
                gte: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()),
                lt: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + 1),
            },
        },
    }),
};
