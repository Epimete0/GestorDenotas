import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-super-segura-2024';

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
        profesorId?: number;
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
      return;
    }

    // Verificar token JWT
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Buscar usuario en la base de datos
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      include: {
        profesor: true
      }
    });

    if (!usuario) {
      res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    // Agregar información del usuario a la request
    req.user = {
      id: usuario.id,
      email: usuario.email,
      role: usuario.rol,
      profesorId: usuario.profesor?.id
    };

    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({
        success: false,
        message: 'Token inválido'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware para verificar roles específicos
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Acceso denegado: permisos insuficientes'
      });
      return;
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