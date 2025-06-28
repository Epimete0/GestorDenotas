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
function getAllEstudiantes() {
    return __awaiter(this, void 0, void 0, function* () {
        return estudianteRepository_1.estudianteRepository.findAll();
    });
}
function getEstudianteById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const estudiante = yield estudianteRepository_1.estudianteRepository.findById(id);
        if (!estudiante) {
            throw new Error("Estudiante no encontrado");
        }
        return estudiante;
    });
}
function createEstudiante(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validaciones básicas
        if (!data.nombre || !data.apellido) {
            throw new Error("Nombre y apellido son requeridos");
        }
        if (data.edad < 3 || data.edad > 25) {
            throw new Error("La edad debe estar entre 3 y 25 años");
        }
        if (!["M", "F"].includes(data.sexo)) {
            throw new Error("El sexo debe ser 'M' o 'F'");
        }
        if (data.cursoId <= 0) {
            throw new Error("ID de curso inválido");
        }
        return estudianteRepository_1.estudianteRepository.create(data);
    });
}
function updateEstudiante(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que el estudiante existe
        yield getEstudianteById(id);
        // Validaciones básicas
        if (data.edad && (data.edad < 3 || data.edad > 25)) {
            throw new Error("La edad debe estar entre 3 y 25 años");
        }
        if (data.sexo && !["M", "F"].includes(data.sexo)) {
            throw new Error("El sexo debe ser 'M' o 'F'");
        }
        return estudianteRepository_1.estudianteRepository.update(id, data);
    });
}
function deleteEstudiante(id) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que el estudiante existe
        yield getEstudianteById(id);
        return estudianteRepository_1.estudianteRepository.delete(id);
    });
}
