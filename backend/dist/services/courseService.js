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
exports.getCoursesByProfesor = getCoursesByProfesor;
// backend/src/services/courseService.ts
const courseRepository_1 = require("../repositories/courseRepository");
const errors_1 = require("../config/errors");
function getAllCourses() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield courseRepository_1.courseRepository.findAll();
        }
        catch (error) {
            throw errors_1.createError.internal('Error al obtener cursos');
        }
    });
}
function getCourseById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const course = yield courseRepository_1.courseRepository.findById(id);
            if (!course) {
                throw errors_1.createError.notFound('Curso no encontrado');
            }
            return course;
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Curso no encontrado') {
                throw error;
            }
            throw errors_1.createError.internal('Error al obtener curso');
        }
    });
}
function createCourse(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validaciones básicas
        if (!data.nombre || data.nombre.trim().length === 0) {
            throw errors_1.createError.validation('El nombre del curso es requerido');
        }
        if (data.jefeId <= 0) {
            throw errors_1.createError.validation('ID de jefe de curso inválido');
        }
        try {
            return yield courseRepository_1.courseRepository.create(data);
        }
        catch (error) {
            throw errors_1.createError.internal('Error al crear curso');
        }
    });
}
function updateCourse(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar que el curso existe
            yield getCourseById(id);
            // Validaciones básicas
            if (data.nombre && data.nombre.trim().length === 0) {
                throw errors_1.createError.validation('El nombre del curso no puede estar vacío');
            }
            if (data.jefeId && data.jefeId <= 0) {
                throw errors_1.createError.validation('ID de jefe de curso inválido');
            }
            return yield courseRepository_1.courseRepository.update(id, data);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Curso no encontrado')) {
                throw error;
            }
            if (error instanceof Error && error.message.includes('El nombre del curso')) {
                throw error;
            }
            if (error instanceof Error && error.message.includes('ID de jefe de curso')) {
                throw error;
            }
            throw errors_1.createError.internal('Error al actualizar curso');
        }
    });
}
function deleteCourse(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar que el curso existe
            yield getCourseById(id);
            return yield courseRepository_1.courseRepository.delete(id);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Curso no encontrado')) {
                throw error;
            }
            throw errors_1.createError.internal('Error al eliminar curso');
        }
    });
}
function addAsignaturaToCourse(cursoId, asignaturaId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar que el curso existe
            yield getCourseById(cursoId);
            return yield courseRepository_1.courseRepository.addAsignatura(cursoId, asignaturaId);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Curso no encontrado')) {
                throw error;
            }
            throw errors_1.createError.internal('Error al agregar asignatura al curso');
        }
    });
}
function removeAsignaturaFromCourse(cursoId, asignaturaId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar que el curso existe
            yield getCourseById(cursoId);
            return yield courseRepository_1.courseRepository.removeAsignatura(cursoId, asignaturaId);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Curso no encontrado')) {
                throw error;
            }
            throw errors_1.createError.internal('Error al remover asignatura del curso');
        }
    });
}
function getCoursesByProfesor(profesorId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!profesorId || profesorId <= 0) {
            throw errors_1.createError.validation('ID de profesor inválido');
        }
        try {
            return yield courseRepository_1.courseRepository.findByProfesor(profesorId);
        }
        catch (error) {
            throw errors_1.createError.internal('Error al obtener cursos por profesor');
        }
    });
}
