// frontend/src/pages/Estudiantes.tsx
import React, { useEffect, useState, useRef } from "react";
import { getStudents } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import {
  getObservacionesByEstudiante,
  createObservacion,
  updateObservacion,
  deleteObservacion,
} from "../services/api";
import type { Observacion } from "../services/api";
import "./Estudiantes.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

  const cargar = () => {
    setLoading(true);
    getObservacionesByEstudiante(estudianteId)
      .then(setObservaciones)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line
  }, [estudianteId]);

  const handleAgregar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTexto.trim() || !user?.profesorId) return;
    setSaving(true);
    try {
      await createObservacion({
        estudianteId,
        profesorId: user.profesorId,
        texto: nuevoTexto,
        estado: nuevoEstado,
      });
      setNuevoTexto("");
      setNuevoEstado("neutro");
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
        <div>Cargando observaciones…</div>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {observaciones.length === 0 ? (
            <li>No hay observaciones</li>
          ) : (
            observaciones.map((o) => (
              <li key={o.id} style={{ marginBottom: 6 }}>
                {editId === o.id ? (
                  <form onSubmit={handleGuardarEdicion} style={{ display: "inline" }}>
                    <input
                      value={editTexto}
                      onChange={(e) => setEditTexto(e.target.value)}
                      style={{ width: 180, marginRight: 4 }}
                      required
                      className="input-minimal"
                    />
                    <select value={editEstado} onChange={e => setEditEstado(e.target.value as any)} className="select-minimal">
                      <option value="negativa">Negativa</option>
                      <option value="neutro">Neutro</option>
                      <option value="positiva">Positiva</option>
                    </select>
                    <button type="submit" disabled={saving} className="btn-minimal">Guardar</button>
                    <button type="button" onClick={() => setEditId(null)} disabled={saving} className="btn-minimal">Cancelar</button>
                  </form>
                ) : (
                  <>
                    {o.texto} <span style={{ fontStyle: "italic", color: "#888" }}>({o.estado})</span>
                    {user?.profesorId === o.profesorId && (
                      <>
                        <button style={{ marginLeft: 8 }} onClick={() => handleEditar(o)} disabled={saving} className="btn-minimal">Editar</button>
                        <button style={{ marginLeft: 4 }} onClick={() => handleEliminar(o.id)} disabled={saving} className="btn-minimal">Eliminar</button>
                      </>
                    )}
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      )}
      <form onSubmit={handleAgregar} style={{ marginTop: 10, display: "flex", gap: 4 }}>
        <input
          value={nuevoTexto}
          onChange={e => setNuevoTexto(e.target.value)}
          placeholder="Agregar observación…"
          style={{ flex: 1 }}
          required
          disabled={saving}
          className="input-minimal"
        />
        <select value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value as any)} disabled={saving} className="select-minimal">
          <option value="negativa">Negativa</option>
          <option value="neutro">Neutro</option>
          <option value="positiva">Positiva</option>
        </select>
        <button type="submit" disabled={saving || !user?.profesorId} className="btn-minimal">Agregar</button>
      </form>
      {error && <div className="feedback-minimal" style={{ color: "red", marginTop: 4 }}>{error}</div>}
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
      <div className="modal-ficha" ref={modalRef} style={{ minWidth: 380, maxWidth: 480, borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--color-background-card, #fff)', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '1.2rem 1.5rem 1rem 1.5rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: 'var(--color-background-secondary, #f6f6fa)' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Ficha de {e.nombre} {e.apellido}</h4>
            <div style={{ fontSize: '1rem', color: '#666', marginTop: 2 }}><b>Curso:</b> {e.curso.nombre}</div>
            <div style={{ fontSize: '1rem', color: '#666', marginTop: 2 }}><b>Edad:</b> {e.edad} &nbsp; <b>Sexo:</b> {e.sexo}</div>
          </div>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.2rem 1.5rem 1.5rem 1.5rem' }}>
          <button
            onClick={() => exportarFichaPDF(e, obs)}
            style={{ float: 'right', marginBottom: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5rem 1.1rem', fontWeight: 500, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}
            title={'Exportar ficha a PDF'}
            className="btn-minimal"
          >
            Exportar ficha a PDF
          </button>

          <section style={{ marginBottom: 18 }}>
            <h5 style={{ fontSize: '1.08rem', margin: '1.2rem 0 0.5rem 0', color: '#222' }}>Calificaciones</h5>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.98rem' }}>
              {e.calificaciones.length === 0 ? <li style={{ color: '#888' }}>No hay calificaciones</li> :
                e.calificaciones.map((c, i) => (
                  <li key={i} style={{ marginBottom: 2 }}>
                    <b>{c.asignatura.nombre}:</b> {c.valor !== undefined ? c.valor.toFixed(2) : "-"}
                    {c.fecha ? <span style={{ color: '#888', fontSize: '0.95em' }}> ({new Date(c.fecha).toLocaleDateString()})</span> : ""}
                  </li>
                ))}
            </ul>
          </section>

          <section style={{ marginBottom: 18 }}>
            <h5 style={{ fontSize: '1.08rem', margin: '1.2rem 0 0.5rem 0', color: '#222' }}>Asistencias</h5>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.98rem' }}>
              {e.asistencias && e.asistencias.length > 0 ? e.asistencias.map((a, i) => (
                <li key={i} style={{ marginBottom: 2 }}>
                  {new Date(a.fecha).toLocaleDateString()} - <span style={{ color: a.estado === 'ausente' ? '#dc2626' : a.estado === 'tarde' ? '#f59e42' : '#16a34a' }}>{a.estado}</span>
                </li>
              )) : <li style={{ color: '#888' }}>No hay asistencias</li>}
            </ul>
          </section>

          <section style={{ marginBottom: 18 }}>
            <h5 style={{ fontSize: '1.08rem', margin: '1.2rem 0 0.5rem 0', color: '#222' }}>Observaciones</h5>
            <ObservacionesCRUD estudianteId={e.id} />
          </section>
        </div>
      </div>
    </div>
  );
}

export default function Estudiantes() {
  const [lista, setLista] = useState<Estudiante[]>([]);
  const [cargando, setCargando] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [fichaId, setFichaId] = useState<number | null>(null);

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
            asistencias: s.asistencias ?? [],
          }))
        );
      })
      .catch((e) => setErr(e.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p className="status">Cargando estudiantes…</p>;
  if (err) return <p className="status error">Error: {err}</p>;

  const estudianteSeleccionado = fichaId !== null ? lista.find(e => e.id === fichaId) : null;

  return (
    <div className="estudiantes-container">
      <h2>Administración de Estudiantes</h2>
      <div className="estudiantes-grid">
        {lista.map((e) => (
          <div
            key={e.id}
            className="estudiante-card"
            onClick={() => setFichaId(e.id)}
            tabIndex={0}
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
              <button
                className="ver-ficha-btn"
                tabIndex={-1}
                onClick={(ev) => {
                  ev.stopPropagation();
                  setFichaId(e.id);
                }}
                style={{ marginTop: 8 }}
              >
                Ver ficha
              </button>
            </div>
          </div>
        ))}
      </div>
      {estudianteSeleccionado && (
        <FichaModal estudiante={estudianteSeleccionado} onClose={() => setFichaId(null)} />
      )}
    </div>
  );
}
