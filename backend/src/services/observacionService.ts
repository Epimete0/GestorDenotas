import { observacionRepository } from "../repositories/observacionRepository";

export const observacionService = {
  findAll: () => observacionRepository.findAll(),
  findById: (id: number) => observacionRepository.findById(id),
  findByEstudiante: (estudianteId: number) => observacionRepository.findByEstudiante(estudianteId),
  findByProfesor: (profesorId: number) => observacionRepository.findByProfesor(profesorId),
  create: (data: { estudianteId: number; profesorId: number; texto: string; estado?: "negativa" | "neutro" | "positiva" }) => observacionRepository.create(data),
  update: (id: number, data: { texto?: string; estado?: "negativa" | "neutro" | "positiva" }) => observacionRepository.update(id, data),
  delete: (id: number) => observacionRepository.delete(id),
}; 