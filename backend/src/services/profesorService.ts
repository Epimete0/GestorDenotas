import { profesorRepository } from "../repositories/profesorRepository";
import { createError } from "../config/errors";

export async function getAllProfesores() {
  try {
    return await profesorRepository.findAll();
  } catch (error) {
    throw createError.internal('Error al obtener profesores');
  }
}

export async function getProfesorById(id: number) {
  try {
    const profesor = await profesorRepository.findById(id);
    if (!profesor) {
      throw createError.notFound('Profesor no encontrado');
    }
    return profesor;
  } catch (error) {
    if (error instanceof Error && error.message === 'Profesor no encontrado') {
      throw error;
    }
    throw createError.internal('Error al obtener profesor');
  }
}

export async function createProfesor(data: {
  nombre: string;
  apellido: string;
  edad: number;
  sexo: string;
}) {
  // Validaciones básicas
  if (!data.nombre || !data.apellido) {
    throw createError.validation('Nombre y apellido son requeridos');
  }
  if (data.edad < 18 || data.edad > 80) {
    throw createError.validation('La edad debe estar entre 18 y 80 años');
  }
  if (!["M", "F"].includes(data.sexo)) {
    throw createError.validation('El sexo debe ser "M" o "F"');
  }

  try {
    return await profesorRepository.create(data);
  } catch (error) {
    throw createError.internal('Error al crear profesor');
  }
}

export async function updateProfesor(
  id: number,
  data: {
    nombre?: string;
    apellido?: string;
    edad?: number;
    sexo?: string;
  }
) {
  try {
    // Verificar que el profesor existe
    await getProfesorById(id);

    // Validaciones básicas
    if (data.edad && (data.edad < 18 || data.edad > 80)) {
      throw createError.validation('La edad debe estar entre 18 y 80 años');
    }
    if (data.sexo && !["M", "F"].includes(data.sexo)) {
      throw createError.validation('El sexo debe ser "M" o "F"');
    }

    return await profesorRepository.update(id, data);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Profesor no encontrado')) {
      throw error;
    }
    if (error instanceof Error && error.message.includes('La edad debe estar')) {
      throw error;
    }
    if (error instanceof Error && error.message.includes('El sexo debe ser')) {
      throw error;
    }
    throw createError.internal('Error al actualizar profesor');
  }
}

export async function deleteProfesor(id: number) {
  try {
    // Verificar que el profesor existe
    await getProfesorById(id);

    return await profesorRepository.delete(id);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Profesor no encontrado')) {
      throw error;
    }
    throw createError.internal('Error al eliminar profesor');
  }
}

export async function addAsignaturaToProfesor(profesorId: number, asignaturaId: number) {
  try {
    // Verificar que el profesor existe
    await getProfesorById(profesorId);

    return await profesorRepository.addAsignatura(profesorId, asignaturaId);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Profesor no encontrado')) {
      throw error;
    }
    throw createError.internal('Error al agregar asignatura al profesor');
  }
}

export async function removeAsignaturaFromProfesor(profesorId: number, asignaturaId: number) {
  try {
    // Verificar que el profesor existe
    await getProfesorById(profesorId);

    return await profesorRepository.removeAsignatura(profesorId, asignaturaId);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Profesor no encontrado')) {
      throw error;
    }
    throw createError.internal('Error al remover asignatura del profesor');
  }
} 