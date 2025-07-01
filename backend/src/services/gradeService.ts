// backend/src/services/gradeService.ts
import { gradeRepository } from "../repositories/gradeRepository";

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
    throw new Error("ID de estudiante inválido");
  }
  if (asignaturaId <= 0) {
    throw new Error("ID de asignatura inválido");
  }
  if (profesorId <= 0) {
    throw new Error("ID de profesor inválido");
  }
  if (valor < 1.0 || valor > 7.0) {
    throw new Error("La calificación debe estar entre 1.0 y 7.0");
  }

  return gradeRepository.create({
    estudianteId,
    asignaturaId,
    profesorId,
    valor,
  });
}

/**
 * Obtiene todas las calificaciones de un estudiante dado,
 * incluyendo nombres de asignatura y profesor.
 *
 * @param estudianteId  ID del estudiante
 */
export async function getGrades(estudianteId: number) {
  if (estudianteId <= 0) {
    throw new Error("ID de estudiante inválido");
  }

  const calificaciones = await gradeRepository.findByEstudiante(estudianteId);
  return calificaciones || [];
}

/**
 * Obtiene todas las calificaciones del sistema,
 * incluyendo nombres de asignatura y profesor.
 */
export async function getAllGrades() {
  return gradeRepository.findAll();
}

export async function getGradeById(id: number) {
  if (id <= 0) {
    throw new Error("ID de calificación inválido");
  }
  
  const grade = await gradeRepository.findById(id);
  if (!grade) {
    throw new Error("Calificación no encontrada");
  }
  return grade;
}

export async function updateGrade(
  id: number,
  data: {
    valor?: number;
    asignaturaId?: number;
    profesorId?: number;
  }
) {
  // Verificar que la calificación existe
  await getGradeById(id);

  // Validaciones básicas
  if (data.valor && (data.valor < 1.0 || data.valor > 7.0)) {
    throw new Error("La calificación debe estar entre 1.0 y 7.0");
  }
  if (data.asignaturaId && data.asignaturaId <= 0) {
    throw new Error("ID de asignatura inválido");
  }
  if (data.profesorId && data.profesorId <= 0) {
    throw new Error("ID de profesor inválido");
  }

  return gradeRepository.update(id, data);
}

export async function deleteGrade(id: number) {
  // Verificar que la calificación existe
  await getGradeById(id);

  return gradeRepository.delete(id);
}

export async function getGradesByAsignatura(asignaturaId: number) {
  if (asignaturaId <= 0) {
    throw new Error("ID de asignatura inválido");
  }

  return gradeRepository.findByAsignatura(asignaturaId);
}

export async function getGradesByProfesor(profesorId: number) {
  if (profesorId <= 0) {
    throw new Error("ID de profesor inválido");
  }

  return gradeRepository.findByProfesor(profesorId);
}

export async function getEstadisticasCalificaciones() {
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
}
