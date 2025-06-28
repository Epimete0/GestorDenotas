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
exports.getAllAsistencias = getAllAsistencias;
exports.getAsistenciaById = getAsistenciaById;
exports.getAsistenciasByEstudiante = getAsistenciasByEstudiante;
exports.getAsistenciasByFecha = getAsistenciasByFecha;
exports.createAsistencia = createAsistencia;
exports.updateAsistencia = updateAsistencia;
exports.deleteAsistencia = deleteAsistencia;
exports.getEstadisticasAsistencia = getEstadisticasAsistencia;
const asistenciaRepository_1 = require("../repositories/asistenciaRepository");
function getAllAsistencias() {
    return __awaiter(this, void 0, void 0, function* () {
        return asistenciaRepository_1.asistenciaRepository.findAll();
    });
}
function getAsistenciaById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const asistencia = yield asistenciaRepository_1.asistenciaRepository.findById(id);
        if (!asistencia) {
            throw new Error("Asistencia no encontrada");
        }
        return asistencia;
    });
}
function getAsistenciasByEstudiante(estudianteId) {
    return __awaiter(this, void 0, void 0, function* () {
        return asistenciaRepository_1.asistenciaRepository.findByEstudiante(estudianteId);
    });
}
function getAsistenciasByFecha(fecha) {
    return __awaiter(this, void 0, void 0, function* () {
        return asistenciaRepository_1.asistenciaRepository.findByFecha(fecha);
    });
}
function createAsistencia(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validaciones básicas
        if (data.estudianteId <= 0) {
            throw new Error("ID de estudiante inválido");
        }
        if (!["presente", "ausente", "tarde"].includes(data.estado)) {
            throw new Error("Estado de asistencia inválido");
        }
        if (data.fecha > new Date()) {
            throw new Error("No se puede registrar asistencia para fechas futuras");
        }
        // Verificar si ya existe asistencia para este estudiante en esta fecha
        const existingAsistencia = yield asistenciaRepository_1.asistenciaRepository.findByEstudianteAndFecha(data.estudianteId, data.fecha);
        if (existingAsistencia) {
            throw new Error("Ya existe un registro de asistencia para este estudiante en esta fecha");
        }
        return asistenciaRepository_1.asistenciaRepository.create(data);
    });
}
function updateAsistencia(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que la asistencia existe
        yield getAsistenciaById(id);
        // Validaciones básicas
        if (data.estado && !["presente", "ausente", "tarde"].includes(data.estado)) {
            throw new Error("Estado de asistencia inválido");
        }
        if (data.fecha && data.fecha > new Date()) {
            throw new Error("No se puede registrar asistencia para fechas futuras");
        }
        return asistenciaRepository_1.asistenciaRepository.update(id, data);
    });
}
function deleteAsistencia(id) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar que la asistencia existe
        yield getAsistenciaById(id);
        return asistenciaRepository_1.asistenciaRepository.delete(id);
    });
}
function getEstadisticasAsistencia() {
    return __awaiter(this, void 0, void 0, function* () {
        const asistencias = yield asistenciaRepository_1.asistenciaRepository.findAll();
        const total = asistencias.length;
        const presentes = asistencias.filter((a) => a.estado === "presente").length;
        const ausentes = asistencias.filter((a) => a.estado === "ausente").length;
        const tardes = asistencias.filter((a) => a.estado === "tarde").length;
        return {
            total,
            presentes,
            ausentes,
            tardes,
            porcentajePresentes: total > 0 ? (presentes / total) * 100 : 0,
            porcentajeAusentes: total > 0 ? (ausentes / total) * 100 : 0,
            porcentajeTardes: total > 0 ? (tardes / total) * 100 : 0,
        };
    });
}
