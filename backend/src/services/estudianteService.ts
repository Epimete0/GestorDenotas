// backend/src/services/estudianteService.ts
import { estudianteRepository } from "../repositories/estudianteRepository";

export async function getAllEstudiantes() {
  return estudianteRepository.findAll();
}

export async function getEstudianteById(id: number) {
  const estudiante = await estudianteRepository.findById(id);
  if (!estudiante) {
    throw new Error("Estudiante no encontrado");
  }
  return estudiante;
}

export async function createEstudiante(data: {
  nombre: string;
  apellido: string;
  edad: number;
  sexo: string;
  cursoId: number;
}) {
  // Validaciones básicas
  if (!data.nombre || !data.apellido) {
    throw new Error("Nombre y apellido son requeridos");
  }
  if (data.edad < 3 || data.edad > 25) {
    throw new Error("La edad debe estar entre 3 y 25 años");
  }
  if (!["M", "F"].includes(data.sexo)) {
    throw new Error("El sexo debe ser 'M' o 'F'");
  }
  if (data.cursoId <= 0) {
    throw new Error("ID de curso inválido");
  }

  return estudianteRepository.create(data);
}

export async function updateEstudiante(
  id: number,
  data: {
    nombre?: string;
    apellido?: string;
    edad?: number;
    sexo?: string;
    cursoId?: number;
  }
) {
  // Verificar que el estudiante existe
  await getEstudianteById(id);

  // Validaciones básicas
  if (data.edad && (data.edad < 3 || data.edad > 25)) {
    throw new Error("La edad debe estar entre 3 y 25 años");
  }
  if (data.sexo && !["M", "F"].includes(data.sexo)) {
    throw new Error("El sexo debe ser 'M' o 'F'");
  }

  return estudianteRepository.update(id, data);
}

export async function deleteEstudiante(id: number) {
  // Verificar que el estudiante existe
  await getEstudianteById(id);

  return estudianteRepository.delete(id);
}
