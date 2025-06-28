import { asignaturaRepository } from "../repositories/asignaturaRepository";

export async function getAllAsignaturas() {
  return asignaturaRepository.findAll();
}

export async function getAsignaturaById(id: number) {
  const asignatura = await asignaturaRepository.findById(id);
  if (!asignatura) {
    throw new Error("Asignatura no encontrada");
  }
  return asignatura;
}

export async function createAsignatura(data: { nombre: string }) {
  // Validaciones básicas
  if (!data.nombre || data.nombre.trim().length === 0) {
    throw new Error("El nombre de la asignatura es requerido");
  }

  return asignaturaRepository.create(data);
}

export async function updateAsignatura(id: number, data: { nombre?: string }) {
  // Verificar que la asignatura existe
  await getAsignaturaById(id);

  // Validaciones básicas
  if (data.nombre && data.nombre.trim().length === 0) {
    throw new Error("El nombre de la asignatura no puede estar vacío");
  }

  return asignaturaRepository.update(id, data);
}

export async function deleteAsignatura(id: number) {
  // Verificar que la asignatura existe
  await getAsignaturaById(id);

  return asignaturaRepository.delete(id);
}

export async function addProfesorToAsignatura(asignaturaId: number, profesorId: number) {
  // Verificar que la asignatura existe
  await getAsignaturaById(asignaturaId);

  return asignaturaRepository.addProfesor(asignaturaId, profesorId);
}

export async function removeProfesorFromAsignatura(asignaturaId: number, profesorId: number) {
  // Verificar que la asignatura existe
  await getAsignaturaById(asignaturaId);

  return asignaturaRepository.removeProfesor(asignaturaId, profesorId);
} 