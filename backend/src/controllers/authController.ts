import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validar que se proporcionen las credenciales
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
      return;
    }

    // Buscar usuario por email
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        profesor: true
      }
    });

    if (!usuario) {
      res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
      return;
    }

    // Verificar contraseña (simplificado para pruebas)
    if (password !== '123456') {
      res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
      return;
    }

    // Generar token simple
    const token = 'token-' + Date.now() + '-' + usuario.id;

    // Preparar respuesta según el rol
    let responseData: any = {
      user: {
        id: usuario.id,
        email: usuario.email,
        role: usuario.rol
      },
      token
    };

    if (usuario.rol === 'profesor' && usuario.profesor) {
      responseData.profesorId = usuario.profesor.id;
      responseData.user.nombre = usuario.profesor.nombre;
      responseData.user.apellido = usuario.profesor.apellido;
    } else if (usuario.rol === 'admin') {
      responseData.user.nombre = 'Administrador';
    }

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: responseData
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
      return;
    }

    // Verificar token simple
    const tokenParts = token.split('-');
    if (tokenParts.length < 3) {
      res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
      return;
    }

    const userId = parseInt(tokenParts[2]);
    
    // Buscar usuario en la base de datos
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
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

    // Preparar datos del usuario
    let userData: any = {
      id: usuario.id,
      email: usuario.email,
      role: usuario.rol
    };

    if (usuario.rol === 'profesor' && usuario.profesor) {
      userData.profesorId = usuario.profesor.id;
      userData.nombre = usuario.profesor.nombre;
      userData.apellido = usuario.profesor.apellido;
    } else if (usuario.rol === 'admin') {
      userData.nombre = 'Administrador';
    }

    res.status(200).json({
      success: true,
      message: 'Token válido',
      data: { user: userData }
    });

  } catch (error) {
    console.error('Error en verificación de token:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}; 