import React, { useEffect, useState } from "react";
import "./Resumen.css";

interface TopSubject {
  nombre: string;
  promedio: number;
}

interface Summary {
  totalEstudiantes: number;
  totalCursos: number;
  promedioGeneral: number;
  tasaAsistencia: number; // en porcentaje, ej. 92.5
  topAsignaturas: TopSubject[];
}

export default function Resumen() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Para cuando exista un endpoint real /api/summary
    fetch("http://localhost:4000/api/summary")
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((json) => setData(json as Summary))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center">Cargando resumen…</p>;
  if (error) return <p className="text-center error">Error: {error}</p>;
  if (!data) return null;

  const {
    totalEstudiantes,
    totalCursos,
    promedioGeneral,
    tasaAsistencia,
    topAsignaturas,
  } = data;

  return (
    <div className="resumen-page">
      <h2 className="page-title">Resumen Académico</h2>

      <div className="cards-grid">
        <div className="card">
          <div className="card-title">Estudiantes</div>
          <div className="card-value">{totalEstudiantes}</div>
        </div>
        <div className="card">
          <div className="card-title">Cursos</div>
          <div className="card-value">{totalCursos}</div>
        </div>
        <div className="card">
          <div className="card-title">Promedio General</div>
          <div className="card-value">{promedioGeneral.toFixed(2)}</div>
        </div>
        <div className="card">
          <div className="card-title">Tasa de Asistencia</div>
          <div className="card-value">{tasaAsistencia.toFixed(1)} %</div>
        </div>
      </div>

      <section className="list-section">
        <h3>Top 5 Asignaturas por Promedio</h3>
        <ul>
          {topAsignaturas.map((a, i) => (
            <li key={i}>
              <span>{a.nombre}</span>
              <span>{a.promedio.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
