// backend/prisma/seed.ts
import { PrismaClient, Profesor, Asignatura, Curso, Estudiante } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Contraseña común
  const passwordHash = await bcrypt.hash("654321", 10);

  // Profesores nuevos
  const profesoresData = [
    { nombre: "Ana", apellido: "García", edad: 40, sexo: "F" },
    { nombre: "Luis", apellido: "Pérez", edad: 35, sexo: "M" },
    { nombre: "Marta", apellido: "Sánchez", edad: 42, sexo: "F" },
    { nombre: "Jorge", apellido: "Ruiz", edad: 39, sexo: "M" },
  ];
  const profesores: Profesor[] = [];
  for (const prof of profesoresData) {
    profesores.push(await prisma.profesor.create({ data: prof }));
  }

  // Usuarios para profesores
  for (let i = 0; i < profesores.length; i++) {
    await prisma.usuario.upsert({
      where: { email: `nuevo_profesor${i + 1}@demo.com` },
      update: {},
      create: {
        email: `nuevo_profesor${i + 1}@demo.com`,
        password: passwordHash,
        rol: "profesor",
        profesorId: profesores[i].id,
        activo: true,
      },
    });
  }

  // Limpiar tablas dependientes
  await prisma.observacion.deleteMany();
  await prisma.calificacion.deleteMany();
  await prisma.asistencia.deleteMany();
  await prisma.usuarioEstudiante.deleteMany();
  await prisma.estudiante.deleteMany();
  await prisma.cursoAsignatura.deleteMany();
  await prisma.profesorAsignatura.deleteMany();
  await prisma.curso.deleteMany();
  await prisma.asignatura.deleteMany();

  // Asignaturas nuevas
  const asignaturasNombres = [
    "Física",
    "Química",
    "Biología",
    "Matemática Avanzada",
    "Lengua Moderna",
    "Historia Universal",
    "Educación Artística",
    "Tecnología Digital",
  ];
  const asignaturas: Asignatura[] = [];
  for (const nombre of asignaturasNombres) {
    asignaturas.push(await prisma.asignatura.create({ data: { nombre } }));
  }

  // Relacionar profesores con asignaturas (cada uno 2-3 asignaturas)
  for (let i = 0; i < profesores.length; i++) {
    for (let j = 0; j < asignaturas.length; j++) {
      if ((j + i) % profesores.length === i || j % profesores.length === i) {
        await prisma.profesorAsignatura.create({
          data: { profesorId: profesores[i].id, asignaturaId: asignaturas[j].id },
        });
      }
    }
  }

  // Cursos nuevos (4 cursos, cada profesor jefe de 1)
  const cursos: Curso[] = [];
  for (let i = 0; i < 4; i++) {
    cursos.push(
      await prisma.curso.create({
        data: {
          nombre: `Curso Especial ${i + 1}`,
          jefeId: profesores[i].id,
          planDeEstudio: {
            create: asignaturas.slice(i, i + 2).map((asig) => ({ asignaturaId: asig.id })),
          },
        },
      })
    );
  }

  // Estudiantes nuevos (5 por curso)
  const nombres = [
    "Pedro", "Lucía", "Santiago", "Valeria", "Andrés",
    "Sofía", "Diego", "Paula", "Martín", "Elena",
    "Camilo", "Carla", "Tomás", "Alicia", "Bruno",
    "Marina", "Iván", "Rosa", "Samuel", "Nuria"
  ];
  const apellidos = [
    "Morales", "Delgado", "Ramos", "Vega", "Cruz",
    "Herrera", "Aguilar", "Castillo", "Ortega", "Flores",
    "Peña", "Silva", "Molina", "Suárez", "Giménez",
    "Navarro", "Reyes", "Serrano", "Iglesias", "Cabrera"
  ];
  let estudianteIdx = 0;
  const estudiantes: Estudiante[] = [];
  const usedEmails = new Set<string>();
  for (let i = 0; i < cursos.length; i++) {
    for (let j = 0; j < 5; j++) {
      const nombre = nombres[(estudianteIdx + j) % nombres.length];
      const apellido = apellidos[(estudianteIdx + j) % apellidos.length];
      const edad = 15 + (j % 3); // 15-17 años
      const sexo = j % 2 === 0 ? "F" : "M";
      const est = await prisma.estudiante.create({
        data: {
          nombre,
          apellido,
          edad,
          sexo,
          cursoId: cursos[i].id,
        },
      });
      estudiantes.push(est);
      // Generar email único
      let baseEmail = `${nombre.toLowerCase()}.${apellido.toLowerCase()}@nuevoestudiante.com`;
      let email = baseEmail;
      let count = 1;
      while (usedEmails.has(email)) {
        email = `${nombre.toLowerCase()}.${apellido.toLowerCase()}${count}@nuevoestudiante.com`;
        count++;
      }
      usedEmails.add(email);
      // Usuario para estudiante
      await prisma.usuarioEstudiante.create({
        data: {
          email,
          password: passwordHash,
          estudianteId: est.id,
          activo: true,
        },
      });
    }
    estudianteIdx += 5;
  }

  // Calificaciones, observaciones y asistencias para cada estudiante
  for (const est of estudiantes) {
    // Calificaciones en todas las asignaturas del curso
    const plan = await prisma.cursoAsignatura.findMany({ where: { cursoId: est.cursoId } });
    for (const p of plan) {
      // Profesor asignado a la asignatura
      const profAsig = await prisma.profesorAsignatura.findFirst({ where: { asignaturaId: p.asignaturaId } });
      await prisma.calificacion.create({
        data: {
          estudianteId: est.id,
          asignaturaId: p.asignaturaId,
          profesorId: profAsig?.profesorId || profesores[0].id,
          valor: parseFloat((Math.random() * 2 + 4).toFixed(1)), // 4.0 - 6.0
        },
      });
    }
    // Observaciones
    await prisma.observacion.create({
      data: {
        estudianteId: est.id,
        profesorId: profesores[est.id % profesores.length].id,
        texto: `Observación positiva para ${est.nombre}`,
        estado: "positiva",
      },
    });
    await prisma.observacion.create({
      data: {
        estudianteId: est.id,
        profesorId: profesores[(est.id + 1) % profesores.length].id,
        texto: `Observación a mejorar para ${est.nombre}`,
        estado: "negativa",
      },
    });
    // Asistencias (5 registros variados)
    for (let k = 0; k < 5; k++) {
      const estados = ["presente", "ausente", "tarde"];
      await prisma.asistencia.create({
        data: {
          estudianteId: est.id,
          fecha: new Date(Date.now() - k * 86400000),
          estado: estados[(est.id + k) % 3] as any,
        },
      });
    }
  }

  // Admin demo
  await prisma.usuario.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      email: "admin@demo.com",
      password: passwordHash,
      rol: "admin",
      activo: true,
    },
  });

  console.log("Seed de datos completos y realistas generada.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
