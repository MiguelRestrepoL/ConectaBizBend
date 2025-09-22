import { Router } from 'express';
import {
  createClient,
  getClientById,
  getClients,
  getClientsByType,
  updateClient,
  deleteClient,
  getClientStats
} from '../controllers/client.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// Rutas de clientes
// POST /api/clients - Crear un nuevo cliente
router.post('/', createClient);

// GET /api/clients - Obtener todos los clientes del usuario autenticado
router.get('/', getClients);

// GET /api/clients/type/:tipo - Obtener clientes por tipo (persona_natural o persona_juridica)
router.get('/type/:tipo', getClientsByType);

// GET /api/clients/stats - Obtener estadísticas de clientes
router.get('/stats', getClientStats);

// GET /api/clients/:id - Obtener un cliente específico por ID
router.get('/:id', getClientById);

// PUT /api/clients/:id - Actualizar un cliente específico
router.put('/:id', updateClient);

// DELETE /api/clients/:id - Eliminar un cliente específico
router.delete('/:id', deleteClient);

export default router;
