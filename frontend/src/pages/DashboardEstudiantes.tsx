import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  getEstudianteById,
  getCursosByEstudiante,
  getGradesByEstudiante,
  getObservacionesByEstudiante
} from '../services/api';
import type { Student, Curso, Grade, Observacion } from '../services/api';
import './DashboardEstudiantes.css';

const DashboardEstudiantes: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [estudiante, setEstudiante] = useState<Student | null>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [calificaciones, setCalificaciones] = useState<Grade[]>([]);
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.estudianteId) {
      setError('No se encontró información del estudiante');
      setLoading(false);
      return;
    }

    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [
          estudianteData,
          cursosData,
          calificacionesData,
          observacionesData
        ] = await Promise.all([
          getEstudianteById(user.estudianteId!),
          getCursosByEstudiante(user.estudianteId!),
          getGradesByEstudiante(user.estudianteId!),
          getObservacionesByEstudiante(user.estudianteId!)
        ]);

        setEstudiante(estudianteData);
        setCursos(cursosData || []);
        setCalificaciones(calificacionesData || []);
        setObservaciones(observacionesData || []);
      } catch (error) {
        console.error('Error cargando datos del estudiante:', error);
        setError('Error al cargar la información del estudiante');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getEstadoCalificacion = (nota: number) => {
    if (nota >= 4.0) return 'Aprobado';
    return 'Reprobado';
  };

  const getEstadoCurso = () => {
    return 'En curso';
  };

  if (loading) {
    return (
      <div className="dashboard-estudiantes">
        <div className="loading-container">
          <div className="header">
            <h1 className="page-title">Panel del Estudiante</h1>
            <button className="est-logout-btn" onClick={handleLogout}>Cerrar sesión</button>
          </div>
          <div className="spinner"></div>
          <p>Cargando información del estudiante...</p>
        </div>
      </div>
    );
  }

  if (error || !estudiante) {
    return (
      <div className="dashboard-estudiantes">
        <div className="error-container">
          <div className="header">
            <h1 className="page-title">Panel del Estudiante</h1>
            <button className="est-logout-btn" onClick={handleLogout}>Cerrar sesión</button>
          </div>
          <p>{error || 'No se pudo cargar la información del estudiante.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-estudiantes">
      <div className="layout-container">
        <div className="layout-content">
          <div className="main-content">
            <div className="header">
              <h1 className="page-title">Panel del Estudiante</h1>
              <button className="est-logout-btn" onClick={handleLogout}>Cerrar sesión</button>
            </div>

            <div className="content-sections">
              <section className="info-section">
                <h3>Información Personal</h3>
                <div className="info-grid">
                  <div className="info-row">
                    <p className="info-label">Nombre</p>
                    <p className="info-value">{estudiante.nombre} {estudiante.apellido}</p>
                  </div>
                  <div className="info-row">
                    <p className="info-label">ID de Estudiante</p>
                    <p className="info-value">{estudiante.id}</p>
                  </div>
                  <div className="info-row">
                    <p className="info-label">Programa</p>
                    <p className="info-value">{estudiante.curso?.nombre || 'No asignado'}</p>
                  </div>
                  <div className="info-row">
                    <p className="info-label">Correo Electrónico</p>
                    <p className="info-value">{user?.email || 'No disponible'}</p>
                  </div>
                </div>
              </section>

              <section className="info-section">
                <h3>Cursos Inscritos</h3>
                <div className="table-container">
                  {cursos.length > 0 ? (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Curso</th>
                          <th>Profesor</th>
                          <th>Horario</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cursos.map((curso) => (
                          <tr key={curso.id}>
                            <td>{curso.nombre}</td>
                            <td>
                              {curso.jefeDeCurso 
                                ? `${curso.jefeDeCurso.nombre} ${curso.jefeDeCurso.apellido}`
                                : 'No asignado'
                              }
                            </td>
                            <td>Horario por definir</td>
                            <td>
                              <span className="status-badge">{getEstadoCurso()}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-state">
                      <p>No tienes cursos inscritos actualmente.</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="info-section">
                <h3>Calificaciones</h3>
                <div className="table-container">
                  {calificaciones.length > 0 ? (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Curso</th>
                          <th>Calificación</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calificaciones.map((cal) => (
                          <tr key={cal.id}>
                            <td>{cal.asignatura?.nombre || 'Sin asignatura'}</td>
                            <td>{cal.valor}</td>
                            <td>
                              <span className={`status-badge ${cal.valor >= 4.0 ? 'approved' : 'failed'}`}>
                                {getEstadoCalificacion(cal.valor)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-state">
                      <p>No hay calificaciones registradas aún.</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="info-section">
                <h3>Observaciones</h3>
                {observaciones.length > 0 ? (
                  <div className="observaciones-list">
                    {observaciones.map((obs) => (
                      <div key={obs.id} className={`observacion-item ${obs.estado}`}>
                        <p className="observacion-texto">{obs.texto}</p>
                        <p className="observacion-profesor">
                          Por: {obs.profesor?.nombre} {obs.profesor?.apellido}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-observaciones">No hay observaciones disponibles en este momento.</p>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEstudiantes; 