import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getEstadisticas } from '../controllers/estadisticas.controller.js';
 
const router = Router();
 
router.use(authMiddleware);
 
// GET /api/estadisticas?fecha_inicio=2026-01-01&fecha_fin=2026-06-15
router.get('/', getEstadisticas);
 
export default router;
 