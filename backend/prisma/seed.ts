// backend/prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hashear password demo
  const passwordHash = await bcrypt.hash('123456', 10);

  // Crear o encontrar admin
  await prisma.usuario.upsert({
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
  let profesor1 = await prisma.profesor.findFirst();
  if (!profesor1) {
    profesor1 = await prisma.profesor.create({
      data: {
        nombre: 'Juan',
        apellido: 'Pérez',
        edad: 40,
        sexo: 'M',
      },
    });
  }
  let profesor2 = await prisma.profesor.findFirst({ where: { id: { not: profesor1.id } } });
  if (!profesor2) {
    profesor2 = await prisma.profesor.create({
      data: {
        nombre: 'María',
        apellido: 'García',
        edad: 35,
        sexo: 'F',
      },
    });
  }

  // Crear usuarios para profesores
  await prisma.usuario.upsert({
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
  await prisma.usuario.upsert({
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
  await prisma.observacion.deleteMany();
  await prisma.calificacion.deleteMany();
  await prisma.asistencia.deleteMany();
  await prisma.estudiante.deleteMany();
  await prisma.cursoAsignatura.deleteMany();
  await prisma.profesorAsignatura.deleteMany();
  await prisma.curso.deleteMany();
  await prisma.asignatura.deleteMany();

  // Crear Asignaturas
  const asignaturas = await Promise.all(
    ['Matemáticas', 'Lenguaje', 'Inglés', 'Historia', 'Ciencias'].map(
      (nombre) => prisma.asignatura.create({ data: { nombre } })
    )
  );

  // Relacionar Profesores ↔ Asignaturas (cada uno imparte 2)
  await prisma.profesorAsignatura.createMany({
    data: [
      { profesorId: profesor1.id, asignaturaId: asignaturas[0].id }, // Matemáticas
      { profesorId: profesor1.id, asignaturaId: asignaturas[1].id }, // Lenguaje
      { profesorId: profesor2.id, asignaturaId: asignaturas[2].id }, // Inglés
      { profesorId: profesor2.id, asignaturaId: asignaturas[3].id }, // Historia
    ],
  });

  // Crear Cursos
  const cursos = await Promise.all(
    ['1° Básico A', '1° Básico B', '2° Básico A', '2° Básico B'].map((nombre, i) =>
      prisma.curso.create({
        data: {
          nombre,
          jefeId: i % 2 === 0 ? profesor1.id : profesor2.id,
          planDeEstudio: {
            create: asignaturas.map((asig) => ({ asignaturaId: asig.id })),
          },
        },
      })
    )
  );

  // Crear Estudiantes
  const estudiantes = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.estudiante.create({
        data: {
          nombre: `Estud${i + 1}`,
          apellido: `Apellido${i + 1}`,
          edad: 12 + (i % 5),
          sexo: i % 2 === 0 ? 'M' : 'F',
          cursoId: cursos[i % cursos.length].id,
        },
      })
    )
  );

  // Crear Calificaciones y Observaciones demo
  for (const est of estudiantes) {
    for (const p of await prisma.cursoAsignatura.findMany({ where: { cursoId: est.cursoId } })) {
      await prisma.calificacion.create({
        data: {
          estudianteId: est.id,
          asignaturaId: p.asignaturaId,
          profesorId: p.asignaturaId <= asignaturas[1].id ? profesor1.id : profesor2.id,
          valor: parseFloat((Math.random() * 5 + 1).toFixed(2)),
        },
      });
    }
    await prisma.observacion.create({
      data: {
        estudianteId: est.id,
        profesorId: profesor1.id,
        texto: 'Muy participativo en clase.',
        estado: 'positiva',
      },
    });
    await prisma.observacion.create({
      data: {
        estudianteId: est.id,
        profesorId: profesor2.id,
        texto: 'Debe mejorar la puntualidad.',
        estado: 'negativa',
      },
    });
  }

  console.log('Seed de usuarios y profesores demo completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
