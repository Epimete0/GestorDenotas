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
exports.getAllProfesores = getAllProfesores;
exports.getProfesorById = getProfesorById;
exports.createProfesor = createProfesor;
exports.updateProfesor = updateProfesor;
exports.deleteProfesor = deleteProfesor;
exports.addAsignaturaToProfesor = addAsignaturaToProfesor;
exports.removeAsignaturaFromProfesor = removeAsignaturaFromProfesor;
const profesorRepository_1 = require("../repositories/profesorRepository");
const errors_1 = require("../config/errors");
function getAllProfesores() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield profesorRepository_1.profesorRepository.findAll();
        }
        catch (error) {
            throw errors_1.createError.internal('Error al obtener profesores');
        }
    });
}
function getProfesorById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const profesor = yield profesorRepository_1.profesorRepository.findById(id);
            if (!profesor) {
                throw errors_1.createError.notFound('Profesor no encontrado');
            }
            return profesor;
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Profesor no encontrado') {
                throw error;
            }
            throw errors_1.createError.internal('Error al obtener profesor');
        }
    });
}
function createProfesor(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validaciones básicas
        if (!data.nombre || !data.apellido) {
            throw errors_1.createError.validation('Nombre y apellido son requeridos');
        }
        if (data.edad < 18 || data.edad > 80) {
            throw errors_1.createError.validation('La edad debe estar entre 18 y 80 años');
        }
        if (!["M", "F"].includes(data.sexo)) {
            throw errors_1.createError.validation('El sexo debe ser "M" o "F"');
        }
        try {
            return yield profesorRepository_1.profesorRepository.create(data);
        }
        catch (error) {
            throw errors_1.createError.internal('Error al crear profesor');
        }
    });
}
function updateProfesor(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar que el profesor existe
            yield getProfesorById(id);
            // Validaciones básicas
            if (data.edad && (data.edad < 18 || data.edad > 80)) {
                throw errors_1.createError.validation('La edad debe estar entre 18 y 80 años');
            }
            if (data.sexo && !["M", "F"].includes(data.sexo)) {
                throw errors_1.createError.validation('El sexo debe ser "M" o "F"');
            }
            return yield profesorRepository_1.profesorRepository.update(id, data);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Profesor no encontrado')) {
                throw error;
            }
            if (error instanceof Error && error.message.includes('La edad debe estar')) {
                throw error;
            }
            if (error instanceof Error && error.message.includes('El sexo debe ser')) {
                throw error;
            }
            throw errors_1.createError.internal('Error al actualizar profesor');
        }
    });
}
function deleteProfesor(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar que el profesor existe
            yield getProfesorById(id);
            return yield profesorRepository_1.profesorRepository.delete(id);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Profesor no encontrado')) {
                throw error;
            }
            throw errors_1.createError.internal('Error al eliminar profesor');
        }
    });
}
function addAsignaturaToProfesor(profesorId, asignaturaId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar que el profesor existe
            yield getProfesorById(profesorId);
            return yield profesorRepository_1.profesorRepository.addAsignatura(profesorId, asignaturaId);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Profesor no encontrado')) {
                throw error;
            }
            throw errors_1.createError.internal('Error al agregar asignatura al profesor');
        }
    });
}
function removeAsignaturaFromProfesor(profesorId, asignaturaId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar que el profesor existe
            yield getProfesorById(profesorId);
            return yield profesorRepository_1.profesorRepository.removeAsignatura(profesorId, asignaturaId);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Profesor no encontrado')) {
                throw error;
            }
            throw errors_1.createError.internal('Error al remover asignatura del profesor');
        }
    });
}
