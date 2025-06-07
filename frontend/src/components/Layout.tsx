import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="profile">
          <div className="avatar" />
          <div className="info">
            <span className="name">Nombre Usuario</span>
            <span className="role">Cargo</span>
          </div>
        </div>

        <nav className="menu">
          <h4>Menu Principal</h4>
          <ul>
            <li className={isActive("/") ? "active" : ""}>
              <Link to="/">Dashboard</Link>
            </li>
            <li className={isActive("/courses") ? "active" : ""}>
              <Link to="/courses">Cursos</Link>
            </li>
            <li className={isActive("/inscripcion") ? "active" : ""}>
              <Link to="/inscripcion">Inscripción</Link>
            </li>
            <li className={isActive("/estudiantes") ? "active" : ""}>
              <Link to="/estudiantes">Estudiantes</Link>
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
