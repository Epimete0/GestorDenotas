import { observacionRepository } from "../repositories/observacionRepository";
import { createError } from "../config/errors";

export const observacionService = {
  findAll: async () => {
    try {
      return await observacionRepository.findAll();
    } catch (error) {
      throw createError.internal('Error al obtener observaciones');
    }
  },
  
  findById: async (id: number) => {
    try {
      const observacion = await observacionRepository.findById(id);
      if (!observacion) {
        throw createError.notFound('Observación no encontrada');
      }
      return observacion;
    } catch (error) {
      if (error instanceof Error && error.message === 'Observación no encontrada') {
        throw error;
      }
      throw createError.internal('Error al obtener observación');
    }
  },
  
  findByEstudiante: async (estudianteId: number) => {
    try {
      return await observacionRepository.findByEstudiante(estudianteId);
    } catch (error) {
      throw createError.internal('Error al obtener observaciones por estudiante');
    }
  },
  
  findByProfesor: async (profesorId: number) => {
    try {
      return await observacionRepository.findByProfesor(profesorId);
    } catch (error) {
      throw createError.internal('Error al obtener observaciones por profesor');
    }
  },
  
  create: async (data: { estudianteId: number; profesorId: number; texto: string; estado?: "negativa" | "neutro" | "positiva" }) => {
    // Validaciones básicas
    if (!data.texto || data.texto.trim().length === 0) {
      throw createError.validation('El texto de la observación es requerido');
    }
    if (data.estado && !["negativa", "neutro", "positiva"].includes(data.estado)) {
      throw createError.validation('Estado de observación inválido');
    }
    
    try {
      return await observacionRepository.create(data);
    } catch (error) {
      throw createError.internal('Error al crear observación');
    }
  },
  
  update: async (id: number, data: { texto?: string; estado?: "negativa" | "neutro" | "positiva" }) => {
    try {
      // Verificar que la observación existe
      await observacionService.findById(id);
      
      // Validaciones básicas
      if (data.texto && data.texto.trim().length === 0) {
        throw createError.validation('El texto de la observación no puede estar vacío');
      }
      if (data.estado && !["negativa", "neutro", "positiva"].includes(data.estado)) {
        throw createError.validation('Estado de observación inválido');
      }
      
      return await observacionRepository.update(id, data);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Observación no encontrada')) {
        throw error;
      }
      if (error instanceof Error && error.message.includes('El texto de la observación')) {
        throw error;
      }
      if (error instanceof Error && error.message.includes('Estado de observación inválido')) {
        throw error;
      }
      throw createError.internal('Error al actualizar observación');
    }
  },
  
  delete: async (id: number) => {
    try {
      // Verificar que la observación existe
      await observacionService.findById(id);
      
      return await observacionRepository.delete(id);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Observación no encontrada')) {
        throw error;
      }
      throw createError.internal('Error al eliminar observación');
    }
  },
}; 