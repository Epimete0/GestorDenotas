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
exports.getAllEstudiantes = getAllEstudiantes;
exports.getEstudianteById = getEstudianteById;
exports.createEstudiante = createEstudiante;
exports.updateEstudiante = updateEstudiante;
exports.deleteEstudiante = deleteEstudiante;
// backend/src/services/estudianteService.ts
const estudianteRepository_1 = require("../repositories/estudianteRepository");
const errors_1 = require("../config/errors");
function getAllEstudiantes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield estudianteRepository_1.estudianteRepository.findAll();
        }
        catch (error) {
            throw errors_1.createError.internal('Error al obtener estudiantes');
        }
    });
}
function getEstudianteById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const estudiante = yield estudianteRepository_1.estudianteRepository.findById(id);
            if (!estudiante) {
                throw errors_1.createError.notFound('Estudiante no encontrado');
            }
            return estudiante;
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Estudiante no encontrado') {
                throw error;
            }
            throw errors_1.createError.internal('Error al obtener estudiante');
        }
    });
}
function createEstudiante(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validaciones básicas
        if (!data.nombre || !data.apellido) {
            throw errors_1.createError.validation('Nombre y apellido son requeridos');
        }
        if (data.edad < 3 || data.edad > 25) {
            throw errors_1.createError.validation('La edad debe estar entre 3 y 25 años');
        }
        if (!["M", "F"].includes(data.sexo)) {
            throw errors_1.createError.validation('El sexo debe ser "M" o "F"');
        }
        if (data.cursoId <= 0) {
            throw errors_1.createError.validation('ID de curso inválido');
        }
        try {
            return yield estudianteRepository_1.estudianteRepository.create(data);
        }
        catch (error) {
            throw errors_1.createError.internal('Error al crear estudiante');
        }
    });
}
function updateEstudiante(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar que el estudiante existe
            yield getEstudianteById(id);
            // Validaciones básicas
            if (data.edad && (data.edad < 3 || data.edad > 25)) {
                throw errors_1.createError.validation('La edad debe estar entre 3 y 25 años');
            }
            if (data.sexo && !["M", "F"].includes(data.sexo)) {
                throw errors_1.createError.validation('El sexo debe ser "M" o "F"');
            }
            return yield estudianteRepository_1.estudianteRepository.update(id, data);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Estudiante no encontrado')) {
                throw error;
            }
            if (error instanceof Error && error.message.includes('La edad debe estar')) {
                throw error;
            }
            if (error instanceof Error && error.message.includes('El sexo debe ser')) {
                throw error;
            }
            throw errors_1.createError.internal('Error al actualizar estudiante');
        }
    });
}
function deleteEstudiante(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar que el estudiante existe
            yield getEstudianteById(id);
            return yield estudianteRepository_1.estudianteRepository.delete(id);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Estudiante no encontrado')) {
                throw error;
            }
            throw errors_1.createError.internal('Error al eliminar estudiante');
        }
    });
}
