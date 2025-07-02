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
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireEstudiante = exports.requireAdminOrProfesor = exports.requireProfesor = exports.requireAdmin = exports.requireRole = exports.authenticateToken = void 0;
const prisma_1 = require("../config/prisma");
const errors_1 = require("../config/errors");
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return next(errors_1.createError.unauthorized('Token de acceso requerido'));
        }
        const tokenParts = token.split('-');
        if (tokenParts.length < 3) {
            return next(errors_1.createError.unauthorized('Token inválido'));
        }
        if (tokenParts[1] === 'estudiante') {
            const estudianteUserId = parseInt(tokenParts[3]);
            const usuarioEstudiante = yield prisma_1.prisma.usuarioEstudiante.findUnique({
                where: { id: estudianteUserId },
                include: {
                    estudiante: { include: { curso: true } }
                }
            });
            if (!usuarioEstudiante) {
                return next(errors_1.createError.unauthorized('Usuario no encontrado'));
            }
            req.user = {
                id: usuarioEstudiante.id,
                email: usuarioEstudiante.email,
                role: 'estudiante',
                estudianteId: usuarioEstudiante.estudianteId
            };
            return next();
        }
        const userId = parseInt(tokenParts[2]);
        const usuario = yield prisma_1.prisma.usuario.findUnique({
            where: { id: userId },
            include: { profesor: true }
        });
        if (!usuario) {
            return next(errors_1.createError.unauthorized('Usuario no encontrado'));
        }
        req.user = {
            id: usuario.id,
            email: usuario.email,
            role: usuario.rol,
            profesorId: (_a = usuario.profesor) === null || _a === void 0 ? void 0 : _a.id
        };
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.authenticateToken = authenticateToken;
// Middleware para verificar roles específicos
const requireRole = (roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(errors_1.createError.unauthorized('Usuario no autenticado'));
        }
        if (!roles.includes(req.user.role)) {
            return next(errors_1.createError.forbidden('Acceso denegado: permisos insuficientes'));
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
// Middleware para estudiantes
exports.requireEstudiante = (0, exports.requireRole)(['estudiante']);
