// backend/src/services/gradeService.ts
import { gradeRepository } from "../repositories/gradeRepository";
import { createError } from "../config/errors";

/**
 * Registra una nueva calificación para un estudiante en una asignatura,
 * indicando también el profesor que la asigna.
 *
 * @param estudianteId  ID del estudiante
 * @param asignaturaId  ID de la asignatura
 * @param profesorId    ID del profesor que registra la nota
 * @param valor         Valor numérico de la calificación
 */
export async function addGrade(
  estudianteId: number,
  asignaturaId: number,
  profesorId: number,
  valor: number
) {
  // Validaciones básicas
  if (estudianteId <= 0) {
    throw createError.validation('ID de estudiante inválido');
  }
  if (asignaturaId <= 0) {
    throw createError.validation('ID de asignatura inválido');
  }
  if (profesorId <= 0) {
    throw createError.validation('ID de profesor inválido');
  }
  if (valor < 1.0 || valor > 7.0) {
    throw createError.validation('La calificación debe estar entre 1.0 y 7.0');
  }

  try {
    return await gradeRepository.create({
    estudianteId,
    asignaturaId,
    profesorId,
    valor,
  });
  } catch (error) {
    throw createError.internal('Error al crear calificación');
  }
}

/**
 * Obtiene todas las calificaciones de un estudiante dado,
 * incluyendo nombres de asignatura y profesor.
 *
 * @param estudianteId  ID del estudiante
 */
export async function getGrades(estudianteId: number) {
  if (estudianteId <= 0) {
    throw createError.validation('ID de estudiante inválido');
  }

  try {
  const calificaciones = await gradeRepository.findByEstudiante(estudianteId);
  return calificaciones || [];
  } catch (error) {
    throw createError.internal('Error al obtener calificaciones del estudiante');
  }
}

/**
 * Obtiene todas las calificaciones del sistema,
 * incluyendo nombres de asignatura y profesor.
 */
export async function getAllGrades() {
  try {
    return await gradeRepository.findAll();
  } catch (error) {
    throw createError.internal('Error al obtener todas las calificaciones');
  }
}

export async function getGradeById(id: number) {
  if (id <= 0) {
    throw createError.validation('ID de calificación inválido');
  }
  
  try {
  const grade = await gradeRepository.findById(id);
  if (!grade) {
      throw createError.notFound('Calificación no encontrada');
  }
  return grade;
  } catch (error) {
    if (error instanceof Error && error.message === 'Calificación no encontrada') {
      throw error;
    }
    throw createError.internal('Error al obtener calificación');
  }
}

export async function updateGrade(
  id: number,
  data: {
    valor?: number;
    asignaturaId?: number;
    profesorId?: number;
  }
) {
  try {
  // Verificar que la calificación existe
  await getGradeById(id);

  // Validaciones básicas
  if (data.valor && (data.valor < 1.0 || data.valor > 7.0)) {
      throw createError.validation('La calificación debe estar entre 1.0 y 7.0');
  }
  if (data.asignaturaId && data.asignaturaId <= 0) {
      throw createError.validation('ID de asignatura inválido');
  }
  if (data.profesorId && data.profesorId <= 0) {
      throw createError.validation('ID de profesor inválido');
  }

    return await gradeRepository.update(id, data);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Calificación no encontrada')) {
      throw error;
    }
    if (error instanceof Error && error.message.includes('La calificación debe estar')) {
      throw error;
    }
    if (error instanceof Error && error.message.includes('ID de')) {
      throw error;
    }
    throw createError.internal('Error al actualizar calificación');
  }
}

export async function deleteGrade(id: number) {
  try {
  // Verificar que la calificación existe
  await getGradeById(id);

    return await gradeRepository.delete(id);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Calificación no encontrada')) {
      throw error;
    }
    throw createError.internal('Error al eliminar calificación');
  }
}

export async function getGradesByAsignatura(asignaturaId: number) {
  if (asignaturaId <= 0) {
    throw createError.validation('ID de asignatura inválido');
  }

  try {
    return await gradeRepository.findByAsignatura(asignaturaId);
  } catch (error) {
    throw createError.internal('Error al obtener calificaciones por asignatura');
  }
}

export async function getGradesByProfesor(profesorId: number) {
  if (profesorId <= 0) {
    throw createError.validation('ID de profesor inválido');
  }

  try {
    return await gradeRepository.findByProfesor(profesorId);
  } catch (error) {
    throw createError.internal('Error al obtener calificaciones por profesor');
  }
}

export async function getEstadisticasCalificaciones() {
  try {
  const calificaciones = await gradeRepository.findAll();
  
  const total = calificaciones.length;
  const promedio = total > 0 ? calificaciones.reduce((sum: number, g: any) => sum + g.valor, 0) / total : 0;
  const aprobadas = calificaciones.filter((g: any) => g.valor >= 4.0).length;
  const reprobadas = calificaciones.filter((g: any) => g.valor < 4.0).length;

  return {
    total,
    promedio,
    aprobadas,
    reprobadas,
    porcentajeAprobacion: total > 0 ? (aprobadas / total) * 100 : 0,
  };
  } catch (error) {
    throw createError.internal('Error al obtener estadísticas de calificaciones');
  }
}
