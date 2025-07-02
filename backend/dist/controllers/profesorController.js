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
const profesorService_1 = require("../services/profesorService");
const router = (0, express_1.Router)();
// GET /api/profesores - Obtener todos los profesores
router.get("/", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesores = yield (0, profesorService_1.getAllProfesores)();
        res.json({
            success: true,
            data: { profesores }
        });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/profesores/:id - Obtener profesor por ID
router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const profesor = yield (0, profesorService_1.getProfesorById)(id);
        res.json({
            success: true,
            data: { profesor }
        });
    }
    catch (err) {
        next(err);
    }
}));
// POST /api/profesores - Crear nuevo profesor
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, apellido, edad, sexo } = req.body;
        const nuevoProfesor = yield (0, profesorService_1.createProfesor)({
            nombre,
            apellido,
            edad: Number(edad),
            sexo,
        });
        res.status(201).json({
            success: true,
            data: { profesor: nuevoProfesor }
        });
    }
    catch (err) {
        next(err);
    }
}));
// PUT /api/profesores/:id - Actualizar profesor
router.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { nombre, apellido, edad, sexo } = req.body;
        const profesorActualizado = yield (0, profesorService_1.updateProfesor)(id, {
            nombre,
            apellido,
            edad: edad ? Number(edad) : undefined,
            sexo,
        });
        res.json({
            success: true,
            data: { profesor: profesorActualizado }
        });
    }
    catch (err) {
        next(err);
    }
}));
// DELETE /api/profesores/:id - Eliminar profesor
router.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield (0, profesorService_1.deleteProfesor)(id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}));
// POST /api/profesores/:id/asignaturas - Agregar asignatura a profesor
router.post("/:id/asignaturas", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesorId = Number(req.params.id);
        const { asignaturaId } = req.body;
        yield (0, profesorService_1.addAsignaturaToProfesor)(profesorId, asignaturaId);
        res.status(201).json({
            success: true,
            data: { message: "Asignatura agregada al profesor" }
        });
    }
    catch (err) {
        next(err);
    }
}));
// DELETE /api/profesores/:id/asignaturas/:asignaturaId - Remover asignatura de profesor
router.delete("/:id/asignaturas/:asignaturaId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesorId = Number(req.params.id);
        const asignaturaId = Number(req.params.asignaturaId);
        yield (0, profesorService_1.removeAsignaturaFromProfesor)(profesorId, asignaturaId);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
