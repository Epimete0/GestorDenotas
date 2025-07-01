import React, { useState, useEffect } from 'react';
import styles from './AsistenciaProfesor.module.css';
import { getCursosByProfesor, getEstudiantesByCurso, createAsistencia } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Curso, Student } from '../services/api';

export default function AsistenciaProfesor() {
  const { user } = useAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoId, setCursoId] = useState('');
  const [estudiantes, setEstudiantes] = useState<Student[]>([]);
  const [asistencia, setAsistencia] = useState<{ [id: number]: boolean }>({});
  const [loadingCursos, setLoadingCursos] = useState(false);
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.profesorId) return;
    setLoadingCursos(true);
    getCursosByProfesor(user.profesorId)
      .then(setCursos)
      .catch(() => setFeedback('Error cargando cursos'))
      .finally(() => setLoadingCursos(false));
  }, [user]);

  useEffect(() => {
    if (!cursoId) {
      setEstudiantes([]);
      setAsistencia({});
      return;
    }
    setLoadingEstudiantes(true);
    getEstudiantesByCurso(Number(cursoId))
      .then(estuds => {
        setEstudiantes(estuds);
        setAsistencia(Object.fromEntries(estuds.map(e => [e.id, false])));
      })
      .catch(() => setFeedback('Error cargando estudiantes'))
      .finally(() => setLoadingEstudiantes(false));
  }, [cursoId]);

  const handleCheck = (id: number) => {
    setAsistencia(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGuardar = async () => {
    setSaving(true);
    setFeedback(null);
    const fecha = new Date().toISOString().split('T')[0];
    try {
      await Promise.all(estudiantes.map(est =>
        createAsistencia({
          estudianteId: est.id,
          fecha,
          estado: asistencia[est.id] ? 'presente' : 'ausente',
        })
      ));
      setFeedback('¡Asistencia guardada correctamente!');
    } catch {
      setFeedback('Error al guardar la asistencia');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.contentWrap}>
      <div className={styles.header}><span>Registro de Asistencia</span></div>
      <div className={styles.selectorRow}>
        <label className={styles.selectorLabel}>
          <select
            className={styles.select}
            value={cursoId}
            onChange={e => setCursoId(e.target.value)}
            disabled={loadingCursos}
          >
            <option value="">Seleccionar Curso</option>
            {cursos.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.tableWrap}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.colEstudiante}>Estudiante</th>
                <th className={styles.colAsistencia}>Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {loadingEstudiantes ? (
                <tr><td colSpan={2}>Cargando estudiantes...</td></tr>
              ) : estudiantes.length === 0 ? (
                <tr><td colSpan={2}>Selecciona un curso para ver los estudiantes</td></tr>
              ) : (
                estudiantes.map(est => (
                  <tr key={est.id}>
                    <td className={styles.colEstudiante}>{est.nombre} {est.apellido}</td>
                    <td className={styles.colAsistencia}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={!!asistencia[est.id]}
                        onChange={() => handleCheck(est.id)}
                      />
                      <span style={{ marginLeft: 8, color: asistencia[est.id] ? '#4caf50' : '#ff5252', fontWeight: 500 }}>
                        {asistencia[est.id] ? 'Asistió' : 'No asistió'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <button
          className={styles.saveBtn}
          onClick={handleGuardar}
          disabled={saving || estudiantes.length === 0}
        >
          {saving ? 'Guardando...' : 'Guardar Asistencia'}
        </button>
      </div>
      {feedback && <div className={styles.feedback}>{feedback}</div>}
    </div>
  );
} 