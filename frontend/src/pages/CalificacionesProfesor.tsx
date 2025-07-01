import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { 
  getCursosByProfesor, 
  getEstudiantesByCurso, 
  getGradesByProfesor,
  createGrade,
  updateGrade,
  deleteGrade,
  getAsignaturas
} from "../services/api";
import type { Curso, Student, Grade, Asignatura } from "../services/api";
import "./CalificacionesProfesor.css";

const CalificacionesProfesor: React.FC = () => {
  const { user } = useAuth();
  
  // Estados del formulario
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [editingGradeId, setEditingGradeId] = useState<number | null>(null);
  
  // Estados de datos
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [estudiantes, setEstudiantes] = useState<Student[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [calificaciones, setCalificaciones] = useState<Grade[]>([]);
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Cargar cursos del profesor al montar
  useEffect(() => {
    if (!user?.profesorId) return;
    
    setLoading(true);
    Promise.all([
      getCursosByProfesor(user.profesorId),
      getAsignaturas()
    ])
      .then(([cursosData, asignaturasData]) => {
        setCursos(cursosData);
        setAsignaturas(asignaturasData);
      })
      .catch((error: Error) => {
        setMessage({ text: "Error cargando datos: " + error.message, type: 'error' });
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Cargar estudiantes cuando se selecciona un curso
  useEffect(() => {
    if (selectedCourse) {
      setLoading(true);
      getEstudiantesByCurso(Number(selectedCourse))
        .then(setEstudiantes)
        .catch((error: Error) => {
          setMessage({ text: "Error cargando estudiantes: " + error.message, type: 'error' });
        })
        .finally(() => setLoading(false));
    } else {
      setEstudiantes([]);
    }
  }, [selectedCourse]);

  // Cargar calificaciones del profesor
  useEffect(() => {
    if (!user?.profesorId) return;
    
    setLoading(true);
    getGradesByProfesor(user.profesorId)
      .then(setCalificaciones)
              .catch((error: Error) => {
          setMessage({ text: "Error cargando calificaciones: " + error.message, type: 'error' });
        })
      .finally(() => setLoading(false));
  }, [user]);

  // Limpiar mensajes después de 3 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedCourse || !selectedAssessmentType || !grade) {
      setMessage({ text: "Por favor completa todos los campos", type: 'error' });
      return;
    }

    const gradeValue = parseFloat(grade);
    if (isNaN(gradeValue) || gradeValue < 1.0 || gradeValue > 7.0) {
      setMessage({ text: "La calificación debe estar entre 1.0 y 7.0", type: 'error' });
      return;
    }

    setLoading(true);
    try {
      if (editingGradeId) {
        // Actualizar calificación existente
        await updateGrade(editingGradeId, {
          valor: gradeValue,
          asignaturaId: Number(selectedAssessmentType)
        });
        setMessage({ text: "Calificación actualizada correctamente", type: 'success' });
        setEditingGradeId(null);
      } else {
        // Crear nueva calificación
        await createGrade({
          estudianteId: Number(selectedStudent),
          asignaturaId: Number(selectedAssessmentType),
          profesorId: user!.profesorId!,
          valor: gradeValue
        });
        setMessage({ text: "Calificación guardada correctamente", type: 'success' });
      }
      
      // Limpiar formulario
      setSelectedStudent("");
      setSelectedCourse("");
      setSelectedAssessmentType("");
      setGrade("");
      
      // Recargar calificaciones
      const updatedGrades = await getGradesByProfesor(user!.profesorId!);
      setCalificaciones(updatedGrades);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setMessage({ text: "Error: " + errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGrade = async () => {
    if (!editingGradeId) {
      setMessage({ text: "Selecciona una calificación para eliminar", type: 'error' });
      return;
    }

    if (!confirm("¿Estás seguro de que quieres eliminar esta calificación?")) {
      return;
    }

    setLoading(true);
    try {
      await deleteGrade(editingGradeId);
      setMessage({ text: "Calificación eliminada correctamente", type: 'success' });
      
      // Limpiar formulario
      setSelectedStudent("");
      setSelectedCourse("");
      setSelectedAssessmentType("");
      setGrade("");
      setEditingGradeId(null);
      
      // Recargar calificaciones
      const updatedGrades = await getGradesByProfesor(user!.profesorId!);
      setCalificaciones(updatedGrades);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setMessage({ text: "Error: " + errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditGrade = (calificacion: Grade) => {
    setSelectedStudent(String(calificacion.estudiante?.id || ""));
    setSelectedCourse(String(calificacion.estudiante?.curso?.id || ""));
    setSelectedAssessmentType(String(calificacion.asignaturaId));
    setGrade(String(calificacion.valor));
    setEditingGradeId(calificacion.id);
  };

  const handleCancelEdit = () => {
    setSelectedStudent("");
    setSelectedCourse("");
    setSelectedAssessmentType("");
    setGrade("");
    setEditingGradeId(null);
  };

  return (
    <div className="calificaciones-container">
      <div className="calificaciones-header">
        <div className="calificaciones-title-section">
          <h1 className="calificaciones-title">Calificaciones de Estudiantes</h1>
        </div>
      </div>

      <div className="calificaciones-content">
        <div className="calificaciones-form-container">
          <form onSubmit={handleSubmit} className="calificaciones-form">
            {/* Selector de Curso */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Curso</span>
                <select
                  className="form-select"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required
                >
                  <option value="">Seleccionar Curso</option>
                  {cursos.map((curso) => (
                    <option key={curso.id} value={curso.id}>
                      {curso.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Selector de Estudiante */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Nombre del Estudiante</span>
                <select
                  className="form-select"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  required
                >
                  <option value="">Seleccionar Estudiante</option>
                  {estudiantes.map((estudiante) => (
                    <option key={estudiante.id} value={estudiante.id}>
                      {estudiante.nombre} {estudiante.apellido}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Selector de Materia */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Materia</span>
                <select
                  className="form-select"
                  value={selectedAssessmentType}
                  onChange={(e) => setSelectedAssessmentType(e.target.value)}
                  required
                >
                  <option value="">Seleccionar Materia</option>
                  {asignaturas.map((asignatura) => (
                    <option key={asignatura.id} value={asignatura.id}>
                      {asignatura.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Campo de Calificación */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-text">Calificación</span>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="7.0"
                  placeholder="Ingresar Calificación"
                  className="form-input"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required
                />
              </label>
            </div>

            {/* Mensajes de estado */}
            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            {/* Botones de acción */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Guardando..." : editingGradeId ? "Actualizar Calificación" : "Guardar Calificación"}
              </button>
              
              {editingGradeId && (
                <>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteGrade}
                    disabled={loading}
                  >
                    {loading ? "Eliminando..." : "Eliminar Calificación"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
        <div className="calificaciones-list-container">
          <div className="calificaciones-list">
            <h3 className="list-title">Calificaciones Recientes</h3>
            {loading ? (
              <p className="loading-text">Cargando calificaciones...</p>
            ) : calificaciones.length === 0 ? (
              <p className="empty-text">No hay calificaciones registradas</p>
            ) : (
              <div className="grades-table">
                <table>
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Curso</th>
                      <th>Asignatura</th>
                      <th>Calificación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calificaciones.slice(0, 5).map((calificacion) => (
                      <tr key={calificacion.id}>
                        <td>{calificacion.estudiante?.nombre} {calificacion.estudiante?.apellido}</td>
                        <td>{calificacion.estudiante?.curso?.nombre}</td>
                        <td>{calificacion.asignatura.nombre}</td>
                        <td className={`grade-value ${calificacion.valor >= 4.0 ? 'passing' : 'failing'}`}>
                          {calificacion.valor}
                        </td>
                        <td>
                          <button
                            className="btn-edit"
                            onClick={() => handleEditGrade(calificacion)}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalificacionesProfesor;
