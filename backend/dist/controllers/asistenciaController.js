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
const asistenciaService_1 = require("../services/asistenciaService");
const router = (0, express_1.Router)();
// GET /api/asistencias - Obtener todas las asistencias
router.get("/", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const asistencias = yield (0, asistenciaService_1.getAllAsistencias)();
        res.json({ asistencias });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/asistencias/estadisticas - Obtener estadísticas de asistencia
router.get("/estadisticas", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estadisticas = yield (0, asistenciaService_1.getEstadisticasAsistencia)();
        res.json({ estadisticas });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/asistencias/:id - Obtener asistencia por ID
router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const asistencia = yield (0, asistenciaService_1.getAsistenciaById)(id);
        res.json({ asistencia });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/asistencias/estudiante/:estudianteId - Obtener asistencias por estudiante
router.get("/estudiante/:estudianteId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudianteId = Number(req.params.estudianteId);
        const asistencias = yield (0, asistenciaService_1.getAsistenciasByEstudiante)(estudianteId);
        res.json({ asistencias });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/asistencias/fecha/:fecha - Obtener asistencias por fecha
router.get("/fecha/:fecha", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fecha = new Date(req.params.fecha);
        const asistencias = yield (0, asistenciaService_1.getAsistenciasByFecha)(fecha);
        res.json({ asistencias });
    }
    catch (err) {
        next(err);
    }
}));
// POST /api/asistencias - Crear nueva asistencia
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { estudianteId, fecha, estado } = req.body;
        const nuevaAsistencia = yield (0, asistenciaService_1.createAsistencia)({
            estudianteId: Number(estudianteId),
            fecha: new Date(fecha),
            estado,
        });
        res.status(201).json({ asistencia: nuevaAsistencia });
    }
    catch (err) {
        next(err);
    }
}));
// PUT /api/asistencias/:id - Actualizar asistencia
router.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { fecha, estado } = req.body;
        const asistenciaActualizada = yield (0, asistenciaService_1.updateAsistencia)(id, {
            fecha: fecha ? new Date(fecha) : undefined,
            estado,
        });
        res.json({ asistencia: asistenciaActualizada });
    }
    catch (err) {
        next(err);
    }
}));
// DELETE /api/asistencias/:id - Eliminar asistencia
router.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield (0, asistenciaService_1.deleteAsistencia)(id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
