import { useState, useEffect } from "react";
import { API_BASE } from "../services/api";
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
    const fetchSummaryData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`${API_BASE}/api/summary`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();
        
        if (json.success) {
          setData(json.data);
        } else {
          throw new Error(json.message || 'Error al cargar datos del resumen');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  if (loading) return <p className="text-center">Cargando resumen…</p>;
  if (error) return <p className="text-center error">Error: {error}</p>;
  if (!data) return <p className="text-center">No se pudieron cargar los datos del resumen.</p>;

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
    
    if (data.topAsignaturas && data.topAsignaturas.length > 0) {
      doc.autoTable({
        startY: y,
        head: [["Asignatura", "Promedio"]],
        body: data.topAsignaturas.map((a) => [a.nombre, a.promedio.toFixed(2)]),
        theme: 'grid',
        styles: { fontSize: 10 },
      });
    } else {
      doc.text("No hay datos de asignaturas disponibles", 14, y);
    }
    
    doc.save("resumen_academico.pdf");
  }

  function exportarResumenExcel(data: Summary) {
    const ws = XLSX.utils.json_to_sheet([
      { Estudiantes: data.totalEstudiantes, Cursos: data.totalCursos, "Promedio General": data.promedioGeneral, "Tasa de Asistencia": data.tasaAsistencia }
    ]);
    
    let ws2;
    if (data.topAsignaturas && data.topAsignaturas.length > 0) {
      ws2 = XLSX.utils.json_to_sheet(
        data.topAsignaturas.map((a) => ({ Asignatura: a.nombre, Promedio: a.promedio }))
      );
    } else {
      ws2 = XLSX.utils.json_to_sheet([{ Asignatura: "No hay datos disponibles", Promedio: "" }]);
    }
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resumen");
    XLSX.utils.book_append_sheet(wb, ws2, "Top Asignaturas");
    XLSX.writeFile(wb, "resumen_academico.xlsx");
  }

  const handleManualTest = () => {
    fetch(`${API_BASE}/api/summary`)
      .then(res => res.json())
      .then(() => {
        // Procesar datos si es necesario
      })
      .catch(error => {
        console.error('Error en test manual:', error);
      });
  };

  return (
    <div className="resumen-page">
      <h2 className="page-title">Resumen Académico</h2>
      
      {/* Botón de prueba para debug */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <button 
          className="btn-minimal" 
          onClick={handleManualTest}
        >
          🔍 Probar Conexión
        </button>
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
        {topAsignaturas && topAsignaturas.length > 0 ? (
          <ul>
            {topAsignaturas.map((a, i) => (
              <li key={i}>
                <span>{a.nombre}</span>
                <span>{a.promedio.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No hay datos de asignaturas disponibles.</p>
        )}
      </section>
    </div>
  );
}
