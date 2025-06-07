import React, { useEffect, useState } from "react";
import { getStudents } from "../services/api";
import type { Student } from "../services/api";
import "./Asistencia.css";

export default function Asistencia() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | "">("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [status, setStatus] = useState<"Presente" | "Ausente" | "Tarde">(
    "Presente"
  );
  const [msg, setMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    getStudents()
      .then(setStudents)
      .catch((err) => setMsg({ text: err.message, type: "error" }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      setMsg({ text: "Selecciona un estudiante.", type: "error" });
      return;
    }
    // Aquí iría la llamada a la API...
    setMsg({
      text: `Asistencia marcada: ${status} el ${date}`,
      type: "success",
    });
    // opcional: reset
    // setSelectedStudent("");
    // setStatus("Presente");
  };

  return (
    <div className="asistencia-page">
      <h2 className="page-title">Asistencia</h2>
      <div className="asistencia-card card">
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
            >
              <option value="">-- Selecciona --</option>
              {students.map((s) => (
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
            />
          </div>

          <div className="form-group">
            <span className="radio-group-label">Estado</span>
            <div className="radio-group">
              {["Presente", "Ausente", "Tarde"].map((opt) => (
                <label key={opt}>
                  <input
                    type="radio"
                    name="status"
                    value={opt}
                    checked={status === opt}
                    onChange={() => setStatus(opt as any)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Marcar
          </button>
        </form>

        {msg && <div className={`feedback ${msg.type}`}>{msg.text}</div>}
      </div>
    </div>
  );
}
