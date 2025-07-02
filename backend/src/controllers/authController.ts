import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { createError } from '../config/errors';

export const login = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  // --- LOGIN ABIERTO PARA PRUEBAS ---
  const { email } = req.body;
  let userType: 'profesor' | 'estudiante' | 'admin' = 'profesor';
  if (email && email.includes('admin')) userType = 'admin';
  if (email && email.includes('estudiante')) userType = 'estudiante';

  let user: any = {
    id: 1,
    email: email || 'prueba@demo.com',
    role: userType,
    nombre: userType === 'profesor' ? 'Ana' : userType === 'admin' ? 'Administrador' : 'Estudiante Prueba',
    apellido: userType === 'profesor' ? 'García' : userType === 'estudiante' ? 'Demo' : undefined,
  };
  if (userType === 'profesor') user.profesorId = 49;
  if (userType === 'estudiante') {
    user.estudianteId = 407;
    user.nombre = 'Pedro';
    user.apellido = 'Morales';
    user.curso = { id: 73, nombre: 'Curso Especial 1' };
  }

  const token = 'token-pruebas';
  res.status(200).json({ success: true, data: { user, token } });
};

export const verifyToken = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
  // --- VERIFICACIÓN ABIERTA PARA PRUEBAS ---
  res.status(200).json({ success: true, data: { user: { id: 1, email: 'prueba@demo.com', role: 'admin', nombre: 'Administrador' } } });
};

export const logout = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
  res.status(200).json({ success: true, message: 'Logout exitoso' });
}; 