"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observacionService = void 0;
const observacionRepository_1 = require("../repositories/observacionRepository");
exports.observacionService = {
    findAll: () => observacionRepository_1.observacionRepository.findAll(),
    findById: (id) => observacionRepository_1.observacionRepository.findById(id),
    findByEstudiante: (estudianteId) => observacionRepository_1.observacionRepository.findByEstudiante(estudianteId),
    create: (data) => observacionRepository_1.observacionRepository.create(data),
    update: (id, data) => observacionRepository_1.observacionRepository.update(id, data),
    delete: (id) => observacionRepository_1.observacionRepository.delete(id),
};
