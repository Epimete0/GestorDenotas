// frontend/src/pages/Calificaciones.tsx
import React, { useEffect, useState } from "react";
import { getStudents, getGrades, getAsignaturas, getProfesores, createGrade } from "../services/api";
import type { Student, Grade, Asignatura, Profesor } from "../services/api";
import "./Calificaciones.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default function Calificaciones() {
  // Estado de datos
  const [students, setStudents] = useState<Student[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | "">("");
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulario
  const [subjectId, setSubjectId] = useState<number | "">("");
  const [profesorId, setProfesorId] = useState<number | "">("");
  const [value, setValue] = useState("");
  const [formMsg, setFormMsg] = useState<string>("");
  const [formLoading, setFormLoading] = useState(false);

  // Carga inicial: estudiantes, asignaturas y profesores
  useEffect(() => {
    Promise.all([
      getStudents().then(setStudents),
      getAsignaturas().then(setAsignaturas),
      getProfesores().then(setProfesores),
    ]).catch((err) => setError(err.message));
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

  // Handler de agregar calificación
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !subjectId || !profesorId || !value) {
      setFormMsg("Todos los campos son requeridos");
      return;
    }

    setFormLoading(true);
    setFormMsg("");

    try {
      const nuevaCalificacion = await createGrade({
        estudianteId: selectedStudent as number,
        asignaturaId: subjectId as number,
        profesorId: profesorId as number,
        valor: parseFloat(value),
      });

      // Agregar la nueva calificación a la lista
      setGrades(prev => [nuevaCalificacion, ...prev]);
      
      // Limpiar formulario
      setSubjectId("");
      setProfesorId("");
      setValue("");
      setFormMsg("✅ Calificación agregada exitosamente");
      
      setTimeout(() => setFormMsg(""), 3000);
    } catch (err: any) {
      setFormMsg(`❌ Error: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  function exportarPDF(grades: Grade[]) {
    const doc = new jsPDF();
    doc.text("Reporte de Calificaciones", 14, 16);
    (doc as any).autoTable({
      startY: 22,
      head: [["Asignatura", "Valor", "Fecha", "Profesor"]],
      body: grades.map((g) => [
        g.asignatura.nombre,
        g.valor.toFixed(2),
        new Date(g.fecha).toLocaleDateString(),
        `${g.profesor.nombre} ${g.profesor.apellido}`
      ]),
    });
    doc.save("calificaciones.pdf");
  }

  function exportarExcel(grades: Grade[]) {
    const ws = XLSX.utils.json_to_sheet(
      grades.map((g) => ({
        Asignatura: g.asignatura.nombre,
        Valor: g.valor,
        Fecha: new Date(g.fecha).toLocaleDateString(),
        Profesor: `${g.profesor.nombre} ${g.profesor.apellido}`,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Calificaciones");
    XLSX.writeFile(wb, "calificaciones.xlsx");
  }

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
              className="select-minimal"
            >
              <option value="">-- Selecciona --</option>
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.nombre} {st.apellido}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="feedback-minimal error">Error: {error}</p>}
          {loading && <p className="feedback-minimal">Cargando calificaciones…</p>}

          {!loading && selectedStudent !== "" && (
            <ul className="grades-list">
              {grades.map((g) => (
                <li key={g.id} className="grade-item">
                  <span className="subject-name">{g.asignatura.nombre}</span>
                  <span className="subject-value">{g.valor.toFixed(2)}</span>
                  <time className="subject-date">
                    {new Date(g.fecha).toLocaleDateString()}
                  </time>
                  <span className="professor-name">
                    {g.profesor.nombre} {g.profesor.apellido}
                  </span>
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
                className="select-minimal"
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
              <label htmlFor="select-professor">Profesor</label>
              <select
                id="select-professor"
                value={profesorId}
                onChange={(e) =>
                  setProfesorId(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                required
                className="select-minimal"
              >
                <option value="">-- Selecciona --</option>
                {profesores.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} {p.apellido}
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
                className="input-minimal"
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={formLoading}
            >
              {formLoading ? "Agregando..." : "Agregar"}
            </button>
            
            {formMsg && (
              <p className={`feedback-minimal ${formMsg.includes("✅") ? "success" : "error"}`}>
                {formMsg}
              </p>
            )}
          </form>
        </div>

        {/* Botones de exportación */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button onClick={() => exportarPDF(grades)} disabled={grades.length === 0} className="btn-minimal">
            Exportar a PDF
          </button>
          <button onClick={() => exportarExcel(grades)} disabled={grades.length === 0} className="btn-minimal">
            Exportar a Excel
          </button>
        </div>
      </div>
    </div>
  );
}
