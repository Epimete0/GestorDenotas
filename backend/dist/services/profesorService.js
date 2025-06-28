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
function getAllProfesores() {
    return __awaiter(this, void 0, void 0, function* () {
        return profesorRepository_1.profesorRepository.findAll();
    });
}
function getProfesorById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const profesor = yield profesorRepository_1.profesorRepository.findById(id);
        if (!profesor) {
            throw new Error("Profesor no encontrado");
        }
        return profesor;
    });
}
function createProfesor(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validaciones básicas
        if (!data.nombre || !data.apellido) {
            throw new Error("Nombre y apellido son requeridos");
        }
        if (data.edad < 18 || data.edad > 80) {
            throw new Error("La edad debe estar entre 18 y 80 años");
        }
        if (!["M", "F"].includes(data.sexo)) {
            throw new Error("El sexo debe ser 'M' o 'F'");
        }
        return profesorRepository_1.profesorRepository.create(data);
    });
}
function updateProfesor(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que el profesor existe
        yield getProfesorById(id);
        // Validaciones básicas
        if (data.edad && (data.edad < 18 || data.edad > 80)) {
            throw new Error("La edad debe estar entre 18 y 80 años");
        }
        if (data.sexo && !["M", "F"].includes(data.sexo)) {
            throw new Error("El sexo debe ser 'M' o 'F'");
        }
        return profesorRepository_1.profesorRepository.update(id, data);
    });
}
function deleteProfesor(id) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que el profesor existe
        yield getProfesorById(id);
        return profesorRepository_1.profesorRepository.delete(id);
    });
}
function addAsignaturaToProfesor(profesorId, asignaturaId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que el profesor existe
        yield getProfesorById(profesorId);
        return profesorRepository_1.profesorRepository.addAsignatura(profesorId, asignaturaId);
    });
}
function removeAsignaturaFromProfesor(profesorId, asignaturaId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que el profesor existe
        yield getProfesorById(profesorId);
        return profesorRepository_1.profesorRepository.removeAsignatura(profesorId, asignaturaId);
    });
}
