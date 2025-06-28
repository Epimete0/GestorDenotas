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
// GET /api/summary
router.get("/", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // 1) Total de estudiantes y cursos
        const [totalEstudiantes, totalCursos] = yield Promise.all([
            prisma_1.prisma.estudiante.count(),
            prisma_1.prisma.curso.count(),
        ]);
        // 2) Promedio general de todas las calificaciones
        const avgObj = yield prisma_1.prisma.calificacion.aggregate({
            _avg: { valor: true },
        });
        const promedioGeneral = (_a = avgObj._avg.valor) !== null && _a !== void 0 ? _a : 0;
        // 3) Tasa de asistencia = presencias / total asistencias
        const [presencias, totalAsist] = yield Promise.all([
            prisma_1.prisma.asistencia.count({ where: { estado: "presente" } }),
            prisma_1.prisma.asistencia.count(),
        ]);
        const tasaAsistencia = totalAsist > 0 ? (presencias / totalAsist) * 100 : 0;
        // 4) Top 5 asignaturas por promedio
        const top = yield prisma_1.prisma.calificacion.groupBy({
            by: ["asignaturaId"],
            _avg: { valor: true },
            orderBy: { _avg: { valor: "desc" } },
            take: 5,
        });
        // Carga nombres de asignaturas
        const topAsignaturas = yield Promise.all(top.map((t) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const asig = yield prisma_1.prisma.asignatura.findUnique({
                where: { id: t.asignaturaId },
            });
            return {
                nombre: (_a = asig === null || asig === void 0 ? void 0 : asig.nombre) !== null && _a !== void 0 ? _a : "–",
                promedio: (_b = t._avg.valor) !== null && _b !== void 0 ? _b : 0,
            };
        })));
        res.json({
            totalEstudiantes,
            totalCursos,
            promedioGeneral,
            tasaAsistencia,
            topAsignaturas,
        });
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
