"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradeRepository = void 0;
// backend/src/repositories/gradeRepository.ts
const prisma_1 = require("../config/prisma");
exports.gradeRepository = {
    /**
     * Crea una nueva calificación para un estudiante en una asignatura,
     * especificando también el profesor que la registra.
     */
    create: (data) => prisma_1.prisma.calificacion.create({
        data,
        include: {
            estudiante: true,
            asignatura: true,
            profesor: true,
        },
    }),
    /**
     * Obtiene todas las calificaciones de un estudiante dado,
     * incluyendo el nombre de la asignatura y del profesor.
     */
    findByEstudiante: (estudianteId) => prisma_1.prisma.calificacion.findMany({
        where: { estudianteId },
        include: {
            asignatura: true,
            profesor: true,
        },
        orderBy: {
            fecha: "desc",
        },
    }),
    findById: (id) => prisma_1.prisma.calificacion.findUnique({
        where: { id },
        include: {
            estudiante: true,
            asignatura: true,
            profesor: true,
        },
    }),
    update: (id, data) => prisma_1.prisma.calificacion.update({
        where: { id },
        data,
        include: {
            estudiante: true,
            asignatura: true,
            profesor: true,
        },
    }),
    delete: (id) => prisma_1.prisma.calificacion.delete({
        where: { id },
    }),
    findByAsignatura: (asignaturaId) => prisma_1.prisma.calificacion.findMany({
        where: { asignaturaId },
        include: {
            estudiante: true,
            asignatura: true,
            profesor: true,
        },
        orderBy: {
            fecha: "desc",
        },
    }),
    findByProfesor: (profesorId) => prisma_1.prisma.calificacion.findMany({
        where: { profesorId },
        include: {
            estudiante: true,
            asignatura: true,
            profesor: true,
        },
        orderBy: {
            fecha: "desc",
        },
    }),
    findAll: () => prisma_1.prisma.calificacion.findMany({
        include: {
            estudiante: true,
            asignatura: true,
            profesor: true,
        },
        orderBy: {
            fecha: "desc",
        },
    }),
};
