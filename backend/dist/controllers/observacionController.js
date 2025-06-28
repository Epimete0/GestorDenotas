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
// GET /api/observaciones - Listar todas
router.get("/", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const observaciones = yield observacionService_1.observacionService.findAll();
        res.json({ observaciones });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/observaciones/:id - Buscar por id
router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const observacion = yield observacionService_1.observacionService.findById(id);
        res.json({ observacion });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/observaciones/estudiante/:estudianteId - Buscar por estudiante
router.get("/estudiante/:estudianteId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudianteId = Number(req.params.estudianteId);
        const observaciones = yield observacionService_1.observacionService.findByEstudiante(estudianteId);
        res.json({ observaciones });
    }
    catch (err) {
        next(err);
    }
}));
// POST /api/observaciones - Crear
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { estudianteId, profesorId, texto, estado } = req.body;
        const nueva = yield observacionService_1.observacionService.create({ estudianteId, profesorId, texto, estado });
        res.status(201).json({ observacion: nueva });
    }
    catch (err) {
        next(err);
    }
}));
// PUT /api/observaciones/:id - Actualizar
router.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { texto, estado } = req.body;
        const actualizada = yield observacionService_1.observacionService.update(id, { texto, estado });
        res.json({ observacion: actualizada });
    }
    catch (err) {
        next(err);
    }
}));
// DELETE /api/observaciones/:id - Eliminar
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
exports.default = router;
