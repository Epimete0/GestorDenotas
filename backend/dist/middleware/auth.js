"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminOrProfesor = exports.requireProfesor = exports.requireAdmin = exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'tu-clave-secreta-super-segura-2024';
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Buscar usuario en la base de datos
        const usuario = yield prisma.usuario.findUnique({
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
            profesorId: (_a = usuario.profesor) === null || _a === void 0 ? void 0 : _a.id
        };
        next();
    }
    catch (error) {
        console.error('Error en autenticación:', error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
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
});
exports.authenticateToken = authenticateToken;
// Middleware para verificar roles específicos
const requireRole = (roles) => {
    return (req, res, next) => {
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
exports.requireRole = requireRole;
// Middleware específico para admin
exports.requireAdmin = (0, exports.requireRole)(['admin']);
// Middleware específico para profesor
exports.requireProfesor = (0, exports.requireRole)(['profesor']);
// Middleware para admin o profesor
exports.requireAdminOrProfesor = (0, exports.requireRole)(['admin', 'profesor']);
