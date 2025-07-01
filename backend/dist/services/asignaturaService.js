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
function getAllAsignaturas() {
    return __awaiter(this, void 0, void 0, function* () {
        return asignaturaRepository_1.asignaturaRepository.findAll();
    });
}
function getAsignaturaById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const asignatura = yield asignaturaRepository_1.asignaturaRepository.findById(id);
        if (!asignatura) {
            throw new Error("Asignatura no encontrada");
        }
        return asignatura;
    });
}
function createAsignatura(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validaciones básicas
        if (!data.nombre || data.nombre.trim().length === 0) {
            throw new Error("El nombre de la asignatura es requerido");
        }
        return asignaturaRepository_1.asignaturaRepository.create(data);
    });
}
function updateAsignatura(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que la asignatura existe
        yield getAsignaturaById(id);
        // Validaciones básicas
        if (data.nombre && data.nombre.trim().length === 0) {
            throw new Error("El nombre de la asignatura no puede estar vacío");
        }
        return asignaturaRepository_1.asignaturaRepository.update(id, data);
    });
}
function deleteAsignatura(id) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que la asignatura existe
        yield getAsignaturaById(id);
        return asignaturaRepository_1.asignaturaRepository.delete(id);
    });
}
function addProfesorToAsignatura(asignaturaId, profesorId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que la asignatura existe
        yield getAsignaturaById(asignaturaId);
        return asignaturaRepository_1.asignaturaRepository.addProfesor(asignaturaId, profesorId);
    });
}
function removeProfesorFromAsignatura(asignaturaId, profesorId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que la asignatura existe
        yield getAsignaturaById(asignaturaId);
        return asignaturaRepository_1.asignaturaRepository.removeProfesor(asignaturaId, profesorId);
    });
}
