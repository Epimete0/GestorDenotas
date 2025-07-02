import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Layout.css";

export default function Layout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const isActive = (path: string) => pathname === path;

  // Modo oscuro
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return saved === "true";
    // Preferencia del sistema
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((d) => !d);

  const handleLogout = () => {
    logout();
  };

  const getUserDisplayName = () => {
    if (user?.nombre) {
      return user.nombre;
    }
    return user?.email || "Usuario";
  };

  const getRoleDisplayName = () => {
    switch (user?.role) {
      case 'admin':
        return 'Administrador';
      case 'profesor':
        return 'Profesor';
      default:
        return 'Usuario';
    }
  };

  const [obsView, setObsView] = useState<"none" | "form" | "list">("none");

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="profile">
          <div className="avatar" />
          <div className="info">
            <span className="name">{getUserDisplayName()}</span>
            <span className="role">{getRoleDisplayName()}</span>
          </div>
        </div>

        <nav className="menu">
          <h4>Menu Principal</h4>
          <ul>
            <li className={isActive("/admin") ? "active" : ""}>
              <Link to="/admin">Dashboard</Link>
            </li>
            {user?.role === 'admin' && (
              <li className={isActive("/admin/courses") ? "active" : ""}>
                <Link to="/admin/courses">Cursos</Link>
              </li>
            )}
            <li className={isActive("/admin/estudiantes") ? "active" : ""}>
              <Link to="/admin/estudiantes">Estudiantes</Link>
            </li>
            <li className={isActive("/admin/profesores") ? "active" : ""}>
              <Link to="/admin/profesores">Profesores</Link>
            </li>
            <li className={isActive("/admin/asignaturas") ? "active" : ""}>
              <Link to="/admin/asignaturas">Materias</Link>
            </li>
            <li className={isActive("/admin/calificaciones") ? "active" : ""}>
              <Link to="/admin/calificaciones">Calificaciones</Link>
            </li>
            <li className={isActive("/admin/asistencia") ? "active" : ""}>
              <Link to="/admin/asistencia">Asistencia</Link>
            </li>
            <li className={isActive("/admin/resumen") ? "active" : ""}>
              <Link to="/admin/resumen">Resumen</Link>
            </li>
          </ul>
        </nav>

        <nav className="menu others">
          <h4>Utiles</h4>
          <ul>
            <li className={isActive("/admin/calendar") ? "active" : ""}>
              <Link to="/admin/calendar">Calendario</Link>
            </li>
          </ul>
        </nav>

        <div style={{ margin: "1.5rem 0 0.5rem 0", textAlign: "center" }}>
          <button onClick={toggleDarkMode} style={{ width: "90%" }}>
            {darkMode ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
          </button>
        </div>

        <div className="logout-section">
          <button onClick={handleLogout} className="logout-button">
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="header">
          <h2>
            {pathname === "/"
              ? "Dashboard"
              : pathname.replace("/", "").charAt(0).toUpperCase() +
                pathname.slice(2)}
          </h2>
          {pathname.includes("/observaciones") && (
            <div style={{ display: "flex", gap: "1rem", marginLeft: "auto" }}>
              <button className="oprof-btn" onClick={() => setObsView("form")}>Agregar observación</button>
              <button className="oprof-btn" onClick={() => setObsView("list")}>Listar observaciones</button>
            </div>
          )}
        </header>
        <main className="content">
          <Outlet context={{ obsView, setObsView }} />
        </main>
      </div>
    </div>
  );
}
