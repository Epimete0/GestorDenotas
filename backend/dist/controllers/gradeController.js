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
// backend/src/controllers/gradeController.ts
const express_1 = require("express");
const gradeService_1 = require("../services/gradeService");
const router = (0, express_1.Router)();
// POST /api/grades - Crear nueva calificación
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { estudianteId, asignaturaId, profesorId, valor } = req.body;
        const nuevaNota = yield (0, gradeService_1.addGrade)(Number(estudianteId), Number(asignaturaId), Number(profesorId), Number(valor));
        res.status(201).json({ calificacion: nuevaNota });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/grades - Obtener todas las calificaciones
router.get("/", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const calificaciones = yield (0, gradeService_1.getEstadisticasCalificaciones)();
        res.json({ estadisticas: calificaciones });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/grades/all - Obtener todas las calificaciones (lista completa)
router.get("/all", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const calificaciones = yield (0, gradeService_1.getAllGrades)();
        res.json({ calificaciones });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/grades/:estudianteId - Obtener calificaciones por estudiante
router.get("/estudiante/:estudianteId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudianteId = Number(req.params.estudianteId);
        const notas = yield (0, gradeService_1.getGrades)(estudianteId);
        res.json({ calificaciones: notas });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/grades/asignatura/:asignaturaId - Obtener calificaciones por asignatura
router.get("/asignatura/:asignaturaId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const asignaturaId = Number(req.params.asignaturaId);
        const notas = yield (0, gradeService_1.getGradesByAsignatura)(asignaturaId);
        res.json({ calificaciones: notas });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/grades/profesor/:profesorId - Obtener calificaciones por profesor
router.get("/profesor/:profesorId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesorId = Number(req.params.profesorId);
        const notas = yield (0, gradeService_1.getGradesByProfesor)(profesorId);
        res.json({ calificaciones: notas });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/grades/id/:id - Obtener calificación por ID
router.get("/id/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const calificacion = yield (0, gradeService_1.getGradeById)(id);
        res.json({ calificacion });
    }
    catch (err) {
        next(err);
    }
}));
// PUT /api/grades/:id - Actualizar calificación
router.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { valor, asignaturaId, profesorId } = req.body;
        const calificacionActualizada = yield (0, gradeService_1.updateGrade)(id, {
            valor: valor ? Number(valor) : undefined,
            asignaturaId: asignaturaId ? Number(asignaturaId) : undefined,
            profesorId: profesorId ? Number(profesorId) : undefined,
        });
        res.json({ calificacion: calificacionActualizada });
    }
    catch (err) {
        next(err);
    }
}));
// DELETE /api/grades/:id - Eliminar calificación
router.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield (0, gradeService_1.deleteGrade)(id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
