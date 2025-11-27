import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { listMyAudits, hasMyAudits, findAuditsController } from '../controllers/audit.controller.js';

const router = Router();

router.use(authenticateToken);

// GET /api/audits - listar auditorías del usuario actual sadsddasds
router.get('/', listMyAudits);

// GET /api/audits/search - buscar con filtros (limitado al usuario)
router.get('/search', findAuditsController);

// GET /api/audits/has - saber si el usuario tiene auditorías
router.get('/has', hasMyAudits);

export default router;


