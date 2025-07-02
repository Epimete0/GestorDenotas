import "./DashboardProfesor.css";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getCursosByProfesor } from "../services/api";
import type { Curso } from "../services/api";

function DashboardProfesor() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.profesorId) return;
    setLoading(true);
    getCursosByProfesor(user.profesorId)
      .then((cursosData) => {
        setCursos(cursosData);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="prof-dashboard">
        <div className="prof-title-row">
          <p className="prof-dashboard-title">Panel del Profesor</p>
          <button className="prof-logout-btn" onClick={handleLogout}>Cerrar sesión</button>
        </div>
        <p className="prof-loading">Cargando información...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prof-dashboard">
        <div className="prof-title-row">
          <p className="prof-dashboard-title">Panel del Profesor</p>
          <button className="prof-logout-btn" onClick={handleLogout}>Cerrar sesión</button>
        </div>
        <p className="prof-error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="prof-dashboard">
      <div className="prof-title-row">
        <p className="prof-dashboard-title">Panel del Profesor</p>
        <button className="prof-logout-btn" onClick={handleLogout}>Cerrar sesión</button>
      </div>
      <div className="prof-section">
        <h3 className="prof-section-title">Mis Cursos</h3>
        {cursos.length === 0 ? (
          <p className="prof-empty">No tienes cursos asignados.</p>
        ) : (
          <div className="prof-courses-list">
            {cursos.map((curso) => (
              <div key={curso.id} className="prof-course-item">
                <div className="prof-course-name">{curso.nombre}</div>
                <div className="prof-course-students">
                  {curso.estudiantes?.length || 0} estudiantes
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardProfesor; 