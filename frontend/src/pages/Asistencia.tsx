import { useEffect, useState } from "react";
import { getStudents, createAsistencia, getAsistenciasByEstudiante } from "../services/api";
import type { Student, Asistencia } from "../services/api";
import "./Asistencia.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default function Asistencia() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | "">("");
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [status, setStatus] = useState<"presente" | "ausente" | "tarde">(
    "presente"
  );
  const [msg, setMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    getStudents()
      .then(setStudents)
      .catch((err) => setMsg({ text: err.message, type: "error" }));
  }, []);

  // Cargar asistencias del estudiante seleccionado
  useEffect(() => {
    if (selectedStudent) {
      setLoading(true);
      getAsistenciasByEstudiante(selectedStudent)
        .then(setAsistencias)
        .catch((err) => setMsg({ text: err.message, type: "error" }))
        .finally(() => setLoading(false));
    } else {
      setAsistencias([]);
    }
  }, [selectedStudent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      setMsg({ text: "Selecciona un estudiante.", type: "error" });
      return;
    }

    setFormLoading(true);
    setMsg(null);

    try {
      const nuevaAsistencia = await createAsistencia({
        estudianteId: selectedStudent,
        fecha: date,
        estado: status,
      });

      // Agregar la nueva asistencia a la lista
      setAsistencias(prev => [nuevaAsistencia, ...prev]);
      
      setMsg({
        text: `Asistencia marcada: ${status} el ${date}`,
        type: "success",
      });
    } catch (err: unknown) {
      setMsg({ text: `Error: ${err instanceof Error ? err.message : "Error al crear asistencia"}`, type: "error" });
    } finally {
      setFormLoading(false);
    }
  };

  function exportarAsistenciasPDF(asistencias: Asistencia[], estudiante?: Student) {
    const doc = new jsPDF();
    let y = 14;
    doc.setFontSize(16);
    doc.text("Historial de Asistencia", 14, y);
    y += 8;
    if (estudiante) {
      doc.setFontSize(12);
      doc.text(`Estudiante: ${estudiante.nombre} ${estudiante.apellido}`, 14, y);
      y += 7;
    }
    doc.autoTable({
      startY: y,
      head: [["Fecha", "Estado"]],
      body: asistencias.map((a) => [
        new Date(a.fecha).toLocaleDateString(),
        a.estado.charAt(0).toUpperCase() + a.estado.slice(1)
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
    });
    doc.save(`asistencias${estudiante ? `_${estudiante.nombre}_${estudiante.apellido}` : ''}.pdf`);
  }

  function exportarAsistenciasExcel(asistencias: Asistencia[], estudiante?: Student) {
    const ws = XLSX.utils.json_to_sheet(
      asistencias.map((a) => ({
        Fecha: new Date(a.fecha).toLocaleDateString(),
        Estado: a.estado.charAt(0).toUpperCase() + a.estado.slice(1),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asistencias");
    XLSX.writeFile(wb, `asistencias${estudiante ? `_${estudiante.nombre}_${estudiante.apellido}` : ''}.xlsx`);
  }

  // Seguridad: siempre usar un array
  const studentsList = Array.isArray(students) ? students : [];
  const asistenciasList = Array.isArray(asistencias) ? asistencias : [];

  return (
    <div className="asistencia-page">
      <h2 className="page-title">Asistencia</h2>
      
      <div className="asistencia-container">
        {/* Panel de formulario */}
        <div className="asistencia-card card">
          <h3>Marcar Asistencia</h3>
          <form onSubmit={handleSubmit} className="asistencia-form">
            <div className="form-group">
              <label htmlFor="select-student">Estudiante</label>
              <select
                id="select-student"
                value={selectedStudent}
                onChange={(e) =>
                  setSelectedStudent(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="select-minimal"
              >
                <option value="">-- Selecciona --</option>
                {studentsList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre} {s.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="input-date">Fecha</label>
              <input
                id="input-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-minimal"
              />
            </div>

            <div className="form-group">
              <span className="radio-group-label">Estado</span>
              <div className="radio-group">
                {["presente", "ausente", "tarde"].map((opt) => (
                  <label key={opt}>
                    <input
                      type="radio"
                      name="status"
                      value={opt}
                      checked={status === opt}
                      onChange={() => setStatus(opt as "presente" | "ausente" | "tarde")}
                    />
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={formLoading}
            >
              {formLoading ? "Marcando..." : "Marcar"}
            </button>
          </form>

          {msg && <div className={`feedback ${msg.type}`}>{msg.text}</div>}
        </div>

        {/* Panel de historial */}
        {selectedStudent && (
          <div className="historial-card card">
            <h3>Historial de Asistencia</h3>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button onClick={() => exportarAsistenciasPDF(asistenciasList, studentsList.find(s => s.id === selectedStudent))} disabled={asistenciasList.length === 0} className="btn-minimal">
                Exportar a PDF
              </button>
              <button onClick={() => exportarAsistenciasExcel(asistenciasList, studentsList.find(s => s.id === selectedStudent))} disabled={asistenciasList.length === 0} className="btn-minimal">
                Exportar a Excel
              </button>
            </div>
            {loading ? (
              <p>Cargando historial...</p>
            ) : (
              <div className="asistencias-list">
                {asistenciasList.length === 0 ? (
                  <p>No hay registros de asistencia</p>
                ) : (
                  asistenciasList.map((a) => (
                    <div key={a.id} className="asistencia-item">
                      <span>{new Date(a.fecha).toLocaleDateString()}</span>
                      <span className={`estado ${a.estado}`}>{a.estado.charAt(0).toUpperCase() + a.estado.slice(1)}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
