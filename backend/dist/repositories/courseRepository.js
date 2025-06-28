"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRepository = void 0;
// backend/src/repositories/courseRepository.ts
const prisma_1 = require("../config/prisma");
exports.courseRepository = {
    findAll: () => prisma_1.prisma.curso.findMany({
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
    findById: (id) => prisma_1.prisma.curso.findUnique({
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
    create: (data) => prisma_1.prisma.curso.create({
        data,
        include: {
            jefeDeCurso: true,
        },
    }),
    update: (id, data) => prisma_1.prisma.curso.update({
        where: { id },
        data,
        include: {
            jefeDeCurso: true,
        },
    }),
    delete: (id) => prisma_1.prisma.curso.delete({
        where: { id },
    }),
    addAsignatura: (cursoId, asignaturaId) => prisma_1.prisma.cursoAsignatura.create({
        data: {
            cursoId,
            asignaturaId,
        },
    }),
    removeAsignatura: (cursoId, asignaturaId) => prisma_1.prisma.cursoAsignatura.delete({
        where: {
            cursoId_asignaturaId: {
                cursoId,
                asignaturaId,
            },
        },
    }),
};
