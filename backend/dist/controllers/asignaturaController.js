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
const asignaturaService_1 = require("../services/asignaturaService");
const router = (0, express_1.Router)();
// GET /api/asignaturas - Obtener todas las asignaturas
router.get("/", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const asignaturas = yield (0, asignaturaService_1.getAllAsignaturas)();
        res.json({ asignaturas });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/asignaturas/:id - Obtener asignatura por ID
router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const asignatura = yield (0, asignaturaService_1.getAsignaturaById)(id);
        res.json({ asignatura });
    }
    catch (err) {
        next(err);
    }
}));
// POST /api/asignaturas - Crear nueva asignatura
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre } = req.body;
        const nuevaAsignatura = yield (0, asignaturaService_1.createAsignatura)({ nombre });
        res.status(201).json({ asignatura: nuevaAsignatura });
    }
    catch (err) {
        next(err);
    }
}));
// PUT /api/asignaturas/:id - Actualizar asignatura
router.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { nombre } = req.body;
        const asignaturaActualizada = yield (0, asignaturaService_1.updateAsignatura)(id, { nombre });
        res.json({ asignatura: asignaturaActualizada });
    }
    catch (err) {
        next(err);
    }
}));
// DELETE /api/asignaturas/:id - Eliminar asignatura
router.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield (0, asignaturaService_1.deleteAsignatura)(id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}));
// POST /api/asignaturas/:id/profesores - Agregar profesor a la asignatura
router.post("/:id/profesores", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const asignaturaId = Number(req.params.id);
        const { profesorId } = req.body;
        yield (0, asignaturaService_1.addProfesorToAsignatura)(asignaturaId, Number(profesorId));
        res.status(201).json({ message: "Profesor agregado a la asignatura" });
    }
    catch (err) {
        next(err);
    }
}));
// DELETE /api/asignaturas/:id/profesores/:profesorId - Remover profesor de la asignatura
router.delete("/:id/profesores/:profesorId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const asignaturaId = Number(req.params.id);
        const profesorId = Number(req.params.profesorId);
        yield (0, asignaturaService_1.removeProfesorFromAsignatura)(asignaturaId, profesorId);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
