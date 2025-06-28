import { profesorRepository } from "../repositories/profesorRepository";

export async function getAllProfesores() {
  return profesorRepository.findAll();
}

export async function getProfesorById(id: number) {
  const profesor = await profesorRepository.findById(id);
  if (!profesor) {
    throw new Error("Profesor no encontrado");
  }
  return profesor;
}

export async function createProfesor(data: {
  nombre: string;
  apellido: string;
  edad: number;
  sexo: string;
}) {
  // Validaciones básicas
  if (!data.nombre || !data.apellido) {
    throw new Error("Nombre y apellido son requeridos");
  }
  if (data.edad < 18 || data.edad > 80) {
    throw new Error("La edad debe estar entre 18 y 80 años");
  }
  if (!["M", "F"].includes(data.sexo)) {
    throw new Error("El sexo debe ser 'M' o 'F'");
  }

  return profesorRepository.create(data);
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
  // Verificar que el profesor existe
  await getProfesorById(id);

  // Validaciones básicas
  if (data.edad && (data.edad < 18 || data.edad > 80)) {
    throw new Error("La edad debe estar entre 18 y 80 años");
  }
  if (data.sexo && !["M", "F"].includes(data.sexo)) {
    throw new Error("El sexo debe ser 'M' o 'F'");
  }

  return profesorRepository.update(id, data);
}

export async function deleteProfesor(id: number) {
  // Verificar que el profesor existe
  await getProfesorById(id);

  return profesorRepository.delete(id);
}

export async function addAsignaturaToProfesor(profesorId: number, asignaturaId: number) {
  // Verificar que el profesor existe
  await getProfesorById(profesorId);

  return profesorRepository.addAsignatura(profesorId, asignaturaId);
}

export async function removeAsignaturaFromProfesor(profesorId: number, asignaturaId: number) {
  // Verificar que el profesor existe
  await getProfesorById(profesorId);

  return profesorRepository.removeAsignatura(profesorId, asignaturaId);
} 