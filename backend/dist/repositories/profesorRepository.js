"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profesorRepository = void 0;
const prisma_1 = require("../config/prisma");
exports.profesorRepository = {
    findAll: () => prisma_1.prisma.profesor.findMany({
        include: {
            jefeDeCurso: true,
            asignaturas: {
                include: {
                    asignatura: true,
                },
            },
            calificaciones: true,
            observaciones: true,
        },
    }),
    findById: (id) => prisma_1.prisma.profesor.findUnique({
        where: { id },
        include: {
            jefeDeCurso: true,
            asignaturas: {
                include: {
                    asignatura: true,
                },
            },
            calificaciones: true,
            observaciones: true,
        },
    }),
    create: (data) => prisma_1.prisma.profesor.create({
        data,
    }),
    update: (id, data) => prisma_1.prisma.profesor.update({
        where: { id },
        data,
    }),
    delete: (id) => prisma_1.prisma.profesor.delete({
        where: { id },
    }),
    addAsignatura: (profesorId, asignaturaId) => prisma_1.prisma.profesorAsignatura.create({
        data: {
            profesorId,
            asignaturaId,
        },
    }),
    removeAsignatura: (profesorId, asignaturaId) => prisma_1.prisma.profesorAsignatura.delete({
        where: {
            profesorId_asignaturaId: {
                profesorId,
                asignaturaId,
            },
        },
    }),
};
