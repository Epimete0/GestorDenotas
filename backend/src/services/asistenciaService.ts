import { asistenciaRepository } from "../repositories/asistenciaRepository";
import { createError } from "../config/errors";

export async function getAllAsistencias() {
  try {
    return await asistenciaRepository.findAll();
  } catch (error) {
    throw createError.internal('Error al obtener asistencias');
  }
}

export async function getAsistenciaById(id: number) {
  try {
    const asistencia = await asistenciaRepository.findById(id);
    if (!asistencia) {
      throw createError.notFound('Asistencia no encontrada');
    }
    return asistencia;
  } catch (error) {
    if (error instanceof Error && error.message === 'Asistencia no encontrada') {
      throw error;
    }
    throw createError.internal('Error al obtener asistencia');
  }
}

export async function getAsistenciasByEstudiante(estudianteId: number) {
  try {
    return await asistenciaRepository.findByEstudiante(estudianteId);
  } catch (error) {
    throw createError.internal('Error al obtener asistencias por estudiante');
  }
}

export async function getAsistenciasByFecha(fecha: Date) {
  try {
    return await asistenciaRepository.findByFecha(fecha);
  } catch (error) {
    throw createError.internal('Error al obtener asistencias por fecha');
  }
}

export async function createAsistencia(data: {
  estudianteId: number;
  fecha: Date;
  estado: "presente" | "ausente" | "tarde";
}) {
  // Validaciones básicas
  if (data.estudianteId <= 0) {
    throw createError.validation('ID de estudiante inválido');
  }
  if (!["presente", "ausente", "tarde"].includes(data.estado)) {
    throw createError.validation('Estado de asistencia inválido');
  }
  if (data.fecha > new Date()) {
    throw createError.validation('No se puede registrar asistencia para fechas futuras');
  }

  try {
    // Verificar si ya existe asistencia para este estudiante en esta fecha
    const existingAsistencia = await asistenciaRepository.findByEstudianteAndFecha(
      data.estudianteId,
      data.fecha
    );
    if (existingAsistencia) {
      throw createError.conflict('Ya existe un registro de asistencia para este estudiante en esta fecha');
    }

    return await asistenciaRepository.create(data);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Ya existe un registro')) {
      throw error;
    }
    throw createError.internal('Error al crear asistencia');
  }
}

export async function updateAsistencia(
  id: number,
  data: {
    fecha?: Date;
    estado?: "presente" | "ausente" | "tarde";
  }
) {
  try {
    // Verificar que la asistencia existe
    await getAsistenciaById(id);

    // Validaciones básicas
    if (data.estado && !["presente", "ausente", "tarde"].includes(data.estado)) {
      throw createError.validation('Estado de asistencia inválido');
    }
    if (data.fecha && data.fecha > new Date()) {
      throw createError.validation('No se puede registrar asistencia para fechas futuras');
    }

    return await asistenciaRepository.update(id, data);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Asistencia no encontrada')) {
      throw error;
    }
    if (error instanceof Error && error.message.includes('Estado de asistencia inválido')) {
      throw error;
    }
    if (error instanceof Error && error.message.includes('No se puede registrar asistencia')) {
      throw error;
    }
    throw createError.internal('Error al actualizar asistencia');
  }
}

export async function deleteAsistencia(id: number) {
  try {
    // Verificar que la asistencia existe
    await getAsistenciaById(id);

    return await asistenciaRepository.delete(id);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Asistencia no encontrada')) {
      throw error;
    }
    throw createError.internal('Error al eliminar asistencia');
  }
}

export async function getEstadisticasAsistencia() {
  try {
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
  } catch (error) {
    throw createError.internal('Error al obtener estadísticas de asistencia');
  }
} 