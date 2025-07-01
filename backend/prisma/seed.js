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
// backend/prisma/seed.ts
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Hashear password demo
        const passwordHash = yield bcrypt_1.default.hash('123456', 10);
        // Crear o encontrar admin
        yield prisma.usuario.upsert({
            where: { email: 'admin@demo.com' },
            update: {},
            create: {
                email: 'admin@demo.com',
                password: passwordHash,
                rol: 'admin',
                activo: true,
            },
        });
        // Crear profesores demo si no existen
        let profesor1 = yield prisma.profesor.findFirst();
        if (!profesor1) {
            profesor1 = yield prisma.profesor.create({
                data: {
                    nombre: 'Juan',
                    apellido: 'Pérez',
                    edad: 40,
                    sexo: 'M',
                },
            });
        }
        let profesor2 = yield prisma.profesor.findFirst({ where: { id: { not: profesor1.id } } });
        if (!profesor2) {
            profesor2 = yield prisma.profesor.create({
                data: {
                    nombre: 'María',
                    apellido: 'García',
                    edad: 35,
                    sexo: 'F',
                },
            });
        }
        // Crear usuarios para profesores
        yield prisma.usuario.upsert({
            where: { email: 'profesor1@demo.com' },
            update: {},
            create: {
                email: 'profesor1@demo.com',
                password: passwordHash,
                rol: 'profesor',
                profesorId: profesor1.id,
                activo: true,
            },
        });
        yield prisma.usuario.upsert({
            where: { email: 'profesor2@demo.com' },
            update: {},
            create: {
                email: 'profesor2@demo.com',
                password: passwordHash,
                rol: 'profesor',
                profesorId: profesor2.id,
                activo: true,
            },
        });
        // Limpiar tablas dependientes
        yield prisma.observacion.deleteMany();
        yield prisma.calificacion.deleteMany();
        yield prisma.asistencia.deleteMany();
        yield prisma.estudiante.deleteMany();
        yield prisma.cursoAsignatura.deleteMany();
        yield prisma.profesorAsignatura.deleteMany();
        yield prisma.curso.deleteMany();
        yield prisma.asignatura.deleteMany();
        // Crear Asignaturas
        const asignaturas = yield Promise.all(['Matemáticas', 'Lenguaje', 'Inglés', 'Historia', 'Ciencias'].map((nombre) => prisma.asignatura.create({ data: { nombre } })));
        // Relacionar Profesores ↔ Asignaturas (cada uno imparte 2)
        yield prisma.profesorAsignatura.createMany({
            data: [
                { profesorId: profesor1.id, asignaturaId: asignaturas[0].id }, // Matemáticas
                { profesorId: profesor1.id, asignaturaId: asignaturas[1].id }, // Lenguaje
                { profesorId: profesor2.id, asignaturaId: asignaturas[2].id }, // Inglés
                { profesorId: profesor2.id, asignaturaId: asignaturas[3].id }, // Historia
            ],
        });
        // Crear Cursos
        const cursos = yield Promise.all(['1° Básico A', '1° Básico B', '2° Básico A', '2° Básico B'].map((nombre, i) => prisma.curso.create({
            data: {
                nombre,
                jefeId: i % 2 === 0 ? profesor1.id : profesor2.id,
                planDeEstudio: {
                    create: asignaturas.map((asig) => ({ asignaturaId: asig.id })),
                },
            },
        })));
        // Crear Estudiantes
        const estudiantes = yield Promise.all(Array.from({ length: 10 }).map((_, i) => prisma.estudiante.create({
            data: {
                nombre: `Estud${i + 1}`,
                apellido: `Apellido${i + 1}`,
                edad: 12 + (i % 5),
                sexo: i % 2 === 0 ? 'M' : 'F',
                cursoId: cursos[i % cursos.length].id,
            },
        })));
        // Crear Calificaciones y Observaciones demo
        for (const est of estudiantes) {
            for (const p of yield prisma.cursoAsignatura.findMany({ where: { cursoId: est.cursoId } })) {
                yield prisma.calificacion.create({
                    data: {
                        estudianteId: est.id,
                        asignaturaId: p.asignaturaId,
                        profesorId: p.asignaturaId <= asignaturas[1].id ? profesor1.id : profesor2.id,
                        valor: parseFloat((Math.random() * 5 + 1).toFixed(2)),
                    },
                });
            }
            yield prisma.observacion.create({
                data: {
                    estudianteId: est.id,
                    profesorId: profesor1.id,
                    texto: 'Muy participativo en clase.',
                    estado: 'positiva',
                },
            });
            yield prisma.observacion.create({
                data: {
                    estudianteId: est.id,
                    profesorId: profesor2.id,
                    texto: 'Debe mejorar la puntualidad.',
                    estado: 'negativa',
                },
            });
        }
        console.log('Seed de usuarios y profesores demo completado.');
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
