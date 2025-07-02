import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { createError } from '../config/errors';

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
        profesorId?: number;
        estudianteId?: number;
      };
    }
  }
}

// --- AUTENTICACIÓN DESHABILITADA TEMPORALMENTE PARA PRUEBAS ---
export const authenticateToken = async (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
  // Deshabilitado: permite todas las peticiones sin verificar token
  return next();
};

// Middleware para verificar roles específicos
export const requireRole = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(createError.unauthorized('Usuario no autenticado'));
    }
    if (!roles.includes(req.user.role)) {
      return next(createError.forbidden('Acceso denegado: permisos insuficientes'));
    }
    next();
  };
};

// Middleware específico para admin
export const requireAdmin = requireRole(['admin']);

// Middleware específico para profesor
export const requireProfesor = requireRole(['profesor']);

// Middleware para admin o profesor
export const requireAdminOrProfesor = requireRole(['admin', 'profesor']);

// Middleware para estudiantes
export const requireEstudiante = requireRole(['estudiante']); 