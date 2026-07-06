import type { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../domain/constants.js';
import { HttpError } from '../lib/http-error.js';
import { verifyAuthToken } from '../lib/jwt.js';

// Trusts the JWT payload without a DB lookup: a role change or user deletion
// won't be reflected until the token expires and the user logs in again.
// Acceptable tradeoff for this app's scope.
export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const token = req.cookies?.token as string | undefined;
  if (!token) {
    next(new HttpError(401, 'UNAUTHENTICATED', 'Authentication required'));
    return;
  }

  try {
    const payload = verifyAuthToken(token);
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch {
    next(new HttpError(401, 'UNAUTHENTICATED', 'Authentication required'));
  }
};

export const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.user?.role !== USER_ROLES.ADMIN) {
    next(new HttpError(403, 'FORBIDDEN', 'Admin access required'));
    return;
  }
  next();
};
