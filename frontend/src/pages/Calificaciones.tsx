// frontend/src/pages/Calificaciones.tsx
import React, { useEffect, useState, useRef } from "react";
import { getStudents, getGrades, getAsignaturas, getProfesores, createGrade, updateGrade, deleteGrade } from "../services/api";
import type { Student, Grade, Asignatura, Profesor } from "../services/api";
import "./Calificaciones.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

function EditarNotaModal({ grade, open, onClose, onSave, onDelete, loading, error }: {
  grade: Grade;
  open: boolean;
  onClose: () => void;
  onSave: (valor: number) => void;
  onDelete: () => void;
  loading: boolean;
  error: string | null;
}) {
  const [valor, setValor] = useState(grade.valor.toString());
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValor(grade.valor.toString());
  }, [grade]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return open ? (
    <div className="modal-overlay">
      <div className="modal-ficha" ref={modalRef} style={{ minWidth: 340, maxWidth: 400, borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', padding: '1.2rem 1.5rem 1rem 1.5rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: 'var(--bg-secondary)' }}>
          <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Editar Calificación</h4>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.2rem' }}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>{grade.asignatura.nombre}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.97rem', marginBottom: 8 }}>{grade.profesor.nombre} {grade.profesor.apellido}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.93rem' }}>{new Date(grade.fecha).toLocaleDateString()}</div>
          </div>
          <form onSubmit={e => { e.preventDefault(); onSave(Number(valor)); }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Valor</label>
            <input
              type="number"
              min={1}
              max={7}
              step={0.01}
              value={valor}
              onChange={e => setValor(e.target.value)}
              style={{ width: '100%', padding: '0.7rem', border: '1px solid var(--border-light)', borderRadius: 8, fontSize: '1.1rem', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              disabled={loading}
              required
            />
            {error && <div style={{ color: 'var(--error-dark)', marginTop: 8 }}>{error}</div>}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: 18 }}>
              <button type="button" onClick={onClose} style={{ padding: '0.7rem 1.5rem', border: '1px solid var(--border-light)', borderRadius: 8, background: 'var(--bg-primary)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1rem' }} disabled={loading}>Cancelar</button>
              <button type="submit" style={{ padding: '0.7rem 1.5rem', border: 'none', borderRadius: 8, background: 'var(--accent-primary)', color: 'var(--black)', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }} disabled={loading}>Guardar</button>
            </div>
          </form>
          <div style={{ marginTop: 24, borderTop: '1px solid var(--border-light)', paddingTop: 16, textAlign: 'right' }}>
            <button type="button" onClick={onDelete} style={{ background: 'var(--error-dark)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', cursor: 'pointer', fontWeight: 500 }} disabled={loading}>Eliminar Calificación</button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

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

  // Editar
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  // Modal
  const [modalGrade, setModalGrade] = useState<Grade | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

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

  // SVG ICONOS
  const IconEdit = (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.7 2.29a1 1 0 0 1 1.42 0l1.59 1.59a1 1 0 0 1 0 1.42l-9.3 9.3-2.12.71.71-2.12 9.3-9.3zM3 17h14v2H3v-2z" fill="currentColor"/>
    </svg>
  );
  const IconDelete = (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 7v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7M9 3h2a2 2 0 0 1 2 2v1H7V5a2 2 0 0 1 2-2zM4 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Handlers edición y borrado
  const openModal = (grade: Grade) => {
    setModalGrade(grade);
    setModalError(null);
  };
  const closeModal = () => {
    setModalGrade(null);
    setModalError(null);
  };
  const handleModalSave = async (valor: number) => {
    setModalLoading(true);
    setModalError(null);
    try {
      if (isNaN(valor) || valor < 1 || valor > 7) throw new Error("Valor inválido (1-7)");
      const updated = await updateGrade(modalGrade!.id, { valor });
      setGrades((prev) => prev.map((g) => (g.id === modalGrade!.id ? { ...g, valor: updated.valor } : g)));
      closeModal();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };
  const handleModalDelete = async () => {
    if (!window.confirm("¿Eliminar esta calificación?")) return;
    setModalLoading(true);
    try {
      await deleteGrade(modalGrade!.id);
      setGrades((prev) => prev.filter((g) => g.id !== modalGrade!.id));
      closeModal();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
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
      <h2 className="page-title">Calificaciones de Estudiantes</h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 32 }}>
        Gestiona y visualiza las calificaciones de los estudiantes para todos los cursos.
      </p>
      <form className="add-form" style={{ maxWidth: 480, margin: '0 auto', background: 'var(--bg-card)', borderRadius: 16, padding: 32, boxShadow: 'var(--shadow-light)' }} onSubmit={handleAdd}>
        <div className="form-group">
          <label>Nombre del Estudiante</label>
          <select value={selectedStudent} onChange={e => setSelectedStudent(Number(e.target.value))} required>
            <option value="">Selecciona un estudiante</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.nombre} {s.apellido}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Curso</label>
          <select value={subjectId} onChange={e => setSubjectId(Number(e.target.value))} required>
            <option value="">Selecciona un curso</option>
            {asignaturas.map(a => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Profesor</label>
          <select value={profesorId} onChange={e => setProfesorId(Number(e.target.value))} required>
            <option value="">Selecciona un profesor</option>
            {profesores.map(p => (
              <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Calificación</label>
          <input
            type="number"
            min={1}
            max={7}
            step={0.01}
            placeholder="Ingresa la calificación"
            value={value}
            onChange={e => setValue(e.target.value)}
            required
          />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <button className="btn-primary" type="submit" disabled={formLoading} style={{ minWidth: 120 }}>
            Guardar calificación
          </button>
        </div>
        {formMsg && <div className={formMsg.startsWith('✅') ? 'feedback success' : 'feedback error'}>{formMsg}</div>}
      </form>
      {/* Aquí puedes mostrar el listado de calificaciones si lo deseas debajo o al costado */}
    </div>
  );
}
