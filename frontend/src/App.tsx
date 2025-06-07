// frontend/src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Cursos from "./pages/Cursos";
import Inscripcion from "./pages/Inscripcion";
import Calificaciones from "./pages/Calificaciones";
import Asistencia from "./pages/Asistencia";
import Resumen from "./pages/Resumen";
import Calendar from "./pages/Calendar";
import Estudiantes from "./pages/Estudiantes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Captura cualquier ruta bajo “/” */}
        <Route path="/*" element={<Layout />}>
          {/* Dashboard en “/” */}
          <Route index element={<Dashboard />} />

          {/* Hijas relativas */}
          <Route path="courses" element={<Cursos />} />
          <Route path="inscripcion" element={<Inscripcion />} />
          <Route path="calificaciones" element={<Calificaciones />} />
          <Route path="asistencia" element={<Asistencia />} />
          <Route path="resumen" element={<Resumen />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="estudiantes" element={<Estudiantes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
