// backend/prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1. Limpiar tablas en orden de dependencias
  await prisma.observacion.deleteMany();
  await prisma.calificacion.deleteMany();
  await prisma.asistencia.deleteMany();
  await prisma.estudiante.deleteMany();
  await prisma.profesorAsignatura.deleteMany();
  await prisma.cursoAsignatura.deleteMany();
  await prisma.curso.deleteMany();
  await prisma.asignatura.deleteMany();
  await prisma.profesor.deleteMany();

  // 2. Crear Profesores
  const profesores = await Promise.all([
    prisma.profesor.create({
      data: { nombre: "Juan", apellido: "Pérez", edad: 40, sexo: "M" },
    }),
    prisma.profesor.create({
      data: { nombre: "María", apellido: "González", edad: 35, sexo: "F" },
    }),
    prisma.profesor.create({
      data: { nombre: "Luis", apellido: "Ramírez", edad: 50, sexo: "M" },
    }),
  ]);

  // 3. Crear Asignaturas
  const asignaturas = await Promise.all(
    ["Matemáticas", "Lenguaje", "Inglés", "Historia", "Ciencias"].map(
      (nombre) => prisma.asignatura.create({ data: { nombre } })
    )
  );

  // 4. Relacionar Profesores ↔ Asignaturas (cada uno imparte 2)
  await prisma.profesorAsignatura.createMany({
    data: [
      { profesorId: profesores[0].id, asignaturaId: asignaturas[0].id },
      { profesorId: profesores[0].id, asignaturaId: asignaturas[1].id },
      { profesorId: profesores[1].id, asignaturaId: asignaturas[2].id },
      { profesorId: profesores[1].id, asignaturaId: asignaturas[3].id },
      { profesorId: profesores[2].id, asignaturaId: asignaturas[4].id },
      { profesorId: profesores[2].id, asignaturaId: asignaturas[0].id },
    ],
  });

  // 5. Crear Cursos y su plan de estudios
  const nombreCursos = [
    "1° Básico A",
    "1° Básico B",
    "2° Básico A",
    "2° Básico B",
  ];
  const cursos = await Promise.all(
    nombreCursos.map((nombre, i) =>
      prisma.curso.create({
        data: {
          nombre,
          jefeId: profesores[i % profesores.length].id,
          planDeEstudio: {
            create: asignaturas.map((asig) => ({ asignaturaId: asig.id })),
          },
        },
      })
    )
  );

  // 6. Crear Estudiantes por curso (5 por curso)
  const estudiantes: { id: number; cursoId: number }[] = [];
  for (const curso of cursos) {
    for (let n = 1; n <= 5; n++) {
      const est = await prisma.estudiante.create({
        data: {
          nombre: `Estud${curso.id}${n}`,
          apellido: `Apellido${n}`,
          edad: 6 + curso.id, // edad variable
          sexo: n % 2 === 0 ? "F" : "M",
          cursoId: curso.id,
        },
      });
      estudiantes.push({ id: est.id, cursoId: curso.id });
    }
  }

  // 7. Generar Calificaciones y Observaciones Aleatorias
  for (const est of estudiantes) {
    // Para cada asignatura del curso del estudiante:
    const plan = await prisma.cursoAsignatura.findMany({
      where: { cursoId: est.cursoId },
    });

    for (const p of plan) {
      // Nota
      await prisma.calificacion.create({
        data: {
          estudianteId: est.id,
          asignaturaId: p.asignaturaId,
          profesorId: profesores[0].id, // asignamos siempre al primero para simplificar
          valor: parseFloat((Math.random() * 5 + 1).toFixed(2)), // 1.00–6.00
        },
      });
    }

    // Observaciones (una positiva y una negativa por estudiante)
    await prisma.observacion.createMany({
      data: [
        {
          estudianteId: est.id,
          profesorId: profesores[1].id,
          texto: "Muy participativo en clase.",
          estado: "positiva",
        },
        {
          estudianteId: est.id,
          profesorId: profesores[2].id,
          texto: "Debe mejorar la puntualidad.",
          estado: "negativa",
        },
      ],
    });

    // Asistencias (5 días de clase con random presente/ausente/tarde)
    for (let d = 0; d < 5; d++) {
      const estados = ["presente", "ausente", "tarde"] as const;
      const estado = estados[Math.floor(Math.random() * estados.length)];
      await prisma.asistencia.create({
        data: {
          estudianteId: est.id,
          fecha: new Date(Date.now() - d * 24 * 60 * 60 * 1000),
          estado,
        },
      });
    }
  }

  console.log(
    "🌱 Seed completo: Cursos, Estudiantes, Notas, Observaciones y Asistencias"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
