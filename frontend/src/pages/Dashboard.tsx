// frontend/src/pages/Dashboard.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Panel Principal</h1>
      <div className="dashboard-grid">
        <Link className="card" to="/courses">
          <span role="img" aria-label="Cursos">
            📚
          </span>
          <span>Cursos</span>
        </Link>

        <Link className="card" to="/inscripcion">
          <span role="img" aria-label="Inscripción">
            ✏️
          </span>
          <span>Inscripción</span>
        </Link>

        <Link className="card" to="/calificaciones">
          <span role="img" aria-label="Calificaciones">
            📝
          </span>
          <span>Calificaciones</span>
        </Link>

        <Link className="card" to="/asistencia">
          <span role="img" aria-label="Asistencia">
            ✅
          </span>
          <span>Asistencia</span>
        </Link>

        <Link className="card" to="/resumen">
          <span role="img" aria-label="Resumen Anual">
            📊
          </span>
          <span>Resumen Anual</span>
        </Link>
      </div>
    </div>
  );
}
