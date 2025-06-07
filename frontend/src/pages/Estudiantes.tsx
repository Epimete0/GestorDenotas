// frontend/src/pages/Estudiantes.tsx
import React, { useEffect, useState } from "react";
import { getStudents } from "../services/api";

// Define the Estudiante type locally if not exported from api
interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  curso: {
    nombre: string;
  };
  edad: number;
  sexo: string;
  calificaciones: {
    asignatura: {
      nombre: string;
    };
  }[];
  observaciones: any[];
}
import "./Estudiantes.css";

export default function Estudiantes() {
  const [lista, setLista] = useState<Estudiante[]>([]);
  const [cargando, setCargando] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getStudents()
      .then((data) => {
        // Map Student[] to Estudiante[] if needed
        setLista(
          data.map((s: any) => ({
            id: s.id,
            nombre: s.nombre,
            apellido: s.apellido,
            curso: s.curso,
            edad: s.edad,
            sexo: s.sexo,
            calificaciones: s.calificaciones,
            observaciones: s.observaciones ?? [],
          }))
        );
      })
      .catch((e) => setErr(e.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p className="status">Cargando estudiantes…</p>;
  if (err) return <p className="status error">Error: {err}</p>;

  return (
    <div className="estudiantes-container">
      <h2>Administración de Estudiantes</h2>
      <div className="estudiantes-grid">
        {lista.map((e) => (
          <div key={e.id} className="estudiante-card">
            <div className="card-header">
              {e.nombre} {e.apellido}
            </div>
            <div className="card-body">
              <p>
                <strong>Curso:</strong> {e.curso.nombre}
              </p>
              <p>
                <strong>Edad:</strong> {e.edad} · <strong>Sexo:</strong>{" "}
                {e.sexo}
              </p>
              <div className="subsection">
                <strong>Asignaturas:</strong>{" "}
                {e.calificaciones
                  .map((c) => c.asignatura.nombre)
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .join(", ")}
              </div>
              <div className="subsection">
                <strong>Observaciones:</strong> {e.observaciones.length}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
