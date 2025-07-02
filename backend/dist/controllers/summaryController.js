"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/controllers/summaryController.ts
const express_1 = require("express");
const prisma_1 = require("../config/prisma");
const router = (0, express_1.Router)();
// GET /api/summary - Obtener resumen general del sistema
router.get("/", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener estadísticas generales
        const [totalEstudiantes, totalProfesores, totalCursos, totalAsignaturas, totalCalificaciones, totalAsistencias, totalObservaciones] = yield Promise.all([
            prisma_1.prisma.estudiante.count(),
            prisma_1.prisma.profesor.count(),
            prisma_1.prisma.curso.count(),
            prisma_1.prisma.asignatura.count(),
            prisma_1.prisma.calificacion.count(),
            prisma_1.prisma.asistencia.count(),
            prisma_1.prisma.observacion.count()
        ]);
        // Obtener promedio de calificaciones
        const calificaciones = yield prisma_1.prisma.calificacion.findMany({
            select: { valor: true }
        });
        const promedioCalificaciones = calificaciones.length > 0
            ? calificaciones.reduce((sum, cal) => sum + cal.valor, 0) / calificaciones.length
            : 0;
        // Obtener estadísticas de asistencia
        const asistencias = yield prisma_1.prisma.asistencia.findMany({
            select: { estado: true }
        });
        const totalAsistenciasCount = asistencias.length;
        const asistenciasPresentes = asistencias.filter(a => a.estado === 'presente').length;
        const asistenciasAusentes = asistencias.filter(a => a.estado === 'ausente').length;
        const asistenciasTardes = asistencias.filter(a => a.estado === 'tarde').length;
        const resumen = {
            estudiantes: {
                total: totalEstudiantes
            },
            profesores: {
                total: totalProfesores
            },
            cursos: {
                total: totalCursos
            },
            asignaturas: {
                total: totalAsignaturas
            },
            calificaciones: {
                total: totalCalificaciones,
                promedio: promedioCalificaciones
            },
            asistencias: {
                total: totalAsistenciasCount,
                presentes: asistenciasPresentes,
                ausentes: asistenciasAusentes,
                tardes: asistenciasTardes,
                porcentajeAsistencia: totalAsistenciasCount > 0
                    ? ((asistenciasPresentes + asistenciasTardes) / totalAsistenciasCount) * 100
                    : 0
            },
            observaciones: {
                total: totalObservaciones
            }
        };
        res.json({
            success: true,
            data: { resumen }
        });
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
