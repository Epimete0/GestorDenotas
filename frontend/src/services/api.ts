// frontend/src/services/api.ts

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

// ——————————————
//  Interfaces de datos
// ——————————————

export interface User {
  id: number;
  email: string;
  role: string;
  nombre?: string;
  apellido?: string;
  profesorId?: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    profesorId?: number;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface Curso {
  id: number;
  nombre: string;
  jefeId: number;
  jefeDeCurso?: {
    id: number;
    nombre: string;
    apellido: string;
  };
  estudiantes?: Student[];
  planDeEstudio?: {
    asignatura: {
      id: number;
      nombre: string;
    };
  }[];
}

export interface Student {
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
  sexo: string;
  cursoId: number;
  curso?: {
    id: number;
    nombre: string;
  };
  calificaciones?: Grade[];
  observaciones?: any[];
  asistencias?: any[];
}

export interface Profesor {
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
  sexo: string;
  jefeDeCurso?: Curso[];
  asignaturas?: {
    asignatura: {
      id: number;
      nombre: string;
    };
  }[];
}

export interface Asignatura {
  id: number;
  nombre: string;
  profesores?: {
    profesor: {
      id: number;
      nombre: string;
      apellido: string;
    };
  }[];
  cursos?: {
    curso: {
      id: number;
      nombre: string;
    };
  }[];
}

export interface Grade {
  id: number;
  valor: number;
  fecha: string;
  estudianteId: number;
  asignaturaId: number;
  profesorId: number;
  asignatura: {
    id: number;
    nombre: string;
  };
  profesor: {
    id: number;
    nombre: string;
    apellido: string;
  };
  estudiante?: {
    id: number;
    nombre: string;
    apellido: string;
  };
}

export interface Asistencia {
  id: number;
  estudianteId: number;
  fecha: string;
  estado: "presente" | "ausente" | "tarde";
  estudiante?: {
    id: number;
    nombre: string;
    apellido: string;
    curso?: {
      id: number;
      nombre: string;
    };
  };
}

export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  date: string;
}

export interface Observacion {
  id: number;
  estudianteId: number;
  profesorId: number;
  texto: string;
  estado: "negativa" | "neutro" | "positiva";
  estudiante?: Student;
  profesor?: Profesor;
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

export async function getCourseById(id: number): Promise<Curso> {
  const res = await fetch(`${API_BASE}/api/courses/${id}`);
  if (!res.ok) throw new Error(`Error fetching course: ${res.statusText}`);
  const { course } = await res.json();
  return course;
}

export async function createCourse(data: { nombre: string; jefeId: number }): Promise<Curso> {
  const res = await fetch(`${API_BASE}/api/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error creating course: ${res.statusText}`);
  const { course } = await res.json();
  return course;
}

export async function updateCourse(id: number, data: { nombre?: string; jefeId?: number }): Promise<Curso> {
  const res = await fetch(`${API_BASE}/api/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error updating course: ${res.statusText}`);
  const { course } = await res.json();
  return course;
}

export async function deleteCourse(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/courses/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error deleting course: ${res.statusText}`);
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

export async function getStudentById(id: number): Promise<Student> {
  const res = await fetch(`${API_BASE}/api/estudiantes/${id}`);
  if (!res.ok) throw new Error(`Error fetching student: ${res.statusText}`);
  const { estudiante } = await res.json();
  return estudiante;
}

export async function createStudent(data: {
  nombre: string;
  apellido: string;
  edad: number;
  sexo: string;
  cursoId: number;
}): Promise<Student> {
  const res = await fetch(`${API_BASE}/api/estudiantes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error creating student: ${res.statusText}`);
  const { estudiante } = await res.json();
  return estudiante;
}

export async function updateStudent(
  id: number,
  data: {
    nombre?: string;
    apellido?: string;
    edad?: number;
    sexo?: string;
    cursoId?: number;
  }
): Promise<Student> {
  const res = await fetch(`${API_BASE}/api/estudiantes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error updating student: ${res.statusText}`);
  const { estudiante } = await res.json();
  return estudiante;
}

export async function deleteStudent(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/estudiantes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error deleting student: ${res.statusText}`);
}

// ——————————————
//  Profesores
// ——————————————

export async function getProfesores(): Promise<Profesor[]> {
  const res = await fetch(`${API_BASE}/api/profesores`);
  if (!res.ok) throw new Error(`Error fetching profesores: ${res.statusText}`);
  const { profesores } = await res.json();
  return profesores;
}

export async function getProfesorById(id: number): Promise<Profesor> {
  const res = await fetch(`${API_BASE}/api/profesores/${id}`);
  if (!res.ok) throw new Error(`Error fetching profesor: ${res.statusText}`);
  const { profesor } = await res.json();
  return profesor;
}

export async function createProfesor(data: {
  nombre: string;
  apellido: string;
  edad: number;
  sexo: string;
}): Promise<Profesor> {
  const res = await fetch(`${API_BASE}/api/profesores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error creating profesor: ${res.statusText}`);
  const { profesor } = await res.json();
  return profesor;
}

export async function updateProfesor(
  id: number,
  data: {
    nombre?: string;
    apellido?: string;
    edad?: number;
    sexo?: string;
  }
): Promise<Profesor> {
  const res = await fetch(`${API_BASE}/api/profesores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error updating profesor: ${res.statusText}`);
  const { profesor } = await res.json();
  return profesor;
}

export async function deleteProfesor(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/profesores/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error deleting profesor: ${res.statusText}`);
}

// ——————————————
//  Asignaturas
// ——————————————

export async function getAsignaturas(): Promise<Asignatura[]> {
  const res = await fetch(`${API_BASE}/api/asignaturas`);
  if (!res.ok) throw new Error(`Error fetching asignaturas: ${res.statusText}`);
  const { asignaturas } = await res.json();
  return asignaturas;
}

export async function getAsignaturaById(id: number): Promise<Asignatura> {
  const res = await fetch(`${API_BASE}/api/asignaturas/${id}`);
  if (!res.ok) throw new Error(`Error fetching asignatura: ${res.statusText}`);
  const { asignatura } = await res.json();
  return asignatura;
}

export async function createAsignatura(data: { nombre: string }): Promise<Asignatura> {
  const res = await fetch(`${API_BASE}/api/asignaturas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error creating asignatura: ${res.statusText}`);
  const { asignatura } = await res.json();
  return asignatura;
}

export async function updateAsignatura(id: number, data: { nombre?: string }): Promise<Asignatura> {
  const res = await fetch(`${API_BASE}/api/asignaturas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error updating asignatura: ${res.statusText}`);
  const { asignatura } = await res.json();
  return asignatura;
}

export async function deleteAsignatura(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/asignaturas/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error deleting asignatura: ${res.statusText}`);
}

// ——————————————
//  Calificaciones
// ——————————————

export async function getGrades(studentId: number): Promise<Grade[]> {
  const res = await fetch(`${API_BASE}/api/grades/estudiante/${studentId}`);
  if (!res.ok) throw new Error(`Error fetching grades: ${res.statusText}`);
  const { calificaciones } = await res.json();
  return calificaciones;
}

export async function getAllGrades(): Promise<Grade[]> {
  const res = await fetch(`${API_BASE}/api/grades/all`);
  if (!res.ok) throw new Error(`Error fetching grades: ${res.statusText}`);
  const { calificaciones } = await res.json();
  return calificaciones;
}

export async function getGradeById(id: number): Promise<Grade> {
  const res = await fetch(`${API_BASE}/api/grades/id/${id}`);
  if (!res.ok) throw new Error(`Error fetching grade: ${res.statusText}`);
  const { calificacion } = await res.json();
  return calificacion;
}

export async function createGrade(data: {
  estudianteId: number;
  asignaturaId: number;
  profesorId: number;
  valor: number;
}): Promise<Grade> {
  const res = await fetch(`${API_BASE}/api/grades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error creating grade: ${res.statusText}`);
  const { calificacion } = await res.json();
  return calificacion;
}

export async function updateGrade(
  id: number,
  data: {
    valor?: number;
    asignaturaId?: number;
    profesorId?: number;
  }
): Promise<Grade> {
  const res = await fetch(`${API_BASE}/api/grades/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error updating grade: ${res.statusText}`);
  const { calificacion } = await res.json();
  return calificacion;
}

export async function deleteGrade(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/grades/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error deleting grade: ${res.statusText}`);
}

// ——————————————
//  Asistencias
// ——————————————

export async function getAsistencias(): Promise<Asistencia[]> {
  const res = await fetch(`${API_BASE}/api/asistencias`);
  if (!res.ok) throw new Error(`Error fetching asistencias: ${res.statusText}`);
  const { asistencias } = await res.json();
  return asistencias;
}

export async function getAsistenciaById(id: number): Promise<Asistencia> {
  const res = await fetch(`${API_BASE}/api/asistencias/${id}`);
  if (!res.ok) throw new Error(`Error fetching asistencia: ${res.statusText}`);
  const { asistencia } = await res.json();
  return asistencia;
}

export async function getAsistenciasByEstudiante(estudianteId: number): Promise<Asistencia[]> {
  const res = await fetch(`${API_BASE}/api/asistencias/estudiante/${estudianteId}`);
  if (!res.ok) throw new Error(`Error fetching asistencias: ${res.statusText}`);
  const { asistencias } = await res.json();
  return asistencias;
}

export async function createAsistencia(data: {
  estudianteId: number;
  fecha: string;
  estado: "presente" | "ausente" | "tarde";
}): Promise<Asistencia> {
  const res = await fetch(`${API_BASE}/api/asistencias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error creating asistencia: ${res.statusText}`);
  const { asistencia } = await res.json();
  return asistencia;
}

export async function updateAsistencia(
  id: number,
  data: {
    fecha?: string;
    estado?: "presente" | "ausente" | "tarde";
  }
): Promise<Asistencia> {
  const res = await fetch(`${API_BASE}/api/asistencias/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error updating asistencia: ${res.statusText}`);
  const { asistencia } = await res.json();
  return asistencia;
}

export async function deleteAsistencia(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/asistencias/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error deleting asistencia: ${res.statusText}`);
}

// ——————————————
//  Inscripciones (mantener compatibilidad)
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
//  Autenticación
// ——————————————

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error en login');
  }
  
  return res.json();
}

export async function verifyToken(token: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/verify`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error verificando token');
  }
  
  return res.json();
}

export async function logout(): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error en logout');
  }
  
  return res.json();
}

// ——————————————
//  Observaciones
// ——————————————

export async function getObservacionesByEstudiante(estudianteId: number): Promise<Observacion[]> {
  const res = await fetch(`${API_BASE}/api/observaciones/estudiante/${estudianteId}`);
  if (!res.ok) throw new Error(`Error fetching observaciones: ${res.statusText}`);
  const { observaciones } = await res.json();
  return observaciones;
}

export async function createObservacion(data: { estudianteId: number; profesorId: number; texto: string; estado?: "negativa" | "neutro" | "positiva" }): Promise<Observacion> {
  const res = await fetch(`${API_BASE}/api/observaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error creating observacion: ${res.statusText}`);
  const { observacion } = await res.json();
  return observacion;
}

export async function updateObservacion(id: number, data: { texto?: string; estado?: "negativa" | "neutro" | "positiva" }): Promise<Observacion> {
  const res = await fetch(`${API_BASE}/api/observaciones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error updating observacion: ${res.statusText}`);
  const { observacion } = await res.json();
  return observacion;
}

export async function deleteObservacion(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/observaciones/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error(`Error deleting observacion: ${res.statusText}`);
}
