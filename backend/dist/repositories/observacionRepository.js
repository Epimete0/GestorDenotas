"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observacionRepository = void 0;
const prisma_1 = require("../config/prisma");
exports.observacionRepository = {
    findAll: () => prisma_1.prisma.observacion.findMany({
        include: {
            estudiante: true,
            profesor: true,
        },
        orderBy: { id: "desc" },
    }),
    findById: (id) => prisma_1.prisma.observacion.findUnique({
        where: { id },
        include: {
            estudiante: true,
            profesor: true,
        },
    }),
    findByEstudiante: (estudianteId) => prisma_1.prisma.observacion.findMany({
        where: { estudianteId },
        include: {
            estudiante: true,
            profesor: true,
        },
        orderBy: { id: "desc" },
    }),
    create: (data) => prisma_1.prisma.observacion.create({
        data,
        include: {
            estudiante: true,
            profesor: true,
        },
    }),
    update: (id, data) => prisma_1.prisma.observacion.update({
        where: { id },
        data,
        include: {
            estudiante: true,
            profesor: true,
        },
    }),
    delete: (id) => prisma_1.prisma.observacion.delete({
        where: { id },
    }),
};
