// frontend/src/pages/Estudiantes.tsx
import React, { useEffect, useState, useRef } from "react";
import { getStudents, getCourses, createStudent, updateStudent, deleteStudent, getProfesores } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import {
  getObservacionesByEstudiante,
  createObservacion,
  updateObservacion,
  deleteObservacion,
} from "../services/api";
import type { Observacion, Curso, Profesor } from "../services/api";
import "./Estudiantes.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Define the Estudiante type locally if not exported from api
interface Estudiante {
  id: number;
  nombre: string;
  apellido: string;
  curso: {
    id: number;
    nombre: string;
  };
  edad: number;
  sexo: string;
  calificaciones: {
    asignatura: {
      nombre: string;
    };
    valor?: number;
    fecha?: string;
  }[];
  observaciones: { texto: string; estado: string }[];
  asistencias?: { fecha: string; estado: string }[];
}

declare module "jspdf" {
  interface jsPDF {
    autoTable: (...args: any[]) => void;
    lastAutoTable: { finalY: number };
  }
}

function ObservacionesCRUD({ estudianteId }: { estudianteId: number }) {
  const { user } = useAuth();
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nuevoTexto, setNuevoTexto] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState<"negativa" | "neutro" | "positiva">("neutro");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTexto, setEditTexto] = useState("");
  const [editEstado, setEditEstado] = useState<"negativa" | "neutro" | "positiva">("neutro");
  const [saving, setSaving] = useState(false);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [profesorIdAdmin, setProfesorIdAdmin] = useState<number | null>(null);

  const cargar = () => {
    setLoading(true);
    getObservacionesByEstudiante(estudianteId)
      .then(setObservaciones)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargar();
    if (user?.role === 'admin') {
      getProfesores().then(setProfesores).catch(() => setProfesores([]));
    }
    // eslint-disable-next-line
  }, [estudianteId, user]);

  const handleAgregar = async (e: React.FormEvent) => {
    e.preventDefault();
    let profesorId = user?.profesorId;
    if (user?.role === 'admin') {
      if (!profesorIdAdmin) {
        setError('Selecciona un profesor autor');
        return;
      }
      profesorId = profesorIdAdmin;
    }
    if (!nuevoTexto.trim() || !profesorId) return;
    setSaving(true);
    try {
      await createObservacion({
        estudianteId,
        profesorId,
        texto: nuevoTexto,
        estado: nuevoEstado,
      });
      setNuevoTexto("");
      setNuevoEstado("neutro");
      if (user?.role === 'admin') setProfesorIdAdmin(null);
      cargar();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditar = (obs: Observacion) => {
    setEditId(obs.id);
    setEditTexto(obs.texto);
    setEditEstado(obs.estado);
  };

  const handleGuardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setSaving(true);
    try {
      await updateObservacion(editId, { texto: editTexto, estado: editEstado });
      setEditId(null);
      setEditTexto("");
      setEditEstado("neutro");
      cargar();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Eliminar esta observación?")) return;
    setSaving(true);
    try {
      await deleteObservacion(id);
      cargar();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ marginTop: 8 }}>
      <strong>Observaciones:</strong>
      {loading ? (
        <div style={{ margin: '1rem 0' }}>Cargando observaciones…</div>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {observaciones.length === 0 ? (
            <li style={{ color: 'var(--text-muted)' }}>No hay observaciones</li>
          ) : (
            observaciones.map((o) => (
              <li key={o.id} style={{ marginBottom: 8, wordBreak: 'break-word' }}>
                {editId === o.id ? (
                  <form onSubmit={handleGuardarEdicion} style={{ display: "flex", gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                      value={editTexto}
                      onChange={(e) => setEditTexto(e.target.value)}
                      style={{ flex: 2, minWidth: 120, padding: '0.5rem', borderRadius: 6, border: '1px solid var(--border-light)', fontSize: '1rem' }}
                      required
                      className="input-minimal"
                    />
                    <select value={editEstado} onChange={e => setEditEstado(e.target.value as any)} className="select-minimal" style={{ flex: 1, minWidth: 90, padding: '0.5rem', borderRadius: 6, border: '1px solid var(--border-light)', fontSize: '1rem' }}>
                      <option value="negativa">Negativa</option>
                      <option value="neutro">Neutro</option>
                      <option value="positiva">Positiva</option>
                    </select>
                    <button type="submit" disabled={saving} className="btn-minimal" style={{ minWidth: 70 }}>Guardar</button>
                    <button type="button" onClick={() => setEditId(null)} disabled={saving} className="btn-minimal" style={{ minWidth: 70 }}>Cancelar</button>
                  </form>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ flex: 2 }}>{o.texto} <span style={{ fontStyle: "italic", color: "#888" }}>({o.estado})</span></span>
                    {user && (user.role === 'admin' || user.profesorId === o.profesorId) && (
                      <span style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
                        <button onClick={() => handleEditar(o)} disabled={saving} className="btn-minimal" style={{ minWidth: 60 }}>Editar</button>
                        <button onClick={() => handleEliminar(o.id)} disabled={saving} className="btn-minimal" style={{ minWidth: 60 }}>Eliminar</button>
                      </span>
                    )}
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      )}
      <form onSubmit={handleAgregar} style={{ marginTop: 10, display: "flex", gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={nuevoTexto}
          onChange={e => setNuevoTexto(e.target.value)}
          placeholder="Agregar observación…"
          style={{ flex: 2, minWidth: 120, padding: '0.5rem', borderRadius: 6, border: '1px solid var(--border-light)', fontSize: '1rem' }}
          required
          disabled={saving}
          className="input-minimal"
        />
        {user?.role === 'admin' && (
          <select
            value={profesorIdAdmin ?? ''}
            onChange={e => setProfesorIdAdmin(e.target.value ? Number(e.target.value) : null)}
            required
            disabled={saving}
            className="select-minimal"
            style={{ flex: 1, minWidth: 120, padding: '0.5rem', borderRadius: 6, border: '1px solid var(--border-light)', fontSize: '1rem' }}
          >
            <option value="">Profesor autor</option>
            {profesores.map(p => (
              <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>
            ))}
          </select>
        )}
        <select value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value as any)} disabled={saving} className="select-minimal" style={{ flex: 1, minWidth: 90, padding: '0.5rem', borderRadius: 6, border: '1px solid var(--border-light)', fontSize: '1rem' }}>
          <option value="negativa">Negativa</option>
          <option value="neutro">Neutro</option>
          <option value="positiva">Positiva</option>
        </select>
        <button type="submit" disabled={saving || (!user?.profesorId && user?.role !== 'admin')} className="btn-minimal" style={{ minWidth: 70 }}>Agregar</button>
      </form>
      {error && <div className="feedback-minimal" style={{ color: "var(--error-dark)", marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function exportarFichaPDF(estudiante: Estudiante, observaciones: Observacion[]) {
  try {
    console.log('Exportando ficha PDF', { estudiante, observaciones });
    const doc = new jsPDF();
    let y = 14;
    doc.setFontSize(16);
    doc.text(`Ficha del Estudiante`, 14, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`Nombre: ${estudiante.nombre} ${estudiante.apellido}`, 14, y);
    y += 7;
    doc.text(`Curso: ${estudiante.curso.nombre}`, 14, y);
    y += 7;
    doc.text(`Edad: ${estudiante.edad}    Sexo: ${estudiante.sexo}`, 14, y);
    y += 10;

    // Calificaciones
    doc.setFontSize(13);
    doc.text("Calificaciones", 14, y);
    y += 3;
    doc.autoTable({
      startY: y,
      head: [["Asignatura", "Valor", "Fecha"]],
      body: estudiante.calificaciones.map((c) => [
        c.asignatura.nombre,
        c.valor !== undefined ? c.valor.toFixed(2) : "",
        c.fecha ? new Date(c.fecha).toLocaleDateString() : ""
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
    });
    y = doc.lastAutoTable.finalY + 6;

    // Asistencias
    doc.setFontSize(13);
    doc.text("Asistencias", 14, y);
    y += 3;
    doc.autoTable({
      startY: y,
      head: [["Fecha", "Estado"]],
      body: (estudiante.asistencias ?? []).map((a) => [
        a.fecha ? new Date(a.fecha).toLocaleDateString() : "",
        a.estado
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
    });
    y = doc.lastAutoTable.finalY + 6;

    // Observaciones
    doc.setFontSize(13);
    doc.text("Observaciones", 14, y);
    y += 3;
    doc.autoTable({
      startY: y,
      head: [["Texto", "Estado"]],
      body: observaciones.map((o) => [
        o.texto,
        o.estado
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
    });

    doc.save(`ficha_${estudiante.nombre}_${estudiante.apellido}.pdf`);
  } catch (err) {
    alert('Error al exportar PDF: ' + (err instanceof Error ? err.message : err));
    console.error('Error exportando PDF', err);
  }
}

function FichaModal({ estudiante, onClose }: { estudiante: Estudiante; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [obs, setObs] = useState<Observacion[]>([]);

  useEffect(() => {
    getObservacionesByEstudiante(estudiante.id)
      .then(setObs);
  }, [estudiante.id]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const e = estudiante;
  return (
    <div className="modal-overlay">
      <div className="modal-ficha" ref={modalRef} style={{ minWidth: 380, maxWidth: 480, borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', padding: '1.2rem 1.5rem 1rem 1.5rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: 'var(--blue-header)' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Ficha de {e.nombre} {e.apellido}</h4>
            <div style={{ fontSize: '1rem', color: '#e0e6ef', marginTop: 2 }}><b>Curso:</b> {e.curso.nombre}</div>
            <div style={{ fontSize: '1rem', color: '#e0e6ef', marginTop: 2 }}><b>Edad:</b> {e.edad} &nbsp; <b>Sexo:</b> {e.sexo}</div>
          </div>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.5rem 1.5rem 1.5rem 1.5rem' }}>
          <button
            onClick={() => exportarFichaPDF(e, obs)}
            style={{ float: 'right', marginBottom: 12, background: 'var(--accent-secondary)', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1.1rem', fontWeight: 500, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}
            title={'Exportar ficha a PDF'}
            className="btn-minimal"
          >
            Exportar ficha a PDF
          </button>

          <section style={{ marginBottom: 24, marginTop: 8 }}>
            <h5 style={{ fontSize: '1.08rem', margin: '1.2rem 0 0.5rem 0', color: 'var(--text-primary)' }}>Calificaciones</h5>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.98rem', lineHeight: 1.7 }}>
              {e.calificaciones.length === 0 ? <li style={{ color: 'var(--text-muted)' }}>No hay calificaciones</li> :
                e.calificaciones.map((c, i) => (
                  <li key={i} style={{ marginBottom: 2, color: 'var(--text-secondary)' }}>
                    <b style={{ color: 'var(--text-primary)' }}>{c.asignatura.nombre}:</b> {c.valor !== undefined ? c.valor.toFixed(2) : "-"}
                    {c.fecha ? <span style={{ color: 'var(--text-muted)', fontSize: '0.95em' }}> ({new Date(c.fecha).toLocaleDateString()})</span> : ""}
                  </li>
                ))}
            </ul>
          </section>

          <section style={{ marginBottom: 24 }}>
            <h5 style={{ fontSize: '1.08rem', margin: '1.2rem 0 0.5rem 0', color: 'var(--text-primary)' }}>Asistencias</h5>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.98rem', lineHeight: 1.7 }}>
              {e.asistencias && e.asistencias.length > 0 ? e.asistencias.map((a, i) => (
                <li key={i} style={{ marginBottom: 2 }}>
                  {new Date(a.fecha).toLocaleDateString()} - <span style={{ color: a.estado === 'ausente' ? 'var(--error-dark)' : a.estado === 'tarde' ? 'var(--accent-primary)' : '#4ade80' }}>{a.estado}</span>
                </li>
              )) : <li style={{ color: 'var(--text-muted)' }}>No hay asistencias</li>}
            </ul>
          </section>

          <section style={{ marginBottom: 8 }}>
            <h5 style={{ fontSize: '1.08rem', margin: '1.2rem 0 0.5rem 0', color: 'var(--text-primary)' }}>Observaciones</h5>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.98rem', lineHeight: 1.7 }}>
              {obs.length === 0 ? (
                <li style={{ color: 'var(--text-muted)' }}>No hay observaciones</li>
              ) : (
                obs.map((o, i) => (
                  <li key={i} style={{ marginBottom: 2 }}>
                    <span style={{ fontWeight: 500, color: o.estado === 'negativa' ? 'var(--error-dark)' : o.estado === 'positiva' ? 'var(--success-dark)' : 'var(--text-secondary)' }}>
                      {o.texto}
                    </span>
                    {o.estado && (
                      <span style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginLeft: 6 }}>
                        ({o.estado})
                      </span>
                    )}
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function CrearEstudianteModal({ onClose, onEstudianteCreado }: { onClose: () => void; onEstudianteCreado: () => void }) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    sexo: "M" as "M" | "F",
    cursoId: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
    setError(null);
    // Cargar cursos para el select
    getCourses()
      .then(setCursos)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.edad || !formData.cursoId) {
      setError("Todos los campos son requeridos");
      setLoading(false);
      return;
    }

    try {
      const edad = parseInt(formData.edad);
      if (edad < 3 || edad > 25) {
        throw new Error("La edad debe estar entre 3 y 25 años");
      }

      await createStudent({
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        edad,
        sexo: formData.sexo,
        cursoId: parseInt(formData.cursoId)
      });

      onEstudianteCreado();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-ficha" ref={modalRef} style={{ minWidth: 400, maxWidth: 500, borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', padding: '0.7rem 1.5rem 0.7rem 1.5rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: 'var(--blue-header)' }}>
          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Agregar Nuevo Estudiante</h4>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                placeholder="Ingrese el nombre"
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Apellido *</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                placeholder="Ingrese el apellido"
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Edad *</label>
              <input
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleInputChange}
                min="3"
                max="25"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                placeholder="Ingrese la edad"
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Sexo *</label>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                required
                disabled={loading}
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <div style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Curso *</label>
              <select
                name="cursoId"
                value={formData.cursoId}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                required
                disabled={loading}
              >
                <option value="">-- Seleccione un curso --</option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nombre}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div style={{ color: '#dc2626', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: 0 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 6,
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.15s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.color = 'var(--accent-secondary)';
                  e.currentTarget.style.border = '1px solid var(--accent-secondary)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.border = '1px solid var(--border-light)';
                }}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: 6, background: 'var(--accent-secondary)', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear Estudiante"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Modal para editar estudiante
function EditarEstudianteModal({ 
  estudiante, 
  onClose, 
  onEstudianteEditado 
}: { 
  estudiante: Estudiante; 
  onClose: () => void; 
  onEstudianteEditado: () => void; 
}) {
  const [formData, setFormData] = useState({
    nombre: estudiante.nombre,
    apellido: estudiante.apellido,
    edad: estudiante.edad.toString(),
    sexo: estudiante.sexo,
    cursoId: estudiante.curso?.id?.toString() || ""
  });
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const cursosData = await getCourses();
        setCursos(cursosData);
      } catch (err: any) {
        setError("Error al cargar cursos: " + err.message);
      }
    };
    cargarCursos();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.edad || !formData.cursoId) {
      setError("Todos los campos son requeridos");
      setLoading(false);
      return;
    }

    try {
      const edad = parseInt(formData.edad);
      if (isNaN(edad) || edad < 3 || edad > 25) {
        throw new Error("La edad debe estar entre 3 y 25 años");
      }

      await updateStudent(estudiante.id, {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        edad,
        sexo: formData.sexo,
        cursoId: parseInt(formData.cursoId)
      });

      onEstudianteEditado();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-ficha" ref={modalRef} style={{ minWidth: 400, maxWidth: 500, borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', padding: '1.2rem 1.5rem 1rem 1.5rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: 'var(--blue-header)' }}>
          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Editar Estudiante</h4>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                placeholder="Ingrese el nombre"
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Apellido *</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                placeholder="Ingrese el apellido"
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Edad *</label>
              <input
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleInputChange}
                min="3"
                max="25"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                placeholder="Ingrese la edad"
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Sexo *</label>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                required
                disabled={loading}
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Curso *</label>
              <select
                name="cursoId"
                value={formData.cursoId}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                required
                disabled={loading}
              >
                <option value="">-- Seleccione un curso --</option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nombre}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div style={{ color: '#dc2626', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: 0 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 6,
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.15s',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.color = 'var(--accent-secondary)';
                  e.currentTarget.style.border = '1px solid var(--accent-secondary)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.border = '1px solid var(--border-light)';
                }}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: 6, background: 'var(--accent-secondary)', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Modal de confirmación para eliminar
function ConfirmarEliminarModal({ 
  estudiante, 
  onClose, 
  onConfirmar 
}: { 
  estudiante: Estudiante; 
  onClose: () => void; 
  onConfirmar: () => void; 
}) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="modal-overlay">
      <div className="modal-ficha" ref={modalRef} style={{ minWidth: 400, maxWidth: 500, borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--color-background-card, #fff)', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '1.2rem 1.5rem 1rem 1.5rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: '#fef2f2' }}>
          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#dc2626' }}>⚠️ Confirmar Eliminación</h4>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <p style={{ marginBottom: '1rem', fontSize: '1rem', lineHeight: 1.5 }}>
            ¿Estás seguro de que deseas eliminar al estudiante <strong>{estudiante.nombre} {estudiante.apellido}</strong>?
          </p>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666', lineHeight: 1.4 }}>
            Esta acción no se puede deshacer. Se eliminarán también todas las calificaciones, asistencias y observaciones asociadas.
          </p>
          
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.75rem 1.5rem', border: '1px solid #ddd', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: '1rem' }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirmar}
              style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: 6, background: '#dc2626', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}
            >
              Eliminar Estudiante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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

export default function Estudiantes() {
  const [lista, setLista] = useState<Estudiante[]>([]);
  const [cargando, setCargando] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [fichaId, setFichaId] = useState<number | null>(null);
  const [mostrarCrearModal, setMostrarCrearModal] = useState(false);
  const [estudianteAEditar, setEstudianteAEditar] = useState<Estudiante | null>(null);
  const [estudianteAEliminar, setEstudianteAEliminar] = useState<Estudiante | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [mostrarObsModal, setMostrarObsModal] = useState(false);
  const [busquedaObs, setBusquedaObs] = useState("");
  const [estudianteObsId, setEstudianteObsId] = useState<number | null>(null);

  const cargarEstudiantes = () => {
    setCargando(true);
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
            asistencias: s.asistencias ?? [],
          }))
        );
      })
      .catch((e) => setErr(e.message))
      .finally(() => setCargando(false));
  };

  const handleEliminarEstudiante = async () => {
    if (!estudianteAEliminar) return;
    
    setEliminando(true);
    try {
      await deleteStudent(estudianteAEliminar.id);
      cargarEstudiantes();
      setEstudianteAEliminar(null);
    } catch (err: any) {
      alert("Error al eliminar estudiante: " + err.message);
    } finally {
      setEliminando(false);
    }
  };

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  if (cargando) return <p className="status">Cargando estudiantes…</p>;
  if (err) return <p className="status error">Error: {err}</p>;

  const estudianteSeleccionado = fichaId !== null ? lista.find(e => e.id === fichaId) : null;

  // Filtrado de estudiantes para el modal de observaciones
  const estudiantesFiltrados = lista.filter(e => {
    const q = busquedaObs.trim().toLowerCase();
    return (
      e.nombre.toLowerCase().includes(q) ||
      e.apellido.toLowerCase().includes(q) ||
      e.curso.nombre.toLowerCase().includes(q)
    );
  });
  const estudianteObs = estudianteObsId ? lista.find(e => e.id === estudianteObsId) : null;

  return (
    <div className="estudiantes-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
      <h2>Administración de Estudiantes</h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setMostrarObsModal(true)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: 8,
              background: 'var(--accent-secondary)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6 }}>
              <path d="M3 17.25V14.75C3 13.2312 4.23122 12 5.75 12H14.25C15.7688 12 17 13.2312 17 14.75V17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Gestionar observaciones
          </button>
          <button
            onClick={() => setMostrarCrearModal(true)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: 8,
              background: 'var(--accent-secondary)', // Oxford Blue
              color: '#fff',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Agregar Estudiante
          </button>
        </div>
      </div>
      <div className="estudiantes-grid">
        {lista.map((e) => (
          <div
            key={e.id}
            className="estudiante-card"
            style={{ cursor: "pointer", position: "relative" }}
          >
            <div className="card-header">
              {e.nombre} {e.apellido}
            </div>
            <div className="card-body">
              <p>
                <strong>Curso:</strong> {e.curso.nombre}
              </p>
              <p>
                <strong>Edad:</strong> {e.edad} · <strong>Sexo:</strong> {e.sexo}
              </p>
              <div className="subsection">
                <strong>Asignaturas:</strong> {e.calificaciones.map((c) => c.asignatura.nombre).filter((v, i, a) => a.indexOf(v) === i).join(", ")}
              </div>
              <div className="subsection">
                <strong>Observaciones:</strong> {e.observaciones.length}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button
                className="ver-ficha-btn"
                onClick={(ev) => {
                  ev.stopPropagation();
                  setFichaId(e.id);
                }}
                  style={{ flex: 1, background: 'var(--accent-secondary)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 500, fontSize: '1rem' }}
                >
                  Ver Ficha
                </button>
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setEstudianteAEditar(e);
                  }}
                  style={{
                    padding: '0.5rem',
                    border: 'none',
                    borderRadius: 6,
                    background: 'var(--accent-secondary)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '40px'
                  }}
                  title="Editar estudiante"
                >
                  {IconEdit}
                </button>
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setEstudianteAEliminar(e);
                  }}
                  style={{
                    padding: '0.5rem',
                    border: 'none',
                    borderRadius: 6,
                    background: 'var(--accent-secondary)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '40px'
                  }}
                  title="Eliminar estudiante"
                >
                  {IconDelete}
              </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {estudianteSeleccionado && (
        <FichaModal estudiante={estudianteSeleccionado} onClose={() => setFichaId(null)} />
      )}
      
      {mostrarCrearModal && (
        <CrearEstudianteModal 
          onClose={() => setMostrarCrearModal(false)} 
          onEstudianteCreado={cargarEstudiantes}
        />
      )}
      
      {estudianteAEditar && (
        <EditarEstudianteModal 
          estudiante={estudianteAEditar}
          onClose={() => setEstudianteAEditar(null)} 
          onEstudianteEditado={cargarEstudiantes}
        />
      )}
      
      {estudianteAEliminar && (
        <ConfirmarEliminarModal 
          estudiante={estudianteAEliminar}
          onClose={() => setEstudianteAEliminar(null)} 
          onConfirmar={handleEliminarEstudiante}
        />
      )}
      
      {mostrarObsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(10,12,20,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ minWidth: 400, maxWidth: 500, borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', padding: '1.2rem 1.5rem 1rem 1.5rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: 'var(--blue-header)' }}>
              <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Gestionar Observaciones</h4>
              <button onClick={() => setMostrarObsModal(false)} style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>×</button>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Buscar estudiante..."
                  value={busquedaObs}
                  onChange={e => {
                    setBusquedaObs(e.target.value);
                    setEstudianteObsId(null); // Limpiar selección al buscar
                  }}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: 6, border: '1px solid var(--border-light)', fontSize: '1rem', marginBottom: 10 }}
                />
                <select
                  style={{ width: '100%', padding: '0.7rem', borderRadius: 6, border: '1px solid var(--border-light)', fontSize: '1rem' }}
                  value={estudianteObsId ?? ''}
                  onChange={e => setEstudianteObsId(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Selecciona un estudiante</option>
                  {estudiantesFiltrados.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre} {e.apellido} - {e.curso.nombre}</option>
                  ))}
                </select>
              </div>
              {estudianteObs && (
                <div style={{ marginTop: '1.5rem' }}>
                  <ObservacionesCRUD estudianteId={estudianteObs.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
