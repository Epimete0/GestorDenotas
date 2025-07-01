// backend/src/services/courseService.ts
import { courseRepository } from "../repositories/courseRepository";

export async function getAllCourses() {
  return courseRepository.findAll();
}

export async function getCourseById(id: number) {
  const course = await courseRepository.findById(id);
  if (!course) {
    throw new Error("Curso no encontrado");
  }
  return course;
}

export async function createCourse(data: {
  nombre: string;
  jefeId: number;
}) {
  // Validaciones básicas
  if (!data.nombre || data.nombre.trim().length === 0) {
    throw new Error("El nombre del curso es requerido");
  }
  if (data.jefeId <= 0) {
    throw new Error("ID de jefe de curso inválido");
  }

  return courseRepository.create(data);
}

export async function updateCourse(
  id: number,
  data: {
    nombre?: string;
    jefeId?: number;
  }
) {
  // Verificar que el curso existe
  await getCourseById(id);

  // Validaciones básicas
  if (data.nombre && data.nombre.trim().length === 0) {
    throw new Error("El nombre del curso no puede estar vacío");
  }
  if (data.jefeId && data.jefeId <= 0) {
    throw new Error("ID de jefe de curso inválido");
  }

  return courseRepository.update(id, data);
}

export async function deleteCourse(id: number) {
  // Verificar que el curso existe
  await getCourseById(id);

  return courseRepository.delete(id);
}

export async function addAsignaturaToCourse(cursoId: number, asignaturaId: number) {
  // Verificar que el curso existe
  await getCourseById(cursoId);

  return courseRepository.addAsignatura(cursoId, asignaturaId);
}

export async function removeAsignaturaFromCourse(cursoId: number, asignaturaId: number) {
  // Verificar que el curso existe
  await getCourseById(cursoId);

  return courseRepository.removeAsignatura(cursoId, asignaturaId);
}

export async function getCoursesByProfesor(profesorId: number) {
  if (!profesorId || profesorId <= 0) {
    throw new Error("ID de profesor inválido");
  }
  return courseRepository.findByProfesor(profesorId);
}
