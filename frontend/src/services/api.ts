// frontend/src/services/api.ts

export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

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
  estudianteId?: number;
  curso?: {
    id: number;
    nombre: string;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    profesorId?: number;
    estudianteId?: number;
    curso?: {
      id: number;
      nombre: string;
    };
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
  observaciones?: Observacion[];
  asistencias?: Asistencia[];
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
    curso?: {
      id: number;
      nombre: string;
    };
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
  const json = await res.json();
  return json.success ? json.data.courses : json.courses;
}

export async function getCourseById(id: number): Promise<Curso> {
  const res = await fetch(`${API_BASE}/api/courses/${id}`);
  if (!res.ok) throw new Error(`Error fetching course: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.course : json.course;
}

export async function createCourse(data: { nombre: string; jefeId: number }): Promise<Curso> {
  const res = await fetch(`${API_BASE}/api/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error creating course: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.course : json.course;
}

export async function updateCourse(id: number, data: { nombre?: string; jefeId?: number }): Promise<Curso> {
  const res = await fetch(`${API_BASE}/api/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error updating course: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.course : json.course;
}

export async function deleteCourse(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/courses/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error deleting course: ${res.statusText}`);
}

export async function getCursosByProfesor(profesorId: number): Promise<Curso[]> {
  console.log('🌐 Llamando a getCursosByProfesor...', { profesorId });
  const res = await fetch(`${API_BASE}/api/courses/profesor/${profesorId}`);
  console.log('📡 Respuesta del servidor (cursos por profesor):', res.status, res.statusText);
  if (!res.ok) throw new Error(`Error fetching courses by profesor: ${res.statusText}`);
  const json = await res.json();
  console.log('📦 JSON recibido (cursos por profesor):', json);
  const result = json.success ? json.data.courses : json.courses;
  console.log('🎯 Resultado final (cursos por profesor):', result);
  return result;
}

// ——————————————
//  Estudiantes
// ——————————————

export async function getStudents(): Promise<Student[]> {
  console.log('🌐 Llamando a getStudents...');
  const res = await fetch(`${API_BASE}/api/estudiantes`);
  console.log('📡 Respuesta del servidor:', res.status, res.statusText);
  if (!res.ok) throw new Error(`Error fetching students: ${res.statusText}`);
  const json = await res.json();
  console.log('📦 JSON recibido:', json);
  const result = json.success ? json.data.estudiantes : json.estudiantes;
  console.log('🎯 Resultado final:', result);
  return result;
}

export async function getEstudiantesByCurso(cursoId: number): Promise<Student[]> {
  const res = await fetch(`${API_BASE}/api/estudiantes/curso/${cursoId}`);
  if (!res.ok) throw new Error(`Error fetching students by course: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.estudiantes : json.estudiantes;
}

export async function getStudentById(id: number): Promise<Student> {
  const res = await fetch(`${API_BASE}/api/estudiantes/${id}`);
  if (!res.ok) throw new Error(`Error fetching student: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.estudiante : json.estudiante;
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
  const json = await res.json();
  return json.success ? json.data.estudiante : json.estudiante;
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
  const json = await res.json();
  return json.success ? json.data.estudiante : json.estudiante;
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
  console.log('🌐 Llamando a getProfesores...');
  const res = await fetch(`${API_BASE}/api/profesores`);
  console.log('📡 Respuesta del servidor (profesores):', res.status, res.statusText);
  if (!res.ok) throw new Error(`Error fetching profesores: ${res.statusText}`);
  const json = await res.json();
  console.log('📦 JSON recibido (profesores):', json);
  const result = json.success ? json.data.profesores : json.profesores;
  console.log('🎯 Resultado final (profesores):', result);
  return result;
}

export async function getProfesorById(id: number): Promise<Profesor> {
  const res = await fetch(`${API_BASE}/api/profesores/${id}`);
  if (!res.ok) throw new Error(`Error fetching profesor: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.profesor : json.profesor;
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
  const json = await res.json();
  return json.success ? json.data.profesor : json.profesor;
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
  const json = await res.json();
  return json.success ? json.data.profesor : json.profesor;
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
  const json = await res.json();
  return json.success ? json.data.asignaturas : json.asignaturas;
}

export async function getAsignaturaById(id: number): Promise<Asignatura> {
  const res = await fetch(`${API_BASE}/api/asignaturas/${id}`);
  if (!res.ok) throw new Error(`Error fetching asignatura: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.asignatura : json.asignatura;
}

export async function createAsignatura(data: { nombre: string }): Promise<Asignatura> {
  const res = await fetch(`${API_BASE}/api/asignaturas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error creating asignatura: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.asignatura : json.asignatura;
}

export async function updateAsignatura(id: number, data: { nombre?: string }): Promise<Asignatura> {
  const res = await fetch(`${API_BASE}/api/asignaturas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error updating asignatura: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.asignatura : json.asignatura;
}

export async function deleteAsignatura(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/asignaturas/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error deleting asignatura: ${res.statusText}`);
}

export async function addProfesorToAsignatura(asignaturaId: number, profesorId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/asignaturas/${asignaturaId}/profesores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ profesorId }),
  });
  if (!res.ok) throw new Error(`Error adding profesor to asignatura: ${res.statusText}`);
}

export async function removeProfesorFromAsignatura(asignaturaId: number, profesorId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/asignaturas/${asignaturaId}/profesores/${profesorId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error removing profesor from asignatura: ${res.statusText}`);
}

// ——————————————
//  Calificaciones
// ——————————————

export async function getGrades(studentId: number): Promise<Grade[]> {
  const res = await fetch(`${API_BASE}/api/grades/estudiante/${studentId}`);
  if (!res.ok) throw new Error(`Error fetching grades: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.calificaciones : json.calificaciones;
}

export async function getAllGrades(): Promise<Grade[]> {
  const res = await fetch(`${API_BASE}/api/grades`);
  if (!res.ok) throw new Error(`Error fetching all grades: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.calificaciones : json.calificaciones;
}

export async function getGradeById(id: number): Promise<Grade> {
  const res = await fetch(`${API_BASE}/api/grades/${id}`);
  if (!res.ok) throw new Error(`Error fetching grade: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.calificacion : json.calificacion;
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
  const json = await res.json();
  return json.success ? json.data.calificacion : json.calificacion;
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
  const json = await res.json();
  return json.success ? json.data.calificacion : json.calificacion;
}

export async function deleteGrade(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/grades/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error deleting grade: ${res.statusText}`);
}

export async function getGradesByProfesor(profesorId: number): Promise<Grade[]> {
  console.log('🌐 Llamando a getGradesByProfesor...', { profesorId });
  const res = await fetch(`${API_BASE}/api/grades/profesor/${profesorId}`);
  console.log('📡 Respuesta del servidor (calificaciones por profesor):', res.status, res.statusText);
  if (!res.ok) throw new Error(`Error fetching grades by profesor: ${res.statusText}`);
  const json = await res.json();
  console.log('📦 JSON recibido (calificaciones por profesor):', json);
  const result = json.success ? json.data.calificaciones : json.calificaciones;
  console.log('🎯 Resultado final (calificaciones por profesor):', result);
  return result;
}

// ——————————————
//  Asistencias
// ——————————————

export async function getAsistencias(): Promise<Asistencia[]> {
  const res = await fetch(`${API_BASE}/api/asistencias`);
  if (!res.ok) throw new Error(`Error fetching asistencias: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.asistencias : json.asistencias;
}

export async function getAsistenciaById(id: number): Promise<Asistencia> {
  const res = await fetch(`${API_BASE}/api/asistencias/${id}`);
  if (!res.ok) throw new Error(`Error fetching asistencia: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.asistencia : json.asistencia;
}

export async function getAsistenciasByEstudiante(estudianteId: number): Promise<Asistencia[]> {
  const res = await fetch(`${API_BASE}/api/asistencias/estudiante/${estudianteId}`);
  if (!res.ok) throw new Error(`Error fetching asistencias by estudiante: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.asistencias : json.asistencias;
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
  const json = await res.json();
  return json.success ? json.data.asistencia : json.asistencia;
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
  const json = await res.json();
  return json.success ? json.data.asistencia : json.asistencia;
}

export async function deleteAsistencia(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/asistencias/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error deleting asistencia: ${res.statusText}`);
}

// ——————————————
//  Matriculas
// ——————————————

export async function createEnrollment(payload: {
  studentId: number;
  courseId: number;
}): Promise<Enrollment> {
  const res = await fetch(`${API_BASE}/api/enrollments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error creating enrollment: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.enrollment : json.enrollment;
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
  if (!res.ok) throw new Error(`Error logging in: ${res.statusText}`);
  return await res.json();
}

export async function verifyToken(token: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error(`Error verifying token: ${res.statusText}`);
  return await res.json();
}

export async function logout(): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Error logging out: ${res.statusText}`);
  return await res.json();
}

// ——————————————
//  Observaciones
// ——————————————

export async function getObservacionesByEstudiante(estudianteId: number): Promise<Observacion[]> {
  const res = await fetch(`${API_BASE}/api/observaciones/estudiante/${estudianteId}`);
  if (!res.ok) throw new Error(`Error fetching observaciones: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.observaciones : json.observaciones;
}

export async function createObservacion(data: { estudianteId: number; profesorId: number; texto: string; estado?: "negativa" | "neutro" | "positiva" }): Promise<Observacion> {
  const res = await fetch(`${API_BASE}/api/observaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error creating observacion: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.observacion : json.observacion;
}

export async function updateObservacion(id: number, data: { texto?: string; estado?: "negativa" | "neutro" | "positiva" }): Promise<Observacion> {
  const res = await fetch(`${API_BASE}/api/observaciones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error updating observacion: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.observacion : json.observacion;
}

export async function deleteObservacion(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/observaciones/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error deleting observacion: ${res.statusText}`);
}

export async function getObservacionesByProfesor(profesorId: number): Promise<Observacion[]> {
  console.log('🌐 Llamando a getObservacionesByProfesor...', { profesorId });
  const res = await fetch(`${API_BASE}/api/observaciones/profesor/${profesorId}`);
  console.log('📡 Respuesta del servidor (observaciones por profesor):', res.status, res.statusText);
  if (!res.ok) throw new Error(`Error fetching observaciones by profesor: ${res.statusText}`);
  const json = await res.json();
  console.log('📦 JSON recibido (observaciones por profesor):', json);
  const result = json.success ? json.data.observaciones : json.observaciones;
  console.log('🎯 Resultado final (observaciones por profesor):', result);
  return result;
}

// ——————————————
//  Funciones adicionales
// ——————————————

export async function getEstudianteById(id: number): Promise<Student> {
  const res = await fetch(`${API_BASE}/api/estudiantes/${id}`);
  if (!res.ok) throw new Error(`Error fetching estudiante: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.estudiante : json.estudiante;
}

export async function getCursosByEstudiante(estudianteId: number): Promise<Curso[]> {
  const res = await fetch(`${API_BASE}/api/courses/estudiante/${estudianteId}`);
  if (!res.ok) throw new Error(`Error fetching cursos by estudiante: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.courses : json.courses;
}

export async function getGradesByEstudiante(estudianteId: number): Promise<Grade[]> {
  const res = await fetch(`${API_BASE}/api/grades/estudiante/${estudianteId}`);
  if (!res.ok) throw new Error(`Error fetching grades by estudiante: ${res.statusText}`);
  const json = await res.json();
  return json.success ? json.data.calificaciones : json.calificaciones;
}
