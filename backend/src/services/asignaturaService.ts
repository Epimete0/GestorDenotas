import { asignaturaRepository } from "../repositories/asignaturaRepository";
import { createError } from "../config/errors";

export async function getAllAsignaturas() {
  try {
    return await asignaturaRepository.findAll();
  } catch (error) {
    throw createError.internal('Error al obtener asignaturas');
  }
}

export async function getAsignaturaById(id: number) {
  try {
    const asignatura = await asignaturaRepository.findById(id);
    if (!asignatura) {
      throw createError.notFound('Asignatura no encontrada');
    }
    return asignatura;
  } catch (error) {
    if (error instanceof Error && error.message === 'Asignatura no encontrada') {
      throw error;
    }
    throw createError.internal('Error al obtener asignatura');
  }
}

export async function createAsignatura(data: { nombre: string }) {
  // Validaciones básicas
  if (!data.nombre || data.nombre.trim().length === 0) {
    throw createError.validation('El nombre de la asignatura es requerido');
  }

  try {
    return await asignaturaRepository.create(data);
  } catch (error) {
    throw createError.internal('Error al crear asignatura');
  }
}

export async function updateAsignatura(id: number, data: { nombre?: string }) {
  try {
    // Verificar que la asignatura existe
    await getAsignaturaById(id);

    // Validaciones básicas
    if (data.nombre && data.nombre.trim().length === 0) {
      throw createError.validation('El nombre de la asignatura no puede estar vacío');
    }

    return await asignaturaRepository.update(id, data);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Asignatura no encontrada')) {
      throw error;
    }
    if (error instanceof Error && error.message.includes('El nombre de la asignatura')) {
      throw error;
    }
    throw createError.internal('Error al actualizar asignatura');
  }
}

export async function deleteAsignatura(id: number) {
  try {
    // Verificar que la asignatura existe
    await getAsignaturaById(id);

    return await asignaturaRepository.delete(id);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Asignatura no encontrada')) {
      throw error;
    }
    throw createError.internal('Error al eliminar asignatura');
  }
}

export async function addProfesorToAsignatura(asignaturaId: number, profesorId: number) {
  try {
    // Verificar que la asignatura existe
    await getAsignaturaById(asignaturaId);

    return await asignaturaRepository.addProfesor(asignaturaId, profesorId);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Asignatura no encontrada')) {
      throw error;
    }
    throw createError.internal('Error al agregar profesor a asignatura');
  }
}

export async function removeProfesorFromAsignatura(asignaturaId: number, profesorId: number) {
  try {
    // Verificar que la asignatura existe
    await getAsignaturaById(asignaturaId);

    return await asignaturaRepository.removeProfesor(asignaturaId, profesorId);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Asignatura no encontrada')) {
      throw error;
    }
    throw createError.internal('Error al remover profesor de asignatura');
  }
} 