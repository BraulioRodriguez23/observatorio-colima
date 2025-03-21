import { Router } from 'express';
import ExportController from '../controllers/export.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

router.get(
  '/:type', 
  authMiddleware(['admin', 'editor']), 
  ExportController.exportData
);

export default router;