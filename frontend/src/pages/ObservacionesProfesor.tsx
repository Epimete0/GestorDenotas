import "./ObservacionesProfesor.css";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getCursosByProfesor, getEstudiantesByCurso, getObservacionesByEstudiante, createObservacion } from "../services/api";
import type { Curso, Student, Observacion } from "../services/api";
import { useOutletContext } from "react-router-dom";
import { FaPlus, FaList, FaPen, FaSearch } from "react-icons/fa";

function ObservacionesProfesor() {
  const { user } = useAuth();
  const outlet = useOutletContext<{ obsView?: "none" | "form" | "list"; setObsView?: (v: "none" | "form" | "list") => void }>() || {};
  const obsView = outlet.obsView ?? "none";
  const setObsView = outlet.setObsView ?? (() => {});
  // Formulario
  const [cursos, setCursos] = useState<Curso[]>([]);

  const [estudiantes, setEstudiantes] = useState<Student[]>([]);
  const [selectedCurso, setSelectedCurso] = useState<string>("");
  const [selectedEstudiante, setSelectedEstudiante] = useState<string>("");
  const [observacion, setObservacion] = useState("");
  const [estado, setEstado] = useState<"negativa" | "neutro" | "positiva">("neutro");
  const [formMsg, setFormMsg] = useState<string | null>(null);
  // Listado


  const [editObs, setEditObs] = useState<Observacion | null>(null);
  const [loading, setLoading] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [search, setSearch] = useState("");
  // Obtener todas las observaciones del profesor
  const [allObservaciones, setAllObservaciones] = useState<Observacion[]>([]);
  // Filtro de búsqueda (nombre o curso)
  const filteredObs = allObservaciones.filter(obs => {
    const est = obs.estudiante;
    const curso = est?.curso?.nombre || "";
    if (!est) return false;
    const fullName = `${est.nombre} ${est.apellido}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      curso.toLowerCase().includes(search.toLowerCase())
    );
  });
  // Paginación
  const itemsPerPage = 5;
  const paginatedObs = filteredObs.slice(0, itemsPerPage);
  const [modalEstudiante, setModalEstudiante] = useState<Student | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalObs, setModalObs] = useState<Observacion[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  // Cargar cursos y asignaturas al montar
  useEffect(() => {
    if (!user?.profesorId) return;
    getCursosByProfesor(user.profesorId).then(setCursos);
  }, [user]);

  // Cargar estudiantes del curso seleccionado (formulario)
  useEffect(() => {
    if (selectedCurso) {
      getEstudiantesByCurso(Number(selectedCurso)).then(setEstudiantes);
    } else {
      setEstudiantes([]);
    }
  }, [selectedCurso]);





  // Obtener todas las observaciones del profesor
  useEffect(() => {
    if (obsView === "list" && user?.profesorId) {
      setLoading(true);
      import("../services/api").then(api =>
        api.getObservacionesByProfesor(user.profesorId!)
          .then(setAllObservaciones)
          .finally(() => setLoading(false))
      );
    }
  }, [obsView, user]);

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEstudiante || !observacion) {
      setFormMsg("Completa todos los campos obligatorios.");
      return;
    }
    setLoading(true);
    try {
      await createObservacion({
        estudianteId: Number(selectedEstudiante),
        profesorId: user!.profesorId!,
        texto: observacion,
        estado,
      });
      setFormMsg("Observación registrada correctamente.");
      setObservacion("");
      setSelectedEstudiante("");
      setEstado("neutro");
    } catch (err: unknown) {
      setFormMsg(err instanceof Error ? err.message : "Error al crear observación");
    } finally {
      setLoading(false);
    }
  };



  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEstudiante || !observacion) {
      setFormMsg("Completa todos los campos obligatorios.");
      return;
    }
    setLoading(true);
    try {
      await createObservacion({
        estudianteId: Number(selectedEstudiante),
        profesorId: user!.profesorId!,
        texto: observacion,
        estado,
      });
      setFormMsg("Nueva observación registrada como edición.");
      setEditObs(null);
      setObservacion("");
      setSelectedEstudiante("");
      setEstado("neutro");
    } catch (err: unknown) {
      setFormMsg(err instanceof Error ? err.message : "Error al actualizar observación");
    } finally {
      setLoading(false);
    }
  };

  const handleViewObservaciones = async (estudiante: Student) => {
    setModalEstudiante(estudiante);
    setModalOpen(true);
    setModalLoading(true);
    try {
      const obs = await getObservacionesByEstudiante(estudiante.id);
      setModalObs(obs);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <>
      {obsView === "none" && (
        <div style={{ textAlign: "center", marginTop: 48, color: "#aaa", fontSize: "1.2rem" }}>
          Selecciona una acción para comenzar: agregar o listar observaciones.
        </div>
      )}
      {obsView === "form" && (
        <form className="oprof-form" onSubmit={editObs ? handleEditSubmit : handleSubmit}>
          <div className="oprof-form-row">
            <label className="oprof-label">
              <span className="oprof-label-text">Curso</span>
              <select className="oprof-input" value={selectedCurso} onChange={e => setSelectedCurso(e.target.value)} required>
                <option value="">Selecciona un curso</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </label>
            <label className="oprof-label">
              <span className="oprof-label-text">Nombre del Estudiante</span>
              <select className="oprof-input" value={selectedEstudiante} onChange={e => setSelectedEstudiante(e.target.value)} required>
                <option value="">Selecciona un estudiante</option>
                {estudiantes.map(e => <option key={e.id} value={e.id}>{e.nombre} {e.apellido}</option>)}
              </select>
            </label>
          </div>
          <div className="oprof-form-row">
            <label className="oprof-label">
              <span className="oprof-label-text">Estado</span>
              <select className="oprof-input" value={estado} onChange={e => setEstado(e.target.value as "negativa" | "neutro" | "positiva")} required>
                <option value="neutro">Neutro</option>
                <option value="positiva">Positiva</option>
                <option value="negativa">Negativa</option>
              </select>
            </label>
          </div>
          <div className="oprof-form-row">
            <label className="oprof-label">
              <span className="oprof-label-text">Observación</span>
              <textarea placeholder="Escribe tu observación aquí..." className="oprof-input oprof-textarea" value={observacion} onChange={e => setObservacion(e.target.value)} required />
            </label>
          </div>
          <div className="oprof-form-actions">
            <button className="oprof-btn" type="submit" disabled={loading}>
              <span className="truncate">{editObs ? "Registrar edición" : "Registrar Observación"}</span>
            </button>
          </div>
          {formMsg && <div style={{ color: formMsg.includes("correctamente") ? "#4caf50" : "#f44336", marginTop: 8 }}>{formMsg}</div>}
        </form>
      )}
      {obsView === "list" && (
        <div className="oprof-mockup-wrap">
          <div className="oprof-mockup-header">
            <div>
              <p className="oprof-mockup-title">Lista de Estudiantes</p>
              <p className="oprof-mockup-subtitle">Gestiona los registros y observaciones de los estudiantes</p>
            </div>
          </div>
          <div className="oprof-mockup-search-row">
            <div className="oprof-mockup-search-box">
              <FaSearch />
              <input
                className="oprof-mockup-search-input"
                type="text"
                placeholder="Buscar por nombre o curso"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          {loading ? <p>Cargando observaciones...</p> : (
            <>
              <div className="oprof-table-wrap">
                <table className="oprof-table oprof-mockup-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Curso</th>
                      <th>Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedObs.length === 0 && (
                      <tr><td colSpan={3}>No hay observaciones para mostrar.</td></tr>
                    )}
                    {paginatedObs.map(obs => (
                      <tr key={obs.id}>
                        <td className="oprof-mockup-name">{obs.estudiante?.nombre} {obs.estudiante?.apellido}</td>
                        <td className="oprof-mockup-course">{obs.estudiante?.curso?.nombre ?? "-"}</td>
                        <td className="oprof-mockup-action">
                          <span className="oprof-mockup-link" onClick={() => handleViewObservaciones(obs.estudiante!)}>Ver</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Controles de paginación... */}
            </>
          )}
          {/* Modal de observaciones del estudiante */}
          {modalOpen && (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.55)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ background: '#23272f', borderRadius: 14, padding: 40, minWidth: 700, maxWidth: 1200, color: '#fff', boxShadow: '0 4px 32px #0008', position: 'relative' }}>
                <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>&times;</button>
                <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: '1.4rem' }}>
                  Observaciones de {modalEstudiante?.nombre} {modalEstudiante?.apellido}
                </h2>
                {modalLoading ? <p>Cargando...</p> : (
                  modalObs.length === 0 ? <p>No hay observaciones para este estudiante.</p> : (
                    <ul style={{ padding: 0, margin: 0, listStyle: 'none', maxHeight: 420, overflowY: 'auto', paddingRight: 24 }}>
                      {modalObs.map((obs) => (
                        <li key={obs.id} style={{ marginBottom: 18, background: '#181b20', borderRadius: 8, padding: 12 }}>
                          <div style={{ fontWeight: 500, marginBottom: 4 }}>{obs.estado === 'positiva' ? '✅' : obs.estado === 'negativa' ? '⚠️' : '📝'} {obs.estado.charAt(0).toUpperCase() + obs.estado.slice(1)}</div>
                          <div style={{ fontSize: '1.05rem', marginBottom: 4 }}>{obs.texto}</div>
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {/* FAB botón flotante */}
      <div className={`fab-container${fabOpen ? " open" : ""}`}>
        <button className="fab-main" onClick={() => setFabOpen((o) => !o)} aria-label="Mostrar acciones" style={{ background: '#1978e5', color: '#fff' }}>
          <FaPlus size={28} />
        </button>
        <div className="fab-actions">
          <button className="fab-action" onClick={() => { setObsView("form"); setFabOpen(false); }} title="Agregar observación">
            <FaPen /> <span>Agregar observación</span>
          </button>
          <button className="fab-action" onClick={() => { setObsView("list"); setFabOpen(false); }} title="Listar observaciones">
            <FaList /> <span>Listar observaciones</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default ObservacionesProfesor; 