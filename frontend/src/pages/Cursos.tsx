import { useEffect, useState } from "react";
import { getCourses } from "../services/api";
import type { Curso } from "../services/api";
import "./Cursos.css";

export default function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getCourses()
      .then((data) => setCursos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status-msg">Cargando cursos…</p>;
  if (error) return <p className="status-msg error">Error: {error}</p>;

  return (
    <div className="courses-container">
      <h2>Administración de Cursos</h2>
      <div className="courses-grid">
        {cursos.map((c) => (
          <div key={c.id} className="course-card">
            <div className="card-header">{c.nombre}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
