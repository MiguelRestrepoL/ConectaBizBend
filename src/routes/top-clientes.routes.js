import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { getTopClientes } from '../controllers/top-clientes.controller.js';
 
const router = Router();
 
router.use(authenticateToken);
 
// GET /api/top-clientes?limit=10&fecha_inicio=2026-01-01&fecha_fin=2026-06-15
router.get('/', getTopClientes);
 
export default router;
 