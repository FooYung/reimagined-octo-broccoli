import bcrypt from 'bcryptjs';
import express from 'express';
import { z } from 'zod';
import { USER_ROLES, type UserRole } from '../domain/constants.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError } from '../lib/http-error.js';
import { signAuthToken } from '../lib/jwt.js';
import { prisma } from '../lib/prisma.js';

export const authRouter = express.Router();

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a digit'),
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

// Computed once at module load so login always runs a bcrypt.compare of comparable
// cost, whether or not the email matches a real user — this keeps response timing
// from leaking which emails are registered.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function setAuthCookie(res: express.Response, token: string): void {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/',
  });
}

function toSafeUser(user: { id: number; email: string; name: string; role: string }) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

authRouter.post('/register', async (req, res) => {
  const { email, password, name } = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new HttpError(409, 'EMAIL_IN_USE', 'Email is already in use');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name, role: USER_ROLES.CUSTOMER },
  });

  const token = signAuthToken({ userId: user.id, role: user.role as UserRole });
  setAuthCookie(res, token);
  res.status(201).json(toSafeUser(user));
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    await bcrypt.compare(password, DUMMY_HASH);
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const token = signAuthToken({ userId: user.id, role: user.role as UserRole });
  setAuthCookie(res, token);
  res.status(200).json(toSafeUser(user));
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie('token', { path: '/' });
  res.status(204).end();
});

authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) {
    throw new HttpError(401, 'UNAUTHENTICATED', 'Authentication required');
  }
  res.status(200).json(toSafeUser(user));
});
