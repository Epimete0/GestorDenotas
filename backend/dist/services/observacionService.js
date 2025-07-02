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
exports.observacionService = void 0;
const observacionRepository_1 = require("../repositories/observacionRepository");
const errors_1 = require("../config/errors");
exports.observacionService = {
    findAll: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield observacionRepository_1.observacionRepository.findAll();
        }
        catch (error) {
            throw errors_1.createError.internal('Error al obtener observaciones');
        }
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const observacion = yield observacionRepository_1.observacionRepository.findById(id);
            if (!observacion) {
                throw errors_1.createError.notFound('Observación no encontrada');
            }
            return observacion;
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Observación no encontrada') {
                throw error;
            }
            throw errors_1.createError.internal('Error al obtener observación');
        }
    }),
    findByEstudiante: (estudianteId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield observacionRepository_1.observacionRepository.findByEstudiante(estudianteId);
        }
        catch (error) {
            throw errors_1.createError.internal('Error al obtener observaciones por estudiante');
        }
    }),
    findByProfesor: (profesorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield observacionRepository_1.observacionRepository.findByProfesor(profesorId);
        }
        catch (error) {
            throw errors_1.createError.internal('Error al obtener observaciones por profesor');
        }
    }),
    create: (data) => __awaiter(void 0, void 0, void 0, function* () {
        // Validaciones básicas
        if (!data.texto || data.texto.trim().length === 0) {
            throw errors_1.createError.validation('El texto de la observación es requerido');
        }
        if (data.estado && !["negativa", "neutro", "positiva"].includes(data.estado)) {
            throw errors_1.createError.validation('Estado de observación inválido');
        }
        try {
            return yield observacionRepository_1.observacionRepository.create(data);
        }
        catch (error) {
            throw errors_1.createError.internal('Error al crear observación');
        }
    }),
    update: (id, data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Verificar que la observación existe
            yield exports.observacionService.findById(id);
            // Validaciones básicas
            if (data.texto && data.texto.trim().length === 0) {
                throw errors_1.createError.validation('El texto de la observación no puede estar vacío');
            }
            if (data.estado && !["negativa", "neutro", "positiva"].includes(data.estado)) {
                throw errors_1.createError.validation('Estado de observación inválido');
            }
            return yield observacionRepository_1.observacionRepository.update(id, data);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Observación no encontrada')) {
                throw error;
            }
            if (error instanceof Error && error.message.includes('El texto de la observación')) {
                throw error;
            }
            if (error instanceof Error && error.message.includes('Estado de observación inválido')) {
                throw error;
            }
            throw errors_1.createError.internal('Error al actualizar observación');
        }
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Verificar que la observación existe
            yield exports.observacionService.findById(id);
            return yield observacionRepository_1.observacionRepository.delete(id);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Observación no encontrada')) {
                throw error;
            }
            throw errors_1.createError.internal('Error al eliminar observación');
        }
    }),
};
