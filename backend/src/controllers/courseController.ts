// backend/src/controllers/courseController.ts
import { Router } from "express";
import { getAllCourses } from "../services/courseService";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const courses = await getAllCourses();
    res.json({ courses });
  } catch (err) {
    next(err);
  }
});

export default router;
