// frontend/src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cursos from "./pages/Cursos";
import Calificaciones from "./pages/Calificaciones";
import Asistencia from "./pages/Asistencia";
import Resumen from "./pages/Resumen";
import Calendar from "./pages/Calendar";
import Estudiantes from "./pages/Estudiantes";
import Profesores from "./pages/Profesores";
import Asignaturas from "./pages/Asignaturas";

function NoAutorizado() {
  return (
    <div style={{textAlign: 'center', marginTop: '3rem', color: 'var(--color-text)'}}>
      <h2>⛔ No autorizado</h2>
      <p>No tienes permiso para acceder a esta página.</p>
    </div>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== 'admin') {
    return <NoAutorizado />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública para login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas protegidas */}
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            {/* Dashboard en "/" */}
            <Route index element={<Dashboard />} />

            {/* Solo admin */}
            <Route path="courses" element={
              <AdminRoute>
                <Cursos />
              </AdminRoute>
            } />

            {/* Acceso común */}
            <Route path="calificaciones" element={<Calificaciones />} />
            <Route path="asistencia" element={<Asistencia />} />
            <Route path="resumen" element={<Resumen />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="estudiantes" element={<Estudiantes />} />
            <Route path="profesores" element={<Profesores />} />
            <Route path="asignaturas" element={<Asignaturas />} />
          </Route>

          {/* Redirigir cualquier otra ruta a login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
