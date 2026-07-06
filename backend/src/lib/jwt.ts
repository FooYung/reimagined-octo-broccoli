import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { USER_ROLES, type UserRole } from '../domain/constants.js';

export interface AuthTokenPayload {
  userId: number;
  role: UserRole;
}

function isAuthTokenPayload(value: unknown): value is AuthTokenPayload {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.userId === 'number' &&
    (candidate.role === USER_ROLES.CUSTOMER || candidate.role === USER_ROLES.ADMIN)
  );
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, config.jwtSecret);
  if (!isAuthTokenPayload(decoded)) {
    throw new Error('Invalid token payload');
  }
  return decoded;
}
