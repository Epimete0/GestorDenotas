import "./DashboardProfesor.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getObservacionesByProfesor } from "../services/api";
import type { Observacion } from "../services/api";

const avatarUrl =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // Avatar genérico limpio

function DashboardProfesor() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);
  const [loadingObs, setLoadingObs] = useState(true);
  const [errorObs, setErrorObs] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.profesorId) return;
    setLoadingObs(true);
    getObservacionesByProfesor(user.profesorId)
      .then(setObservaciones)
      .catch((err) => setErrorObs(err.message))
      .finally(() => setLoadingObs(false));
  }, [user]);

  return (
    <>
      <div className="prof-title-row"><p className="prof-dashboard-title">Panel del Profesor</p></div>
    </>
  );
}

export default DashboardProfesor; 