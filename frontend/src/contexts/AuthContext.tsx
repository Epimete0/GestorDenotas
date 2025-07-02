import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin, verifyToken as apiVerifyToken, logout as apiLogout } from '../services/api';
import type { User } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage al cargar la app
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        JSON.parse(savedUser); // Verificar que es JSON válido
        // Verificar token con el backend
        apiVerifyToken(token)
          .then(response => {
            if (response.success) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            } else {
              // Token inválido, limpiar datos
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
            }
          })
          .catch(() => {
            // Error al verificar token, limpiar datos
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          })
          .finally(() => {
            setLoading(false);
          });
      } catch {
        // Si hay error al parsear, limpiar datos corruptos
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiLogin(email, password);
      
      if (response.success) {
        const { user, token, profesorId, estudianteId, curso } = response.data;
        
        // Agregar IDs y datos adicionales al user según el rol
        let userWithData = user;
        if (profesorId) {
          userWithData = { ...user, profesorId };
        } else if (estudianteId) {
          userWithData = { ...user, estudianteId, curso };
        }
        
        // Guardar en localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userWithData));
        
        setUser(userWithData);
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Llamar al endpoint de logout del backend
        await apiLogout();
      }
    } catch {
      // Error en logout, continuar con la limpieza
    } finally {
      // Limpiar localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Limpiar estado
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 