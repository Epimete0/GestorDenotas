// backend/src/services/courseService.ts
import { courseRepository } from "../repositories/courseRepository";

export async function getAllCourses() {
  return courseRepository.findAll();
}
