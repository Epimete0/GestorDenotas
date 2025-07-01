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
            <li className={isActive("/") ? "active" : ""}>
              <Link to="/">Dashboard</Link>
            </li>
            {user?.role === 'admin' && (
              <li className={isActive("/courses") ? "active" : ""}>
                <Link to="/courses">Cursos</Link>
              </li>
            )}
            <li className={isActive("/estudiantes") ? "active" : ""}>
              <Link to="/estudiantes">Estudiantes</Link>
            </li>
            <li className={isActive("/profesores") ? "active" : ""}>
              <Link to="/profesores">Profesores</Link>
            </li>
            <li className={isActive("/asignaturas") ? "active" : ""}>
              <Link to="/asignaturas">Materias</Link>
            </li>
            <li className={isActive("/calificaciones") ? "active" : ""}>
              <Link to="/calificaciones">Calificaciones</Link>
            </li>
            <li className={isActive("/asistencia") ? "active" : ""}>
              <Link to="/asistencia">Asistencia</Link>
            </li>
            <li className={isActive("/resumen") ? "active" : ""}>
              <Link to="/resumen">Resumen</Link>
            </li>
          </ul>
        </nav>

        <nav className="menu others">
          <h4>Utiles</h4>
          <ul>
            <li className={isActive("/calendar") ? "active" : ""}>
              <Link to="/calendar">Calendario</Link>
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
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
