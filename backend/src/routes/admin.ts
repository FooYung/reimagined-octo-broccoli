import express from 'express';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

export const adminRouter = express.Router();

// Placeholder so the 401/403 matrix is verifiable before real admin routes exist.
// Phase 6 replaces this with the actual admin endpoints.
adminRouter.get('/ping', requireAuth, requireAdmin, (_req, res) => {
  res.json({ status: 'ok' });
});
