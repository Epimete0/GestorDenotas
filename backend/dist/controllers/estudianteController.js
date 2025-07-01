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
// backend/src/controllers/estudianteController.ts
const express_1 = require("express");
const estudianteService_1 = require("../services/estudianteService");
const router = (0, express_1.Router)();
// GET /api/estudiantes - Obtener todos los estudiantes
router.get("/", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudiantes = yield (0, estudianteService_1.getAllEstudiantes)();
        res.json({ estudiantes });
    }
    catch (err) {
        next(err);
    }
}));
// POST /api/estudiantes/enrollments - Inscribir estudiante en curso
router.post("/enrollments", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId, courseId } = req.body;
        if (!studentId || !courseId) {
            return res.status(400).json({ error: "studentId y courseId son requeridos" });
        }
        // Actualizar el cursoId del estudiante
        const actualizado = yield (0, estudianteService_1.updateEstudiante)(studentId, { cursoId: courseId });
        res.status(200).json({ enrollment: { studentId, courseId }, estudiante: actualizado });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/estudiantes/:id - Obtener estudiante por ID
router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const estudiante = yield (0, estudianteService_1.getEstudianteById)(id);
        res.json({ estudiante });
    }
    catch (err) {
        next(err);
    }
}));
// POST /api/estudiantes - Crear nuevo estudiante
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, apellido, edad, sexo, cursoId } = req.body;
        const nuevoEstudiante = yield (0, estudianteService_1.createEstudiante)({
            nombre,
            apellido,
            edad: Number(edad),
            sexo,
            cursoId: Number(cursoId),
        });
        res.status(201).json({ estudiante: nuevoEstudiante });
    }
    catch (err) {
        next(err);
    }
}));
// PUT /api/estudiantes/:id - Actualizar estudiante
router.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { nombre, apellido, edad, sexo, cursoId } = req.body;
        const estudianteActualizado = yield (0, estudianteService_1.updateEstudiante)(id, {
            nombre,
            apellido,
            edad: edad ? Number(edad) : undefined,
            sexo,
            cursoId: cursoId ? Number(cursoId) : undefined,
        });
        res.json({ estudiante: estudianteActualizado });
    }
    catch (err) {
        next(err);
    }
}));
// DELETE /api/estudiantes/:id - Eliminar estudiante
router.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield (0, estudianteService_1.deleteEstudiante)(id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
