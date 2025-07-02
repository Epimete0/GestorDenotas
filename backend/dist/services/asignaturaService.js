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
exports.getAllAsignaturas = getAllAsignaturas;
exports.getAsignaturaById = getAsignaturaById;
exports.createAsignatura = createAsignatura;
exports.updateAsignatura = updateAsignatura;
exports.deleteAsignatura = deleteAsignatura;
exports.addProfesorToAsignatura = addProfesorToAsignatura;
exports.removeProfesorFromAsignatura = removeProfesorFromAsignatura;
const asignaturaRepository_1 = require("../repositories/asignaturaRepository");
const errors_1 = require("../config/errors");
function getAllAsignaturas() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield asignaturaRepository_1.asignaturaRepository.findAll();
        }
        catch (error) {
            throw errors_1.createError.internal('Error al obtener asignaturas');
        }
    });
}
function getAsignaturaById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const asignatura = yield asignaturaRepository_1.asignaturaRepository.findById(id);
            if (!asignatura) {
                throw errors_1.createError.notFound('Asignatura no encontrada');
            }
            return asignatura;
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Asignatura no encontrada') {
                throw error;
            }
            throw errors_1.createError.internal('Error al obtener asignatura');
        }
    });
}
function createAsignatura(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validaciones básicas
        if (!data.nombre || data.nombre.trim().length === 0) {
            throw errors_1.createError.validation('El nombre de la asignatura es requerido');
        }
        try {
            return yield asignaturaRepository_1.asignaturaRepository.create(data);
        }
        catch (error) {
            throw errors_1.createError.internal('Error al crear asignatura');
        }
    });
}
function updateAsignatura(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar que la asignatura existe
            yield getAsignaturaById(id);
            // Validaciones básicas
            if (data.nombre && data.nombre.trim().length === 0) {
                throw errors_1.createError.validation('El nombre de la asignatura no puede estar vacío');
            }
            return yield asignaturaRepository_1.asignaturaRepository.update(id, data);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Asignatura no encontrada')) {
                throw error;
            }
            if (error instanceof Error && error.message.includes('El nombre de la asignatura')) {
                throw error;
            }
            throw errors_1.createError.internal('Error al actualizar asignatura');
        }
    });
}
function deleteAsignatura(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar que la asignatura existe
            yield getAsignaturaById(id);
            return yield asignaturaRepository_1.asignaturaRepository.delete(id);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Asignatura no encontrada')) {
                throw error;
            }
            throw errors_1.createError.internal('Error al eliminar asignatura');
        }
    });
}
function addProfesorToAsignatura(asignaturaId, profesorId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar que la asignatura existe
            yield getAsignaturaById(asignaturaId);
            return yield asignaturaRepository_1.asignaturaRepository.addProfesor(asignaturaId, profesorId);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Asignatura no encontrada')) {
                throw error;
            }
            throw errors_1.createError.internal('Error al agregar profesor a asignatura');
        }
    });
}
function removeProfesorFromAsignatura(asignaturaId, profesorId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar que la asignatura existe
            yield getAsignaturaById(asignaturaId);
            return yield asignaturaRepository_1.asignaturaRepository.removeProfesor(asignaturaId, profesorId);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Asignatura no encontrada')) {
                throw error;
            }
            throw errors_1.createError.internal('Error al remover profesor de asignatura');
        }
    });
}
