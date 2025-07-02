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
// backend/src/controllers/courseController.ts
const express_1 = require("express");
const courseService_1 = require("../services/courseService");
const router = (0, express_1.Router)();
// GET /api/courses - Obtener todos los cursos
router.get("/", (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield (0, courseService_1.getAllCourses)();
        res.json({
            success: true,
            data: { courses }
        });
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/courses/:id - Obtener curso por ID
router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const course = yield (0, courseService_1.getCourseById)(id);
        res.json({
            success: true,
            data: { course }
        });
    }
    catch (err) {
        next(err);
    }
}));
// POST /api/courses - Crear nuevo curso
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, jefeId } = req.body;
        const nuevoCurso = yield (0, courseService_1.createCourse)({
            nombre,
            jefeId: Number(jefeId),
        });
        res.status(201).json({
            success: true,
            data: { course: nuevoCurso }
        });
    }
    catch (err) {
        next(err);
    }
}));
// PUT /api/courses/:id - Actualizar curso
router.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { nombre, jefeId } = req.body;
        const courseActualizado = yield (0, courseService_1.updateCourse)(id, {
            nombre,
            jefeId: jefeId ? Number(jefeId) : undefined,
        });
        res.json({
            success: true,
            data: { course: courseActualizado }
        });
    }
    catch (err) {
        next(err);
    }
}));
// DELETE /api/courses/:id - Eliminar curso
router.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield (0, courseService_1.deleteCourse)(id);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}));
// POST /api/courses/:id/asignaturas - Agregar asignatura a curso
router.post("/:id/asignaturas", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = Number(req.params.id);
        const { asignaturaId } = req.body;
        yield (0, courseService_1.addAsignaturaToCourse)(courseId, asignaturaId);
        res.status(201).json({
            success: true,
            data: { message: "Asignatura agregada al curso" }
        });
    }
    catch (err) {
        next(err);
    }
}));
// DELETE /api/courses/:id/asignaturas/:asignaturaId - Remover asignatura de curso
router.delete("/:id/asignaturas/:asignaturaId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = Number(req.params.id);
        const asignaturaId = Number(req.params.asignaturaId);
        yield (0, courseService_1.removeAsignaturaFromCourse)(courseId, asignaturaId);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}));
// GET /api/courses/profesor/:profesorId - Obtener cursos por profesor
router.get("/profesor/:profesorId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profesorId = Number(req.params.profesorId);
        const courses = yield (0, courseService_1.getCoursesByProfesor)(profesorId);
        res.json({
            success: true,
            data: { courses }
        });
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
