// frontend/src/services/api.ts

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

// ——————————————
//  Interfaces de datos
// ——————————————

export interface Curso {
  id: number;
  nombre: string;
  jefeId: number;
}

export interface Student {
  id: number;
  nombre: string;
  apellido: string;
}

export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  date: string;
}

export interface Grade {
  id: number;
  valor: number;
  fecha: string;
  asignatura: {
    nombre: string;
  };
  profesor: {
    nombre: string;
    apellido: string;
  };
}

// ——————————————
//  Cursos
// ——————————————

export async function getCourses(): Promise<Curso[]> {
  const res = await fetch(`${API_BASE}/api/courses`);
  if (!res.ok) throw new Error(`Error fetching courses: ${res.statusText}`);
  const { courses } = await res.json();
  return courses;
}

// ——————————————
//  Estudiantes
// ——————————————

export async function getStudents(): Promise<Student[]> {
  const res = await fetch(`${API_BASE}/api/estudiantes`);
  if (!res.ok) throw new Error(`Error fetching students: ${res.statusText}`);
  const { estudiantes } = await res.json();
  return estudiantes;
}

// ——————————————
//  Inscripciones
// ——————————————

export async function createEnrollment(payload: {
  studentId: number;
  courseId: number;
}): Promise<Enrollment> {
  const res = await fetch(`${API_BASE}/api/enrollments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errMsg = await res.text();
    throw new Error(errMsg || res.statusText);
  }
  const { enrollment } = await res.json();
  return enrollment;
}

// ——————————————
//  Calificaciones
// ——————————————

export async function getGrades(studentId: number): Promise<Grade[]> {
  const res = await fetch(`${API_BASE}/api/grades/${studentId}`);
  if (!res.ok) throw new Error(`Error fetching grades: ${res.statusText}`);
  const { calificaciones } = await res.json();
  return calificaciones;
}

// al final de frontend/src/services/api.ts

export interface Asignatura {
  id: number;
  nombre: string;
}

export async function getAsignaturas(): Promise<Asignatura[]> {
  const res = await fetch(`${API_BASE}/api/asignaturas`);
  if (!res.ok)
    throw new Error(`Error al cargar asignaturas: ${res.statusText}`);
  const { asignaturas } = await res.json();
  return asignaturas;
}
