// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import DashboardProfesor from "./pages/DashboardProfesor";
import ProfesorLayout from "./pages/ProfesorLayout";
import CursosProfesor from "./pages/CursosProfesor";
import ObservacionesProfesor from "./pages/ObservacionesProfesor";
import AsistenciaProfesor from "./pages/AsistenciaProfesor";
import CalificacionesProfesor from "./pages/CalificacionesProfesor";
import DashboardEstudiantes from "./pages/DashboardEstudiantes";

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

function ProfesorRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== 'profesor') {
    return <NoAutorizado />;
  }
  return <>{children}</>;
}

function EstudianteRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== 'estudiante') {
    return <NoAutorizado />;
  }
  return <>{children}</>;
}

// Componente para redirigir según el rol del usuario
function HomeRoute() {
  const { user } = useAuth();
  if (user?.role === 'profesor') {
    return <Navigate to="/dashboard-profesor" replace />;
  } else if (user?.role === 'estudiante') {
    return <Navigate to="/dashboard-estudiante" replace />;
  } else if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else {
    return <Login />;
  }
}

// NUEVO: Componente para decidir qué mostrar en /login
function LoginRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <HomeRoute /> : <Login />;
}

// NUEVO: Componente para decidir qué mostrar en la raíz
function RootRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <HomeRoute /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta raíz que muestra login o redirige según sesión/rol */}
          <Route path="/" element={<RootRoute />} />
          {/* Ruta /login que redirige si ya hay sesión */}
          <Route path="/login" element={<LoginRoute />} />
          
          {/* Ruta principal para admin y sus subrutas */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminRoute>
                <Layout />
              </AdminRoute>
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<Cursos />} />
            <Route path="calificaciones" element={<Calificaciones />} />
            <Route path="asistencia" element={<Asistencia />} />
            <Route path="resumen" element={<Resumen />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="estudiantes" element={<Estudiantes />} />
            <Route path="profesores" element={<Profesores />} />
            <Route path="asignaturas" element={<Asignaturas />} />
          </Route>
          
          {/* Ruta exclusiva para profesores, con layout propio y rutas hijas */}
          <Route path="/dashboard-profesor/*" element={
            <ProfesorRoute>
              <ProfesorLayout />
            </ProfesorRoute>
          }>
            <Route index element={<DashboardProfesor />} />
            <Route path="cursos" element={<CursosProfesor />} />
            <Route path="calificaciones" element={<CalificacionesProfesor />} />
            <Route path="observaciones" element={<ObservacionesProfesor />} />
            <Route path="asistencia" element={<AsistenciaProfesor />} />
          </Route>
          
          {/* Ruta exclusiva para estudiantes */}
          <Route path="/dashboard-estudiante" element={
            <EstudianteRoute>
              <DashboardEstudiantes />
            </EstudianteRoute>
          } />
          
          {/* Redirigir cualquier otra ruta a login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
