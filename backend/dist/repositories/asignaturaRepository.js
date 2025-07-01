"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asignaturaRepository = void 0;
const prisma_1 = require("../config/prisma");
exports.asignaturaRepository = {
    findAll: () => prisma_1.prisma.asignatura.findMany({
        include: {
            profesores: {
                include: {
                    profesor: true,
                },
            },
            cursos: {
                include: {
                    curso: true,
                },
            },
            calificaciones: true,
        },
    }),
    findById: (id) => prisma_1.prisma.asignatura.findUnique({
        where: { id },
        include: {
            profesores: {
                include: {
                    profesor: true,
                },
            },
            cursos: {
                include: {
                    curso: true,
                },
            },
            calificaciones: true,
        },
    }),
    create: (data) => prisma_1.prisma.asignatura.create({
        data,
    }),
    update: (id, data) => prisma_1.prisma.asignatura.update({
        where: { id },
        data,
    }),
    delete: (id) => prisma_1.prisma.asignatura.delete({
        where: { id },
    }),
    addProfesor: (asignaturaId, profesorId) => prisma_1.prisma.profesorAsignatura.create({
        data: {
            asignaturaId,
            profesorId,
        },
    }),
    removeProfesor: (asignaturaId, profesorId) => prisma_1.prisma.profesorAsignatura.delete({
        where: {
            profesorId_asignaturaId: {
                profesorId,
                asignaturaId,
            },
        },
    }),
};
