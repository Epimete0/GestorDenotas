import { useEffect, useState } from "react";
import { getStudents, getCourses, createEnrollment } from "../services/api";
import type { Student, Curso } from "../services/api";
import "./Inscripcion.css";

export default function Inscripcion() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Curso[]>([]);
  const [studentId, setStudentId] = useState<number | "">("");
  const [courseId, setCourseId] = useState<number | "">("");
  const [msg, setMsg] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getStudents()
      .then(setStudents)
      .catch((e) => setMsg({ text: e.message, type: "error" }));
    getCourses()
      .then(setCourses)
      .catch((e) => setMsg({ text: e.message, type: "error" }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !courseId) {
      setMsg({ text: "Selecciona estudiante y curso.", type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      await createEnrollment({ studentId, courseId });
      setMsg({ text: "Inscripción exitosa 🎉", type: "success" });
      setStudentId("");
      setCourseId("");
    } catch (err: any) {
      let message = err.message;
      if (message && message.startsWith('<!DOCTYPE')) {
        message = 'No se pudo inscribir al estudiante. Verifica los datos.';
      }
      setMsg({ text: message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="inscripcion-page">
      <h2 className="page-title">Inscripción de Estudiantes</h2>
      <div className="inscripcion-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="select-student">Estudiante</label>
            <select
              id="select-student"
              value={studentId}
              onChange={(e) =>
                setStudentId(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              disabled={submitting}
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
            <label htmlFor="select-course">Curso</label>
            <select
              id="select-course"
              value={courseId}
              onChange={(e) =>
                setCourseId(e.target.value === "" ? "" : Number(e.target.value))
              }
              disabled={submitting}
            >
              <option value="">-- Selecciona --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Inscribiendo…" : "Inscribir"}
          </button>
        </form>

        {msg && <div className={`feedback ${msg.type}`}>{msg.text}</div>}
      </div>
    </div>
  );
}
