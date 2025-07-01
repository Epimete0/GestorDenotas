import React, { useEffect, useState, useRef } from "react";
import { getAsignaturas, createAsignatura, updateAsignatura, deleteAsignatura, getProfesores, addProfesorToAsignatura, removeProfesorFromAsignatura } from "../services/api";
import type { Asignatura, Profesor } from "../services/api";
import "./Estudiantes.css";

function CrearAsignaturaModal({ onClose, onAsignaturaCreada }: { onClose: () => void; onAsignaturaCreada: () => void }) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    nombre: ""
  });
  const [profesoresSeleccionados, setProfesoresSeleccionados] = useState<number[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState(false);
  const [cargandoProfesores, setCargandoProfesores] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
    setError(null);
    // Cargar profesores al abrir el modal
    setCargandoProfesores(true);
    getProfesores()
      .then(setProfesores)
      .catch((err) => setError("Error al cargar profesores: " + err.message))
      .finally(() => setCargandoProfesores(false));
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
    
    if (!formData.nombre.trim()) {
      setError("El nombre es requerido");
      setLoading(false);
      return;
    }

    try {
      // Crear la asignatura
      const nuevaAsignatura = await createAsignatura({
        nombre: formData.nombre.trim()
      });

      // Asignar profesores seleccionados
      if (profesoresSeleccionados.length > 0) {
        const promesasAsignacion = profesoresSeleccionados.map(profesorId =>
          addProfesorToAsignatura(nuevaAsignatura.id, profesorId)
        );
        await Promise.all(promesasAsignacion);
      }

      onAsignaturaCreada();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al crear la materia");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfesorToggle = (profesorId: number) => {
    setProfesoresSeleccionados(prev => 
      prev.includes(profesorId)
        ? prev.filter(id => id !== profesorId)
        : [...prev, profesorId]
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-ficha" ref={modalRef} style={{ minWidth: 450, maxWidth: 550, borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', padding: '0.7rem 1.5rem 0.7rem 1.5rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: 'var(--blue-header)' }}>
          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Agregar Materia</h4>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre *</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }} placeholder="Ingrese el nombre de la materia" required disabled={loading} />
            </div>
            
            <div style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Profesores (opcional)</label>
              {cargandoProfesores ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>Cargando profesores...</p>
              ) : profesores.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>No hay profesores disponibles</p>
              ) : (
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: 6, padding: '0.5rem' }}>
                  {profesores.map((profesor) => (
                    <label key={profesor.id} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', cursor: 'pointer', borderRadius: 4, transition: 'background-color 0.15s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <input
                        type="checkbox"
                        checked={profesoresSeleccionados.includes(profesor.id)}
                        onChange={() => handleProfesorToggle(profesor.id)}
                        disabled={loading}
                        style={{ marginRight: '0.75rem' }}
                      />
                      <span>{profesor.nombre} {profesor.apellido}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div style={{ color: '#dc2626', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6 }}>{error}</div>
            )}
            
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: 0 }}>
              <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-light)', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.15s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--accent-secondary)'; e.currentTarget.style.border = '1px solid var(--accent-secondary)'; }} onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.border = '1px solid var(--border-light)'; }} disabled={loading}>Cancelar</button>
              <button type="submit" style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: 6, background: 'var(--accent-secondary)', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }} disabled={loading || cargandoProfesores}>{loading ? "Creando..." : "Agregar"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function EditarAsignaturaModal({ asignatura, onClose, onAsignaturaEditada }: { asignatura: Asignatura; onClose: () => void; onAsignaturaEditada: () => void }) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    nombre: asignatura.nombre
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
    setError(null);
  }, [asignatura]);

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
    if (!formData.nombre.trim()) {
      setError("El nombre es requerido");
      setLoading(false);
      return;
    }
    try {
      await updateAsignatura(asignatura.id, {
        nombre: formData.nombre.trim()
      });
      onAsignaturaEditada();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-ficha" ref={modalRef} style={{ minWidth: 400, maxWidth: 500, borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', padding: '0.7rem 1.5rem 0.7rem 1.5rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: 'var(--blue-header)' }}>
          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Editar Materia</h4>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre *</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }} placeholder="Ingrese el nombre de la materia" required disabled={loading} />
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

function ConfirmarEliminarModal({ asignatura, onClose, onConfirmar, error, eliminando }: { asignatura: Asignatura; onClose: () => void; onConfirmar: () => void; error: string | null; eliminando: boolean }) {
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
          <h4 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 700, color: '#fff' }}>Eliminar Materia</h4>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.2rem' }}>
          <p>¿Estás seguro de que deseas eliminar la materia <b>{asignatura.nombre}</b>?</p>
          {error && (
            <div style={{ color: '#dc2626', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6 }}>{error}</div>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: 0 }}>
            <button type="button" onClick={onClose} style={{ padding: '0.7rem 1.2rem', border: '1px solid var(--border-light)', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.15s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--accent-secondary)'; e.currentTarget.style.border = '1px solid var(--accent-secondary)'; }} onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.border = '1px solid var(--border-light)'; }} disabled={eliminando}>Cancelar</button>
            <button type="button" onClick={onConfirmar} style={{ padding: '0.7rem 1.2rem', border: 'none', borderRadius: 6, background: 'var(--error-dark)', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }} disabled={eliminando}>{eliminando ? "Eliminando..." : "Eliminar"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AsignarProfesorModal({ asignatura, onClose, onProfesorAsignado }: { asignatura: Asignatura; onClose: () => void; onProfesorAsignado: () => void }) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [profesoresAsignados, setProfesoresAsignados] = useState<Profesor[]>([]);
  const [profesoresDisponibles, setProfesoresDisponibles] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Cargar todos los profesores
    getProfesores()
      .then((todosProfesores) => {
        setProfesores(todosProfesores);
        
        // Separar profesores asignados y disponibles
        const asignados = asignatura.profesores?.map(p => ({
          id: p.profesor.id,
          nombre: p.profesor.nombre,
          apellido: p.profesor.apellido,
          edad: 0, // Valor por defecto ya que no viene en la relación
          sexo: 'M' // Valor por defecto ya que no viene en la relación
        })) || [];
        const disponibles = todosProfesores.filter(p => 
          !asignados.some(asignado => asignado.id === p.id)
        );
        
        setProfesoresAsignados(asignados);
        setProfesoresDisponibles(disponibles);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [asignatura]);

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

  const handleAsignarProfesor = async (profesorId: number) => {
    setLoading(true);
    setError(null);
    try {
      await addProfesorToAsignatura(asignatura.id, profesorId);
      const profesor = profesores.find(p => p.id === profesorId);
      if (profesor) {
        setProfesoresAsignados(prev => [...prev, profesor]);
        setProfesoresDisponibles(prev => prev.filter(p => p.id !== profesorId));
      }
      onProfesorAsignado();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDesasignarProfesor = async (profesorId: number) => {
    setLoading(true);
    setError(null);
    try {
      await removeProfesorFromAsignatura(asignatura.id, profesorId);
      const profesor = profesores.find(p => p.id === profesorId);
      if (profesor) {
        setProfesoresAsignados(prev => prev.filter(p => p.id !== profesorId));
        setProfesoresDisponibles(prev => [...prev, profesor]);
      }
      onProfesorAsignado();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-ficha" ref={modalRef} style={{ minWidth: 500, maxWidth: 600, borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', padding: '0.7rem 1.5rem 0.7rem 1.5rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: 'var(--blue-header)' }}>
          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Gestionar Profesores - {asignatura.nombre}</h4>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {loading && <p style={{ textAlign: 'center', marginBottom: '1rem' }}>Cargando...</p>}
          {error && (
            <div style={{ color: '#dc2626', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6 }}>{error}</div>
          )}
          
          <div style={{ marginBottom: '2rem' }}>
            <h5 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>Profesores Asignados</h5>
            {profesoresAsignados.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No hay profesores asignados</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {profesoresAsignados.map((profesor) => (
                  <div key={profesor.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 6, background: 'var(--bg-secondary)' }}>
                    <span>{profesor.nombre} {profesor.apellido}</span>
                    <button
                      onClick={() => handleDesasignarProfesor(profesor.id)}
                      disabled={loading}
                      style={{
                        padding: '0.5rem',
                        border: 'none',
                        borderRadius: 4,
                        background: 'var(--error-dark)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h5 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>Profesores Disponibles</h5>
            {profesoresDisponibles.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No hay profesores disponibles</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {profesoresDisponibles.map((profesor) => (
                  <div key={profesor.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 6, background: 'var(--bg-secondary)' }}>
                    <span>{profesor.nombre} {profesor.apellido}</span>
                    <button
                      onClick={() => handleAsignarProfesor(profesor.id)}
                      disabled={loading}
                      style={{
                        padding: '0.5rem',
                        border: 'none',
                        borderRadius: 4,
                        background: 'var(--accent-secondary)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Asignar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button onClick={onClose} style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-light)', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.15s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--accent-secondary)'; e.currentTarget.style.border = '1px solid var(--accent-secondary)'; }} onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.border = '1px solid var(--border-light)'; }}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Asignaturas() {
  const [lista, setLista] = useState<Asignatura[]>([]);
  const [cargando, setCargando] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [mostrarCrearModal, setMostrarCrearModal] = useState(false);
  const [asignaturaAEditar, setAsignaturaAEditar] = useState<Asignatura | null>(null);
  const [asignaturaAEliminar, setAsignaturaAEliminar] = useState<Asignatura | null>(null);
  const [asignaturaAGestionar, setAsignaturaAGestionar] = useState<Asignatura | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  const cargarAsignaturas = () => {
    setCargando(true);
    setErr(null);
    getAsignaturas()
      .then(setLista)
      .catch((e) => {
        console.error("Error al cargar asignaturas:", e);
        setErr(e.message || "Error al cargar las materias");
      })
      .finally(() => setCargando(false));
  };

  const handleEliminarAsignatura = async () => {
    if (!asignaturaAEliminar) return;
    setEliminando(true);
    setErrorEliminar(null);
    try {
      await deleteAsignatura(asignaturaAEliminar.id);
      cargarAsignaturas();
      setAsignaturaAEliminar(null);
    } catch (err: any) {
      console.error("Error al eliminar asignatura:", err);
      setErrorEliminar(err.message || "Error al eliminar la materia");
    } finally {
      setEliminando(false);
    }
  };

  useEffect(() => {
    cargarAsignaturas();
  }, []);

  if (cargando) return <p className="status">Cargando materias…</p>;
  if (err) return (
    <div className="estudiantes-container">
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p className="status error">Error: {err}</p>
        <button 
          onClick={cargarAsignaturas}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 6,
            background: 'var(--accent-secondary)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '1rem'
          }}
        >
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <div className="estudiantes-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Administración de Materias</h2>
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
          Agregar Materia
        </button>
      </div>
      
      {lista.length === 0 && !cargando ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>No hay materias registradas</p>
          <p style={{ color: '#999', marginTop: '0.5rem' }}>Haz clic en "Agregar Materia" para comenzar</p>
        </div>
      ) : (
        <div className="estudiantes-grid">
          {lista.map((a) => (
            <div
              key={a.id}
              className="estudiante-card"
              style={{ cursor: "pointer", position: "relative" }}
            >
              <div className="card-header">
                {a.nombre}
              </div>
              <div className="card-body">
                <p>
                  <strong>ID:</strong> {a.id}
                </p>
                <p>
                  <strong>Profesores:</strong> {a.profesores?.length || 0}
                </p>
                {a.profesores && a.profesores.length > 0 && (
                  <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                    {a.profesores.map(p => p.profesor.nombre + ' ' + p.profesor.apellido).join(', ')}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setAsignaturaAGestionar(a);
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
                    title="Gestionar profesores"
                  >
                    👥
                  </button>
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setAsignaturaAEditar(a);
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
                    title="Editar materia"
                  >
                    ✎
                  </button>
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setAsignaturaAEliminar(a);
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
                    title="Eliminar materia"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {mostrarCrearModal && (
        <CrearAsignaturaModal onClose={() => setMostrarCrearModal(false)} onAsignaturaCreada={cargarAsignaturas} />
      )}
      {asignaturaAEditar && (
        <EditarAsignaturaModal asignatura={asignaturaAEditar} onClose={() => setAsignaturaAEditar(null)} onAsignaturaEditada={cargarAsignaturas} />
      )}
      {asignaturaAEliminar && (
        <ConfirmarEliminarModal 
          asignatura={asignaturaAEliminar} 
          onClose={() => {
            setAsignaturaAEliminar(null);
            setErrorEliminar(null);
          }} 
          onConfirmar={handleEliminarAsignatura}
          error={errorEliminar}
          eliminando={eliminando}
        />
      )}
      {asignaturaAGestionar && (
        <AsignarProfesorModal asignatura={asignaturaAGestionar} onClose={() => setAsignaturaAGestionar(null)} onProfesorAsignado={cargarAsignaturas} />
      )}
    </div>
  );
} 