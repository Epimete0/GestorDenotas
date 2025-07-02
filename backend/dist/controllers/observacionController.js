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
const express_1 = require("express");
const observacionService_1 = require("../services/observacionService");
const router = (0, express_1.Router)();
// GET /api/observaciones - Obtener todas las observaciones
router.get("/", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const observaciones = yield observacionService_1.observacionService.findAll();
        res.json({
            success: true,
            data: { observaciones }
        });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/observaciones/:id - Obtener observación por ID
router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const observacion = yield observacionService_1.observacionService.findById(id);
        res.json({
            success: true,
            data: { observacion }
        });
    }
    catch (err) {
        next(err);
    }
}));
// POST /api/observaciones - Crear nueva observación
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { estudianteId, profesorId, texto, estado } = req.body;
        const nueva = yield observacionService_1.observacionService.create({
            estudianteId: Number(estudianteId),
            profesorId: Number(profesorId),
            texto,
            estado,
        });
        res.status(201).json({
            success: true,
            data: { observacion: nueva }
        });
    }
    catch (err) {
        next(err);
    }
}));
// PUT /api/observaciones/:id - Actualizar observación
router.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { texto, estado } = req.body;
        const observacionActualizada = yield observacionService_1.observacionService.update(id, {
            texto,
            estado,
        });
        res.json({
            success: true,
            data: { observacion: observacionActualizada }
        });
    }
    catch (err) {
        next(err);
    }
}));
// DELETE /api/observaciones/:id - Eliminar observación
router.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield observacionService_1.observacionService.delete(id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/observaciones/estudiante/:estudianteId - Obtener observaciones por estudiante
router.get("/estudiante/:estudianteId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudianteId = Number(req.params.estudianteId);
        const observaciones = yield observacionService_1.observacionService.findByEstudiante(estudianteId);
        res.json({
            success: true,
            data: { observaciones }
        });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/observaciones/profesor/:profesorId - Obtener observaciones por profesor
router.get("/profesor/:profesorId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesorId = Number(req.params.profesorId);
        const observaciones = yield observacionService_1.observacionService.findByProfesor(profesorId);
        res.json({
            success: true,
            data: { observaciones }
        });
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
