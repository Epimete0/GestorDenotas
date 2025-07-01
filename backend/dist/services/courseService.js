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
exports.getAllCourses = getAllCourses;
exports.getCourseById = getCourseById;
exports.createCourse = createCourse;
exports.updateCourse = updateCourse;
exports.deleteCourse = deleteCourse;
exports.addAsignaturaToCourse = addAsignaturaToCourse;
exports.removeAsignaturaFromCourse = removeAsignaturaFromCourse;
// backend/src/services/courseService.ts
const courseRepository_1 = require("../repositories/courseRepository");
function getAllCourses() {
    return __awaiter(this, void 0, void 0, function* () {
        return courseRepository_1.courseRepository.findAll();
    });
}
function getCourseById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const course = yield courseRepository_1.courseRepository.findById(id);
        if (!course) {
            throw new Error("Curso no encontrado");
        }
        return course;
    });
}
function createCourse(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validaciones básicas
        if (!data.nombre || data.nombre.trim().length === 0) {
            throw new Error("El nombre del curso es requerido");
        }
        if (data.jefeId <= 0) {
            throw new Error("ID de jefe de curso inválido");
        }
        return courseRepository_1.courseRepository.create(data);
    });
}
function updateCourse(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que el curso existe
        yield getCourseById(id);
        // Validaciones básicas
        if (data.nombre && data.nombre.trim().length === 0) {
            throw new Error("El nombre del curso no puede estar vacío");
        }
        if (data.jefeId && data.jefeId <= 0) {
            throw new Error("ID de jefe de curso inválido");
        }
        return courseRepository_1.courseRepository.update(id, data);
    });
}
function deleteCourse(id) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que el curso existe
        yield getCourseById(id);
        return courseRepository_1.courseRepository.delete(id);
    });
}
function addAsignaturaToCourse(cursoId, asignaturaId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que el curso existe
        yield getCourseById(cursoId);
        return courseRepository_1.courseRepository.addAsignatura(cursoId, asignaturaId);
    });
}
function removeAsignaturaFromCourse(cursoId, asignaturaId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que el curso existe
        yield getCourseById(cursoId);
        return courseRepository_1.courseRepository.removeAsignatura(cursoId, asignaturaId);
    });
}
