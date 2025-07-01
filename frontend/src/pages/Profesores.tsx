import React, { useEffect, useState, useRef } from "react";
import { getProfesores, createProfesor, updateProfesor, deleteProfesor } from "../services/api";
import type { Profesor } from "../services/api";
import "./Estudiantes.css";

function CrearProfesorModal({ onClose, onProfesorCreado }: { onClose: () => void; onProfesorCreado: () => void }) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    sexo: "M" as "M" | "F"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
    setError(null);
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
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.edad) {
      setError("Todos los campos son requeridos");
      setLoading(false);
      return;
    }
    try {
      const edad = parseInt(formData.edad);
      if (edad < 18 || edad > 80) {
        throw new Error("La edad debe estar entre 18 y 80 años");
      }
      await createProfesor({
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        edad,
        sexo: formData.sexo
      });
      onProfesorCreado();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-ficha" ref={modalRef} style={{ minWidth: 400, maxWidth: 500, borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', padding: '0.7rem 1.5rem 0.7rem 1.5rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: 'var(--blue-header)' }}>
          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Agregar Profesor</h4>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre *</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }} placeholder="Ingrese el nombre" required disabled={loading} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Apellido *</label>
              <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }} placeholder="Ingrese el apellido" required disabled={loading} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Edad *</label>
              <input type="number" name="edad" value={formData.edad} onChange={handleInputChange} min="18" max="80" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }} placeholder="Ingrese la edad" required disabled={loading} />
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Sexo *</label>
              <select name="sexo" value={formData.sexo} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }} required disabled={loading}>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
            {error && (
              <div style={{ color: '#dc2626', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6 }}>{error}</div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: 0 }}>
              <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-light)', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.15s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--accent-secondary)'; e.currentTarget.style.border = '1px solid var(--accent-secondary)'; }} onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.border = '1px solid var(--border-light)'; }} disabled={loading}>Cancelar</button>
              <button type="submit" style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: 6, background: 'var(--accent-secondary)', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }} disabled={loading}>{loading ? "Creando..." : "Agregar"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function EditarProfesorModal({ profesor, onClose, onProfesorEditado }: { profesor: Profesor; onClose: () => void; onProfesorEditado: () => void }) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    nombre: profesor.nombre,
    apellido: profesor.apellido,
    edad: profesor.edad.toString(),
    sexo: profesor.sexo
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
    setError(null);
  }, [profesor]);

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
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.edad) {
      setError("Todos los campos son requeridos");
      setLoading(false);
      return;
    }
    try {
      const edad = parseInt(formData.edad);
      if (edad < 18 || edad > 80) {
        throw new Error("La edad debe estar entre 18 y 80 años");
      }
      await updateProfesor(profesor.id, {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        edad,
        sexo: formData.sexo
      });
      onProfesorEditado();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-ficha" ref={modalRef} style={{ minWidth: 400, maxWidth: 500, borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', padding: '0.7rem 1.5rem 0.7rem 1.5rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: 'var(--blue-header)' }}>
          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Editar Profesor</h4>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre *</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }} placeholder="Ingrese el nombre" required disabled={loading} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Apellido *</label>
              <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }} placeholder="Ingrese el apellido" required disabled={loading} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Edad *</label>
              <input type="number" name="edad" value={formData.edad} onChange={handleInputChange} min="18" max="80" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }} placeholder="Ingrese la edad" required disabled={loading} />
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Sexo *</label>
              <select name="sexo" value={formData.sexo} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }} required disabled={loading}>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
            {error && (
              <div style={{ color: '#dc2626', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6 }}>{error}</div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: 0 }}>
              <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-light)', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.15s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--accent-secondary)'; e.currentTarget.style.border = '1px solid var(--accent-secondary)'; }} onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.border = '1px solid var(--border-light)'; }} disabled={loading}>Cancelar</button>
              <button type="submit" style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: 6, background: 'var(--accent-secondary)', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ConfirmarEliminarModal({ profesor, onClose, onConfirmar }: { profesor: Profesor; onClose: () => void; onConfirmar: () => void }) {
  const modalRef = useRef<HTMLDivElement | null>(null);
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
  return (
    <div className="modal-overlay">
      <div className="modal-ficha" ref={modalRef} style={{ minWidth: 340, maxWidth: 400, borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', padding: '0.7rem 1.2rem 0.7rem 1.2rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: 'var(--blue-header)' }}>
          <h4 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 700, color: '#fff' }}>Eliminar Profesor</h4>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.2rem' }}>
          <p>¿Estás seguro de que deseas eliminar a <b>{profesor.nombre} {profesor.apellido}</b>?</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: 0 }}>
            <button type="button" onClick={onClose} style={{ padding: '0.7rem 1.2rem', border: '1px solid var(--border-light)', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.15s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--accent-secondary)'; e.currentTarget.style.border = '1px solid var(--accent-secondary)'; }} onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.border = '1px solid var(--border-light)'; }}>Cancelar</button>
            <button type="button" onClick={onConfirmar} style={{ padding: '0.7rem 1.2rem', border: 'none', borderRadius: 6, background: 'var(--error-dark)', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}>Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Profesores() {
  const [lista, setLista] = useState<Profesor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [mostrarCrearModal, setMostrarCrearModal] = useState(false);
  const [profesorAEditar, setProfesorAEditar] = useState<Profesor | null>(null);
  const [profesorAEliminar, setProfesorAEliminar] = useState<Profesor | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const cargarProfesores = () => {
    setCargando(true);
    getProfesores()
      .then(setLista)
      .catch((e) => setErr(e.message))
      .finally(() => setCargando(false));
  };

  const handleEliminarProfesor = async () => {
    if (!profesorAEliminar) return;
    setEliminando(true);
    try {
      await deleteProfesor(profesorAEliminar.id);
      cargarProfesores();
      setProfesorAEliminar(null);
    } catch (err: any) {
      alert("Error al eliminar profesor: " + err.message);
    } finally {
      setEliminando(false);
    }
  };

  useEffect(() => {
    cargarProfesores();
  }, []);

  if (cargando) return <p className="status">Cargando profesores…</p>;
  if (err) return <p className="status error">Error: {err}</p>;

  return (
    <div className="estudiantes-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Administración de Profesores</h2>
        <button
          onClick={() => setMostrarCrearModal(true)}
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
          Agregar Profesor
        </button>
      </div>
      <div className="estudiantes-grid">
        {lista.map((p) => (
          <div
            key={p.id}
            className="estudiante-card"
            style={{ cursor: "pointer", position: "relative" }}
          >
            <div className="card-header">
              {p.nombre} {p.apellido}
            </div>
            <div className="card-body">
              <p>
                <strong>Edad:</strong> {p.edad} · <strong>Sexo:</strong> {p.sexo}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setProfesorAEditar(p);
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
                  title="Editar profesor"
                >
                  ✎
                </button>
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setProfesorAEliminar(p);
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
                  title="Eliminar profesor"
                >
                  🗑
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {mostrarCrearModal && (
        <CrearProfesorModal onClose={() => setMostrarCrearModal(false)} onProfesorCreado={cargarProfesores} />
      )}
      {profesorAEditar && (
        <EditarProfesorModal profesor={profesorAEditar} onClose={() => setProfesorAEditar(null)} onProfesorEditado={cargarProfesores} />
      )}
      {profesorAEliminar && (
        <ConfirmarEliminarModal profesor={profesorAEliminar} onClose={() => setProfesorAEliminar(null)} onConfirmar={handleEliminarProfesor} />
      )}
    </div>
  );
} 