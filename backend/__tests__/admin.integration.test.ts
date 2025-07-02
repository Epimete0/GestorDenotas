import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/prisma';

let adminToken: string;
let createdCursoId: number;
let createdProfesorId: number;
let createdEstudianteId: number;
let createdAsignaturaId: number;
let createdObservacionId: number;

beforeAll(async () => {
  // Login como admin (ajusta el email según tu seed)
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@demo.com', password: 'password123' });

  expect(res.statusCode).toBe(200);
  expect(res.body.data.token).toBeDefined();
  adminToken = res.body.data.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Administrador - Pruebas de integración', () => {
  describe('Cursos', () => {
    it('Debe permitir al admin crear un curso', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Curso Test', jefeId: 49 });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.course).toBeDefined();
      expect(res.body.data.course.nombre).toBe('Curso Test');
      createdCursoId = res.body.data.course.id;
    });

    it('Debe permitir al admin listar cursos', async () => {
      const res = await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data.courses)).toBe(true);
    });

    it('Debe permitir al admin ver detalle de un curso', async () => {
      const res = await request(app)
        .get(`/api/courses/${createdCursoId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.course).toBeDefined();
      expect(res.body.data.course.id).toBe(createdCursoId);
    });

    it('Debe permitir al admin editar un curso', async () => {
      const res = await request(app)
        .put(`/api/courses/${createdCursoId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Curso Editado' });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.course.nombre).toBe('Curso Editado');
    });

    it('Debe permitir al admin eliminar un curso', async () => {
      const res = await request(app)
        .delete(`/api/courses/${createdCursoId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(204);
    });
  });

  describe('Profesores', () => {
    it('Debe permitir al admin crear un profesor', async () => {
      const res = await request(app)
        .post('/api/profesores')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Juan', apellido: 'Pérez', edad: 40, sexo: 'M' });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.profesor).toBeDefined();
      createdProfesorId = res.body.data.profesor.id;
    });

    it('Debe permitir al admin listar profesores', async () => {
      const res = await request(app)
        .get('/api/profesores')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data.profesores)).toBe(true);
    });

    it('Debe permitir al admin ver detalle de un profesor', async () => {
      const res = await request(app)
        .get(`/api/profesores/${createdProfesorId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.profesor).toBeDefined();
      expect(res.body.data.profesor.id).toBe(createdProfesorId);
    });

    it('Debe permitir al admin editar un profesor', async () => {
      const res = await request(app)
        .put(`/api/profesores/${createdProfesorId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Juan Editado', apellido: 'Pérez', edad: 41, sexo: 'M' });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.profesor.nombre).toBe('Juan Editado');
    });

    it('Debe permitir al admin eliminar un profesor', async () => {
      const res = await request(app)
        .delete(`/api/profesores/${createdProfesorId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(204);
    });
  });

  describe('Estudiantes', () => {
    it('Debe permitir al admin crear un estudiante', async () => {
      const res = await request(app)
        .post('/api/estudiantes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Pedro', apellido: 'Gómez', edad: 18, sexo: 'M', cursoId: 1 });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.estudiante).toBeDefined();
      createdEstudianteId = res.body.data.estudiante.id;
    });

    it('Debe permitir al admin listar estudiantes', async () => {
      const res = await request(app)
        .get('/api/estudiantes')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data.estudiantes)).toBe(true);
    });

    it('Debe permitir al admin ver detalle de un estudiante', async () => {
      const res = await request(app)
        .get(`/api/estudiantes/${createdEstudianteId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.estudiante).toBeDefined();
      expect(res.body.data.estudiante.id).toBe(createdEstudianteId);
    });

    it('Debe permitir al admin editar un estudiante', async () => {
      const res = await request(app)
        .put(`/api/estudiantes/${createdEstudianteId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Pedro Editado', apellido: 'Gómez', edad: 19, sexo: 'M' });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.estudiante.nombre).toBe('Pedro Editado');
    });

    it('Debe permitir al admin eliminar un estudiante', async () => {
      const res = await request(app)
        .delete(`/api/estudiantes/${createdEstudianteId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(204);
    });
  });

  describe('Asignaturas', () => {
    it('Debe permitir al admin crear una asignatura', async () => {
      const res = await request(app)
        .post('/api/asignaturas')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Matemáticas' });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.asignatura).toBeDefined();
      createdAsignaturaId = res.body.data.asignatura.id;
    });

    it('Debe permitir al admin listar asignaturas', async () => {
      const res = await request(app)
        .get('/api/asignaturas')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data.asignaturas)).toBe(true);
    });

    it('Debe permitir al admin ver detalle de una asignatura', async () => {
      const res = await request(app)
        .get(`/api/asignaturas/${createdAsignaturaId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.asignatura).toBeDefined();
      expect(res.body.data.asignatura.id).toBe(createdAsignaturaId);
    });

    it('Debe permitir al admin editar una asignatura', async () => {
      const res = await request(app)
        .put(`/api/asignaturas/${createdAsignaturaId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Matemáticas Avanzadas' });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.asignatura.nombre).toBe('Matemáticas Avanzadas');
    });

    it('Debe permitir al admin eliminar una asignatura', async () => {
      const res = await request(app)
        .delete(`/api/asignaturas/${createdAsignaturaId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(204);
    });
  });

  describe('Observaciones', () => {
    it('Debe permitir al admin crear una observación', async () => {
      // Para crear una observación se necesita un estudiante y un profesor válidos
      // Creamos ambos primero
      const estudianteRes = await request(app)
        .post('/api/estudiantes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'EstObs', apellido: 'Test', edad: 17, sexo: 'F', cursoId: 1 });
      const profesorRes = await request(app)
        .post('/api/profesores')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'ProfObs', apellido: 'Test', edad: 35, sexo: 'F' });
      const estudianteId = estudianteRes.body.data.estudiante.id;
      const profesorId = profesorRes.body.data.profesor.id;
      const res = await request(app)
        .post('/api/observaciones')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ estudianteId, profesorId, texto: 'Observación de prueba', estado: 'pendiente' });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.observacion).toBeDefined();
      createdObservacionId = res.body.data.observacion.id;
    });

    it('Debe permitir al admin listar observaciones', async () => {
      const res = await request(app)
        .get('/api/observaciones')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data.observaciones)).toBe(true);
    });

    it('Debe permitir al admin ver detalle de una observación', async () => {
      const res = await request(app)
        .get(`/api/observaciones/${createdObservacionId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.observacion).toBeDefined();
      expect(res.body.data.observacion.id).toBe(createdObservacionId);
    });

    it('Debe permitir al admin editar una observación', async () => {
      const res = await request(app)
        .put(`/api/observaciones/${createdObservacionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ texto: 'Observación editada', estado: 'resuelta' });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.observacion.texto).toBe('Observación editada');
      expect(res.body.data.observacion.estado).toBe('resuelta');
    });

    it('Debe permitir al admin eliminar una observación', async () => {
      const res = await request(app)
        .delete(`/api/observaciones/${createdObservacionId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(204);
    });
  });

  describe('Resumen', () => {
    it('Debe permitir al admin obtener el resumen general del sistema', async () => {
      const res = await request(app)
        .get('/api/summary')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalEstudiantes');
      expect(res.body).toHaveProperty('totalCursos');
      expect(res.body).toHaveProperty('promedioGeneral');
      expect(res.body).toHaveProperty('tasaAsistencia');
      expect(res.body).toHaveProperty('topAsignaturas');
    });
  });
}); 