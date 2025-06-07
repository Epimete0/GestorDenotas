// frontend/src/pages/Calificaciones.tsx
import React, { useEffect, useState } from "react";
import { getStudents, getGrades, getAsignaturas } from "../services/api";
import type { Student, Grade, Asignatura } from "../services/api";
import "./Calificaciones.css";

export default function Calificaciones() {
  // Estado de datos
  const [students, setStudents] = useState<Student[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | "">("");
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulario
  const [subjectId, setSubjectId] = useState<number | "">("");
  const [value, setValue] = useState("");
  const [formMsg, setFormMsg] = useState<string>("");

  // Carga inicial: estudiantes y asignaturas
  useEffect(() => {
    getStudents()
      .then(setStudents)
      .catch((err) => setError(err.message));
    getAsignaturas()
      .then(setAsignaturas)
      .catch((err) => setError(err.message));
  }, []);

  // Al cambiar estudiante: carga calificaciones
  useEffect(() => {
    if (selectedStudent !== "") {
      setLoading(true);
      getGrades(selectedStudent as number)
        .then(setGrades)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      setGrades([]);
    }
  }, [selectedStudent]);

  // Handler de agregar (sin lógica API)
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const asign = asignaturas.find((a) => a.id === subjectId);
    setFormMsg(`✅ Se agregaría: ${asign?.nombre ?? ""} → ${value}`);
    setSubjectId("");
    setValue("");
    setTimeout(() => setFormMsg(""), 3000);
  };

  return (
    <div className="calificaciones-page">
      <h2 className="page-title">Gestión de Calificaciones</h2>
      <div className="calificaciones-grid">
        {/* Panel de notas */}
        <div className="notas-panel card">
          <div className="panel-header">
            <label htmlFor="select-student">Estudiante:</label>
            <select
              id="select-student"
              value={selectedStudent}
              onChange={(e) => {
                setError(null);
                const v = e.target.value;
                setSelectedStudent(v === "" ? "" : Number(v));
              }}
            >
              <option value="">-- Selecciona --</option>
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.nombre} {st.apellido}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="feedback error">Error: {error}</p>}
          {loading && <p className="feedback">Cargando calificaciones…</p>}

          {!loading && selectedStudent !== "" && (
            <ul className="grades-list">
              {grades.map((g) => (
                <li key={g.id} className="grade-item">
                  <span className="subject-name">{g.asignatura.nombre}</span>
                  <span className="subject-value">{g.valor.toFixed(2)}</span>
                  <time className="subject-date">
                    {new Date(g.fecha).toLocaleDateString()}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Panel de formulario */}
        <div className="form-panel card">
          <h3 className="panel-title">Agregar Calificación</h3>
          <form onSubmit={handleAdd} className="add-form">
            <div className="form-group">
              <label htmlFor="select-subject">Asignatura</label>
              <select
                id="select-subject"
                value={subjectId}
                onChange={(e) =>
                  setSubjectId(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                required
              >
                <option value="">-- Selecciona --</option>
                {asignaturas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="input-value">Valor</label>
              <input
                id="input-value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ej: 5.5"
                min="1"
                max="7"
                step="0.1"
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Agregar
            </button>
            {formMsg && <p className="feedback success">{formMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
