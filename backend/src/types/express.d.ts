import type { UserRole } from '../domain/constants.js';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: UserRole };
    }
  }
}

export {};
