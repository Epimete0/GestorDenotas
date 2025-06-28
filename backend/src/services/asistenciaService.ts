import { asistenciaRepository } from "../repositories/asistenciaRepository";

export async function getAllAsistencias() {
  return asistenciaRepository.findAll();
}

export async function getAsistenciaById(id: number) {
  const asistencia = await asistenciaRepository.findById(id);
  if (!asistencia) {
    throw new Error("Asistencia no encontrada");
  }
  return asistencia;
}

export async function getAsistenciasByEstudiante(estudianteId: number) {
  return asistenciaRepository.findByEstudiante(estudianteId);
}

export async function getAsistenciasByFecha(fecha: Date) {
  return asistenciaRepository.findByFecha(fecha);
}

export async function createAsistencia(data: {
  estudianteId: number;
  fecha: Date;
  estado: "presente" | "ausente" | "tarde";
}) {
  // Validaciones básicas
  if (data.estudianteId <= 0) {
    throw new Error("ID de estudiante inválido");
  }
  if (!["presente", "ausente", "tarde"].includes(data.estado)) {
    throw new Error("Estado de asistencia inválido");
  }
  if (data.fecha > new Date()) {
    throw new Error("No se puede registrar asistencia para fechas futuras");
  }

  // Verificar si ya existe asistencia para este estudiante en esta fecha
  const existingAsistencia = await asistenciaRepository.findByEstudianteAndFecha(
    data.estudianteId,
    data.fecha
  );
  if (existingAsistencia) {
    throw new Error("Ya existe un registro de asistencia para este estudiante en esta fecha");
  }

  return asistenciaRepository.create(data);
}

export async function updateAsistencia(
  id: number,
  data: {
    fecha?: Date;
    estado?: "presente" | "ausente" | "tarde";
  }
) {
  // Verificar que la asistencia existe
  await getAsistenciaById(id);

  // Validaciones básicas
  if (data.estado && !["presente", "ausente", "tarde"].includes(data.estado)) {
    throw new Error("Estado de asistencia inválido");
  }
  if (data.fecha && data.fecha > new Date()) {
    throw new Error("No se puede registrar asistencia para fechas futuras");
  }

  return asistenciaRepository.update(id, data);
}

export async function deleteAsistencia(id: number) {
  // Verificar que la asistencia existe
  await getAsistenciaById(id);

  return asistenciaRepository.delete(id);
}

export async function getEstadisticasAsistencia() {
  const asistencias = await asistenciaRepository.findAll();
  
  const total = asistencias.length;
  const presentes = asistencias.filter((a: any) => a.estado === "presente").length;
  const ausentes = asistencias.filter((a: any) => a.estado === "ausente").length;
  const tardes = asistencias.filter((a: any) => a.estado === "tarde").length;

  return {
    total,
    presentes,
    ausentes,
    tardes,
    porcentajePresentes: total > 0 ? (presentes / total) * 100 : 0,
    porcentajeAusentes: total > 0 ? (ausentes / total) * 100 : 0,
    porcentajeTardes: total > 0 ? (tardes / total) * 100 : 0,
  };
} 