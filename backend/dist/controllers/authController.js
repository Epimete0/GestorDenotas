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
exports.logout = exports.verifyToken = exports.login = void 0;
const prisma_1 = require("../config/prisma");
const errors_1 = require("../config/errors");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            next(errors_1.createError.validation('Email y contraseña son requeridos'));
            return;
        }
        let usuario = yield prisma_1.prisma.usuario.findUnique({
            where: { email },
            include: { profesor: true }
        });
        if (usuario) {
            if (password !== '123456') {
                next(errors_1.createError.unauthorized('Credenciales incorrectas'));
                return;
            }
            const token = 'token-' + Date.now() + '-' + usuario.id;
            let responseData = {
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
            }
            else if (usuario.rol === 'admin') {
                responseData.user.nombre = 'Administrador';
            }
            res.status(200).json({ success: true, data: responseData });
            return;
        }
        const usuarioEstudiante = yield prisma_1.prisma.usuarioEstudiante.findUnique({
            where: { email },
            include: {
                estudiante: { include: { curso: true } }
            }
        });
        if (!usuarioEstudiante) {
            next(errors_1.createError.unauthorized('Credenciales incorrectas'));
            return;
        }
        if (password !== '123456') {
            next(errors_1.createError.unauthorized('Credenciales incorrectas'));
            return;
        }
        const token = 'token-estudiante-' + Date.now() + '-' + usuarioEstudiante.id;
        const responseData = {
            user: {
                id: usuarioEstudiante.id,
                email: usuarioEstudiante.email,
                role: 'estudiante',
                nombre: usuarioEstudiante.estudiante.nombre,
                apellido: usuarioEstudiante.estudiante.apellido,
                estudianteId: usuarioEstudiante.estudianteId,
                curso: usuarioEstudiante.estudiante.curso
            },
            token
        };
        res.status(200).json({ success: true, data: responseData });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            next(errors_1.createError.unauthorized('Token no proporcionado'));
            return;
        }
        const tokenParts = token.split('-');
        if (tokenParts.length < 3) {
            next(errors_1.createError.unauthorized('Token inválido'));
            return;
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
                next(errors_1.createError.unauthorized('Usuario no encontrado'));
                return;
            }
            const userData = {
                id: usuarioEstudiante.id,
                email: usuarioEstudiante.email,
                role: 'estudiante',
                nombre: usuarioEstudiante.estudiante.nombre,
                apellido: usuarioEstudiante.estudiante.apellido,
                estudianteId: usuarioEstudiante.estudianteId,
                curso: usuarioEstudiante.estudiante.curso
            };
            res.status(200).json({ success: true, data: { user: userData } });
            return;
        }
        const userId = parseInt(tokenParts[2]);
        const usuario = yield prisma_1.prisma.usuario.findUnique({
            where: { id: userId },
            include: { profesor: true }
        });
        if (!usuario) {
            next(errors_1.createError.unauthorized('Usuario no encontrado'));
            return;
        }
        let userData = {
            id: usuario.id,
            email: usuario.email,
            role: usuario.rol
        };
        if (usuario.rol === 'profesor' && usuario.profesor) {
            userData.profesorId = usuario.profesor.id;
            userData.nombre = usuario.profesor.nombre;
            userData.apellido = usuario.profesor.apellido;
        }
        else if (usuario.rol === 'admin') {
            userData.nombre = 'Administrador';
        }
        res.status(200).json({ success: true, data: { user: userData } });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyToken = verifyToken;
const logout = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ success: true, message: 'Logout exitoso' });
    }
    catch (error) {
        next(error);
    }
});
exports.logout = logout;
