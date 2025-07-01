import React, { useEffect, useState, useRef } from "react";
import { getCourses, getProfesores, getAsignaturas, createCourse, updateCourse, deleteCourse, getEstudiantesByCurso } from "../services/api";
import type { Curso, Profesor, Asignatura, Student } from "../services/api";
import "./Cursos.css";

// Modal para crear/editar curso
function CursoModal({ 
  curso, 
  onClose, 
  onCursoGuardado 
}: { 
  curso?: Curso; 
  onClose: () => void; 
  onCursoGuardado: () => void;
}) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [formData, setFormData] = useState({
    nombre: curso?.nombre || "",
    jefeId: curso?.jefeId ? curso.jefeId.toString() : ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cargar profesores para el select
    getProfesores()
      .then(setProfesores)
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

    try {
      if (!formData.nombre.trim() || !formData.jefeId) {
        throw new Error("Todos los campos son requeridos");
      }

      if (curso) {
        // Actualizar curso existente
        await updateCourse(curso.id, {
          nombre: formData.nombre.trim(),
          jefeId: parseInt(formData.jefeId)
        });
      } else {
        // Crear nuevo curso
        await createCourse({
          nombre: formData.nombre.trim(),
          jefeId: parseInt(formData.jefeId)
        });
      }

      onCursoGuardado();
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

  const isEditing = !!curso;

  return (
    <div className="modal-overlay">
      <div className="modal-ficha" ref={modalRef} style={{ minWidth: 400, maxWidth: 500, borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', padding: '1.2rem 1.5rem 1rem 1.5rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: 'var(--blue-header)' }}>
          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
            {isEditing ? 'Editar Curso' : 'Crear Nuevo Curso'}
          </h4>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre del Curso *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                placeholder="Ej: 1° Básico A"
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Jefe de Curso *</label>
              <select
                name="jefeId"
                value={formData.jefeId}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: 6, fontSize: '1rem' }}
                required
                disabled={loading}
              >
                <option value="">-- Seleccione un profesor --</option>
                {profesores.map((profesor) => (
                  <option key={profesor.id} value={profesor.id}>
                    {profesor.nombre} {profesor.apellido}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div style={{ color: '#dc2626', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
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
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-secondary)';
                  (e.currentTarget as HTMLButtonElement).style.border = '1px solid var(--accent-secondary)';
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-secondary)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                  (e.currentTarget as HTMLButtonElement).style.border = '1px solid var(--border-light)';
                }}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: 6, background: '#2563eb', color: '#fff', cursor: 'pointer', fontSize: '1rem', fontWeight: 500 }}
                disabled={loading}
              >
                {loading ? (isEditing ? "Actualizando..." : "Creando...") : (isEditing ? "Actualizar Curso" : "Crear Curso")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Modal para ver detalles del curso
function DetalleCursoModal({ curso, onClose }: { curso: Curso; onClose: () => void }) {
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
      <div className="modal-ficha" ref={modalRef} style={{ minWidth: 500, maxWidth: 600, borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', padding: '1.2rem 1.5rem 1rem 1.5rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: 'var(--blue-header)' }}>
          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Detalles del Curso: {curso.nombre}</h4>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: '#333' }}>Información General</h5>
            <p><strong>Nombre:</strong> {curso.nombre}</p>
            <p><strong>Jefe de Curso:</strong> {curso.jefeDeCurso ? `${curso.jefeDeCurso.nombre} ${curso.jefeDeCurso.apellido}` : 'No asignado'}</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: '#333' }}>Estudiantes ({curso.estudiantes?.length || 0})</h5>
            {curso.estudiantes && curso.estudiantes.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                {curso.estudiantes.map((estudiante) => (
                  <li key={estudiante.id}>
                    {estudiante.nombre} {estudiante.apellido}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No hay estudiantes inscritos</p>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: '#333' }}>Plan de Estudio ({curso.planDeEstudio?.length || 0})</h5>
            {curso.planDeEstudio && curso.planDeEstudio.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                {curso.planDeEstudio.map((item, index) => (
                  <li key={index}>
                    {item.asignatura.nombre}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No hay asignaturas asignadas</p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{ padding: '0.75rem 1.5rem', border: '1px solid #ddd', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: '1rem' }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Importar el componente FichaModal de Estudiantes
function FichaModal({ estudiante, onClose }: { estudiante: Student; onClose: () => void }) {
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
      <div className="modal-ficha" ref={modalRef} style={{ minWidth: 500, maxWidth: 700, borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', padding: '0.7rem 1.5rem 0.7rem 1.5rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: 'var(--blue-header)' }}>
          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Ficha de Estudiante</h4>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Información Personal</h5>
            <p><strong>Nombre:</strong> {estudiante.nombre} {estudiante.apellido}</p>
            <p><strong>Edad:</strong> {estudiante.edad} años</p>
            <p><strong>Sexo:</strong> {estudiante.sexo}</p>
            <p><strong>Curso:</strong> {estudiante.curso?.nombre || 'No asignado'}</p>
          </div>

          {estudiante.calificaciones && estudiante.calificaciones.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Calificaciones</h5>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                {estudiante.calificaciones.map((cal, index) => (
                  <li key={index}>
                    <strong>{cal.asignatura.nombre}:</strong> {cal.valor || 'Sin calificar'}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {estudiante.observaciones && estudiante.observaciones.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h5 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Observaciones</h5>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                {estudiante.observaciones.map((obs, index) => (
                  <li key={index}>
                    {obs.texto} <span style={{ fontStyle: "italic", color: "#888" }}>({obs.estado})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-light)', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1rem' }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal para mostrar estudiantes de un curso
function EstudiantesCursoModal({ curso, onClose }: { curso: Curso; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [estudiantes, setEstudiantes] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [estudianteFicha, setEstudianteFicha] = useState<Student | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getEstudiantesByCurso(curso.id)
      .then(setEstudiantes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [curso.id]);

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
      <div className="modal-ficha" ref={modalRef} style={{ minWidth: 800, maxWidth: '90vw', maxHeight: '90vh', borderRadius: 16, boxShadow: '0 8px 32px #0002', background: 'var(--bg-card)', color: 'var(--text-primary)', padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', padding: '0.7rem 1.5rem 0.7rem 1.5rem', borderTopLeftRadius: 16, borderTopRightRadius: 16, background: 'var(--blue-header)' }}>
          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Estudiantes del Curso: {curso.nombre}</h4>
          <button className="modal-close" onClick={onClose} title="Cerrar" style={{ fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 8 }}>×</button>
        </div>
        <div style={{ padding: '1.5rem', maxHeight: 'calc(90vh - 80px)', overflowY: 'auto' }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Cargando estudiantes...</p>
          ) : error ? (
            <div style={{ color: '#dc2626', padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6 }}>
              Error: {error}
            </div>
          ) : estudiantes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>No hay estudiantes en este curso</p>
            </div>
          ) : (
            <div className="estudiantes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {estudiantes.map((estudiante) => (
                <div
                  key={estudiante.id}
                  className="estudiante-card"
                  style={{
                    border: '1px solid var(--border-light)',
                    borderRadius: 8,
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  onClick={() => setEstudianteFicha(estudiante)}
                >
                  <div style={{ marginBottom: '0.5rem' }}>
                    <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                      {estudiante.nombre} {estudiante.apellido}
                    </h5>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                      <strong>Edad:</strong> {estudiante.edad} años
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                      <strong>Sexo:</strong> {estudiante.sexo}
                    </p>
                    {estudiante.calificaciones && estudiante.calificaciones.length > 0 && (
                      <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                        <strong>Calificaciones:</strong> {estudiante.calificaciones.length}
                      </p>
                    )}
                    {estudiante.observaciones && estudiante.observaciones.length > 0 && (
                      <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                        <strong>Observaciones:</strong> {estudiante.observaciones.length}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>Haz clic para ver ficha completa</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              onClick={onClose}
              style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-light)', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1rem' }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
      
      {estudianteFicha && (
        <FichaModal 
          estudiante={estudianteFicha} 
          onClose={() => setEstudianteFicha(null)} 
        />
      )}
    </div>
  );
}

export default function Cursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarCrearModal, setMostrarCrearModal] = useState(false);
  const [cursoEditando, setCursoEditando] = useState<Curso | null>(null);
  const [cursoDetalle, setCursoDetalle] = useState<Curso | null>(null);
  const [cursoEstudiantes, setCursoEstudiantes] = useState<Curso | null>(null);

  const cargarCursos = () => {
    setLoading(true);
    getCourses()
      .then((data) => setCursos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  const handleEliminarCurso = async (curso: Curso) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el curso "${curso.nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await deleteCourse(curso.id);
      cargarCursos();
    } catch (err: any) {
      alert(`Error al eliminar el curso: ${err.message}`);
    }
  };

  if (loading) return <p className="status-msg">Cargando cursos…</p>;
  if (error) return <p className="status-msg error">Error: {error}</p>;

  return (
    <div className="courses-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Administración de Cursos</h2>
        <button
          onClick={() => setMostrarCrearModal(true)}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: 6,
            background: '#2563eb',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ➕ Agregar Curso
        </button>
      </div>
      
      <div className="courses-grid">
        {cursos.map((curso) => (
          <div key={curso.id} className="course-card">
            <div className="card-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{curso.nombre}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCursoEstudiantes(curso);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: 4
                    }}
                    title="Ver estudiantes"
                  >
                    👥
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCursoDetalle(curso);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: 4
                    }}
                    title="Ver detalles"
                  >
                    👁️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCursoEditando(curso);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: 4
                    }}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEliminarCurso(curso);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: 4
                    }}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <p><strong>Jefe de Curso:</strong> {curso.jefeDeCurso ? `${curso.jefeDeCurso.nombre} ${curso.jefeDeCurso.apellido}` : 'No asignado'}</p>
              <p><strong>Estudiantes:</strong> {curso.estudiantes?.length || 0}</p>
              <p><strong>Asignaturas:</strong> {curso.planDeEstudio?.length || 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modales */}
      {mostrarCrearModal && (
        <CursoModal 
          onClose={() => setMostrarCrearModal(false)} 
          onCursoGuardado={cargarCursos}
        />
      )}
      
      {cursoEditando && (
        <CursoModal 
          curso={cursoEditando}
          onClose={() => setCursoEditando(null)} 
          onCursoGuardado={cargarCursos}
        />
      )}

      {cursoDetalle && (
        <DetalleCursoModal 
          curso={cursoDetalle}
          onClose={() => setCursoDetalle(null)}
        />
      )}

      {cursoEstudiantes && (
        <EstudiantesCursoModal 
          curso={cursoEstudiantes}
          onClose={() => setCursoEstudiantes(null)}
        />
      )}
    </div>
  );
}
