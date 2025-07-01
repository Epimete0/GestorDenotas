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

  // Profesores realistas
  const profesoresData = [
    { nombre: 'Sofía', apellido: 'Ramírez', edad: 38, sexo: 'F' },
    { nombre: 'Carlos', apellido: 'Muñoz', edad: 45, sexo: 'M' },
    { nombre: 'Valentina', apellido: 'López', edad: 29, sexo: 'F' },
    { nombre: 'Diego', apellido: 'Fernández', edad: 50, sexo: 'M' },
  ];
  const profesores: { id: number; nombre: string; apellido: string; edad: number; sexo: string; }[] = [];
  for (const prof of profesoresData) {
    profesores.push(await prisma.profesor.create({ data: prof }));
  }

  // Crear usuarios para profesores con correos personalizados
  await prisma.usuario.upsert({
    where: { email: 'sofia.ramirez@demo.com' },
    update: {},
    create: {
      email: 'sofia.ramirez@demo.com',
      password: passwordHash,
      rol: 'profesor',
      profesorId: profesores[0].id,
      activo: true,
    },
  });
  await prisma.usuario.upsert({
    where: { email: 'carlos.munoz@demo.com' },
    update: {},
    create: {
      email: 'carlos.munoz@demo.com',
      password: passwordHash,
      rol: 'profesor',
      profesorId: profesores[1].id,
      activo: true,
    },
  });
  await prisma.usuario.upsert({
    where: { email: 'valentina.lopez@demo.com' },
    update: {},
    create: {
      email: 'valentina.lopez@demo.com',
      password: passwordHash,
      rol: 'profesor',
      profesorId: profesores[2].id,
      activo: true,
    },
  });
  await prisma.usuario.upsert({
    where: { email: 'diego.fernandez@demo.com' },
    update: {},
    create: {
      email: 'diego.fernandez@demo.com',
      password: passwordHash,
      rol: 'profesor',
      profesorId: profesores[3].id,
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

  // Asignaturas
  const asignaturas = await Promise.all(
    [
      'Matemáticas',
      'Lengua y Literatura',
      'Inglés',
      'Historia',
      'Ciencias Naturales',
      'Educación Física',
      'Artes Visuales',
    ].map((nombre) => prisma.asignatura.create({ data: { nombre } }))
  );

  // Relacionar Profesores ↔ Asignaturas
  await prisma.profesorAsignatura.createMany({
    data: [
      { profesorId: profesores[0].id, asignaturaId: asignaturas[0].id }, // Sofía - Matemáticas
      { profesorId: profesores[0].id, asignaturaId: asignaturas[1].id }, // Sofía - Lengua
      { profesorId: profesores[1].id, asignaturaId: asignaturas[2].id }, // Carlos - Inglés
      { profesorId: profesores[1].id, asignaturaId: asignaturas[3].id }, // Carlos - Historia
      { profesorId: profesores[2].id, asignaturaId: asignaturas[4].id }, // Valentina - Ciencias
      { profesorId: profesores[3].id, asignaturaId: asignaturas[5].id }, // Diego - Educación Física
      { profesorId: profesores[3].id, asignaturaId: asignaturas[6].id }, // Diego - Artes Visuales
    ],
  });

  // Cursos realistas
  const cursos = await Promise.all(
    [
      { nombre: '1° Básico A', jefeId: profesores[0].id },
      { nombre: '1° Básico B', jefeId: profesores[1].id },
      { nombre: '2° Básico A', jefeId: profesores[2].id },
      { nombre: '2° Básico B', jefeId: profesores[3].id },
    ].map((c) =>
      prisma.curso.create({
        data: {
          nombre: c.nombre,
          jefeId: c.jefeId,
          planDeEstudio: {
            create: asignaturas.map((asig) => ({ asignaturaId: asig.id })),
          },
        },
      })
    )
  );

  // Estudiantes realistas
  const estudiantesData = [
    { nombre: 'Martina', apellido: 'Gómez', edad: 7, sexo: 'F' },
    { nombre: 'Lucas', apellido: 'Soto', edad: 8, sexo: 'M' },
    { nombre: 'Antonia', apellido: 'Vera', edad: 7, sexo: 'F' },
    { nombre: 'Benjamín', apellido: 'Torres', edad: 8, sexo: 'M' },
    { nombre: 'Florencia', apellido: 'Navarro', edad: 7, sexo: 'F' },
    { nombre: 'Matías', apellido: 'Pizarro', edad: 8, sexo: 'M' },
    { nombre: 'Josefa', apellido: 'Silva', edad: 7, sexo: 'F' },
    { nombre: 'Agustín', apellido: 'Rojas', edad: 8, sexo: 'M' },
    { nombre: 'Valentina', apellido: 'Mora', edad: 7, sexo: 'F' },
    { nombre: 'Tomás', apellido: 'Castro', edad: 8, sexo: 'M' },
    { nombre: 'Isidora', apellido: 'Fuentes', edad: 7, sexo: 'F' },
    { nombre: 'Joaquín', apellido: 'Saavedra', edad: 8, sexo: 'M' },
    { nombre: 'Emilia', apellido: 'Cáceres', edad: 7, sexo: 'F' },
    { nombre: 'Vicente', apellido: 'Reyes', edad: 8, sexo: 'M' },
    { nombre: 'Amanda', apellido: 'Ortega', edad: 7, sexo: 'F' },
    { nombre: 'Gabriel', apellido: 'Méndez', edad: 8, sexo: 'M' },
  ];
  const estudiantes: { id: number; nombre: string; apellido: string; edad: number; sexo: string; cursoId: number; }[] = [];
  for (let i = 0; i < estudiantesData.length; i++) {
    estudiantes.push(
      await prisma.estudiante.create({
        data: {
          ...estudiantesData[i],
          cursoId: cursos[i % cursos.length].id,
        },
      })
    );
  }

  // Observaciones realistas
  const observacionesPositivas = [
    'Participa activamente en clase y muestra interés por aprender.',
    'Excelente comportamiento y compañerismo.',
    'Entrega sus tareas a tiempo y con dedicación.',
    'Demuestra creatividad en los trabajos escolares.',
    'Colabora con sus compañeros y respeta las normas.',
  ];
  const observacionesNegativas = [
    'Debe mejorar la puntualidad en la llegada a clases.',
    'Presenta dificultades para concentrarse en clase.',
    'No entrega tareas en los plazos establecidos.',
    'Necesita participar más en las actividades grupales.',
    'Debe mejorar la organización de su material escolar.',
  ];

  // Calificaciones realistas y observaciones
  for (const est of estudiantes) {
    const plan = await prisma.cursoAsignatura.findMany({ where: { cursoId: est.cursoId } });
    for (const p of plan) {
      // Asignar profesor según asignatura
      const profAsig = await prisma.profesorAsignatura.findFirst({ where: { asignaturaId: p.asignaturaId } });
      await prisma.calificacion.create({
        data: {
          estudianteId: est.id,
          asignaturaId: p.asignaturaId,
          profesorId: profAsig?.profesorId || profesores[0].id,
          valor: parseFloat((Math.random() * 2 + 4).toFixed(1)), // Notas entre 4.0 y 6.0
        },
      });
    }
    // Observaciones positivas y negativas alternadas
    await prisma.observacion.create({
      data: {
        estudianteId: est.id,
        profesorId: profesores[estudiantes.indexOf(est) % profesores.length].id,
        texto: observacionesPositivas[estudiantes.indexOf(est) % observacionesPositivas.length],
        estado: 'positiva',
      },
    });
    await prisma.observacion.create({
      data: {
        estudianteId: est.id,
        profesorId: profesores[(estudiantes.indexOf(est) + 1) % profesores.length].id,
        texto: observacionesNegativas[estudiantes.indexOf(est) % observacionesNegativas.length],
        estado: 'negativa',
      },
    });
  }

  console.log('Seed de datos realistas completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
