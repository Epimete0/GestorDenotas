import "./CursosProfesor.css";
import { useEffect, useState } from "react";
import { getCursosByProfesor, getEstudiantesByCurso } from "../services/api";
import type { Curso, Student } from "../services/api";
import { useAuth } from "../contexts/AuthContext";



function CursosProfesor() {
  const { user } = useAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal de estudiantes
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [estudiantes, setEstudiantes] = useState<Student[]>([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(null);

  useEffect(() => {
    if (!user?.profesorId) return;
    setLoading(true);
    getCursosByProfesor(user.profesorId)
      .then(setCursos)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar cursos"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleVerEstudiantes = async (curso: Curso) => {
    setShowModal(true);
    setCursoSeleccionado(curso);
    setModalLoading(true);
    setModalError(null);
    try {
      const estudiantes = await getEstudiantesByCurso(curso.id);
      setEstudiantes(estudiantes);
    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : "Error al cargar estudiantes");
      setEstudiantes([]);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setEstudiantes([]);
    setCursoSeleccionado(null);
    setModalError(null);
  };

  return (
    <>
      <div className="cprof-title-row">
        <div className="cprof-title-col">
          <p className="cprof-dashboard-title">Mis Cursos</p>
          <p className="cprof-dashboard-desc">
            Aquí están los cursos que estás enseñando actualmente. Puedes ver los detalles del curso, agregar nuevas tareas o actualizar la información del curso.
          </p>
        </div>
      </div>
      <div className="cprof-table-wrap">
        <div className="cprof-table-outer">
          {loading ? (
            <p className="cprof-feedback">Cargando cursos...</p>
          ) : error ? (
            <p className="cprof-feedback cprof-error">{error}</p>
          ) : (
            <div style={{overflowX: 'auto'}}>
              <table className="cprof-table">
                <thead>
                  <tr className="cprof-table-head-row">
                    <th className="cprof-table-col-120">Curso</th>
                    <th className="cprof-table-col-240">Estudiantes</th>
                  </tr>
                </thead>
                <tbody>
                  {cursos.length === 0 ? (
                    <tr><td colSpan={2}>No tienes cursos asignados.</td></tr>
                  ) : (
                    cursos.map((curso) => (
                      <tr className="cprof-table-row" key={curso.id}>
                        <td className="cprof-table-col-120">{curso.nombre}</td>
                        <td className="cprof-table-col-240">
                          <button className="cprof-estudiantes-btn" onClick={() => handleVerEstudiantes(curso)}>
                            {curso.estudiantes?.length ?? 0} Ver estudiantes
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Modal de estudiantes */}
      {showModal && (
        <div className="cprof-modal-bg" onClick={handleCerrarModal}>
          <div className="cprof-modal" onClick={e => e.stopPropagation()}>
            <button className="cprof-modal-close" onClick={handleCerrarModal}>&times;</button>
            <h3 className="cprof-modal-title">
              Estudiantes del curso: <span>{cursoSeleccionado?.nombre}</span>
            </h3>
            {modalLoading ? (
              <p className="cprof-feedback">Cargando estudiantes...</p>
            ) : modalError ? (
              <p className="cprof-feedback cprof-error">{modalError}</p>
            ) : estudiantes.length === 0 ? (
              <p className="cprof-feedback">No hay estudiantes en este curso.</p>
            ) : (
              <ul className="cprof-modal-list">
                {estudiantes.map(est => (
                  <li key={est.id} className="cprof-modal-list-item">
                    {est.nombre} {est.apellido}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {/* Mejoras de responsividad */}
      <style>{`
        @media (max-width: 900px) {
          .cprof-table-col-120, .cprof-table-col-240, .cprof-table-col-360 { font-size: 0.85rem; padding: 0.5rem; }
          .cprof-dashboard-title { font-size: 1.3rem; }
        }
        @media (max-width: 600px) {
          .cprof-table-col-120, .cprof-table-col-240, .cprof-table-col-360 { font-size: 0.75rem; padding: 0.3rem; }
          .cprof-dashboard-title { font-size: 1rem; }
          .cprof-table-outer { padding: 0; }
        }
      `}</style>
    </>
  );
}

export default CursosProfesor; 