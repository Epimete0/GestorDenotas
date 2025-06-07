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
  return gradeRepository.create(estudianteId, asignaturaId, profesorId, valor);
}

/**
 * Obtiene todas las calificaciones de un estudiante dado,
 * incluyendo nombres de asignatura y profesor.
 *
 * @param estudianteId  ID del estudiante
 */
export async function getGrades(estudianteId: number) {
  return gradeRepository.findByEstudiante(estudianteId);
}
