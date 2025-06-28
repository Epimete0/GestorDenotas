import { Router, Request, Response, NextFunction } from "express";
import {
  getAllProfesores,
  getProfesorById,
  createProfesor,
  updateProfesor,
  deleteProfesor,
  addAsignaturaToProfesor,
  removeAsignaturaFromProfesor,
} from "../services/profesorService";

const router = Router();

// GET /api/profesores - Obtener todos los profesores
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const profesores = await getAllProfesores();
    res.json({ profesores });
  } catch (err) {
    next(err);
  }
});

// GET /api/profesores/:id - Obtener profesor por ID
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const profesor = await getProfesorById(id);
    res.json({ profesor });
  } catch (err) {
    next(err);
  }
});

// POST /api/profesores - Crear nuevo profesor
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, apellido, edad, sexo } = req.body;
    const nuevoProfesor = await createProfesor({
      nombre,
      apellido,
      edad: Number(edad),
      sexo,
    });
    res.status(201).json({ profesor: nuevoProfesor });
  } catch (err) {
    next(err);
  }
});

// PUT /api/profesores/:id - Actualizar profesor
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { nombre, apellido, edad, sexo } = req.body;
    const profesorActualizado = await updateProfesor(id, {
      nombre,
      apellido,
      edad: edad ? Number(edad) : undefined,
      sexo,
    });
    res.json({ profesor: profesorActualizado });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/profesores/:id - Eliminar profesor
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await deleteProfesor(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// POST /api/profesores/:id/asignaturas - Agregar asignatura al profesor
router.post("/:id/asignaturas", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profesorId = Number(req.params.id);
    const { asignaturaId } = req.body;
    await addAsignaturaToProfesor(profesorId, Number(asignaturaId));
    res.status(201).json({ message: "Asignatura agregada al profesor" });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/profesores/:id/asignaturas/:asignaturaId - Remover asignatura del profesor
router.delete("/:id/asignaturas/:asignaturaId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profesorId = Number(req.params.id);
    const asignaturaId = Number(req.params.asignaturaId);
    await removeAsignaturaFromProfesor(profesorId, asignaturaId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router; 