// frontend/src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bienvenido al Sistema de Gestión Escolar</h1>
      <p>Este es el módulo principal.</p>
      <Link to="/courses">➡️ Ver Cursos</Link>
    </div>
  );
}
