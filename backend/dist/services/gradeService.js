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
exports.addGrade = addGrade;
exports.getGrades = getGrades;
exports.getAllGrades = getAllGrades;
exports.getGradeById = getGradeById;
exports.updateGrade = updateGrade;
exports.deleteGrade = deleteGrade;
exports.getGradesByAsignatura = getGradesByAsignatura;
exports.getGradesByProfesor = getGradesByProfesor;
exports.getEstadisticasCalificaciones = getEstadisticasCalificaciones;
// backend/src/services/gradeService.ts
const gradeRepository_1 = require("../repositories/gradeRepository");
/**
 * Registra una nueva calificación para un estudiante en una asignatura,
 * indicando también el profesor que la asigna.
 *
 * @param estudianteId  ID del estudiante
 * @param asignaturaId  ID de la asignatura
 * @param profesorId    ID del profesor que registra la nota
 * @param valor         Valor numérico de la calificación
 */
function addGrade(estudianteId, asignaturaId, profesorId, valor) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validaciones básicas
        if (estudianteId <= 0) {
            throw new Error("ID de estudiante inválido");
        }
        if (asignaturaId <= 0) {
            throw new Error("ID de asignatura inválido");
        }
        if (profesorId <= 0) {
            throw new Error("ID de profesor inválido");
        }
        if (valor < 1.0 || valor > 7.0) {
            throw new Error("La calificación debe estar entre 1.0 y 7.0");
        }
        return gradeRepository_1.gradeRepository.create({
            estudianteId,
            asignaturaId,
            profesorId,
            valor,
        });
    });
}
/**
 * Obtiene todas las calificaciones de un estudiante dado,
 * incluyendo nombres de asignatura y profesor.
 *
 * @param estudianteId  ID del estudiante
 */
function getGrades(estudianteId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (estudianteId <= 0) {
            throw new Error("ID de estudiante inválido");
        }
        const calificaciones = yield gradeRepository_1.gradeRepository.findByEstudiante(estudianteId);
        if (!calificaciones || calificaciones.length === 0) {
            throw new Error("No se encontraron calificaciones para el estudiante");
        }
        return calificaciones;
    });
}
/**
 * Obtiene todas las calificaciones del sistema,
 * incluyendo nombres de asignatura y profesor.
 */
function getAllGrades() {
    return __awaiter(this, void 0, void 0, function* () {
        return gradeRepository_1.gradeRepository.findAll();
    });
}
function getGradeById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const grade = yield gradeRepository_1.gradeRepository.findById(id);
        if (!grade) {
            throw new Error("Calificación no encontrada");
        }
        return grade;
    });
}
function updateGrade(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que la calificación existe
        yield getGradeById(id);
        // Validaciones básicas
        if (data.valor && (data.valor < 1.0 || data.valor > 7.0)) {
            throw new Error("La calificación debe estar entre 1.0 y 7.0");
        }
        if (data.asignaturaId && data.asignaturaId <= 0) {
            throw new Error("ID de asignatura inválido");
        }
        if (data.profesorId && data.profesorId <= 0) {
            throw new Error("ID de profesor inválido");
        }
        return gradeRepository_1.gradeRepository.update(id, data);
    });
}
function deleteGrade(id) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que la calificación existe
        yield getGradeById(id);
        return gradeRepository_1.gradeRepository.delete(id);
    });
}
function getGradesByAsignatura(asignaturaId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (asignaturaId <= 0) {
            throw new Error("ID de asignatura inválido");
        }
        return gradeRepository_1.gradeRepository.findByAsignatura(asignaturaId);
    });
}
function getGradesByProfesor(profesorId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (profesorId <= 0) {
            throw new Error("ID de profesor inválido");
        }
        return gradeRepository_1.gradeRepository.findByProfesor(profesorId);
    });
}
function getEstadisticasCalificaciones() {
    return __awaiter(this, void 0, void 0, function* () {
        const calificaciones = yield gradeRepository_1.gradeRepository.findAll();
        const total = calificaciones.length;
        const promedio = total > 0 ? calificaciones.reduce((sum, g) => sum + g.valor, 0) / total : 0;
        const aprobadas = calificaciones.filter((g) => g.valor >= 4.0).length;
        const reprobadas = calificaciones.filter((g) => g.valor < 4.0).length;
        return {
            total,
            promedio,
            aprobadas,
            reprobadas,
            porcentajeAprobacion: total > 0 ? (aprobadas / total) * 100 : 0,
        };
    });
}
