// frontend/src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  getCourses, 
  getStudents, 
  getAsistencias, 
  getAllGrades,
  type Curso, 
  type Student, 
  type Asistencia, 
  type Grade 
} from '../services/api';
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [estudiantes, setEstudiantes] = useState<Student[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [calificaciones, setCalificaciones] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user?.role === 'profesor' && user?.profesorId) {
          // Cargar todos los datos y filtrar por profesor
          const [cursosData, estudiantesData, asistenciasData, calificacionesData] = await Promise.all([
            getCourses(),
            getStudents(),
            getAsistencias(),
            getAllGrades() // Obtener todas las calificaciones
          ]);

          // Filtrar cursos donde el profesor es jefe de curso
          const cursosDelProfesor = cursosData.filter(curso => curso.jefeId === user.profesorId);
          
          // Filtrar estudiantes de los cursos del profesor
          const estudiantesDelProfesor = estudiantesData.filter(estudiante => 
            cursosDelProfesor.some(curso => curso.id === estudiante.cursoId)
          );

          // Filtrar asistencias de estudiantes del profesor
          const asistenciasDelProfesor = asistenciasData.filter(asistencia =>
            estudiantesDelProfesor.some(estudiante => estudiante.id === asistencia.estudianteId)
          );

          // Filtrar calificaciones del profesor
          const calificacionesDelProfesor = calificacionesData.filter(calificacion =>
            calificacion.profesorId === user.profesorId
          );

          setCursos(cursosDelProfesor);
          setEstudiantes(estudiantesDelProfesor);
          setAsistencias(asistenciasDelProfesor);
          setCalificaciones(calificacionesDelProfesor);
        } else {
          // Para admin, cargar todos los datos
          const [cursosData, estudiantesData, asistenciasData] = await Promise.all([
            getCourses(),
            getStudents(),
            getAsistencias()
          ]);
          
          setCursos(cursosData);
          setEstudiantes(estudiantesData);
          setAsistencias(asistenciasData);
        }
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  const isProfesor = user?.role === 'profesor';

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="welcome-message">
          Bienvenido, {user?.nombre || user?.email}
          {isProfesor && ' - Profesor'}
        </p>
      </div>

      <div className="dashboard-cards">
        {/* Tarjeta de Cursos */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Mis Cursos</h3>
            <span className="card-number">{cursos.length}</span>
          </div>
          <div className="card-content">
            {cursos.length > 0 ? (
              <ul className="card-list">
                {cursos.slice(0, 3).map(curso => (
                  <li key={curso.id}>{curso.nombre}</li>
                ))}
                {cursos.length > 3 && <li>... y {cursos.length - 3} más</li>}
              </ul>
            ) : (
              <p className="no-data">No tienes cursos asignados</p>
            )}
          </div>
          {isProfesor && (
            <button 
              className="card-action"
              onClick={() => navigate('/cursos')}
            >
              Ver Cursos
            </button>
          )}
        </div>

        {/* Tarjeta de Estudiantes */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Mis Estudiantes</h3>
            <span className="card-number">{estudiantes.length}</span>
          </div>
          <div className="card-content">
            {estudiantes.length > 0 ? (
              <ul className="card-list">
                {estudiantes.slice(0, 3).map(estudiante => (
                  <li key={estudiante.id}>
                    {estudiante.nombre} {estudiante.apellido}
                  </li>
                ))}
                {estudiantes.length > 3 && <li>... y {estudiantes.length - 3} más</li>}
              </ul>
            ) : (
              <p className="no-data">No tienes estudiantes asignados</p>
            )}
          </div>
          {isProfesor && (
            <button 
              className="card-action"
              onClick={() => navigate('/estudiantes')}
            >
              Ver Estudiantes
            </button>
          )}
        </div>

        {/* Tarjeta de Asistencias Recientes */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Asistencias Recientes</h3>
            <span className="card-number">{asistencias.length}</span>
          </div>
          <div className="card-content">
            {asistencias.length > 0 ? (
              <div className="attendance-summary">
                <div className="attendance-item">
                  <span className="attendance-label">Presentes:</span>
                  <span className="attendance-count present">
                    {asistencias.filter(a => a.estado === 'presente').length}
                  </span>
                </div>
                <div className="attendance-item">
                  <span className="attendance-label">Ausentes:</span>
                  <span className="attendance-count absent">
                    {asistencias.filter(a => a.estado === 'ausente').length}
                  </span>
                </div>
                <div className="attendance-item">
                  <span className="attendance-label">Tardanzas:</span>
                  <span className="attendance-count late">
                    {asistencias.filter(a => a.estado === 'tarde').length}
                  </span>
                </div>
              </div>
            ) : (
              <p className="no-data">No hay asistencias registradas</p>
            )}
          </div>
          {isProfesor && (
            <button 
              className="card-action"
              onClick={() => navigate('/asistencia')}
            >
              Gestionar Asistencia
            </button>
          )}
        </div>

        {/* Tarjeta de Calificaciones */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Calificaciones</h3>
            <span className="card-number">{calificaciones.length}</span>
          </div>
          <div className="card-content">
            {calificaciones.length > 0 ? (
              <div className="grades-summary">
                <div className="grade-stats">
                  <div className="grade-stat">
                    <span className="grade-label">Promedio:</span>
                    <span className="grade-value">
                      {(calificaciones.reduce((sum, g) => sum + g.valor, 0) / calificaciones.length).toFixed(1)}
                    </span>
                  </div>
                  <div className="grade-stat">
                    <span className="grade-label">Última:</span>
                    <span className="grade-value">
                      {new Date(calificaciones[calificaciones.length - 1]?.fecha).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="no-data">No hay calificaciones registradas</p>
            )}
          </div>
          {isProfesor && (
            <button 
              className="card-action"
              onClick={() => navigate('/calificaciones')}
            >
              Gestionar Calificaciones
            </button>
          )}
        </div>

        {/* Tarjeta de Acciones Rápidas */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Acciones Rápidas</h3>
          </div>
          <div className="card-content">
            <div className="quick-actions">
              {isProfesor ? (
                <>
                  <button 
                    className="quick-action-btn"
                    onClick={() => navigate('/asistencia')}
                  >
                    Tomar Asistencia
                  </button>
                  <button 
                    className="quick-action-btn"
                    onClick={() => navigate('/calificaciones')}
                  >
                    Agregar Calificación
                  </button>
                  <button 
                    className="quick-action-btn"
                    onClick={() => navigate('/estudiantes')}
                  >
                    Ver Estudiantes
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="quick-action-btn"
                    onClick={() => navigate('/estudiantes')}
                  >
                    Gestionar Estudiantes
                  </button>
                  <button 
                    className="quick-action-btn"
                    onClick={() => navigate('/cursos')}
                  >
                    Gestionar Cursos
                  </button>
                  <button 
                    className="quick-action-btn"
                    onClick={() => navigate('/profesores')}
                  >
                    Gestionar Profesores
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
