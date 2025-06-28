import { describe, it, expect } from 'vitest';
import { getGrades } from '../services/api';

describe('API services', () => {
  it('getGrades lanza error si el estudiante no existe', async () => {
    await expect(getGrades(99999)).rejects.toThrow();
  });
}); 