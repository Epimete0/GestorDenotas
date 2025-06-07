// backend/src/services/estudianteService.ts
import { estudianteRepository } from "../repositories/estudianteRepository";

export async function getAllEstudiantes() {
  return estudianteRepository.findAll();
}
