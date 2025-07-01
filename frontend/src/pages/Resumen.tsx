import { useEffect, useState } from "react";
import "./Resumen.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

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

  function exportarResumenPDF(data: Summary) {
    const doc = new jsPDF();
    let y = 14;
    doc.setFontSize(16);
    doc.text("Resumen Académico", 14, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`Estudiantes: ${data.totalEstudiantes}`, 14, y);
    y += 7;
    doc.text(`Cursos: ${data.totalCursos}`, 14, y);
    y += 7;
    doc.text(`Promedio General: ${data.promedioGeneral.toFixed(2)}`, 14, y);
    y += 7;
    doc.text(`Tasa de Asistencia: ${data.tasaAsistencia.toFixed(1)} %`, 14, y);
    y += 10;
    doc.setFontSize(13);
    doc.text("Top 5 Asignaturas por Promedio", 14, y);
    y += 3;
    doc.autoTable({
      startY: y,
      head: [["Asignatura", "Promedio"]],
      body: data.topAsignaturas.map((a) => [a.nombre, a.promedio.toFixed(2)]),
      theme: 'grid',
      styles: { fontSize: 10 },
    });
    doc.save("resumen_academico.pdf");
  }

  function exportarResumenExcel(data: Summary) {
    const ws = XLSX.utils.json_to_sheet([
      { Estudiantes: data.totalEstudiantes, Cursos: data.totalCursos, "Promedio General": data.promedioGeneral, "Tasa de Asistencia": data.tasaAsistencia }
    ]);
    const ws2 = XLSX.utils.json_to_sheet(
      data.topAsignaturas.map((a) => ({ Asignatura: a.nombre, Promedio: a.promedio }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resumen");
    XLSX.utils.book_append_sheet(wb, ws2, "Top Asignaturas");
    XLSX.writeFile(wb, "resumen_academico.xlsx");
  }

  return (
    <div className="resumen-page">
      <h2 className="page-title">Resumen Académico</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <button className="btn-minimal" onClick={() => exportarResumenPDF(data)}>
          Exportar a PDF
        </button>
        <button className="btn-minimal" onClick={() => exportarResumenExcel(data)}>
          Exportar a Excel
        </button>
      </div>

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
